import express from 'express';
import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  updateRabbiForLocation,
} from '../controllers/locationController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole(['system_admin','manager']),
  getAllLocations
);

router.post(
  '/getById',
  authenticateToken,
  authorizeRole(['lacation_rabbi']),
  getLocationById
);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['system_admin', 'manager']),
  createLocation
);

router.put(
  '/',
  authenticateToken,
  authorizeRole(['system_admin', 'manager']),
  updateLocation
);

router.put(
  '/:id/rabbi',
  authenticateToken,
  authorizeRole(['location_rabbi']),
  updateRabbiForLocation
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['system_admin', 'manager']),
  deleteLocation
);

export default router;
