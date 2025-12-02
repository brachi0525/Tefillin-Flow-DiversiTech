// users.routes.ts
import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();

router.get('/', authenticateToken, authorizeRole(['manager']), getUsers);
router.post('/', authenticateToken, authorizeRole(['manager']), createUser);
router.put('/:id', authenticateToken, authorizeRole(['manager']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['manager']), deleteUser);

export default router;
