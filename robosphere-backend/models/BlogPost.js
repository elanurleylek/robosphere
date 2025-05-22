// models/BlogPost.js
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog yazısı başlığı zorunludur.'],
    trim: true,
    minlength: [3, 'Başlık en az 3 karakter olmalıdır.'],
    maxlength: [150, 'Başlık en fazla 150 karakter olabilir.']
  },
  content: {
    type: String,
    required: [true, 'Blog yazısı içeriği zorunludur.']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Kullanıcı ID'sini saklayacak
    ref: 'User', // User modeline referans (populate için)
    required: [true, 'Yazar bilgisi zorunludur.']
  },
  category: {
    type: String,
    trim: true,
    default: 'Genel' // Varsayılan kategori
  },
  tags: {
    type: [String], // String dizisi
    default: []     // Varsayılan boş dizi
  },
  imageUrl: {
    type: String,   // Resmin sunucudaki yolu (/uploads/images/...)
    trim: true,
    default: null   // Resim zorunlu değilse veya varsayılan bir resim yolu
                    // Örneğin: default: '/uploads/images/default-blog.png'
  },
  // createdAt ve updatedAt alanları timestamps: true ile otomatik gelecek
}, {
  timestamps: true // createdAt ve updatedAt alanlarını otomatik olarak yönetir
});

// Modeli oluştur ve dışa aktar
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;