#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Информация о репозитории
echo -e "${BLUE}Введите имя репозитория (например, catwille):${NC}"
read repo_name

echo -e "${BLUE}Введите ваше имя пользователя GitHub:${NC}"
read github_username

# Инициализация Git репозитория
echo -e "${GREEN}Инициализация Git репозитория...${NC}"
git init

# Добавление всех файлов в репозиторий
echo -e "${GREEN}Добавление файлов...${NC}"
git add .

# Первый коммит
echo -e "${GREEN}Создание первого коммита...${NC}"
git commit -m "Initial commit"

# Создание основной ветки main
echo -e "${GREEN}Переключение на ветку main...${NC}"
git branch -M main

# Добавление удаленного репозитория
echo -e "${GREEN}Добавление удаленного репозитория...${NC}"
git remote add origin https://github.com/$github_username/$repo_name.git

# Использование токена для аутентификации
echo -e "${BLUE}Введите ваш токен GitHub:${NC}"
read github_token

# Проверяем, существует ли .git/config
if [ -f .git/config ]; then
  # Настройка URL с токеном для отправки изменений
  git config --local credential.helper store
  echo "https://$github_username:$github_token@github.com" > ~/.git-credentials
  
  # Отправка на GitHub
  echo -e "${GREEN}Отправка изменений на GitHub...${NC}"
  git push -u origin main

  echo -e "${GREEN}Готово! Репозиторий создан и загружен на GitHub.${NC}"
  echo -e "${GREEN}URL репозитория: https://github.com/$github_username/$repo_name${NC}"
else
  echo -e "${RED}Ошибка: .git/config не найден. Возможно, git init не выполнен успешно.${NC}"
fi 