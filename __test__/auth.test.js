import { beforeEach, describe, expect, it, spyOn, jest } from "bun:test";
import request from "supertest";
import mongoose from "mongoose";
import authService from "../src/services/authService";
import app from "../src/app";

const userInput = {
    email: "user@test.com",
    username: "testuser",
    password: "Password123",
    role: "respondent",
};

const userLoginInput = {
    email: "user@test.com",
    password: "Password123"
};

const userPayload = {
    user: {
        _id: new mongoose.Types.ObjectId().toString(),
        username: 'testuser',
        email: 'user@test.com',
        role: 'respondent',
    },
    accessToken: "MockedToken",
    refreshToken: "MockedToken",
};

describe('Authentication', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Registeration', () => {

        it('should register a user with valid inputs', async () => {
            spyOn(authService, 'register').mockReturnValueOnce(userPayload);

            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    confirmPassword: "Password123",
                });

            expect(statusCode).toBe(201);
            expect(body.status).toBe('success');
            expect(body.message).toBe('User registered successfully');
            expect(body.data).toEqual(userPayload);
        });

        it('should fail for an existing email', async () => {
            spyOn(authService, 'register').mockImplementation(() => {
                throw new Error('User already exists');
            });

            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    confirmPassword: "Password123",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('User registration failed');
            expect(body.errors).toContain('User already exists');
        });

        it('should fail for invalid email format', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    email: "invalid-email",
                    confirmPassword: "Password123",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"email" must be a valid email');
        });

        it('should fail for weak password', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    password: "123",
                    confirmPassword: "123",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"password" length must be at least 6 characters long');
        });

        it('should fail when passwords do not match', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    confirmPassword: "passwords do not match",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('Passwords do not match');
        });

        it('should fail for missing required fields', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    email: "user@test.com",
                    confirmPassword: "Password123",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"username" is required');
            expect(body.errors).toContain('"password" is required');
            expect(body.errors).toContain('Passwords do not match');
        });

        it('should fail for additional unnecessary fields', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/register')
                .send({
                    ...userInput,
                    confirmPassword: "Password123",
                    extraField: "This should not be here",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"extraField" is not allowed');
        });
    });

    describe('Login', () => {

        it('should login a user with valid credentials', async () => {
            spyOn(authService, 'login').mockReturnValueOnce(userPayload);

            const { statusCode, body } = await request(app)
                .post('/api/auth/login')
                .send(userLoginInput);

            expect(statusCode).toBe(200);
            expect(body.status).toBe('success');
            expect(body.message).toBe('User logged in successfully');
            expect(body.data).toEqual(userPayload);
        });

        it('should fail for invalid email or password', async () => {
            spyOn(authService, 'login').mockImplementation(() => {
                throw new Error('Invalid email or password');
            });

            const { statusCode, body } = await request(app)
                .post('/api/auth/login')
                .send(userLoginInput);

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('User login failed');
            expect(body.errors).toContain('Invalid email or password');
        });

        it('should fail for missing required fields', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/login')
                .send({ email: 'user@test.com' });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"password" is required');
        });

        it('should fail for invalid email format', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/login')
                .send({
                    email: "invalid-email",
                    password: "Password123",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"email" must be a valid email');
        });

        it('should fail for additional unnecessary fields', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/login')
                .send({
                    ...userLoginInput,
                    extraField: "This should not be here",
                });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"extraField" is not allowed');
        });
    });

    describe('TokenRefresh', () => {
        it('should return new aceess token with status code 200 for valid refresh token', async () => {
            spyOn(authService, 'refreshToken').mockReturnValueOnce({
                accessToken: "New mock access token",
                refreshToken: "New mock refresh token",
            })

            const { statusCode, body } = await request(app)
                .post('/api/auth/refresh-token')
                .send({ refreshToken: userPayload.refreshToken });

            expect(statusCode).toBe(200);
            expect(body.status).toBe('success');
            expect(body.message).toBe('Token refreshed successfully');
            expect(body.data.accessToken).toBe('New mock access token');
            expect(body.data.refreshToken).toBe('New mock refresh token');
        });

        it.each([
            ['expired', 'Expired refresh token'],
            ['invalid', 'Invalid refresh token'],
            ['revoked', 'Revoked refresh token']
        ])('should return error message with status code 400 for %s refresh token', async (_, tokenValue) => {
            spyOn(authService, 'refreshToken').mockImplementation(() => {
                throw new Error('Invalid refresh token');
            });

            const { statusCode, body } = await request(app)
                .post('/api/auth/refresh-token')
                .send({ refreshToken: tokenValue });

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Token refresh failed');
            expect(body.errors).toContain('Invalid refresh token');
        });

        it('should return error message with status code 400 for missing refresh token', async () => {
            const { statusCode, body } = await request(app)
                .post('/api/auth/refresh-token')
                .send({});

            expect(statusCode).toBe(400);
            expect(body.status).toBe('error');
            expect(body.message).toBe('Validation failed');
            expect(body.errors).toContain('"refreshToken" is required');
        });
    });
});
