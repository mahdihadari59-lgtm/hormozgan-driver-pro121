import { OTP_CONSTANTS } from '@hormozgan/shared';

interface OTPData {
  code: string;
  phoneNumber: string;
  expiresAt: Date;
  attempts: number;
}

class OTPService {
  private otpStore = new Map<string, OTPData>();

  generateOTP(): string {
    return Math.floor(
      Math.random() * (10 ** OTP_CONSTANTS.LENGTH)
    )
      .toString()
      .padStart(OTP_CONSTANTS.LENGTH, '0');
  }

  async sendOTP(phoneNumber: string): Promise<{ code: string }> {
    const code = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_CONSTANTS.EXPIRY_MINUTES);

    this.otpStore.set(phoneNumber, {
      code,
      phoneNumber,
      expiresAt,
      attempts: 0,
    });

    console.log(`[OTP] Code for ${phoneNumber}: ${code}`);
    
    return { code };
  }

  async verifyOTP(phoneNumber: string, code: string): Promise<boolean> {
    const otpData = this.otpStore.get(phoneNumber);

    if (!otpData) {
      throw new Error('کد تایید یافت نشد');
    }

    if (otpData.attempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
      this.otpStore.delete(phoneNumber);
      throw new Error('تعداد تلاش‌های مجاز تمام شد');
    }

    if (new Date() > otpData.expiresAt) {
      this.otpStore.delete(phoneNumber);
      throw new Error('کد تایید منقضی شده است');
    }

    otpData.attempts++;

    if (otpData.code !== code) {
      throw new Error('کد تایید نامعتبر است');
    }

    this.otpStore.delete(phoneNumber);
    return true;
  }
}

export default new OTPService();
