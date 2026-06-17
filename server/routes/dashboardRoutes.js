import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { getDashboardOverview, revokeFileLink } from '../controllers/dashboardController.js';

const router = express.Router();

// Enforce global validation locks on metrics routing entries
router.get('/overview', protect, getDashboardOverview);
router.delete('/revoke/:id', protect, revokeFileLink);

export default router;