// controllers/aiController.js
import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// --- Google AI İstemcisini ve Modelini Başlatma (Lazy Initialization ile) ---
let genAIInstance = null;
let modelInstance = null;

function getGoogleAIInstances() {
    // İstemci ve model sadece ilk ihtiyaç duyulduğunda oluşturulur.
    if (!genAIInstance || !modelInstance) {
        const apiKeyFromEnv = process.env.GOOGLE_API_KEY; // .env'den Google API anahtarını oku
        console.log("[aiController.js] getGoogleAIInstances - GOOGLE_API_KEY:", apiKeyFromEnv ? "VAR (Gizli)" : "YOK veya BOŞ");

        if (!apiKeyFromEnv) {
            console.error("KRİTİK HATA aiController.js (getGoogleAIInstances): GOOGLE_API_KEY ortam değişkeni bulunamadı!");
            return { genAI: null, model: null }; // Hata durumunda null dön
        }

        try {
            genAIInstance = new GoogleGenerativeAI(apiKeyFromEnv);
            // KULLANILACAK MODEL ADI (En son deneme: gemini-1.5-flash-latest)
            modelInstance = genAIInstance.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            console.log("[aiController.js] Google Generative AI client ve model (gemini-1.5-flash-latest) başarıyla oluşturuldu.");
        } catch (error) {
            console.error("[aiController.js] Google Generative AI başlatılırken hata:", error);
            genAIInstance = null; // Hata durumunda sıfırla
            modelInstance = null; // Hata durumunda sıfırla
            return { genAI: null, model: null };
        }
    }
    return { genAI: genAIInstance, model: modelInstance };
}

// Güvenlik Ayarları
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];
// --- Başlatma Sonu ---


// @desc    Google Gemini AI Asistanına soru sor
// @route   POST /api/ai/ask
// @access  Public
const askGoogleAI = asyncHandler(async (req, res) => {
    const { model } = getGoogleAIInstances(); // Sadece model yeterli

    if (!model) { // Model başlatılamadıysa
        console.error("[aiController.js] askGoogleAI: AI Modeli başlatılamadı (API Anahtarı eksik/geçersiz veya başlatma hatası).");
        res.status(500);
        throw new Error('AI Servisi başlatılamadı. Lütfen yönetici ile iletişime geçin.');
    }

    const { question, history } = req.body;

    if (!question) {
        res.status(400);
        throw new Error('Lütfen bir soru sorun.');
    }

    try {
        const systemInstruction = `Sen Robotik Okulu platformunda öğrencilere yardımcı olan bir AI asistansın. Senin görevin sadece robotik, programlama (Arduino, Raspberry Pi, Python, C++ vb.), elektronik ve bu kurs platformuyla ilgili soruları yanıtlamaktır. Konu dışı veya uygunsuz sorular sorulursa, kibarca sadece belirtilen konularda yardımcı olabileceğini söyle. Cevapların eğitici, anlaşılır, doğru ve öğrenci seviyesine uygun olsun. Bilmediğin veya emin olmadığın konularda bunu açıkça belirt.`;

        // Konuşma geçmişini Google AI formatına çevir.
        const formattedHistory = (history || [])
            .filter(msg => msg.text && (msg.sender === 'user' || msg.sender === 'model'))
            .map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

        // Tüm bağlamı (sistem talimatı, geçmiş, yeni soru) oluştur.
        const conversationContext = [];

        // 1. Sistem Talimatı (Kullanıcı rolüyle başlayıp, modelin "anladım" demesiyle devam eder)
        conversationContext.push({ role: 'user', parts: [{ text: `SİSTEM TALİMATI: ${systemInstruction}` }] });
        conversationContext.push({ role: 'model', parts: [{ text: 'Anladım, belirtilen konularda yardımcı olacağım ve bu talimatlara uyacağım.' }] });

        // 2. Mevcut Konuşma Geçmişi
        formattedHistory.forEach(msg => {
            conversationContext.push(msg);
        });

        // 3. Kullanıcının Yeni Sorusu
        conversationContext.push({ role: 'user', parts: [{ text: question }] });

        // console.log("Gönderilen Konuşma Bağlamı (contents):", JSON.stringify(conversationContext, null, 2)); // DEBUG için

        // generateContent kullanarak tüm bağlamı gönder
        const result = await model.generateContent({
            contents: conversationContext,
            generationConfig: {
                temperature: 0.7,
            },
            safetySettings,
        });

        const response = result.response;
        const answer = response.text();

        if (answer) {
            res.json({ answer });
        } else {
            const feedback = response.promptFeedback;
            const finishReason = response.candidates?.[0]?.finishReason;
            console.warn(
                "Google AI'dan boş yanıt alındı. Sebep:",
                feedback || finishReason,
                "Tüm yanıt:",
                JSON.stringify(response, null, 2)
            );
            let userMessage = "Üzgünüm, isteğinize şu anda bir yanıt oluşturamadım.";
            if (finishReason === 'SAFETY') {
                userMessage += " İçerik güvenlik filtrelerine takılmış olabilir.";
            } else if (feedback?.blockReason) {
                userMessage += ` İçerik engellendi, sebep: ${feedback.blockReason}.`;
            } else if (finishReason) {
                userMessage += ` Bitirme sebebi: ${finishReason}.`
            }
            res.status(500).json({ answer: userMessage });
        }

    } catch (error) {
        console.error("Google AI API Hatası Detayları:", error.message);
        if (error.stack) console.error("Stack Trace:", error.stack);
        if (error.cause) console.error("Cause:", JSON.stringify(error.cause, null, 2));

        res.status(500);
        let errorMessage = "AI asistanıyla iletişimde bir sorun oluştu.";
        if (error.message) {
            if (error.message.includes('400') || error.message.includes('API key not valid') || error.message.includes('PERMISSION_DENIED') || error.message.includes("not found for API version") || error.message.includes("should be with role 'user'")) {
                errorMessage = `Google AI Yapılandırma veya İstek Hatası: ${error.message}. Lütfen API anahtarını, model adını ve gönderilen veriyi kontrol edin.`;
            } else if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
                errorMessage = "AI servisi şu anda çok yoğun (kota aşımı), lütfen biraz sonra tekrar deneyin.";
            } else if (error.message.includes('SAFETY') || error.message.includes('blocked by safety')) {
                errorMessage = "İsteğiniz güvenlik filtreleri nedeniyle işlenemedi.";
            } else {
                errorMessage = `Google AI Hatası: ${error.message}`;
            }
        }
        throw new Error(errorMessage);
    }
});

export const askAI = async (req, res) => {
  // Burada AI ile ilgili işlemler yapılır
  res.json({ answer: "AI cevabı buraya gelecek" });
};

export {
    askGoogleAI
};