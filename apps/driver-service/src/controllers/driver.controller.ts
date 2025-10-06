import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import driverService from '../services/driver.service';
import { DriverStatus, DocumentType } from '@hormozgan/database';

export class DriverController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.getProfile(req.user!.userId);
      
      res.json({
        success: true,
        data: driver
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async createProfile(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.createProfile(req.user!.userId, req.body);
      
      res.json({
        success: true,
        message: 'پروفایل راننده با موفقیت ایجاد شد',
        data: driver
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const driver = await driverService.updateProfile(req.user!.userId, req.body);
      
      res.json({
        success: true,
        message: 'پروفایل با موفقیت به‌روزرسانی شد',
        data: driver
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async uploadDocument(req: AuthRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'فایل الزامی است'
        });
      }

      const { type } = req.body;
      const fileUrl = `/uploads/${req.file.filename}`;

      const document = await driverService.uploadDocument(
        req.user!.userId,
        type as DocumentType,
        fileUrl
      );

      res.json({
        success: true,
        message: 'مدرک با موفقیت بارگذاری شد',
        data: document
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = req.body;
      const driver = await driverService.updateStatus(req.user!.userId, status as DriverStatus);
      
      res.json({
        success: true,
        message: 'وضعیت به‌روزرسانی شد',
        data: driver
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default new DriverController();
