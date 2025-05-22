// routes/blogPostRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // ES Modules için __dirname alternatifi
import BlogPost from '../models/BlogPost.js'; // BlogPost modelini import et
import { protect } from '../middleware/authMiddleware.js'; // protect middleware'i

// ES Modules için __dirname'i manuel olarak tanımla
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Bu, şu anki dosyanın (blogPostRoutes.js) bulunduğu 'routes' klasörünü gösterir

const router = express.Router();

// --- Multer (Dosya Yükleme) Konfigürasyonu ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Hedef: Proje Kökü -> public -> uploads -> images
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'images');

    // Klasör yoksa oluştur (recursive: true iç içe klasörleri de oluşturur)
    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log(`Multer: Hedef klasör oluşturuldu: ${uploadPath}`);
      } catch (err) {
        console.error(`Multer: Hedef klasör oluşturulamadı HATA: ${uploadPath}`, err);
        return cb(err); // Hata durumunda multer'a hata ilet
      }
    }
    cb(null, uploadPath); // Dosyanın kaydedileceği yer
  },
  filename: function (req, file, cb) {
    // Dosya adını benzersiz yap: zaman damgası + orijinal ad (güvenli hale getirilmiş)
    const safeOriginalName = file.originalname
      .toLowerCase()
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/[^a-z0-9-._]/g, ''); // Sadece harf, rakam, tire, nokta, alt çizgi kalsın
    cb(null, Date.now() + '-' + safeOriginalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true); // Dosyayı kabul et
  } else {
    // Multer'a bir hata nesnesi iletmek, bunun 500'e dönüşmesini engeller ve istemciye 400 olarak dönebilir
    const error = new Error('Sadece JPEG, PNG veya GIF formatında resim yüklenebilir!');
    error.status = 400; // Hata durum kodunu ayarlayabilirsiniz, ancak multer bunu doğrudan kullanmayabilir
    cb(error, false); // Hata ile reddet
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
// Bu rota adı, frontend'deki api.ts'de kullanılanla (API_BASE_URL/blogposts) eşleşmelidir.
router.post('/', protect, upload.single('image'), async (req, res) => {
  console.log('--- POST /api/blogposts isteği BAŞLADI ---');
  console.log('req.file (Multer sonrası):', req.file);
  console.log('req.body (Multer sonrası):', req.body);
  try {
    const { title, content, category, tags } = req.body; // 'tags' frontend'den virgülle ayrılmış string olarak gelecek

    if (!title || !content) {
      return res.status(400).json({ message: 'Başlık ve içerik alanları zorunludur.' });
    }

    const authorId = req.user._id; // authMiddleware'den (protect)

    let imageUrlPath = null; // Varsayılan olarak resim yok
    if (req.file) {
      // server.js'deki express.static('public') nedeniyle URL'de 'public' olmaz.
      // Dosya public/uploads/images/ altında saklanacak, URL /uploads/images/ olacak.
      imageUrlPath = `/uploads/images/${req.file.filename}`;
    }

    const newPostData = {
      title,
      content,
      author: authorId,
      category: category || 'Genel', // Kategori yoksa varsayılan 'Genel'
      // 'tags' string'ini array'e çevir. Eğer tags boş veya undefined ise boş array ata.
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      imageUrl: imageUrlPath,
    };

    const newPost = new BlogPost(newPostData);
    const savedPost = await newPost.save(); // Mongoose validasyonları burada çalışacak

    // Yanıtta yazar bilgilerini de gönder
    const populatedPost = await BlogPost.findById(savedPost._id).populate('author', 'name email'); // Sadece name ve email
    res.status(201).json(populatedPost || savedPost);

  } catch (error) {
    console.error("Blog yazısı ekleme hatası DETAY:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join('. ');
      console.error("Mongoose Validation Errors:", error.errors);
      return res.status(400).json({ message: `Geçersiz veri: ${messages}`, errors: error.errors });
    } else if (error.message && error.message.includes('Sadece JPEG, PNG veya GIF')) {
      // Multer'dan gelen dosya tipi hatası
      return res.status(400).json({ message: error.message });
    }
    // Diğer beklenmedik hatalar için
    return res.status(500).json({ message: "Sunucuda bir hata oluştu blog yazısı eklenirken.", error: error.message });
  }
});

// 2. READ: Tüm Blog Yazılarını Listele (GET /api/blogposts)
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Blog yazısı listeleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu yazıları listelerken.", error: error.message });
  }
});

// 3. READ: Tek Bir Blog Yazısını Getir (GET /api/blogposts/:id)
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Belirtilen ID ile blog yazısı bulunamadı.' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Tek blog yazısı getirme hatası:", error);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    }
    res.status(500).json({ message: "Sunucu hatası oluştu tek yazı getirilirken.", error: error.message });
  }
});

