// routes/blogPostRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import BlogPost from '../models/BlogPost.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- Multer (Dosya Yükleme) Konfigürasyonu ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'images');

    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log(`Multer: Hedef klasör oluşturuldu: ${uploadPath}`);
      } catch (err) {
        console.error(`Multer: Hedef klasör oluşturulamadı HATA: ${uploadPath}`, err);
        return cb(err);
      }
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const safeOriginalName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-._]/g, '');
    cb(null, Date.now() + '-' + safeOriginalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    const error = new Error('Sadece JPEG, PNG veya GIF formatında resim yüklenebilir!');
    cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB dosya boyutu limiti
  },
  fileFilter: fileFilter
});
// --- Multer Konfigürasyonu Sonu ---


// --- Blog Post CRUD Operasyonları ---

// 1. CREATE: Yeni Blog Yazısı Ekle (POST /api/blogposts)
router.post('/', protect, upload.single('image'), async (req, res) => {
  console.log('--- POST /api/blogposts isteği BAŞLADI ---');
  console.log('req.file (Multer sonrası):', req.file);
  console.log('req.body (Multer sonrası):', req.body);
  try {
    const { title, content, category, tags, excerpt } = req.body;
    const authorId = req.user._id; // protect middleware'den gelen kullanıcı ID'si

    if (!title || !content) {
      return res.status(400).json({ message: 'Başlık ve içerik alanları zorunludur.' });
    }

    let imageUrlPath = null;
    if (req.file) {
      imageUrlPath = `/uploads/images/${req.file.filename}`;
    }

    const newPostData = {
      title,
      content,
      author: authorId, // <-- Yazının yazarını kaydediyoruz
      category: category || 'Genel',
      // Frontend'den string veya dizi gelebilir, backend'de diziye çeviriyoruz
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : [],
      imageUrl: imageUrlPath,
      // Excerpt frontend'den geliyorsa kullan, yoksa backend'de oluştur
      excerpt: excerpt || (content ? content.substring(0, Math.min(content.length, 150)) + (content.length > 150 ? '...' : '') : 'Özet yok.')
    };

    const newPost = new BlogPost(newPostData);
    const savedPost = await newPost.save();

    // Yanıtta yazar bilgilerini de populate et (name ve avatar)
    const populatedPost = await BlogPost.findById(savedPost._id).populate('author', 'name avatar'); // name ve avatar populate ediliyor
    res.status(201).json(populatedPost || savedPost);

  } catch (error) {
    console.error("Blog yazısı ekleme hatası DETAY:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => (e && typeof e === 'object' && 'message' in e && e.message) ? e.message : 'Geçersiz alan').join('. ');
      console.error("Mongoose Validation Errors:", error.errors);
      return res.status(400).json({ message: `Geçersiz veri: ${messages}`, errors: error.errors });
    } else if (error instanceof multer.MulterError) {
       console.error("Multer Hatası:", error.message);
       return res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
       return res.status(500).json({ message: "Sunucuda bir hata oluştu blog yazısı eklenirken.", error: error.message });
    }
    // Beklenmedik diğer hata türleri için
    return res.status(500).json({ message: "Sunucuda bilinmeyen bir hata oluştu.", error: (error && typeof error === 'object' && 'message' in error && error.message) || error });
  }
});

// 2. READ: Tüm Blog Yazılarını Listele (GET /api/blogposts)
// Bu rota artık 'author' query parametresi alarak filtreleme yapabilir
router.get('/', async (req, res) => {
  try {
    const filter = {}; // Filtre objesi başlatılıyor

    // Eğer istekte 'author' query parametresi varsa, filtreye ekle
    if (req.query.author) {
      // req.query.author string olmalı, Mongoose otomatik olarak ObjectId'ye çevirir
      filter.author = req.query.author;
    }

    // Veritabanından yazıları filtreye göre çek
    // Yazarın name ve avatarını populate et
    // Son eklenene göre sırala
    const posts = await BlogPost.find(filter) // <-- Filter objesi burada kullanılıyor
      .populate('author', 'name avatar') // name ve avatar populate ediliyor
      .sort({ createdAt: -1 });

    res.status(200).json(posts); // Frontend'e yanıt gönderiliyor
  } catch (error) {
    console.error("Blog yazısı listeleme hatası:", error);
    // Hata yönetimini güncelleyin
    const errorMessage = (error && typeof error === 'object' && 'message' in error && error.message) || 'Sunucu hatası oluştu yazıları listelerken.';
    res.status(500).json({ message: errorMessage, error: error });
  }
});

