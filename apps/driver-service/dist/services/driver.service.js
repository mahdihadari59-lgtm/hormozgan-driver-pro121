"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@hormozgan/database");
const database_2 = require("@hormozgan/database");
const shared_1 = require("@hormozgan/shared");
class DriverService {
    driverRepository = database_1.AppDataSource.getRepository(database_2.Driver);
    documentRepository = database_1.AppDataSource.getRepository(database_2.DriverDocument);
    async getProfile(userId) {
        const driver = await this.driverRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'documents']
        });
        if (!driver) {
            throw new Error('پروفایل راننده یافت نشد');
        }
        return driver;
    }
    async updateProfile(userId, data) {
        const driver = await this.getProfile(userId);
        if (data.firstName)
            driver.firstName = data.firstName;
        if (data.lastName)
            driver.lastName = data.lastName;
        if (data.licenseNumber)
            driver.licenseNumber = data.licenseNumber;
        if (data.vehicleType)
            driver.vehicleType = data.vehicleType;
        if (data.vehiclePlate)
            driver.vehiclePlate = data.vehiclePlate;
        await this.driverRepository.save(driver);
        return driver;
    }
    async createProfile(userId, data) {
        if (!(0, shared_1.isValidNationalId)(data.nationalId)) {
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
            status: database_2.DriverStatus.PENDING_APPROVAL
        });
        await this.driverRepository.save(driver);
        return driver;
    }
    async uploadDocument(userId, type, fileUrl) {
        const driver = await this.getProfile(userId);
        const document = this.documentRepository.create({
            driver: { id: driver.id },
            type,
            fileUrl,
            status: database_2.DocumentStatus.PENDING
        });
        await this.documentRepository.save(document);
        return document;
    }
    async updateStatus(userId, status) {
        const driver = await this.getProfile(userId);
        driver.status = status;
        await this.driverRepository.save(driver);
        return driver;
    }
}
exports.default = new DriverService();
//# sourceMappingURL=driver.service.js.map