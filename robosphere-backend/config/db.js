// config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // Bu seçenekler artık genellikle varsayılan
      // useUnifiedTopology: true,
      // useCreateIndex: true,    // Bu seçenekler artık genellikle varsayılan
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Hata durumunda uygulamayı kapat
  }
};

export default connectDB;