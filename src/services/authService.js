
import passwordUtils from "../utils/passwordUtils";
import tokenUtils from "../utils/tokenUtils";
import User from "../models/User";
import RefreshToken from "../models/RefreshToken";

const authService = {

    async register({ username, email, password, role }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await passwordUtils.hashPassword(password);
        const user = new User({ username, email, passwordHash: hashedPassword, role });
        await user.save();

        const userPayload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
        const accessToken = tokenUtils.generateAccessToken(userPayload);
        const refreshToken = tokenUtils.generateRefreshToken(userPayload);

        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            issuedAt: new Date()
        })

        return {
            user: userPayload,
            accessToken,
            refreshToken
        }
    },

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isPasswordValid = await passwordUtils.comparePasswords(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const userPayload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        const accessToken = tokenUtils.generateAccessToken(userPayload);
        const refreshToken = tokenUtils.generateRefreshToken(userPayload);

        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            issuedAt: new Date()
        })

        return {
            user: userPayload,
            accessToken,
            refreshToken
        }
    },

    async refreshToken(refreshToken) {
        const isValidRefreshToken = tokenUtils.verifyRefreshToken(refreshToken);
        if (!isValidRefreshToken) {
            throw new Error('Invalid refresh token');
        }

        const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken });
        if (!existingRefreshToken || existingRefreshToken.revoked) {
            throw new Error('Invalid refresh token');
        }

        if (existingRefreshToken.expiresAt < new Date()) {
            existingRefreshToken.revoked = true;
            await existingRefreshToken.save();

            throw new Error('Refresh token expired');
        }

        const user = await User.findById(isValidRefreshToken._id);

        if (!user) {
            throw new Error('User not found');
        }

        const userPayload = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        const accessToken = tokenUtils.generateAccessToken(userPayload);
        const newRefreshToken = tokenUtils.generateRefreshToken(userPayload);

        existingRefreshToken.revoked = true;
        await existingRefreshToken.save();

        await RefreshToken.create({
            token: newRefreshToken,
            user: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            issuedAt: new Date()
        })

        return {
            accessToken,
            refreshToken: newRefreshToken
        }
    }
}

export default authService;