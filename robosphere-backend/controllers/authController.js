// controllers/authController.js
import User from '../models/User.js'; // ../models/User.js yolunun doğru olduğundan emin ol
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js'; // ../utils/generateToken.js yolunun doğru olduğundan emin ol
// Şifre güncellemede hashleme user.save() ile modeldeki hook tarafından yapılacak
// Ama bcrypt'i burada import etmeye gerek yok gibi duruyor şimdilik.

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Temel girdi kontrolü
  if (!name || !email || !password) {
     res.status(400); // Bad Request
     throw new Error('Lütfen tüm alanları doldurun');
  }

  // E-posta var mı kontrolü
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('Bu e-posta adresi zaten kullanılıyor');
  }

  // Yeni kullanıcı oluştur (şifre hashleme modelde pre-save hook ile olacak)
  const user = await User.create({
    name,
    email,
    password,
  });

  // Kullanıcı başarıyla oluşturulduysa
  if (user) {
    res.status(201).json({ // 201 Created
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Kullanıcı ID'si ile token oluştur
    });
  } else {
    // Normalde create hata fırlatır ama yine de kontrol
    res.status(400); // Bad Request
    throw new Error('Kullanıcı kaydedilemedi, geçersiz veri');
  }
});

// @desc    Kullanıcı girişi (Auth) & token döndür
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Girdi kontrolü
   if (!email || !password) {
     res.status(400); // Bad Request
     throw new Error('Lütfen e-posta ve şifreyi girin');
   }

  // Kullanıcıyı e-posta ile bul ve şifreyi de sorguya dahil et (+password)
  const user = await User.findOne({ email }).select('+password');

  // Kullanıcı bulunduysa VE girilen şifre db'deki hash ile eşleşiyorsa
  if (user && (await user.matchPassword(password))) {
    res.json({ // 200 OK (varsayılan)
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Token oluştur ve yanıtla gönder
    });
  } else {
    // Kullanıcı bulunamadı VEYA şifre eşleşmedi
    res.status(401); // Unauthorized
    throw new Error('Geçersiz e-posta veya şifre'); // Güvenlik için genel mesaj
  }
});

// @desc    Giriş yapmış kullanıcının bilgilerini getir
// @route   GET /api/auth/profile
// @access  Private (protect middleware ile korunacak)
const getUserProfile = asyncHandler(async (req, res) => {
  // protect middleware 'req.user'ı zaten doldurmuş olmalı
  const user = req.user;

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    // Bu durumun olmaması gerekir, protect middleware yakalamalı
    res.status(404);
    throw new Error('Kullanıcı bulunamadı (beklenmeyen durum)');
  }
});

// @desc    Giriş yapmış kullanıcının profilini güncelle
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // Güncellenecek kullanıcıyı ID ile bul (protect middleware'inden gelen ID)
    const user = await User.findById(req.user._id);

    if (user) {
        // Gelen veriden isim veya e-postayı güncelle (eğer geldiyse)
        user.name = req.body.name || user.name;
        const newEmail = req.body.email;

        // E-posta değiştiyse ve yeni e-posta mevcut kullanıcıdan farklıysa
        if (newEmail && newEmail !== user.email) {
            // Yeni e-postanın başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
            const emailExists = await User.findOne({ email: newEmail });
            if (emailExists) {
                res.status(400);
                throw new Error('Bu email adresi zaten başkası tarafından kullanılıyor.');
            }
            user.email = newEmail; // E-postayı güncelle
        }

        // Şifre güncelleniyorsa (yeni şifre geldiyse)
        if (req.body.password) {
            // İsteğe bağlı: Şifre uzunluk kontrolü
            if (req.body.password.length < 6) {
               res.status(400);
               throw new Error('Yeni şifre en az 6 karakter olmalıdır.');
            }
            // Yeni şifreyi ata (hashleme modeldeki pre-save hook'u ile olacak)
            user.password = req.body.password;
        }

        // Değişiklikleri kaydet (pre-save hook'ları çalıştırır)
        const updatedUser = await user.save();

        // Güncellenmiş kullanıcı bilgilerini (ve isteğe bağlı yeni token) döndür
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id), // Yeni bilgilerle yeni token
        });
    } else {
        // Bu durumun da olmaması gerekir (protect middleware'i kullanıcıyı bulmalıydı)
        res.status(404);
        throw new Error('Kullanıcı bulunamadı (güncelleme)');
    }
});

// Kullanıcı silme (Şimdilik burada bırakıyoruz, admin yetkisi kontrolü gerekebilir)
// @desc    Kullanıcıyı sil (ID ile)
// @route   DELETE /api/auth/:id (Admin veya özel yetki gerektirebilir)
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
        res.status(404);
        throw new Error('Silinecek kullanıcı bulunamadı');
    }

    // !!! ÖNEMLİ: Burada yetki kontrolü yapılmalı !!!
    // Örneğin: Sadece admin silebilir VEYA kullanıcı kendi hesabını silebilir
    // if (req.user.role !== 'admin' && req.user._id.toString() !== userToDelete._id.toString()) {
    //    res.status(403); // Forbidden
    //    throw new Error('Bu işlemi yapmaya yetkiniz yok.');
    // }

    await userToDelete.deleteOne(); // Kullanıcıyı sil
    res.json({ message: 'Kullanıcı başarıyla silindi.' });
});


// Controller fonksiyonlarını dışa aktar
export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
};