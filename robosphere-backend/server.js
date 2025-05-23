// server.js

// dotenv importunu ve kullanımını tamamen kaldırıyoruz.
// Artık tüm ortam değişkenleri Render'dan doğrudan process.env üzerinden gelecek.
// import dotenv from 'dotenv';
// const dotenvResult = dotenv.config();

// if (dotenvResult.error) {
//     console.error("### .env YÜKLENİRKEN KRİTİK HATA:", dotenvResult.error.message);
// } else {
//     console.log(">>> .env dosyası başarıyla yüklendi.");
// }

// dotenv olmadığı için bu kontrolleri de kaldırıyoruz.
// if (!process.env.JWT_SECRET) {
//     console.error("\n### KRİTİK HATA: JWT_SECRET ortam değişkeni bulunamadı! .env dosyasını kontrol edin. ###\n");
//     process.exit(1);
// }
// if (!process.env.MONGO_URI) {
//     console.error("\n### KRİTİK HATA: MONGO_URI ortam değişkeni bulunamadı! .env dosyasını kontrol edin. ###\n");
//     process.exit(1);
// }
// if (!process.env.GOOGLE_API_KEY) {
//     console.warn("### UYARI: GOOGLE_API_KEY ortam değişkeni bulunamadı. AI Asistanı çalışmayabilir.");
// }

import express from 'express';
import cors from 'cors';
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

// process.env üzerinden değişkenleri doğrudan alıyoruz.
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

connectDB();

const app = express();

// --- Genel Middleware'ler ve CORS Ayarları ---
const frontendDevUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
    'http://localhost:8080',
    'http://192.168.56.1:8080',
    frontendDevUrl,
    'http://localhost:8081',
    'http://127.0.0.1',
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'https://localhost',
    'https://capacitor.localhost',
    'https://ionic.localhost',
    'https://_capacitor_assets_',
    // Buraya Render canlı URL'sini doğrudan ekliyoruz, Render ortam değişkeninden gelmesi de sorun yaratırsa diye
    'https://robosphere.onrender.com'
];

// Bu if bloğu artık gereksiz olabilir çünkü yukarıda doğrudan ekledik.
// Ancak eğer FRONTEND_PRODUCTION_URL değişkenini Render'a eklediyseniz, bunu koruyabilirsiniz.
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_PRODUCTION_URL) {
    allowedOrigins.push(process.env.FRONTEND_PRODUCTION_URL);
}

const uniqueAllowedOrigins = [...new Set(allowedOrigins)].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || uniqueAllowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS Engellendi: Origin '${origin}' izin verilenler listesinde değil.`);
            console.log('İzin Verilen Originler:', uniqueAllowedOrigins);
            callback(new Error(`CORS politikası: ${origin} adresinden gelen isteklere izin verilmiyor.`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

app.use(cors(corsOptions));
console.log(`>>> CORS ayarları aktif. İzin verilen originler: ${uniqueAllowedOrigins.join(', ')}`);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


// --- DOSYA YÜKLEME (MULTER) AYARLARI VE YÜKLEME KLASÖRÜ ---
const UPLOADS_DIR_NAME = 'uploads';
const UPLOADS_DIR = path.join(__dirname, 'public', UPLOADS_DIR_NAME);
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') oluşturuldu.`);
} else {
    console.log(`>>> Yükleme klasörü ('${UPLOADS_DIR}') zaten mevcut.`);
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

// --- PUBLIC KLASÖRÜNÜ STATİK OLARAK SUNMA ---
// Bu, backend'in kendi içindeki 'public' klasörünü sunar (örneğin yüklenen resimler için).
app.use(express.static(path.join(__dirname, 'public')));
console.log(`>>> Statik dosyalar '${path.join(__dirname, 'public')}' klasöründen sunuluyor.`);

// --- ROTALAR ---

app.post('/api/upload',
    upload.single('image'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'Lütfen yüklenecek bir dosya seçin.' });
        }
        const imageUrl = `/${UPLOADS_DIR_NAME}/${req.file.filename}`;
        console.log(`>>> Dosya başarıyla yüklendi (/api/upload): ${req.file.filename}, Public URL: ${imageUrl}`);
        return res.status(200).json({ message: 'Dosya başarıyla yüklendi.', imageUrl: imageUrl });
    },
    (error, req, res, next) => {
        console.error("### Dosya yükleme sırasında hata (/api/upload):", error.message);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer hatası: ${error.message}` });
        } else if (error) {
            return res.status(400).json({ message: error.message || 'Dosya yüklenirken bilinmeyen bir hata oluştu.' });
        }
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

// Eski root rotayı burada kaldırıyoruz veya aşağı taşıyoruz, çünkü frontend ele alacak
// app.get('/', (req, res) => {
//   res.send(`Robosphere API Çalışıyor! Ortam: ${process.env.NODE_ENV || 'development'}`);
// });

// #######################################################################
// ### YENİ EKLENEN KISIM: FRONTEND DOSYALARINI SUNMA ###
// #######################################################################

// Frontend build klasörünün yolu.
// Önceki loglarınızda hala /opt/render/project/src/src/dist olarak gösterdiği için,
// yolu kesinlikle bu şekilde ayarlıyoruz.
// server.js içinde, frontendPath tanımı
const frontendPath = path.join(__dirname, 'public', 'frontend_dist');
// __dirname: /opt/render/project/src/robosphere-backend
// public: /opt/render/project/src/robosphere-backend/public
// frontend_dist: /opt/render/project/src/robosphere-backend/public/frontend_dist

// Frontend build klasörünün varlığını ve doğru yolu konsola yazdırın
console.log(">>> Frontend statik dosyaları buradan sunuluyor:", frontendPath);

// Frontend'in build edilmiş statik dosyalarını sun
app.use(express.static(frontendPath));

// Client-side routing için fallback: Herhangi bir API rotasına uymayan veya statik dosya olmayan
// tüm diğer GET istekleri için frontend'in index.html dosyasını gönder.
// Bu, SPA (Single Page Application) navigasyonu için KRİTİKTİR.
app.get('*', (req, res) => {
    // Eğer index.html dosyasının varlığından emin olmak istiyorsanız:
    const indexPath = path.resolve(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Frontend build edilmediyse veya yol yanlışsa buraya düşebilir
        console.error("### HATA: Frontend index.html dosyası bulunamadı:", indexPath);
        res.status(500).send('Frontend uygulaması bulunamadı. Lütfen dağıtımın doğru yapıldığından emin olun.');
    }
});
// #######################################################################


// --- Hata Yönetimi Middleware'leri ---
// Bu middleware'ler, tüm API rotalarından ve frontend sunumundan SONRA gelmelidir.
app.use(notFound);
app.use(errorHandler);

// --- Sunucuyu Başlatma ---
app.listen(PORT, HOST, () => {
    console.log(`\nSunucu ${process.env.NODE_ENV || 'development'} modunda http://${HOST}:${PORT} adresinde başlatıldı.`);
    console.log(`>>> Yüklenen resimlere erişim (örnek): http://${HOST}:${PORT}/${UPLOADS_DIR_NAME}/<dosya_adi>`);
});