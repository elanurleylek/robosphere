// models/Course.js
import mongoose from 'mongoose';

const courseContentItemSchema = new mongoose.Schema({
  week: { type: String, required: false },
  title: { type: String, required: true },
  lessons: [{ type: String, required: true }]
}, { _id: false }); // İç içe şemalar için _id oluşturmayı engelle

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Kurs başlığı zorunludur.'],
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  instructor: {
    type: String,
    required: true
  },
  duration: { // Saat cinsinden
    type: Number,
    min: [0, 'Süre en az 0 olabilir'] // 0 olabilir mi? Ya da 1 mi olmalı?
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true
  },
  category: { // Kategori alanı ekleyelim
    type: String,
    required: false, // veya true, ihtiyaca göre
    trim: true
  },
  price: { // Fiyat alanı
    type: Number,
    required: false, // Ücretsiz olabilir, o yüzden false. Gerekirse min:0 eklenebilir.
    default: null // Varsayılan olarak null olabilir (ücretsiz anlamında)
  },
  level: { // Zorluk seviyesi
    type: String,
    enum: ['Başlangıç', 'Orta Seviye', 'İleri Seviye', 'Tüm Seviyeler', 'Belirtilmemiş'], // Olası değerler
    default: 'Belirtilmemiş'
  },
  enrolledStudents: { // Kayıtlı öğrenci sayısı
    type: Number,
    default: 0
  },
  averageRating: { // Ortalama puan
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: { // Toplam yorum sayısı
    type: Number,
    default: 0
  },
  courseStartDate: { // Başlangıç tarihi
    type: Date,
    required: false
  },
  learningObjectives: { // Öğrenme hedefleri
    type: [String],
    default: []
  },
  curriculum: { // Kurs içeriği/müfredatı
    type: [courseContentItemSchema], // Yukarıda tanımladığımız iç içe şemayı kullandık
    default: []
  }
  // createdBy: { // Eğer kursu kimin eklediğini tutmak isterseniz
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User' // User modelinize referans
  // }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;