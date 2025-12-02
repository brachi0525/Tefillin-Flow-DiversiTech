// routes/soldiers.ts
import express from 'express';

import {
  changeSoldierStatus,
  addSoldierComment,
  createSoldier,
  deleteSoldier,
  getAllSoldiers,
  updateSoldier,
  assignSoldierToLocation,
  assignTefillinToSoldier,
  getStatistics,
  getSoldierReport,
  getPendingSoldiers,
  getSoldierByTefillinId
} from '../controllers/soldiers.controller';
import { createSoldierSchema, updateSoldierSchema } from '../schemas/soldier.schema';
// import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../validations/validateAllSchema';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

// import { getPendingSoldiers } from '../controllers/soldiers.controller';
const router = express.Router();

router.get('/', authenticateToken, authorizeRole(['system_admin']), getAllSoldiers);
router.get('/pending', authenticateToken, authorizeRole(['system_admin']), getPendingSoldiers);
router.post('/', authenticateToken, authorizeRole(['system_admin']), createSoldier);
router.post('/soldiers/:id/assign-tefillin', authenticateToken, authorizeRole(['system_admin','manager']), assignTefillinToSoldier);
router.put('/:id', authenticateToken, authorizeRole(['system_admin']), updateSoldier);
router.delete('/:id', authenticateToken, authorizeRole(['system_admin']), deleteSoldier);
router.put('/status/:id', changeSoldierStatus);
router.post('/:id', authenticateToken, authorizeRole(['system_admin']), addSoldierComment);
router.put('/assignSoldierToLocation/:locationId/:soldierId', authenticateToken, authorizeRole(['system_admin','manager']), assignSoldierToLocation);
router.get('/statistics', authenticateToken, authorizeRole(['system_admin']), getStatistics);
router.post('/addComment', authenticateToken, authorizeRole(['system_admin']), addSoldierComment);
// router.get('/:status', getSoldierReport);
router.get('/report/:status', authenticateToken, authorizeRole(['system_admin','manager']), getSoldierReport);
router.get('/tefillin/:id', getSoldierByTefillinId);

export default router;
