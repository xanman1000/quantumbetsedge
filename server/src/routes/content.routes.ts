import express from 'express';
import {
  getAllContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  getContentByType,
  searchContent
} from '../controllers/content.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/search', searchContent);
router.get('/type/:type', getContentByType);
router.get('/:id', getContentById);

// Protected routes (require authentication)
router.get('/', authMiddleware, getAllContent);

// Admin-only routes
router.post('/', adminMiddleware, createContent);
router.put('/:id', adminMiddleware, updateContent);
router.delete('/:id', adminMiddleware, deleteContent);
router.put('/:id/publish', adminMiddleware, publishContent);

export default router; 