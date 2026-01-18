import express from 'express';
import { getServerIp } from '../controllers/debugController.js';

const router = express.Router();

router.get('/ip', getServerIp);

export default router;
