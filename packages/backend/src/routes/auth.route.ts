import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/auth/login', AuthController.login);

router.post('/auth/refresh', AuthController.refresh); 
export default router;
