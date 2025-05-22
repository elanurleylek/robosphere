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
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('projects') // İsteğe bağlı: sadece belirli alanları seçebilirsiniz
      .populate('courses'); // Örn: .populate('courses', 'title instructor');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

// PROFİL GÜNCELLEME (Bio ve Avatar için)
router.put('/profile', protect, upload.single('avatarImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }

    if (req.file) {
      // Eski avatarı sil (varsayılan değilse)
      if (user.avatar && user.avatar !== '' && !user.avatar.includes('default-avatar.png')) {
        // user.avatar /uploads/avatars/filename.jpg şeklinde saklanıyor olmalı
        const oldAvatarPath = path.join(__dirname, '..', '..', 'public', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlink(oldAvatarPath, (err) => {
            if (err) console.error("Eski avatar silinemedi:", err);
          });
        }
      }
      user.avatar = `/uploads/avatars/${req.file.filename}`; // Public URL
    } else if (req.body.removeAvatar === 'true') {
        if (user.avatar && user.avatar !== '' && !user.avatar.includes('default-avatar.png')) {
            const oldAvatarPath = path.join(__dirname, '..', '..', 'public', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }
        user.avatar = ''; // Veya varsayılan avatar yolunuz '/default-avatar.png'
    }


    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
      joinDate: updatedUser.joinDate,
      createdAt: updatedUser.createdAt, // Frontend'de joinDate yerine createdAt kullanabilirsiniz
      // Frontend'in beklediği diğer alanlar
    });

  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    let errorMessage = 'Profil güncellenirken bir sunucu hatası oluştu.';
    if (error instanceof multer.MulterError) {
      errorMessage = error.message;
    } else if (error.message) {
       errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage, error: error.toString() });
  }
});

export default router;