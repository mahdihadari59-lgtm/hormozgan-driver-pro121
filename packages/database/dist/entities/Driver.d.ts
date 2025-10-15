import { User } from './User';
import { Trip } from './Trip';
import { DriverDocument } from './DriverDocument';
export declare enum VehicleType {
    MOTORCYCLE = "MOTORCYCLE",
    CAR = "CAR",
    VAN = "VAN",
    PICKUP = "PICKUP",
    TRUCK = "TRUCK"
}
export declare enum DriverStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    ON_TRIP = "ON_TRIP"
}
export declare class Driver {
    id: string;
    user: User;
    firstName: string;
    lastName: string;
    nationalId: string;
    licenseNumber: string;
    vehicleType: VehicleType;
    vehiclePlate: string;
    status: DriverStatus;
    rating: number;
    totalTrips: number;
    createdAt: Date;
    updatedAt: Date;
    trips?: Trip[];
    documents?: DriverDocument[];
}
//# sourceMappingURL=Driver.d.ts.map