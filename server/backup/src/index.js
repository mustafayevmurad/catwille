const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Импорт моделей (должен быть перед импортом маршрутов)
require('./models/index');

// Импорт маршрутов
const userRoutes = require('./routes/user');
const catRoutes = require('./routes/cat');
const buildingRoutes = require('./routes/building');
const gameRoutes = require('./routes/game');
const telegramRoutes = require('./routes/telegram');

// Маршруты
app.use('/api/user', userRoutes);
app.use('/api/cat', catRoutes);
app.use('/api/building', buildingRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/telegram', telegramRoutes);

// Базовый маршрут для проверки работы API
app.get('/', (req, res) => {
  res.json({ message: 'API Кошачьей Империи работает!' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});