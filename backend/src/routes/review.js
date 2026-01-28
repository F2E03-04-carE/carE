import express from 'express';
import { getReviewsByGarage, getReviewStats } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/reviews', getReviewsByGarage);
router.get('/reviews/stats/:garage_id', getReviewStats);

export default router;