// 4. UPDATE: Blog Yazısını Güncelle (PUT /api/blogposts/:id)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  console.log('--- PUT /api/blogposts/:id isteği BAŞLADI ---');
  console.log('req.file (Güncelleme - Multer sonrası):', req.file);
  console.log('req.body (Güncelleme - Multer sonrası):', req.body);
  try {
    const { title, content, category, tags, removeImage } = req.body;
    const updateData = {};

    const postToUpdate = await BlogPost.findById(req.params.id);
    if (!postToUpdate) {
        return res.status(404).json({ message: 'Güncellenecek blog yazısı bulunamadı.' });
    }
    // Yazar kontrolü
    if (postToUpdate.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Bu yazıyı güncelleme yetkiniz yok.' });
    }

    // Sadece gönderilen alanları güncelleme objesine ekle
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) { // 'tags' string veya null/undefined olabilir
        updateData.tags = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    }

    if (req.file) { // Yeni bir resim yüklenmişse
      // Eski resmi sil (eğer varsa ve varsayılan değilse)
      if (postToUpdate.imageUrl && !postToUpdate.imageUrl.includes('default-blog.png')) {
        const oldImageSystemPath = path.join(__dirname, '..', 'public', postToUpdate.imageUrl);
        if (fs.existsSync(oldImageSystemPath)) {
          fs.unlink(oldImageSystemPath, (err) => {
            if (err) console.error("Güncelleme: Eski resim silinirken hata:", postToUpdate.imageUrl, err);
            else console.log("Güncelleme: Eski resim başarıyla silindi:", postToUpdate.imageUrl);
          });
        }
      }
      updateData.imageUrl = `/uploads/images/${req.file.filename}`;
    } else if (removeImage === 'true' || removeImage === true) { // Resim kaldırılmak isteniyorsa
      // Eski resmi sil (eğer varsa ve varsayılan değilse)
      if (postToUpdate.imageUrl && !postToUpdate.imageUrl.includes('default-blog.png')) {
        const oldImageSystemPath = path.join(__dirname, '..', 'public', postToUpdate.imageUrl);
        if (fs.existsSync(oldImageSystemPath)) {
          fs.unlink(oldImageSystemPath, (err) => {
            if (err) console.error("Güncelleme (Resim Kaldırma): Eski resim silinirken hata:", postToUpdate.imageUrl, err);
            else console.log("Güncelleme (Resim Kaldırma): Eski resim başarıyla silindi:", postToUpdate.imageUrl);
          });
        }
      }
      updateData.imageUrl = null; // Veritabanından imageUrl'i kaldır
    }
    // Eğer req.file yoksa ve removeImage de gelmemişse, mevcut imageUrl değişmez.

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true } // Güncellenmiş dokümanı döndür ve validasyonları çalıştır
    ).populate('author', 'name email');

    if (!updatedPost) { // Bu aslında yukarıdaki findById ile yakalanmalı ama ek bir kontrol
        return res.status(404).json({ message: 'Güncellenecek blog yazısı bulunamadı (update sonrası).' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Blog yazısı güncelleme hatası DETAY:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join('. ');
      return res.status(400).json({ message: `Geçersiz veri: ${messages}`, errors: error.errors });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    } else if (error.message && error.message.includes('Sadece JPEG, PNG veya GIF')) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Sunucu hatası oluştu yazı güncellenirken.", error: error.message });
  }
});

// 5. DELETE: Blog Yazısını Sil (DELETE /api/blogposts/:id)
router.delete('/:id', protect, async (req, res) => {
  try {
    const postToDelete = await BlogPost.findById(req.params.id);
    if (!postToDelete) {
      return res.status(404).json({ message: 'Silinecek blog yazısı bulunamadı.' });
    }
    // Yazar kontrolü
    if (postToDelete.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu yazıyı silme yetkiniz yok.' });
    }

    // İlişkili resmi sunucudan sil (eğer varsa ve varsayılan bir resim değilse)
    if (postToDelete.imageUrl && !postToDelete.imageUrl.includes('default-blog.png')) { // Varsayılan bir resim adınız varsa onu kontrol edin
        const imageSystemPath = path.join(__dirname, '..', 'public', postToDelete.imageUrl);
        if (fs.existsSync(imageSystemPath)) {
            fs.unlink(imageSystemPath, (err) => { // Asenkron, hatayı sadece logla, işlemi bloklama
                if (err) console.error("Silme: Eski resim silinirken hata:", postToDelete.imageUrl, err);
                else console.log("Silme: Resim başarıyla silindi:", postToDelete.imageUrl);
            });
        } else {
            console.warn("Silme: Silinecek resim sunucuda bulunamadı:", postToDelete.imageUrl);
        }
    }

    await BlogPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog yazısı başarıyla silindi.' });
  } catch (error) {
    console.error("Blog yazısı silme hatası:", error);
     if (error.name === 'CastError') {
       return res.status(400).json({ message: 'Geçersiz Blog Yazısı ID formatı.' });
    }
    res.status(500).json({ message: "Sunucu hatası oluştu yazı silinirken.", error: error.message });
  }
});

export default router;