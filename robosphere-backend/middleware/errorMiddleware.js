// middleware/errorMiddleware.js

// Yakalanmayan rotalar için 404 Not Found hatası
const notFound = (req, res, next) => {
    const error = new Error(`Bulunamadı - ${req.originalUrl}`);
    res.status(404);
    next(error); // Hatayı sonraki middleware'e (errorHandler'a) ilet
  };
  
  // Genel Hata İşleyici Middleware
  // Dört argüman alır (err, req, res, next) - Express bunu özel bir middleware olarak tanır
  const errorHandler = (err, req, res, next) => {
    // Bazen hata fırlatılır ama status code hala 200 olabilir, bunu düzeltelim
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // Mongoose CastError (Geçersiz ObjectId) hatasını yakalama (isteğe bağlı ama faydalı)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404; // Kaynak bulunamadı olarak ele al
      message = 'Kaynak bulunamadı (geçersiz ID formatı)';
    }
  
    // Mongoose Validation Error hatasını yakalama (isteğe bağlı)
    // if (err.name === 'ValidationError') {
    //     statusCode = 400; // Bad Request
    //     // Hata mesajlarını birleştirebilir veya ilkini alabilirsiniz
    //     message = Object.values(err.errors).map(val => val.message).join(', ');
    // }
  
    res.status(statusCode).json({
      message: message,
      // Sadece geliştirme ortamında hatanın detayını (stack trace) göster
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  export { notFound, errorHandler };