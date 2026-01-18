import express from 'express';
import { verifyTaxId } from '../controllers/taxIdController.js';

const router = express.Router();

router.get('/verify-taxid', verifyTaxId);

export default router;
