import jwt from 'jsonwebtoken';
import { AppDataSource } from '@hormozgan/database';
import { User, UserRole } from '@hormozgan/database';
import otpService from './otp.service';

class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async sendOTP(phoneNumber: string) {
    const { code } = await otpService.sendOTP(phoneNumber);
    return { message: 'کد تایید ارسال شد', phoneNumber };
  }

  async verifyOTPAndLogin(phoneNumber: string, code: string) {
    await otpService.verifyOTP(phoneNumber, code);

    let user = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    if (!user) {
      user = this.userRepository.create({
        phoneNumber,
        role: UserRole.DRIVER,
        isVerified: true,
      });
      await this.userRepository.save(user);
    } else {
      user.isVerified = true;
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);
    }

    const payload = { 
      userId: user.id, 
      phoneNumber: user.phoneNumber, 
      role: user.role 
    };

    const secret = process.env.JWT_SECRET || 'default-secret-key';
    const options = { expiresIn: process.env.JWT_EXPIRES_IN || '7d' };
    
    const token = (jwt.sign as any)(payload, secret, options) as string;

    return {
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    };
  }
}

export default new AuthService();
