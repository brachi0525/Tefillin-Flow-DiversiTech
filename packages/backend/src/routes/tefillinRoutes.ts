// routes/tefillin.ts
import express from 'express';
import {
  addTefillin,
  completeDistribution,
  getTefillinReport,
  updateStatus,
  movingTefillinLocation,
  getFilteredTefillin,
  getTefillinById
} from '../controllers/tefillinController';
// import { authenticateJWT } from '../middleware/authMiddleware';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = express.Router();

router.put('/transfer', authenticateToken, authorizeRole(['system_admin','manager']), movingTefillinLocation);
// router.patch('/status',authenticateJWT, roleCheck([UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.INVENTORY_MANAGER, UserRole.LOCATION_RABBI]),  updateStatus);
router.put('/status', authenticateToken, authorizeRole(['system_admin','manager','lacation_rabbi']), updateStatus);
// router.patch('/completed',authenticateJWT, roleCheck([UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.INVENTORY_MANAGER, UserRole.LOCATION_RABBI]),  completeDistribution);
router.put('/completed', authenticateToken, authorizeRole(['system_admin','manager','lacation_rabbi']), completeDistribution);
// router.post('/tefillin', authenticateJWT,roleCheck([UserRole.ADMINISTRATOR, UserRole.MANAGER]), addTefillin);
router.post('/tefillin', authenticateToken, authorizeRole(['system_admin','manager']), addTefillin);
//router.get('/',authenticateJWT, roleCheck([UserRole.ADMINISTRATOR, UserRole.MANAGER, UserRole.INVENTORY_MANAGER, UserRole.LOCATION_RABBI]), getFilteredTefillin);
router.get('/', authenticateToken, authorizeRole(['system_admin','manager']), getFilteredTefillin);
// router.get('/:status', getTefillinReport);
router.get('/report/:status', getTefillinReport);
router.get('/id/:tefillinId', getTefillinById);


export default router;
