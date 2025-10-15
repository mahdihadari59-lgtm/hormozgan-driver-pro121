"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driver_controller_1 = __importDefault(require("../controllers/driver.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/profile', driver_controller_1.default.getProfile.bind(driver_controller_1.default));
router.post('/profile', driver_controller_1.default.createProfile.bind(driver_controller_1.default));
router.put('/profile', driver_controller_1.default.updateProfile.bind(driver_controller_1.default));
router.post('/document', upload_middleware_1.upload.single('document'), driver_controller_1.default.uploadDocument.bind(driver_controller_1.default));
router.put('/status', driver_controller_1.default.updateStatus.bind(driver_controller_1.default));
exports.default = router;
//# sourceMappingURL=driver.routes.js.map