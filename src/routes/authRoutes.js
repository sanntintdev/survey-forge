import { Router } from "express";
import authController from "../controllers/authController";
import validate from "../middlewares/validate";
import { loginValidationSchema, refreshTokenValidationSchema, registerValidationSchema } from "../validations/authValidation";

const router = Router();

router.post('/auth/register', validate(registerValidationSchema), authController.registerHandler);
router.post('/auth/login', validate(loginValidationSchema), authController.loginHandler);
router.post('/auth/refresh-token', validate(refreshTokenValidationSchema), authController.refreshTokenHandler);

export default router;