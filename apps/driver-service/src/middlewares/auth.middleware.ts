import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    phoneNumber: string;
    role: string;
  };
  file?: Express.Multer.File;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'توکن احراز هویت یافت نشد'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      phoneNumber: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: 'توکن نامعتبر است'
    });
  }
};
