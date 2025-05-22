// routes/courseRoutes.js

import express from 'express';
import Course from '../models/Course.js';
import Review from '../models/Review.js';
import User from '../models/User.js'; // User modelini import et
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- KURS CRUD OPERASYONLARI ---

// POST /api/courses - Yeni Kurs Ekle (Koruma altında)
router.post('/', protect, async (req, res) => {
  try {
    const newCourseData = { ...req.body };
    // Eğer Course modelinizde kursu oluşturan kullanıcıyı tutan bir 'user' alanı varsa:
    // newCourseData.user = req.user._id; // Bunu Course modelinize eklediyseniz aktif edin
    
    const newCourse = new Course(newCourseData);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error("Kurs ekleme hatası:", error.message, error.stack);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Geçersiz veri gönderildi.", errors: error.errors });
    }
    res.status(500).json({ message: "Sunucu hatası: Kurs eklenemedi.", error: error.message });
  }
});

// GET /api/courses - Tüm Kursları Listele
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    console.error("Kurs listeleme hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası: Kurslar listelenemedi.", error: error.message });
  }
});

// GET /api/courses/:id - Tek Bir Kursu Getir
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Belirtilen ID ile kurs bulunamadı.' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("Tek kurs getirme hatası:", error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Geçersiz Kurs ID formatı.' });
    }
    res.status(500).json({ message: "Sunucu hatası: Kurs getirilemedi.", error: error.message });
  }
});

// PUT /api/courses/:id - Kursu Güncelle (Koruma altında)
router.put('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Güncellenecek kurs bulunamadı.' });
    }
    // Opsiyonel Yetkilendirme:
    // if (course.user && course.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Bu kursu güncelleme yetkiniz yok.' });
    // }
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) { /* ... (Hata yönetimi aynı) ... */ }
});

// DELETE /api/courses/:id - Kursu Sil (Koruma altında)
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Silinecek kurs bulunamadı.' });
    }
    // Opsiyonel Yetkilendirme:
    // if (course.user && course.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'Bu kursu silme yetkiniz yok.' });
    // }
    await Course.deleteOne({ _id: req.params.id });
    // Opsiyonel: İlgili yorumları da sil
    // await Review.deleteMany({ course: req.params.id });
    res.status(200).json({ message: 'Kurs başarıyla silindi.' });
  } catch (error) { /* ... (Hata yönetimi aynı) ... */ }
});


// --- YORUMLAR İÇİN ROTALAR ---

// GET /api/courses/:courseId/reviews - Bir kursa ait tüm yorumları getir
router.get('/:courseId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 }); 
    res.status(200).json(reviews);
  } catch (error) { /* ... (Hata yönetimi aynı) ... */ }
});

// POST /api/courses/:courseId/reviews - Bir kursa yeni yorum ekle (Koruma altında)
router.post('/:courseId/reviews', protect, async (req, res) => {
  // ... (Validasyonlar ve önceki mantık aynı) ...
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) { /* ... */ }
    // const existingReview = await Review.findOne({ course: req.params.courseId, user: req.user._id });
    // if (existingReview) { /* ... */ }

    const review = new Review({
      course: req.params.courseId,
      user: req.user._id,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });
    const createdReview = await review.save();

    const reviewsForCourse = await Review.find({ course: req.params.courseId });
    course.totalReviews = reviewsForCourse.length;
    course.averageRating = parseFloat(
        (reviewsForCourse.reduce((acc, item) => item.rating + acc, 0) / reviewsForCourse.length).toFixed(1)
    );
    await course.save();
    
    const populatedReview = await Review.findById(createdReview._id).populate('user', 'name avatar');
    res.status(201).json(populatedReview);
  } catch (error) { /* ... (Hata yönetimi aynı) ... */ }
});


// --- KURSA KAYIT OLMA (ENROLL) ROTASI ---
// POST /api/courses/:courseId/enroll - Kullanıcıyı kursa kaydet (Koruma altında)
router.post('/:courseId/enroll', protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Kurs bulunamadı.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    // User modelinizde 'courses' alanı (ObjectId dizisi) olmalı
    if (user.courses && user.courses.includes(courseId)) {
      return res.status(400).json({ message: 'Bu kursa zaten kayıtlısınız.' });
    }

    if (!user.courses) {
      user.courses = [];
    }
    user.courses.push(courseId);
    await user.save();
    
    // Opsiyonel: Kursun kayıtlı öğrenci sayısını artır
    // course.enrolledStudents = (course.enrolledStudents || 0) + 1;
    // await course.save();

    res.status(200).json({ message: `"${course.title}" kursuna başarıyla kaydoldunuz.` });

  } catch (error) {
    console.error("Kursa kayıt olma hatası:", error.message, error.stack);
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Geçersiz Kurs veya Kullanıcı ID formatı.' });
    }
    res.status(500).json({ message: 'Kursa kayıt sırasında bir sunucu hatası oluştu.', error: error.message });
  }
});


export default router;