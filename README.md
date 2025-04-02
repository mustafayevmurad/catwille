# Catwille

Браузерная игра для Telegram WebApp о восстановлении кошачьего поселения.

## Установка

1. Клонируйте репозиторий:
```
git clone https://github.com/yourusername/catwille.git
cd catwille
```

2. Установите зависимости:
```
npm install
```

3. Создайте файл .env в корневой директории и добавьте следующие переменные:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=your_mongodb_connection_string
```

4. Запустите сервер:
```
npm start
```

## Развертывание

Проект настроен для развертывания на render.com.

1. Подключите ваш GitHub-репозиторий к Render
2. Создайте новый Web Service, указав репозиторий
3. Настройте переменные окружения:
   - TELEGRAM_BOT_TOKEN
   - MONGODB_USERNAME
   - MONGODB_PASSWORD

## Настройка Telegram WebApp

1. Используйте BotFather в Telegram для активации WebApp для вашего бота
2. Укажите URL вашего приложения на render.com
3. Используйте кнопки типа web_app в меню бота для открытия игры 