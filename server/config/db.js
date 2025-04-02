const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Формирование строки подключения, если не указана напрямую
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI && process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      // Updated connection string with a fallback to potential custom cluster name
      const cluster = process.env.MONGODB_CLUSTER || 'cluster0.kfqcyxl';
      mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${cluster}.mongodb.net/catwille?retryWrites=true&w=majority`;
      console.log('Using constructed MongoDB URI with auth credentials');
    }
    
    if (!mongoURI) {
      console.warn('MONGODB_URI не указан, использую локальную базу данных');
      mongoURI = 'mongodb://localhost:27017/catwille';
    }

    console.log('Connecting to MongoDB with URI:', mongoURI.replace(/:[^:]*@/, ':****@')); // Log URI with hidden password

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB подключена: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    
    // В режиме разработки продолжаем работу без БД
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Продолжаю в режиме без БД (только для разработки)');
      return null;
    }
    
    // В production режиме завершаем процесс при ошибке
    process.exit(1);
  }
};

module.exports = connectDB;