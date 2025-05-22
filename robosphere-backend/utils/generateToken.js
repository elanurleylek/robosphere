// utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // JWT_SECRET'ın server.js başlangıcında kontrol edildiğini varsayıyoruz.
  // Eğer process.env.JWT_SECRET tanımsızsa burada hata alırsınız, bu yüzden server.js kontrolü önemli.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d', // .env'den al veya 30 gün varsay
  });
};

export default generateToken;