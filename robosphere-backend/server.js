// server.js

import dotenv from 'dotenv';
const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  console.error("### .env YÜKLENİRKEN KRİTİK HATA:", dotenvResult.error.message);
} else {
  console.log(">>> .env dosyası başarıyla yüklendi.");
}

if (!process.env.JWT_SECRET) {
  console.error("\n### KRİTİK HATA: JWT_SECRET ortam değişkeni bulunamadı! .env dosyasını kontrol edin. ###\n");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
    console.error("\n### KRİTİK HATA: MONGO_URI ortam değişkeni bulunamadı! .env dosyasını kontrol edin. ###\n");
    process.exit(1);
}
if (!process.env.GOOGLE_API_KEY) {
  console.warn("### UYARI: GOOGLE_API_KEY ortam değişkeni bulunamadı. AI Asistanı çalışmayabilir.");
}

import express from 'express';
import cors from 'cors'; // CORS paketi
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Rota dosyalarını import et
import courseRoutes from './routes/courseRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- DOSYA YÜKLEME İÇİN GEREKLİ IMPORTLAR ---
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // HOST'u 0.0.0.0 olarak ayarlamak da ağ erişimini kolaylaştırabilir

connectDB(); // MongoDB bağlantısı

const app = express();

// --- Genel Middleware'ler ve CORS Ayarları ---

// İzin verilen originler listesi - Web ve Mobil için adresleri içerir
const frontendDevUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // .env'den gelen veya varsayılan web frontend URL'niz

const allowedOrigins = [
  'http://localhost:8080',       // Sizin bir önceki hata mesajınızda görünen bir port
  'http://192.168.56.1:8080',   // Hata mesajında görünen IP tabanlı origin
  frontendDevUrl,                 // .env'den gelen veya varsayılan web frontend URL'niz

  // --- BURAYA MOBİL UYGULAMA ORIGIN'LERİNİ EKLEDİK --- //
  'http://localhost:8081',      // Capacitor/Cordova varsayılan WebView Origin'i (Debug/Emülatör)
  'http://127.0.0.1',           // Başka bir olası WebView Origin'i (Debug/Emülatör)
  'capacitor://localhost',      // Capacitor'ın kullandığı özel şema (Debug/Emülatör)
  'ionic://localhost',          // Ionic kullanıyorsanız özel şema (Debug/Emülatör)
  'http://localhost',           // Bazı WebView'ler için sadece localhost da origin olabilir

  // *** YENİ EKLENEN MOBİL ORIGINLER (ÖNCEKİ HATA LOGLARINA GÖRE) ***
  'https://localhost',          // <-- KONSOLDA GÖRÜLEN EKSİK ORIGIN (HTTPS versiyonu)
  'https://capacitor.localhost',// <-- YAYGIN CAPACITOR 4+ ORIGIN (HTTPS)
  'https://ionic.localhost',    // <-- IONIC KULLANIYORSANIZ İLGİLİ ORIGIN (HTTPS)
  'https://_capacitor_assets_', // <-- iOS debug/development assets origin (genellikle iOS için)
  // *** YENİ EKLENEN MOBİL ORIGINLER BİTTİ ***

  // Eğer mobil uygulamada API isteklerini bilgisayarınızın yerel IP'sine çevirdiyseniz (Geliştirme/Test için),
  // o IP adresini veya IP ve port kombinasyonunu buraya eklemeniz GEREKİR.
  // ipconfig çıktınızdaki IPv4 adresini kontrol edin.
  // Örneğin: 'http://192.168.1.105',
  // Örneğin: 'http://192.168.1.105:8081', // Eğer WebView'in portu farklıysa

  // Gerçek cihazda test ediyorsanız, bazen cihazın yerel IP'si de origin olabilir (daha az yaygın)
  // Örneğin: 'http://192.168.1.106', // Gerçek cihazın kendi local IP'si
];

// Eğer canlı (production) ortamı için ayrı bir frontend URL'niz varsa, onu da ekleyebilirsiniz:
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_PRODUCTION_URL) {
  allowedOrigins.push(process.env.FRONTEND_PRODUCTION_URL);
  // Canlı Render adresi de backend'in kendi isteği için gerekebilir (self-requests)
  allowedOrigins.push('https://robosphere.onrender.com'); // Render'daki canlı backend adresiniz
}

// Allowed origins listesini benzersiz yap ve geçersiz girdileri temizle
const uniqueAllowedOrigins = [...new Set(allowedOrigins)].filter(Boolean);


const corsOptions = {
  origin: function (origin, callback) {
    // İsteği yapan origin izin verilenler listesinde mi kontrol et.
    // Mobil uygulamalar, Postman veya file:// erişimi gibi durumlarda origin undefined olabilir.
    // Güvenlik durumunuza göre undefined origin'e izin verip vermemeye karar verebilirsiniz.
    // Geliştirme için genellikle !origin kontrolü eklenir.
    if (!origin || uniqueAllowedOrigins.includes(origin)) {
      callback(null, true); // İzin ver
    } else {
      console.error(`CORS Engellendi: Origin '${origin}' izin verilenler listesinde değil.`);
      console.log('İzin Verilen Originler:', uniqueAllowedOrigins);
      callback(new Error(`CORS politikası: ${origin} adresinden gelen isteklere izin verilmiyor.`)); // İzin verme
    }
  },
  credentials: true, // Cookie veya Authorization header'ı gibi bilgilerin gönderilmesine izin ver
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // İzin verilen HTTP metodları (OPTIONS preflight için önemli)
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], // İzin verilen header'lar
};

