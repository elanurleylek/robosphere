// routes/projectRoutes.js

import express from 'express';
import Project from '../models/Project.js'; // Project modelini import et
import User from '../models/User.js'; // <-- User modelini import et (Projeyi kullanıcıya bağlamak için)
// Koruma middleware'ini import et
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Proje CRUD Operasyonları ---

// 1. CREATE: Yeni Proje Ekle (POST /api/projects)
//    Sadece giriş yapmış kullanıcılar ekleyebilsin diye 'protect' eklendi.
//    Proje oluşturulurken sahibini (owner) kaydedecek.
router.post('/', protect, async (req, res) => {
  const { title, description, difficulty, technologies, projectUrl, imageUrl } = req.body;
  // protect middleware'inden gelen kullanıcı ID'si, projenin sahibi olacak
  const userId = req.user.id;

  try {
    // Yeni proje belgesini oluştururken sahibini (owner) ekle
    const newProject = new Project({
      title,
      description,
      difficulty,
      // Frontend'den technologies alanı string geliyorsa diziye çevir
      technologies: technologies ? (Array.isArray(technologies) ? technologies : technologies.split(',').map(t => t.trim()).filter(t => t)) : [],
      projectUrl,
      imageUrl,
      owner: userId // <-- Projenin sahibini burada kaydediyoruz
    });

    const savedProject = await newProject.save();

    // Proje ID'sini kullanıcının 'projects' dizisine ekle
    const user = await User.findById(userId);
    if (user) {
        // Kullanıcının projects alanı bir dizi ObjectId olmalı (modelde tanımlanmış olmalı)
        user.projects.push(savedProject._id);
        await user.save();
    } else {
        // Bu durum normalde olmamalı (protect middleware'i kullanıcıyı bulmuş olmalı)
        console.warn(`Proje ${savedProject._id} oluşturuldu ancak sahibi (userId: ${userId}) veritabanında bulunamadı.`);
    }


    // Başarılı yanıt gönder
    // Frontend'in beklediği formatta yanıt döndürmek faydalı olabilir
    res.status(201).json(savedProject); // savedProject zaten owner bilgisi içerir

  } catch (error) {
    console.error("Proje ekleme hatası:", error);
    if (error.name === 'ValidationError') {
      // ValidationError detaylarını frontend'e göndermek daha faydalı olabilir
      res.status(400).json({ message: "Geçersiz proje verisi gönderildi", errors: error.errors, details: error.message });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
    }
  }
});

// 2. READ: Tüm Projeleri Listele (GET /api/projects)
//    Herkese açık, 'protect' eklenmedi. Projeleri çekerken sahiplerini populate etme opsiyonu eklendi.
router.get('/', async (req, res) => {
  try {
    // Projeleri çekerken sahibinin sadece adını ve avatarını populate et
    const projects = await Project.find({}).populate('owner', 'name avatar');
    res.status(200).json(projects);
  } catch (error) {
    console.error("Proje listeleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
  }
});

// 3. READ: Tek Bir Projeyi Getir (GET /api/projects/:id)
//    Herkese açık, 'protect' eklenmedi. Proje sahibini populate etme opsiyonu eklendi.
router.get('/:id', async (req, res) => {
  try {
    // Proje detayında sahibini göstermek isterseniz .populate('owner', 'name avatar') gibi ekleyebilirsiniz
    const project = await Project.findById(req.params.id).populate('owner', 'name avatar'); // <-- Owner'ı populate et
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Proje getirme hatası:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz proje ID formatı' });
    }
    res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
  }
});

// 4. UPDATE: Projeyi Güncelle (PUT /api/projects/:id)
//    Sadece giriş yapmış kullanıcılar ve projenin sahibi güncelleyebilsin diye 'protect' eklendi ve kontrol yapıldı.
router.put('/:id', protect, async (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id; // protect middleware'inden gelen kullanıcı ID'si

  try {
    // Projeyi bul
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Güncellenecek proje bulunamadı' });
    }

    // Projenin sahibinin isteği yapan kullanıcı olup olmadığını kontrol et
    // owner alanı ObjectId olduğu için toString() ile karşılaştırın
    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu projeyi güncellemek için yetkiniz yok' }); // 403 Forbidden
    }

    // Güncelleme işlemlerini yap
    // req.body'den gelen verileri projeye uygula
    const { title, description, difficulty, technologies, projectUrl, imageUrl } = req.body;

    // undefined gelirse mevcut değeri koru, null gelirse (imageUrl için) null ata
    project.title = title !== undefined ? title : project.title;
    project.description = description !== undefined ? description : project.description;
    project.difficulty = difficulty !== undefined ? difficulty : project.difficulty;
    // technologies string olarak gelirse diziye çevir, dizi gelirse kullan, undefined gelirse mevcutu koru
    project.technologies = technologies !== undefined ? (Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(t => t) : project.technologies)) : project.technologies;
    project.projectUrl = projectUrl !== undefined ? projectUrl : project.projectUrl;
    // imageUrl için null değeri gelirse temizle, undefined gelirse mevcutu koru
    project.imageUrl = imageUrl !== undefined ? (imageUrl === null ? null : imageUrl) : project.imageUrl;

    const updatedProject = await project.save(); // save() ile validatorları çalıştır

    res.status(200).json(updatedProject);

  } catch (error) {
    console.error("Proje güncelleme hatası:", error);
    if (error.name === 'ValidationError') {
       res.status(400).json({ message: "Geçersiz proje verisi", errors: error.errors, details: error.message });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz proje ID formatı' });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
    }
  }
});

// 5. DELETE: Projeyi Sil (DELETE /api/projects/:id)
//    Sadece giriş yapmış kullanıcılar ve projenin sahibi silsin diye 'protect' eklendi ve kontrol yapıldı.
//    Kullanıcının proje listesinden de silecek.
router.delete('/:id', protect, async (req, res) => {
   const projectId = req.params.id;
   const userId = req.user.id; // protect middleware'inden gelen kullanıcı ID'si

  try {
    // Projeyi bul
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Silinecek proje bulunamadı' });
    }

    // Projenin sahibinin isteği yapan kullanıcı olup olmadığını kontrol et
    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Bu projeyi silmek için yetkiniz yok' }); // 403 Forbidden
    }

    // Projeyi sil
     await project.deleteOne(); // Mongoose v6+ için deleteOne

    // Kullanıcının projeler dizisinden proje ID'sini kaldır
    const user = await User.findById(userId);
     if (user) {
         user.projects = user.projects.filter(projId => projId && projId.toString() !== projectId.toString()); // null/undefined kontrolü de eklendi
         await user.save();
     }
     // Kullanıcı bulunamazsa veya projeler dizisi boşsa, silme işlemi yine de başarılı sayılabilir.


    res.status(200).json({ message: 'Proje başarıyla silindi' });

  } catch (error) {
    console.error("Proje silme hatası:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz proje ID formatı' });
    }
    res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
  }
});

// Router'ı dışa aktar
export default router;