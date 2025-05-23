// server.js

// Ortam değişkenleri artık Render'dan doğrudan process.env üzerinden gelecek.
// dotenv ile ilgili kısımları kaldırıyoruz.
import 'dotenv/config';  

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Dosya sistemi işlemleri için

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// process.env üzerinden değişkenleri doğrudan alıyoruz.
// Render otomatik olarak PORT ortam değişkenini sağlar.
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Render için 0.0.0.0 kullanmak önemlidir

// Veritabanı bağlantısı
connectDB();

const app = express();

// --- Genel Middleware'ler ve CORS Ayarları ---
// Render'da frontend Static Site URL'ini burada FRONTEND_URL olarak ayarlayacağız.
// Yerel geliştirme için FRONTEND_URL'yi .env'de veya doğrudan burada belirtebilirsiniz.
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'; // Varsayılan geliştirme URL'i

const allowedOrigins = [
    frontendUrl, // Render'daki frontend URL'i veya yerel geliştirme URL'i
    'http://localhost:8080', // Capacitor/Ionic muhtemel adresleri
    'http://192.168.56.1:8080',
    'http://localhost:8081',
    'http://127.0.0.1',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost', // Güvenli olmayan localhost
    'https://localhost', // Güvenli localhost
    'https://capacitor.localhost',
    'https://ionic.localhost',
    'https://_capacitor_assets_',
    // Eğer backend kendi API'sine kendi Render URL'i üzerinden istek atıyorsa ekleyin:
    // `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
];

const uniqueAllowedOrigins = [...new Set(allowedOrigins)].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Origin yoksa (aynı kökenden gelen istekler veya curl gibi) izin ver
        // Render'ın kendi içinden gelen sağlık kontrolü istekleri için de gerekli olabilir
        if (!origin || uniqueAllowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Engellendi: Origin '${origin}' izin verilenler listesinde değil.`);
            console.log('İzin Verilen Originler:', uniqueAllowedOrigins);
            callback(new Error(`CORS politikası: ${origin} adresinden gelen isteklere izin verilmiyor.`));
        }
    },
    credentials: true, // Cookie göndermeye izin ver
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
console.log(`>>> CORS ayarları aktif. İzin verilen originler: ${uniqueAllowedOrigins.join(', ')}`);

// Body parser middleware'leri
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Cookie parser middleware
app.use(cookieParser());


// --- DOSYA YÜKLEME (MULTER) AYARLARI VE YÜKLEME KLASÖRÜ ---
const UPLOADS_DIR_NAME = 'uploads';
// public klasörünün backend klasörünün içinde olduğunu varsayıyoruz
const UPLOADS_DIR = path.join(__dirname, 'public', UPLOADS_DIR_NAME);

// Yükleme klasörünün varlığını kontrol et ve oluştur
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') oluşturuldu.`);
} else {
    console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') zaten mevcut: ${UPLOADS_DIR}`);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, UPLOADS_DIR); },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) { cb(null, true); }
    else { cb(new Error('Sadece resim dosyaları yüklenebilir! (jpg, png, gif, webp)'), false); }
};

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 }, fileFilter: fileFilter });

// --- BACKEND'İN KENDİ PUBLIC KLASÖRÜNÜ STATİK OLARAK SUNMA ---
// Bu, backend'in içindeki 'public' klasörünü sunar, genellikle yüklenen resimler,
// favicon gibi backend'e ait statik varlıklar için kullanılır.
// Frontend'in statik dosyaları buradan SUNULMAYACAK.
app.use(express.static(path.join(__dirname, 'public')));
console.log(`>>> Statik dosyalar '${path.join(__dirname, 'public')}' klasöründen sunuluyor (yüklenen resimler vb.).`);

// --- API ROTALARI ---

// Dosya yükleme rotası (API'nin bir parçası)
app.post('/api/upload',
    upload.single('image'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Lütfen yüklenecek bir dosya seçin.' });
        }
        // Yüklenen dosyanın public URL'i
        const imageUrl = `/${UPLOADS_DIR_NAME}/${req.file.filename}`;
        console.log(`>>> Dosya başarıyla yüklendi (/api/upload): ${req.file.filename}, Public URL: ${imageUrl}`);
        return res.status(200).json({ message: 'Dosya başarıyla yüklendi.', imageUrl: imageUrl });
    },
    // Multer hata yakalama middleware'i
    (error, req, res, next) => {
        console.error("### Dosya yükleme sırasında hata (/api/upload):", error.message);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer hatası: ${error.message}` });
        } else if (error) {
            return res.status(400).json({ message: error.message || 'Dosya yüklenirken bilinmeyen bir hata oluştu.' });
        }
        next(error); // Diğer hata işleyicilere pasla
    }
);


// Diğer API Rotaları için middleware tanımlamaları
app.use('/api/courses', courseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogposts', blogPostRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);

// Root rotası (sadece bir API durum mesajı döndürebilir)
app.get('/', (req, res) => {
    res.send(`Robosphere Backend API Çalışıyor! Ortam: ${process.env.NODE_ENV || 'development'}`);
});


// #######################################################################
// ### BURADAKİ KISIM KALDIRILDI: FRONTEND DOSYALARINI SUNMA ###
// ### Bu sorumluluk artık Render'daki ayrı bir Static Site servisine ait. ###
// #######################################################################
/*
// Önceki kodunuzda bulunan frontend sunma mantığı:
const frontendPath = path.join(__dirname, 'public', 'frontend_dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => { ... });
*/
// Bu kod bloğu yukarıdaki hatalara neden olduğu için kaldırılmıştır.
// Backend servisi sadece API ve kendi statik dosyalarını sunar.
// Frontend servisi, frontend build çıktılarını (index.html, JS, CSS vb.) sunar.


// --- Hata Yönetimi Middleware'leri ---
// Bu middleware'ler, tüm API rotalarından ve statik dosya sunumundan SONRA gelmelidir.
app.use(notFound); // Tanımlı hiçbir rotaya uymayan istekleri yakalar
app.use(errorHandler); // Hataları işler

// --- Sunucuyu Başlatma ---
app.listen(PORT, HOST, () => {
    console.log(`\nSunucu ${process.env.NODE_ENV || 'development'} modunda http://${HOST}:${PORT} adresinde başlatıldı.`);
    console.log(`>>> Yüklenen resimlere erişim (örnek): http://${HOST}:${PORT}/${UPLOADS_DIR_NAME}/<dosya_adi>`);
    console.log(">>> Frontend ayrı bir servis tarafından sunulmalıdır.");
});