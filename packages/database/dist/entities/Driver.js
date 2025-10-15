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
exports.Driver = exports.DriverStatus = exports.VehicleType = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Trip_1 = require("./Trip");
const DriverDocument_1 = require("./DriverDocument");
var VehicleType;
(function (VehicleType) {
    VehicleType["MOTORCYCLE"] = "MOTORCYCLE";
    VehicleType["CAR"] = "CAR";
    VehicleType["VAN"] = "VAN";
    VehicleType["PICKUP"] = "PICKUP";
    VehicleType["TRUCK"] = "TRUCK";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["ACTIVE"] = "ACTIVE";
    DriverStatus["INACTIVE"] = "INACTIVE";
    DriverStatus["SUSPENDED"] = "SUSPENDED";
    DriverStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    DriverStatus["ON_TRIP"] = "ON_TRIP";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
let Driver = class Driver {
    id;
    user;
    firstName;
    lastName;
    nationalId;
    licenseNumber;
    vehicleType;
    vehiclePlate;
    status;
    rating;
    totalTrips;
    createdAt;
    updatedAt;
    trips;
    documents;
};
exports.Driver = Driver;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Driver.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_1.User, (user) => user.driver),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], Driver.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Driver.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Driver.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 10 }),
    __metadata("design:type", String)
], Driver.prototype, "nationalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Driver.prototype, "licenseNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: VehicleType }),
    __metadata("design:type", String)
], Driver.prototype, "vehicleType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Driver.prototype, "vehiclePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: DriverStatus, default: DriverStatus.PENDING_APPROVAL }),
    __metadata("design:type", String)
], Driver.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Driver.prototype, "totalTrips", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Driver.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Trip_1.Trip, (trip) => trip.driver),
    __metadata("design:type", Array)
], Driver.prototype, "trips", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DriverDocument_1.DriverDocument, (doc) => doc.driver),
    __metadata("design:type", Array)
], Driver.prototype, "documents", void 0);
exports.Driver = Driver = __decorate([
    (0, typeorm_1.Entity)('drivers')
], Driver);
//# sourceMappingURL=Driver.js.map