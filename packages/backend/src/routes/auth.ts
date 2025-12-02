import express from 'express';
import { GoogleAuthController } from '../controllers/auth/googleAuth.controller';
import { GoogleRefreshController } from "../controllers/auth/googleRefresh.controller";

const router = express.Router();

// router.post('/google/auth', GoogleAuthController.handleGoogleAuth);
// router.post('/google/refresh', GoogleRefreshController.handleRefresh);
router.post('/google/auth', async (req, res) => {
  await GoogleAuthController.handleGoogleAuth(req, res);
});

router.post('/google/refresh', async (req, res) => {
  await GoogleRefreshController.handleRefresh(req, res);
});

export default router;
