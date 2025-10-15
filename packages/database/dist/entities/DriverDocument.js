"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDocument = exports.DocumentStatus = exports.DocumentType = void 0;
const typeorm_1 = require("typeorm");
const Driver_1 = require("./Driver");
var DocumentType;
(function (DocumentType) {
    DocumentType["NATIONAL_ID"] = "NATIONAL_ID";
    DocumentType["DRIVER_LICENSE"] = "DRIVER_LICENSE";
    DocumentType["VEHICLE_LICENSE"] = "VEHICLE_LICENSE";
    DocumentType["VEHICLE_INSURANCE"] = "VEHICLE_INSURANCE";
    DocumentType["PROFILE_PHOTO"] = "PROFILE_PHOTO";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["PENDING"] = "PENDING";
    DocumentStatus["APPROVED"] = "APPROVED";
    DocumentStatus["REJECTED"] = "REJECTED";
    DocumentStatus["EXPIRED"] = "EXPIRED";
})(DocumentStatus || (exports.DocumentStatus = DocumentStatus = {}));
let DriverDocument = class DriverDocument {
    id;
    driver;
    type;
    fileUrl;
    status;
    expiryDate;
    uploadedAt;
};
exports.DriverDocument = DriverDocument;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DriverDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Driver_1.Driver, (driver) => driver.documents),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Driver_1.Driver)
], DriverDocument.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DocumentType }),
    __metadata("design:type", String)
], DriverDocument.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DriverDocument.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING }),
    __metadata("design:type", String)
], DriverDocument.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DriverDocument.prototype, "expiryDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DriverDocument.prototype, "uploadedAt", void 0);
exports.DriverDocument = DriverDocument = __decorate([
    (0, typeorm_1.Entity)('driver_documents')
], DriverDocument);
//# sourceMappingURL=DriverDocument.js.map