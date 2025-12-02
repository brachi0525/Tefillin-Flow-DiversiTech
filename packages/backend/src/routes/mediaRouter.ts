// media.routes.ts
import express from 'express';
import multer from 'multer';
import {
  getGalleryMedia,
  uploadMedia,
  uploadTefillinPhoto,
  LoadingFiles
} from '../controllers/mediaController';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = express.Router();
const upload = multer();

router.post(
  '/upload-media',
  authenticateToken,
  authorizeRole(['system_admin', 'manager','location_rabbi']),
  upload.array('files'),
  uploadMedia
);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['system_admin', 'manager', 'location_rabbi']),
  getGalleryMedia
);

router.post(
  '/upload-tefillin-photo',
  authenticateToken,
  authorizeRole(['system_admin', 'manager', 'location_rabbi']),
  upload.array('files'),
  uploadTefillinPhoto
);

router.post(
  '/loading-tefillin-photo',
  authenticateToken,
  authorizeRole(['system_admin', 'manager', 'location_rabbi']),
  LoadingFiles
);

export default router;
