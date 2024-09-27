import { embeddedFiles, password } from 'bun';
import Joi from 'joi';

export const registerValidationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match' // Custom error message
    }),
    role: Joi.string().valid('admin', 'creator', 'respondent').default('respondent')
});

export const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const refreshTokenValidationSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

