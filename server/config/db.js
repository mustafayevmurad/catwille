const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Формирование строки подключения, если не указана напрямую
    let mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI && process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.mongodb.net/catwille?retryWrites=true&w=majority`;
    }
    
    if (!mongoURI) {
      console.warn('MONGODB_URI не указан, использую локальную базу данных');
      mongoURI = 'mongodb://localhost:27017/catwille';
    }

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