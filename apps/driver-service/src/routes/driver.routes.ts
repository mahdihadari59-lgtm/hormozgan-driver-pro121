import { Router } from 'express';
import driverController from '../controllers/driver.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', driverController.getProfile.bind(driverController));
router.post('/profile', driverController.createProfile.bind(driverController));
router.put('/profile', driverController.updateProfile.bind(driverController));
router.post('/document', upload.single('document'), driverController.uploadDocument.bind(driverController));
router.put('/status', driverController.updateStatus.bind(driverController));

export default router;
