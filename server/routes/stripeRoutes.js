import express from 'express';
import { createCheckout, createPortal } from '../controllers/stripeController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckout);
router.post('/create-portal-session', createPortal);

export default router;
