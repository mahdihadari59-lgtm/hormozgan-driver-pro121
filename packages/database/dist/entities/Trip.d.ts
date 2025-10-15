import { Driver } from './Driver';
export declare enum TripStatus {
    CREATED = "CREATED",
    STARTED = "STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class Trip {
    id: string;
    driver: Driver;
    originLatitude: number;
    originLongitude: number;
    originAddress?: string;
    destinationLatitude: number;
    destinationLongitude: number;
    destinationAddress?: string;
    status: TripStatus;
    distance?: number;
    duration?: number;
    fare?: number;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Trip.d.ts.map