// 3. READ: Tek Bir Blog Yazısını Getir (GET /api/blogposts/:id)
router.get('/:id', async (req, res) => {
  try {
    // Tek yazıyı çekerken yazarın name ve avatarını populate et
    const post = await BlogPost.findById(req.params.id).populate('author', 'name avatar'); // name ve avatar populate ediliyor

    if (!post) {
      return res.status(404).json({ message: 'Belirtilen ID ile blog yazısı bulunamadı.' });
    }
    res.status(200).json(post); // Frontend'e yanıt gönderiliyor
  } catch (error) {
    console.error("Tek blog yazısı getirme hatası:", error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    } else if (error instanceof Error) {
        const errorMessage = error.message || 'Sunucu hatası oluştu tek yazı getirilirken.';
        return res.status(500).json({ message: errorMessage, error: error.message });
    }
     const unknownError = (error && typeof error === 'object' && 'message' in error && error.message) || error;
     return res.status(500).json({ message: "Sunucuda bilinmeyen bir hata oluştu.", error: unknownError });
  }
});

// 4. UPDATE: Blog Yazısını Güncelle (PUT /api/blogposts/:id)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  console.log('--- PUT /api/blogposts/:id isteği BAŞLADI ---');
  console.log('req.file (Güncelleme - Multer sonrası):', req.file);
  console.log('req.body (Güncelleme - Multer sonrası):', req.body);
  try {
    const { title, content, category, tags, removeImage, excerpt } = req.body;
    const updateData = {}; // Güncelleme için obje

    const postToUpdate = await BlogPost.findById(req.params.id);
    if (!postToUpdate) {
        return res.status(404).json({ message: 'Güncellenecek blog yazısı bulunamadı.' });
    }

    // --- YETKİLENDİRME KONTROLÜ ---
    const isAuthor = postToUpdate.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
        return res.status(403).json({ message: 'Bu yazıyı güncelleme yetkiniz yok.' }); // 403 Forbidden
    }
    // --- YETKİLENDİRME KONTROLÜ SONU ---

    // Güncelleme yapılacak alanları updateData objesine ekle
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (excerpt !== undefined) updateData.excerpt = excerpt;

    if (tags !== undefined) {
         updateData.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : [];
    }

    // Resim güncelleme/silme mantığı
    const shouldRemoveImage = removeImage === 'true' || removeImage === true;

    if (req.file) { // Yeni bir resim yüklenmişse
      if (postToUpdate.imageUrl && !postToUpdate.imageUrl.endsWith('/default-blog.png')) {
        const oldImageSystemPath = path.join(__dirname, '..', 'public', postToUpdate.imageUrl);
         if (fs.existsSync(oldImageSystemPath)) {
           fs.unlink(oldImageSystemPath, (err) => { if (err) console.error("Güncelleme: Eski resim silinirken hata:", postToUpdate.imageUrl, err); });
         }
      }
      updateData.imageUrl = `/uploads/images/${req.file.filename}`; // Yeni resmin URL'si
    } else if (shouldRemoveImage) { // Resim kaldırılmak isteniyorsa (ve yeni resim yüklenmemişse)
       if (postToUpdate.imageUrl && !postToUpdate.imageUrl.endsWith('/default-blog.png')) {
         const oldImageSystemPath = path.join(__dirname, '..', 'public', postToUpdate.imageUrl);
         if (fs.existsSync(oldImageSystemPath)) {
            fs.unlink(oldImageSystemPath, (err) => { if (err) console.error("Güncelleme (Resim Kaldırma): Eski resim silinirken hata:", postToUpdate.imageUrl, err); });
         }
      }
      updateData.imageUrl = null; // Veritabanından imageUrl'i kaldır
    }
    // Eğer req.file yoksa ve removeImage de gelmemişse, updateData.imageUrl set edilmez, mevcut resim kalır.


    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar'); // name ve avatar populate ediliyor

    if (!updatedPost) {
        return res.status(404).json({ message: 'Güncellenecek blog yazısı bulunamadı (update sonrası).' });
    }

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error("Blog yazısı güncelleme hatası DETAY:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => (e && typeof e === 'object' && 'message' in e && e.message) ? e.message : 'Geçersiz alan').join('. ');
      return res.status(400).json({ message: `Geçersiz veri: ${messages}`, errors: error.errors });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    } else if (error instanceof multer.MulterError) {
       console.error("Multer Hatası:", error.message);
       return res.status(400).json({ message: error.message });
    } else if (error instanceof Error) {
      const errorMessage = error.message || 'Sunucu hatası oluştu yazı güncellenirken.';
      return res.status(500).json({ message: errorMessage, error: error.message });
    }
     const unknownError = (error && typeof error === 'object' && 'message' in error && error.message) || error;
     return res.status(500).json({ message: "Sunucuda bilinmeyen bir hata oluştu.", error: unknownError });
  }
});

