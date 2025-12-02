import express from 'express';
import { getReport } from '../controllers/reportsController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = express.Router();

router.get('/reports', authenticateToken, authorizeRole(['manager']), getReport);

export default router;
