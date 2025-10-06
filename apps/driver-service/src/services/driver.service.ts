import { AppDataSource } from '@hormozgan/database';
import { Driver, DriverStatus, VehicleType, DriverDocument, DocumentType, DocumentStatus } from '@hormozgan/database';
import { isValidNationalId } from '@hormozgan/shared';

class DriverService {
  private driverRepository = AppDataSource.getRepository(Driver);
  private documentRepository = AppDataSource.getRepository(DriverDocument);

  async getProfile(userId: string) {
    const driver = await this.driverRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'documents']
    });

    if (!driver) {
      throw new Error('پروفایل راننده یافت نشد');
    }

    return driver;
  }

  async updateProfile(userId: string, data: any) {
    const driver = await this.getProfile(userId);

    if (data.firstName) driver.firstName = data.firstName;
    if (data.lastName) driver.lastName = data.lastName;
    if (data.licenseNumber) driver.licenseNumber = data.licenseNumber;
    if (data.vehicleType) driver.vehicleType = data.vehicleType;
    if (data.vehiclePlate) driver.vehiclePlate = data.vehiclePlate;

    await this.driverRepository.save(driver);
    return driver;
  }

  async createProfile(userId: string, data: any) {
    if (!isValidNationalId(data.nationalId)) {
      throw new Error('کد ملی نامعتبر است');
    }

    const existingDriver = await this.driverRepository.findOne({
      where: [
        { nationalId: data.nationalId },
        { vehiclePlate: data.vehiclePlate }
      ]
    });

    if (existingDriver) {
      throw new Error('راننده با این مشخصات قبلاً ثبت شده است');
    }

    const driver = this.driverRepository.create({
      user: { id: userId },
      firstName: data.firstName,
      lastName: data.lastName,
      nationalId: data.nationalId,
      licenseNumber: data.licenseNumber,
      vehicleType: data.vehicleType,
      vehiclePlate: data.vehiclePlate,
      status: DriverStatus.PENDING_APPROVAL
    });

    await this.driverRepository.save(driver);
    return driver;
  }

  async uploadDocument(userId: string, type: DocumentType, fileUrl: string) {
    const driver = await this.getProfile(userId);

    const document = this.documentRepository.create({
      driver: { id: driver.id },
      type,
      fileUrl,
      status: DocumentStatus.PENDING
    });

    await this.documentRepository.save(document);
    return document;
  }

  async updateStatus(userId: string, status: DriverStatus) {
    const driver = await this.getProfile(userId);
    driver.status = status;
    await this.driverRepository.save(driver);
    return driver;
  }
}

export default new DriverService();