// 5. DELETE: Blog Yazısını Sil (DELETE /api/blogposts/:id)
router.delete('/:id', protect, async (req, res) => {
   const postId = req.params.id;
   const userId = req.user._id;

  try {
    const postToDelete = await BlogPost.findById(postId);
    if (!postToDelete) {
      return res.status(404).json({ message: 'Silinecek blog yazısı bulunamadı.' });
    }

    // --- YETKİLENDİRME KONTROLÜ ---
    const isAuthor = postToDelete.author.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
        return res.status(403).json({ message: 'Bu yazıyı silme yetkiniz yok.' }); // 403 Forbidden
    }
    // --- YETKİLENDİRME KONTROLÜ SONU ---


    // İlişkili resmi sunucudan sil (eğer varsa ve varsayılan bir resim değilse)
    if (postToDelete.imageUrl && !postToDelete.imageUrl.endsWith('/default-blog.png')) {
        const imageSystemPath = path.join(__dirname, '..', 'public', postToDelete.imageUrl);
         if (fs.existsSync(imageSystemPath)) {
            fs.unlink(imageSystemPath, (err) => {
                if (err) console.error("Silme: Eski resim silinirken hata:", postToDelete.imageUrl, err);
            });
        } else {
            console.warn("Silme: Silinecek resim sunucuda bulunamadı veya varsayılan resim:", postToDelete.imageUrl);
        }
    }

    await BlogPost.findByIdAndDelete(postId);

    // Opsiyonel: Kullanıcının blogPosts dizisinden silme
    // Eğer User modelinde blog yazılarının ID'lerinin tutulduğu bir dizi varsa, buradan da silinmeli.
    // Örneğin, User modelinde `blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost' }]` varsa:
    // const user = await User.findById(postToDelete.author);
    // if (user) {
    //     user.blogPosts = user.blogPosts.filter(blogPostId => blogPostId && blogPostId.toString() !== postId.toString());
    //     await user.save();
    // }


    res.status(200).json({ message: 'Blog yazısı başarıyla silindi.' });
  } catch (error) {
    console.error("Blog yazısı silme hatası:", error);
     if (error.name === 'CastError') {
       return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    } else if (error instanceof Error) {
        const errorMessage = error.message || 'Sunucu hatası oluştu yazı silinirken.';
       return res.status(500).json({ message: errorMessage, error: error.message });
    }
     const unknownError = (error && typeof error === 'object' && 'message' in error && error.message) || error;
     return res.status(500).json({ message: "Sunucuda bilinmeyen bir hata oluştu.", error: unknownError });
  }
});

export default router;