import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOenCheckout } from '../controllers/paymentController.js';

const router = express.Router();

const checkoutRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/payment/oen/checkout', checkoutRateLimiter, createOenCheckout);

export default router;
