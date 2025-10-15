import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare class DriverController {
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    createProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    uploadDocument(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateStatus(req: AuthRequest, res: Response): Promise<void>;
}
declare const _default: DriverController;
export default _default;
//# sourceMappingURL=driver.controller.d.ts.map