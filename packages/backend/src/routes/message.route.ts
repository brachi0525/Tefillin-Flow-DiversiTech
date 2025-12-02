// message.routes.ts
import express from 'express';
import {
  getAllMessages,
  getMessageById,
  getMessagesByUsers,
  createMessage,
  updateMessage,
  deleteMessage
} from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  authorizeRole(['system_admin', 'loaction_rabbi']),
  getAllMessages
);

router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['system_admin', 'loaction_rabbi']),
  getMessageById
);

router.get(
  '/between/:fromRole/:toRole',
  authenticateToken,
  authorizeRole(['system_admin', 'loaction_rabbi']),
  getMessagesByUsers
);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['system_admin']),
  createMessage
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['system_admin']),
  updateMessage
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['system_admin']),
  deleteMessage
);

export default router;
