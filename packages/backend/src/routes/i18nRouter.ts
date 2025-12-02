import { Router } from 'express';
import {
  getTranslations,
  updateTranslations,
  backupTranslations
} from '../controllers/i18nController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware'; 

const router = Router();

router.get(
  '/:lang',  getTranslations
);

router.put(
  '/:lang',
  authenticateToken,
  authorizeRole(['system_admin']),
  updateTranslations
);

router.get(
  '/:lang/backup',  backupTranslations
);

export default router;
