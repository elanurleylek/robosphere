// src/routes/userRoutes.js (veya routes/userRoutes.js)
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Yolunuzu kontrol edin
import User from '../models/User.js'; // Yolunuzu kontrol edin
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- Multer Ayarları ---
// public klasörünün backend projenizin kök dizininde olduğunu varsayıyoruz.
// Örnek: backend-projesi/public/uploads/avatars
// __dirname: routes klasörü
// .. : backend kök klasörü
// .. : projenin ana kök klasörü
// public: projenin ana kök klasörü altındaki public
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'avatars');

// Sunucu başlangıcında klasörün varlığını kontrol et ve yoksa oluştur
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Avatar yükleme klasörü oluşturuldu: ${uploadDir}`);
  } catch (error) {
    console.error(`Avatar yükleme klasörü oluşturulamadı: ${uploadDir}`, error);
  }
} else {
  console.log(`Avatar yükleme klasörü mevcut: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // req.user.id protect middleware tarafından eklendiği varsayılır
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir! (jpg, png, jpeg, gif)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  },
  fileFilter: fileFilter
});

// KULLANICI PROFİLİ GETİRME
router.get('/:userId/profile', protect, async (req, res) => {
  console.log('--- GET /api/users/:userId/profile isteği alındı ---'); // Debug log
  console.log('userId:', req.params.userId); // Debug log
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('projects') // İsteğe bağlı: sadece belirli alanları seçebilirsiniz
      .populate('courses'); // Örn: .populate('courses', 'title instructor');

    console.log('Kullanıcı veritabanından çekildi:', user); // Debug log

    if (!user) {
      console.warn('Profil getirme: Kullanıcı bulunamadı', req.params.userId); // Debug log
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user); // Başarılı yanıt
    console.log('Profil verisi başarıyla gönderildi:', user._id); // Debug log
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    // Hata yönetimini güncelleyin
    let errorMessage = 'Sunucu hatası';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    res.status(500).json({ message: errorMessage, error: error }); // Daha detaylı hata bilgisi gönder
  }
});

// PROFİL GÜNCELLEME (Bio ve Avatar için)
router.put('/profile', protect, upload.single('avatarImage'), async (req, res) => {
  console.log('--- PUT /api/users/profile isteği alındı ---'); // Debug log
  console.log('İstek kullanıcısı (req.user.id):', req.user.id); // Debug log
  console.log('req.body:', req.body); // Debug log
  console.log('req.file (Multer tarafından yüklenen dosya):', req.file); // Debug log

  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      console.warn('Profil güncelleme: Kullanıcı bulunamadı', req.user.id); // Debug log
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (req.body.name !== undefined) { // Name alanını da güncelleme eklenmeliydi
        user.name = req.body.name;
        console.log('Name güncellendi:', user.name); // Debug log
    }
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
      console.log('Bio güncellendi:', user.bio); // Debug log
    }

    // Avatar güncelleme/silme mantığı
    const removeAvatarFlag = req.body.removeAvatar === 'true';

    if (req.file) { // Yeni bir resim yüklenmişse
       console.log('Yeni avatar dosyası yüklendi:', req.file.filename); // Debug log
      // Eski avatarı sil (varsayılan değilse)
      if (user.avatar && user.avatar !== '' && !user.avatar.includes('default-avatar.png')) {
        // user.avatar /uploads/avatars/filename.jpg şeklinde saklanıyor olmalı
        const oldAvatarPath = path.join(__dirname, '..', '..', 'public', user.avatar);
         console.log('Eski avatar yolu (siliniyor):', oldAvatarPath); // Debug log
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlink(oldAvatarPath, (err) => {
            if (err) console.error("Eski avatar silinemedi:", err);
            else console.log("Eski avatar başarıyla silindi."); // Debug log
          });
        } else {
           console.warn('Eski avatar dosyası silinemedi (sunucuda bulunamadı):', oldAvatarPath); // Debug log
        }
      }
      user.avatar = `/uploads/avatars/${req.file.filename}`; // Veritabanına kaydedilecek yeni yol (Public URL formatı)
       console.log('user.avatar güncellendi (Yeni dosya):', user.avatar); // Debug log
    } else if (removeAvatarFlag) { // removeAvatar bayrağı geldiyse
        console.log('Avatar kaldırma bayrağı alındı.'); // Debug log
        if (user.avatar && user.avatar !== '' && !user.avatar.includes('default-avatar.png')) {
            const oldAvatarPath = path.join(__dirname, '..', '..', 'public', user.avatar);
             console.log('Eski avatar yolu (siliniyor - kaldırma):', oldAvatarPath); // Debug log
            try {
                fs.unlinkSync(oldAvatarPath); // Senkron silme
                 console.log('Eski avatar başarıyla silindi (kaldırma).'); // Debug log
            } catch (err) {
                 console.error("Eski avatar silinemedi (kaldırma):", err); // Debug log
            }
        } else {
             console.warn('Silinecek avatar yok veya varsayılan avatar.'); // Debug log
        }
        user.avatar = ''; // Veritabanında boş string veya null yap
        console.log('user.avatar güncellendi (Kaldırıldı):', user.avatar); // Debug log
        // Frontend'de varsayılan resmin görünmesi için bu boşluk önemli.
    }
     // Eğer req.file yoksa ve removeAvatarFlag de true değilse, user.avatar değişmez (mevcut değer kalır).
     console.log('Güncelleme öncesi user.avatar son değeri:', user.avatar); // Debug log


    const updatedUser = await user.save(); // Kullanıcıyı veritabanına kaydet

    console.log('Kullanıcı başarıyla veritabanında güncellendi.'); // Debug log
    console.log('Veritabanından kaydedilen user.avatar:', updatedUser.avatar); // Debug log

    // Frontend'e döndürülecek yanıt objesi
    const responsePayload = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar, // <-- Backend'in döndürdüğü avatar yolu burada
      bio: updatedUser.bio,
      role: updatedUser.role,
      joinDate: updatedUser.joinDate,
      createdAt: updatedUser.createdAt,
      // Frontend'in AuthUser interface'inde olup burada olmayan diğer alanlar varsa eklenmeli
      // Örn: enrolledCourseIds
      // enrolledCourseIds: updatedUser.enrolledCourseIds // Eğer User modelinde varsa
    };

    console.log('Backend tarafından döndürülen yanıt payloadı:', responsePayload); // Debug log

    res.json(responsePayload); // Frontend'e güncel kullanıcı bilgisi ile yanıt gönderiliyor

  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    let errorMessage = 'Profil güncellenirken bir sunucu hatası oluştu.';
    if (error instanceof multer.MulterError) {
      errorMessage = error.message;
    } else if (error instanceof Error) { // Genel Error objesi mi?
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
     // Hata yanıtını gönder
    res.status(500).json({ message: errorMessage, error: error }); // Hata detayını da gönder
  }
});

export default router;