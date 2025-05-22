// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('--- authMiddleware BAŞLADI ---');
  // console.log('Gelen Headers:', JSON.stringify(req.headers, null, 2)); // Çok uzun olabilir, gerekirse aç

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('authMiddleware - Alınan Token (ilk 20 karakter):', token ? token.substring(0, 20) + '...' : 'TOKEN YOK');
      console.log("authMiddleware - Kullanılan JWT_SECRET (ilk 5 karakter):", process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + '...' : 'TANIMSIZ!');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('authMiddleware - Decoded Token Payload:', decoded);

      if (!decoded || !decoded.id) {
          console.error('authMiddleware - HATA: Decoded payload içinde "id" alanı bulunamadı!', decoded);
          res.status(401);
          throw new Error('Token payload yapısı geçersiz.');
      }

      req.user = await User.findById(decoded.id).select('-password');
      console.log('authMiddleware - Bulunan User:', req.user ? req.user._id.toString() : 'Kullanıcı bulunamadı (DB sorgusu sonucu null)');

      if (!req.user) {
         res.status(401);
         throw new Error('Yetkilendirme başarısız, kullanıcı bulunamadı (token geçerli ama kullanıcı DBde yok).');
      }

      console.log('--- authMiddleware BAŞARIYLA GEÇİLDİ ---');
      next();

    } catch (error) {
      console.error('Token doğrulama hatası (authMiddleware - catch bloğu):', error.message, 'Hata Adı:', error.name);
      res.status(401);
      throw new Error('Yetkilendirme başarısız, geçersiz token.');
    }
  } else { // if bloğuna hiç girmediyse veya token zaten undefined/null ise
    console.log('authMiddleware - Token bulunamadı (Authorization header yok veya Bearer ile başlamıyor).');
    // if (!token) kontrolünü yukarıya aldık, burası else if(!token) olarak da kalabilir
    // ama if'e girmediyse token zaten tanımsızdır.
    res.status(401);
    throw new Error('Yetkilendirme başarısız, token bulunamadı.');
  }
});

// --- admin middleware'i protect'ten sonra ve BAĞIMSIZ olarak tanımlanmalı ---
const admin = (req, res, next) => {
  // Bu middleware'in çalışması için req.user'ın protect tarafından doldurulmuş olması gerekir.
  // Yani admin middleware'i genellikle protect'ten SONRA kullanılır bir rotada.
  if (req.user && req.user.role === 'admin') {
    console.log('--- admin middleware BAŞARIYLA GEÇİLDİ ---');
    next();
  } else {
    console.log('--- admin middleware BAŞARISIZ: Admin yetkisi yok ---');
    console.log('req.user:', req.user); // Kullanıcı bilgilerini logla
    res.status(403); // Forbidden
    throw new Error('Yetkilendirme başarısız, admin yetkisi gerekli.');
  }
};
// --- admin middleware sonu ---

// Middleware'leri dışa aktar
export { protect, admin };