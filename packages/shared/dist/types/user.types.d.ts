export interface User {
    id: string;
    phoneNumber: string;
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum UserRole {
    DRIVER = "DRIVER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer';
}
export interface LoginRequest {
    phoneNumber: string;
    verificationCode: string;
}
export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}
//# sourceMappingURL=user.types.d.ts.map