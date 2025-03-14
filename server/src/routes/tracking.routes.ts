import express from 'express';
import trackingController from '../controllers/tracking.controller';

const router = express.Router();

// Track email opens
router.get('/open/:trackingId', trackingController.trackEmailOpen);

// Track email clicks
router.get('/click/:trackingId', trackingController.trackEmailClick);

export default router; 