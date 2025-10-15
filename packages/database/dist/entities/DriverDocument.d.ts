import { Driver } from './Driver';
export declare enum DocumentType {
    NATIONAL_ID = "NATIONAL_ID",
    DRIVER_LICENSE = "DRIVER_LICENSE",
    VEHICLE_LICENSE = "VEHICLE_LICENSE",
    VEHICLE_INSURANCE = "VEHICLE_INSURANCE",
    PROFILE_PHOTO = "PROFILE_PHOTO"
}
export declare enum DocumentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED"
}
export declare class DriverDocument {
    id: string;
    driver: Driver;
    type: DocumentType;
    fileUrl: string;
    status: DocumentStatus;
    expiryDate?: Date;
    uploadedAt: Date;
}
//# sourceMappingURL=DriverDocument.d.ts.map