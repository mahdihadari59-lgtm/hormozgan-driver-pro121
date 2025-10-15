import { Driver, DriverStatus, DriverDocument, DocumentType } from '@hormozgan/database';
declare class DriverService {
    private driverRepository;
    private documentRepository;
    getProfile(userId: string): Promise<Driver>;
    updateProfile(userId: string, data: any): Promise<Driver>;
    createProfile(userId: string, data: any): Promise<Driver>;
    uploadDocument(userId: string, type: DocumentType, fileUrl: string): Promise<DriverDocument>;
    updateStatus(userId: string, status: DriverStatus): Promise<Driver>;
}
declare const _default: DriverService;
export default _default;
//# sourceMappingURL=driver.service.d.ts.map