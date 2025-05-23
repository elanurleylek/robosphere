import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler'; // asyncHandler kullanmaya devam edebilirsin, hata yakalamaya yardımcı olur

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Konsola log yazdır (debugging için faydalı)
  console.log('--- authMiddleware BAŞLADI ---');

  // 1. Authorization başlığında "Bearer TOKEN" formatında token var mı kontrol et
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token'ı "Bearer " kısmından sonra al
      token = req.headers.authorization.split(' ')[1];

      // Debug logları
      console.log('authMiddleware - Alınan Token (ilk 20 karakter):', token ? token.substring(0, 20) + '...' : 'TOKEN YOK');
      // JWT_SECRET'ın tanımlı olduğunu Render ve .env'de doğruladık, 5 karakter göstermek güvenli
      console.log("authMiddleware - Kullanılan JWT_SECRET (ilk 5 karakter):", process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + '...' : 'TANIMSIZ!');


      // 2. Token'ı doğrula (Verify)
      // Eğer token geçersizse (imzası yanlış, süresi dolmuş vb.), HATA fırlatır ve catch bloğuna düşer.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('authMiddleware - Decoded Token Payload:', decoded);

      // 3. Token payload'ında gerekli bilgilerin (örneğin kullanıcı id'si) varlığını kontrol et
      if (!decoded || !decoded.id) {
          console.error('authMiddleware - HATA: Decoded payload içinde "id" alanı bulunamadı!', decoded);
          // DÜZELTME: Hata fırlatmak yerine doğrudan 401 yanıtı gönder ve return ile bitir
          return res.status(401).json({ message: 'Yetkilendirme başarısız: Token yapısı geçersiz.' });
      }

      // 4. Token'daki kullanıcı ID'si ile kullanıcıyı veritabanında bul
      // Select('-password') ile şifreyi hariç tut
      req.user = await User.findById(decoded.id).select('-password');
      console.log('authMiddleware - Bulunan User ID:', req.user ? req.user._id.toString() : 'Kullanıcı bulunamadı (DB sorgusu sonucu null)');


      // 5. Kullanıcı veritabanında bulundu mu kontrol et
      if (!req.user) {
         console.error('authMiddleware - HATA: Token geçerli ama kullanıcı DBde bulunamadı.');
         // DÜZELTME: Hata fırlatmak yerine doğrudan 401 yanıtı gönder ve return ile bitir
         return res.status(401).json({ message: 'Yetkilendirme başarısız: Kullanıcı bulunamadı.' });
      }

      // 6. Her şey başarılıysa, req.user'ı ayarla ve bir sonraki middleware/rota işleyicisine geç
      console.log('--- authMiddleware BAŞARIYLA GEÇİLDİ ---');
      next();

    } catch (error) {
      // *** HATA BURADA YAKALANIR (jwt expired, invalid signature vb.) ***
      console.error('Token doğrulama hatası (authMiddleware - catch bloğu):', error.message, 'Hata Adı:', error.name);
      // DÜZELTME: Hata fırlatmak veya next(error) yerine doğrudan 401 yanıtı gönder ve return ile bitir
      // return res.status(401).json({ message: 'Yetkilendirme başarısız: ' + error.message }); // Hata mesajını direkt göndermek istemeyebilirsin
      return res.status(401).json({ message: 'Yetkilendirme başarısız: Geçersiz veya süresi dolmuş token.' });
    }
  } else {
    // 7. Authorization başlığında token hiç yoksa
    console.log('authMiddleware - Token bulunamadı (Authorization header yok veya Bearer ile başlamıyor).');
    // DÜZELTME: Hata fırlatmak veya next(error) yerine doğrudan 401 yanıtı gönder ve return ile bitir
    return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı.' });
  }
});

// --- admin middleware'i (değişiklik yok, protect'ten sonra kullanılır) ---
const admin = (req, res, next) => {
  // Bu middleware'in çalışması için req.user'ın protect tarafından doldurulmuş olması gerekir.
  // Yani admin middleware'i genellikle protect'ten SONRA kullanılır bir rotada.
  if (req.user && req.user.role === 'admin') {
    console.log('--- admin middleware BAŞARIYLA GEÇİLDİ ---');
    next();
  } else {
    console.log('--- admin middleware BAŞARISIZ: Admin yetkisi yok ---');
    console.log('req.user:', req.user); // Kullanıcı bilgilerini logla
    // Burada da hata fırlatmak yerine doğrudan 403 yanıtı göndererek düzeltme yapabiliriz,
    // ama admin middleware'i protect'ten sonra çalıştığı için protect zaten yetkilendirme hatası vermiş olabilir.
    // Ancak yine de güvenli olması açısından hata fırlatmak yerine yanıt göndermek daha sağlamdır.
    // Eğer admin middleware'i de asyncHandler kullanıyorsa throw kullanmak da kabul edilebilir
    // ancak 500 hatalarını kesmek için doğrudan yanıt göndermek en garantisidir.

    // Düzeltme: admin middleware'de de hata fırlatmak yerine doğrudan 403 yanıtı gönder
    // Bu, admin yetkisi olmayan bir kullanıcı korumalı (protect) bir rotayı geçtiyse (örneğin admin rolü kontrolü protect'ten sonra ise)
    // doğru hatayı almasını sağlar.
    if (!res.headersSent) { // Zaten yanıt gönderilmemişse
        console.error('Admin yetkisi gerekli.');
        return res.status(403).json({ message: 'Yetkilendirme başarısız: Yönetici yetkisi gerekli.' }); // Forbidden
    } else {
        // Zaten bir yanıt gönderilmiş (belki protect 401 döndü), bir şey yapma
        console.warn('Admin middleware hatası: Zaten yanıt gönderilmiş.');
        return; // Fonksiyonu bitir
    }

  }
};
// --- admin middleware sonu ---

// Middleware'leri dışa aktar
export { protect, admin };