app.use(cors(corsOptions));
console.log(`>>> CORS ayarları aktif. İzin verilen originler: ${uniqueAllowedOrigins.join(', ')}`);

// Middleware'ler: İstek gövdelerini parse etmek ve cookie'leri işlemek için
app.use(express.json({ limit: '10mb' })); // JSON payload limiti (dosya yükleme için gerekebilir)
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL-encoded payload limiti
app.use(cookieParser());


// --- DOSYA YÜKLEME (MULTER) AYARLARI VE YÜKLEME KLASÖRÜ ---
const UPLOADS_DIR_NAME = 'uploads'; // Yükleme klasörünün adı
// __dirname, server.js dosyasının bulunduğu dizindir. 'public' klasörünün oraya göre yolu
const UPLOADS_DIR = path.join(__dirname, 'public', UPLOADS_DIR_NAME);
// Yükleme klasörünün varlığını kontrol et ve yoksa oluştur
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true }); // recursive: true ile ara klasörleri de oluşturur
  console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') oluşturuldu.`);
} else {
  console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') zaten mevcut.`);
}

// Multer storage ayarları: Dosyaların nereye ve hangi isimle kaydedileceği
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR); // Yükleme klasörünü belirle
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Benzersiz bir isim oluştur
    // Dosyanın orijinal adını ve uzantısını koru
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Dosya filtresi: Sadece resim dosyalarına izin ver
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Kabul et
  } else {
    cb(new Error('Sadece resim dosyaları yüklenebilir! (jpg, png, gif, webp)'), false); // Reddet
  }
};

// Multer middleware'i oluşturma
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // Dosya boyutu limiti: 10 MB
  fileFilter: fileFilter // Dosya filtresini uygula
});


// --- PUBLIC KLASÖRÜNÜ STATİK OLARAK SUNMA ---
// Bu, tarayıcıların veya mobil uygulamanın /uploads/dosyaadi.jpg gibi URL'lerden dosyalara doğrudan erişmesini sağlar.
app.use(express.static(path.join(__dirname, 'public')));
console.log(`>>> Statik dosyalar '${path.join(__dirname, 'public')}' klasöründen sunuluyor.`);
// Örnek erişim URL'si: http://localhost:5000/uploads/image-1627382910372-382910.jpg (HOST ve PORT'a bağlı olarak)


// --- ROTALAR ---

// Dosya Yükleme Rotası: '/api/upload' (POST isteği ile dosya yükleme)
app.post('/api/upload',
  // protect, // Eğer JWT koruması gerekiyorsa, authMiddleware'den protect'i import edip buraya ekleyin
  upload.single('image'), // 'image' frontend FormData.append('image', file) ile eşleşmeli
  (req, res) => {
    if (!req.file) {
      // Dosya yüklenemediyse hata dön
      return res.status(400).json({ message: 'Lütfen yüklenecek bir dosya seçin.' });
    }
    // Dosya başarıyla 'public/uploads' klasörüne kaydedildi.
    // Frontend'e bu dosyaya erişebileceği public URL'yi döndür.
    // `express.static('public')` sayesinde `UPLOADS_DIR_NAME` alt klasörüyle erişilebilir.
    const imageUrl = `/${UPLOADS_DIR_NAME}/${req.file.filename}`;
    console.log(`>>> Dosya başarıyla yüklendi (/api/upload): ${req.file.filename}, Public URL: ${imageUrl}`);
    return res.status(200).json({
      message: 'Dosya başarıyla yüklendi.',
      imageUrl: imageUrl // Frontend bu URL'yi alıp veritabanına kaydederken kullanacak
    });
  },
  // Multer veya fileFilter Hata Yönetimi Middleware'i
  (error, req, res, next) => {
    console.error("### Dosya yükleme sırasında hata (/api/upload):", error.message);
    if (error instanceof multer.MulterError) {
        // Multer'dan gelen belirli hatalar (örn. boyut limiti)
        return res.status(400).json({ message: `Multer hatası: ${error.message}` });
    } else if (error) {
        // fileFilter veya başka bir hata
        return res.status(400).json({ message: error.message || 'Dosya yüklenirken bilinmeyen bir hata oluştu.' });
    }
    // Diğer hata yönetici middleware'lerine devret
    next(error);
  }
);

// Diğer API Rotaları için middleware tanımlamaları
app.use('/api/courses', courseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Ana (Root) rota - Sunucunun çalışıp çalışmadığını kontrol etmek için basit bir yanıt
app.get('/', (req, res) => {
  res.send(`Robosphere API Çalışıyor! Ortam: ${process.env.NODE_ENV || 'development'}`);
});

// --- Hata Yönetimi Middleware'leri ---
app.use(notFound); // Tanımlanmayan rotalar için 404 yanıtı dönmek üzere middleware
app.use(errorHandler); // Genel uygulama hatalarını yakalamak ve uygun yanıt dönmek için middleware

// --- Sunucuyu Başlatma ---
// Sunucuyu belirtilen PORT ve HOST üzerinde dinlemeye başla
app.listen(PORT, HOST, () => { // HOST eklendi - ağdan erişim için '0.0.0.0' iyi olabilir
  console.log(`\nSunucu ${process.env.NODE_ENV || 'development'} modunda http://${HOST}:${PORT} adresinde başlatıldı.`);
  console.log(`>>> Yüklenen resimlere erişim (örnek): http://${HOST}:${PORT}/${UPLOADS_DIR_NAME}/<dosya_adi>`);
});