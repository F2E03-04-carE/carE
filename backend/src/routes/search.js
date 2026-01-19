import express from 'express';
import {
  searchGarages,
  getFilterOptions
} from '../controllers/searchController.js';

const router = express.Router();
router.get('/search', searchGarages);
router.get('/search/filters', getFilterOptions);

export default router;