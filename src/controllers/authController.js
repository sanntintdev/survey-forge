import authService from '../services/authService';
import responseFormatter from '../utils/responseFormatterUtils';

const { successResponse, errorResponse } = responseFormatter;

const authController = {
    async registerHandler(req, res) {
        try {
            const { username, email, password, role } = req.body;
            const data = await authService.register({ username, email, password, role });

            return successResponse(res, 'User registered successfully', data, 201);
        } catch (error) {
            return errorResponse(res, 'User registration failed', [error.message], 400);
        }
    },

    async loginHandler(req, res) {
        try {
            const { email, password } = req.body;
            const data = await authService.login({ email, password });

            return successResponse(res, 'User logged in successfully', data);
        } catch (error) {
            return errorResponse(res, 'User login failed', [error.message], 400);
        }
    },

    async refreshTokenHandler(req, res) {
        try {
            const { refreshToken } = req.body;
            const data = await authService.refreshToken(refreshToken);

            return successResponse(res, 'Token refreshed successfully', data);
        } catch (error) {
            return errorResponse(res, 'Token refresh failed', [error.message], 400);
        }
    }
}

export default authController;