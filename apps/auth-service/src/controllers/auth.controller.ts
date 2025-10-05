import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { isValidIranianPhone } from '@hormozgan/shared';

export class AuthController {
  async sendOTP(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber || !isValidIranianPhone(phoneNumber)) {
        return res.status(400).json({
          success: false,
          error: 'شماره تلفن نامعتبر است',
        });
      }

      const result = await authService.sendOTP(phoneNumber);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'خطای سرور',
      });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { phoneNumber, code } = req.body;

      if (!phoneNumber || !code) {
        return res.status(400).json({
          success: false,
          error: 'شماره تلفن و کد تایید الزامی است',
        });
      }

      const result = await authService.verifyOTPAndLogin(phoneNumber, code);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'خطا در تایید کد',
      });
    }
  }
}

export default new AuthController();
