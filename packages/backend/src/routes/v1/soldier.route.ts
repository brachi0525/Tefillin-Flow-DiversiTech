// soldiers.routes.ts
import { Router } from 'express';
import {
  createSoldier,
  deleteSoldier,
  getAllSoldiers,
  getPendingSoldiers,
  updateSoldier
} from '../../controllers/soldiers.controller';
import { authenticateToken } from '../../middleware/auth.middleware';
import { authorizeRole } from '../../middleware/role.middleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['system_admin']), getAllSoldiers);
router.get('/pending', authenticateToken, authorizeRole(['system_admin']), getPendingSoldiers);
router.post('/', authenticateToken, authorizeRole(['system_admin']), createSoldier);
router.put('/:id', authenticateToken, authorizeRole(['system_admin']), updateSoldier);
router.delete('/:id', authenticateToken, authorizeRole(['system_admin']), deleteSoldier);

export default router;
