// routes/projectRoutes.js

import express from 'express';
import Project from '../models/Project.js'; // Project modelini import et
// Koruma middleware'ini import et
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Proje CRUD Operasyonları ---

// 1. CREATE: Yeni Proje Ekle (POST /api/projects)
//    Sadece giriş yapmış kullanıcılar ekleyebilsin diye 'protect' eklendi.
router.post('/', protect, async (req, res) => { // <-- 'protect' eklendi
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Proje ekleme hatası:", error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: "Geçersiz proje verisi gönderildi", errors: error.errors });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
    }
  }
});

// 2. READ: Tüm Projeleri Listele (GET /api/projects)
//    Herkese açık, 'protect' eklenmedi.
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Proje listeleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
  }
});

// 3. READ: Tek Bir Projeyi Getir (GET /api/projects/:id)
//    Herkese açık, 'protect' eklenmedi.
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
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
//    Sadece giriş yapmış kullanıcılar güncelleyebilsin diye 'protect' eklendi.
router.put('/:id', protect, async (req, res) => { // <-- 'protect' eklendi
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: 'Güncellenecek proje bulunamadı' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Proje güncelleme hatası:", error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: "Geçersiz proje verisi", errors: error.errors });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz proje ID formatı' });
    } else {
      res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
    }
  }
});

// 5. DELETE: Projeyi Sil (DELETE /api/projects/:id)
//    Sadece giriş yapmış kullanıcılar silsin diye 'protect' eklendi.
router.delete('/:id', protect, async (req, res) => { // <-- 'protect' eklendi
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Silinecek proje bulunamadı' });
    }
    res.status(200).json({ message: 'Proje başarıyla silindi' });
  } catch (error) {
    console.error("Proje silme hatası:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Geçersiz proje ID formatı' });
    }
    res.status(500).json({ message: "Sunucu hatası oluştu", error: error.message });
  }
});

// Geçici olarak basit bir yanıt döndüren rotalar
router.get('/', (req, res) => {
  res.json({ message: 'Projeler listesi burada olacak' });
});

// Router'ı dışa aktar
export default router;