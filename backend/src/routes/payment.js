import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOenCheckout, getOenTransaction, handleOenWebhook } from '../controllers/paymentController.js';

const router = express.Router();

const checkoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/payment/oen/checkout', checkoutRateLimiter, createOenCheckout);

const queryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
router.get('/payment/oen/transactions/:id', queryRateLimiter, getOenTransaction);

router.post('/payment/oen/webhook', handleOenWebhook);

export default router;
