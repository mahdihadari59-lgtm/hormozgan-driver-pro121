import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/send-otp', authController.sendOTP.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));

export default router;
