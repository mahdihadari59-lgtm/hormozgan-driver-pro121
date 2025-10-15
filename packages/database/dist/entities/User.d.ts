import { Driver } from './Driver';
export declare enum UserRole {
    DRIVER = "DRIVER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export declare class User {
    id: string;
    phoneNumber: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    driver?: Driver;
}
//# sourceMappingURL=User.d.ts.map