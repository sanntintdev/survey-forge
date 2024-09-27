import jwt from 'jsonwebtoken';

const tokenUtils = {
    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    },

    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    },

    verifyAccessToken(accessToken) {
        return jwt.verify(accessToken, process.env.JWT_SECRET);
    },

    verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }
}

export default tokenUtils;