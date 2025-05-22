// models/Project.js

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Proje başlığı zorunludur.'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Proje açıklaması zorunludur.']
  },
  difficulty: {
    type: String,
    required: [true, 'Zorluk seviyesi zorunludur.'],
    enum: { // Sadece bu değerleri kabul et
      values: ['Kolay', 'Orta', 'Zor'],
      message: '{VALUE} geçerli bir zorluk seviyesi değildir (Kolay, Orta, Zor kullanın).'
    }
  },
  technologies: { // Kullanılan teknolojiler (örneğin: ['Node.js', 'React', 'MongoDB'])
    type: [String], // String dizisi
    required: false, // Zorunlu olmayabilir, projeye bağlı
    default: []      // Varsayılan olarak boş dizi
  },
  imageUrl: { // Proje için bir resim URL'si (isteğe bağlı)
    type: String,
    required: false,
    trim: true
  },
  projectUrl: { // Projenin canlı linki veya repo linki (isteğe bağlı)
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik ekler
});

// Modeli oluştur ve dışa aktar
const Project = mongoose.model('Project', projectSchema);

export default Project;