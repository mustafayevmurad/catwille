const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'client')));

// Telegram Bot WebApp integration
app.get('/telegram-app', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Маршрут для проверки здоровья сервера (для Render)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Обработка всех других запросов, отправка index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 