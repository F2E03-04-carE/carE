import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getCurrentSubscription,
  activateTrial,
  activateLifetime
} from '../controllers/subscriptionController.js';

const router = express.Router();

const subscriptionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/subscription/current', subscriptionRateLimiter, getCurrentSubscription);
router.post('/trial/activate', subscriptionRateLimiter, activateTrial);
router.post('/subscription/activate-lifetime', subscriptionRateLimiter, activateLifetime);

export default router;
