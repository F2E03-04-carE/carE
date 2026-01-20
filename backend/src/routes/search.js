import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  searchGarages,
  getFilterOptions
} from '../controllers/searchController.js';

const router = express.Router();

const searchRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 search requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

const filtersRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 filter requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

router.get('/search', searchRateLimiter, searchGarages);
router.get('/search/filters', filtersRateLimiter, getFilterOptions);
export default router;