import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser, getUsersByRole } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware'; 

const router = Router();

// router.get('/',authenticateJWT,roleCheck([UserRole.SYSTEM_ADMIN, UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.LOCATION_RABBI]) ,getUsers);
// router.get('/:id', authenticateJWT, roleCheck([UserRole.SYSTEM_ADMIN, UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.LOCATION_RABBI]), getUserById);
// router.post('/', authenticateJWT, roleCheck([UserRole.SYSTEM_ADMIN, UserRole.ADMINISTRATOR]), createUser);
// router.put('/:id', authenticateJWT, roleCheck([UserRole.SYSTEM_ADMIN, UserRole.ADMINISTRATOR, UserRole.MANAGER]), updateUser);
// router.delete('/:id', authenticateJWT, roleCheck([UserRole.SYSTEM_ADMIN, UserRole.ADMINISTRATOR]), deleteUser);

router.get('/', authenticateToken, authorizeRole(['manager']), getUsers);
router.get('/:id', authenticateToken, authorizeRole(['manager']), getUserById);
router.get('/role/:role', authenticateToken, authorizeRole(['manager']), getUsersByRole);
router.post('/', authenticateToken, authorizeRole(['manager']), createUser);
router.put('/:id', authenticateToken, authorizeRole(['manager']), updateUser);
router.delete('/:id', authenticateToken, authorizeRole(['manager']), deleteUser);

export default router;
