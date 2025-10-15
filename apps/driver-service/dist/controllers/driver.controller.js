"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const driver_service_1 = __importDefault(require("../services/driver.service"));
class DriverController {
    async getProfile(req, res) {
        try {
            const driver = await driver_service_1.default.getProfile(req.user.userId);
            res.json({
                success: true,
                data: driver
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
    async createProfile(req, res) {
        try {
            const driver = await driver_service_1.default.createProfile(req.user.userId, req.body);
            res.json({
                success: true,
                message: 'پروفایل راننده با موفقیت ایجاد شد',
                data: driver
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const driver = await driver_service_1.default.updateProfile(req.user.userId, req.body);
            res.json({
                success: true,
                message: 'پروفایل با موفقیت به‌روزرسانی شد',
                data: driver
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async uploadDocument(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'فایل الزامی است'
                });
            }
            const { type } = req.body;
            const fileUrl = `/uploads/${req.file.filename}`;
            const document = await driver_service_1.default.uploadDocument(req.user.userId, type, fileUrl);
            res.json({
                success: true,
                message: 'مدرک با موفقیت بارگذاری شد',
                data: document
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const driver = await driver_service_1.default.updateStatus(req.user.userId, status);
            res.json({
                success: true,
                message: 'وضعیت به‌روزرسانی شد',
                data: driver
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.DriverController = DriverController;
exports.default = new DriverController();
//# sourceMappingURL=driver.controller.js.map