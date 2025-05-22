// routes/aiRoutes.js
import express from 'express';
import { askGoogleAI } from '../controllers/aiController.js'; // Birazdan oluşturacağımız controller fonksiyonu
// import { protect } from '../middleware/authMiddleware.js'; // Giriş kontrolü istersen bunu açarsın

const router = express.Router();

// POST /api/ai/ask - Google AI'a soru sormak için endpoint
// router.post('/ask', protect, askGoogleAI); // Giriş korumasıyla
router.post('/ask', askGoogleAI); // Şimdilik giriş koruması olmadan

export default router;