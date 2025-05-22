// routes/authRoutes.js
import express from 'express';

// Controller fonksiyonlarını import et
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  // deleteUser // Silme rotasını şimdilik eklemeyelim veya yoruma alalım
} from '../controllers/authController.js'; // Controller dosyasının yolunu kontrol et

// Middleware'leri import et
import { protect, admin } from '../middleware/authMiddleware.js'; // Middleware dosyasının yolunu kontrol et

// Express router oluştur
const router = express.Router();

// --- Genel (Public) Rotalar ---
// POST /api/auth/register - Yeni kullanıcı kaydı
router.post('/register', registerUser);

// POST /api/auth/login - Kullanıcı girişi
router.post('/login', loginUser);

// --- Korumalı (Private) Rotalar ---
// GET /api/auth/profile - Giriş yapmış kullanıcının profilini getir
// PUT /api/auth/profile - Giriş yapmış kullanıcının profilini güncelle
router.route('/profile')
  .get(protect, getUserProfile)   // Önce 'protect' middleware çalışır, sonra 'getUserProfile'
  .put(protect, updateUserProfile); // Önce 'protect' middleware çalışır, sonra 'updateUserProfile'

// --- Admin Rotaları (Örnek - İsteğe Bağlı) ---
// DELETE /api/auth/:id - Belirli bir kullanıcıyı sil (Admin yetkisi gerektirir)
// Bu rotayı etkinleştirmek için 'deleteUser' controller'ını ve 'admin' middleware'ini import etmelisiniz.
// router.delete('/:id', protect, admin, deleteUser); // Önce protect, sonra admin, sonra deleteUser çalışır

// Router'ı dışa aktar
export default router;