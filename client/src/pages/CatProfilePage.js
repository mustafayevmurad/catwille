// client/src/pages/CatProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ResourceBar from '../components/ResourceBar';
import Loading from '../components/Loading';
import { LevelIcon, ExpIcon, FishingIcon, HuntingIcon, CompassIcon } from '../components/Icons';
import axios from 'axios';

const CatProfilePage = () => {
  const { catId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [cat, setCat] = useState(null);
  const [loadingCat, setLoadingCat] = useState(true);
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  // Получение данных о кошке
  useEffect(() => {
    const fetchCat = async () => {
      try {
        setLoadingCat(true);
        const response = await axios.get(`${API_URL}/cat/${catId}`);
        if (response.data && response.data.cat) {
          setCat(response.data.cat);
        }
      } catch (error) {
        console.error('Ошибка при получении данных кошки:', error);
        navigate('/cats'); // Перенаправляем на страницу кошек при ошибке
      } finally {
        setLoadingCat(false);
      }
    };
    
    if (catId) {
      fetchCat();
    }
  }, [catId, API_URL, navigate]);
  
  // Хук для работы с Telegram WebApp
  useEffect(() => {
    // Показываем кнопку Назад
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.BackButton.isVisible = true;
      tg.BackButton.onClick(() => navigate('/cats'));
      
      return () => {
        tg.BackButton.isVisible = false;
      };
    }
  }, [navigate]);
  
  if (loading || !user || loadingCat) {
    return <Loading />;
  }
  
  if (!cat) {
    return (
      <div className="pb-16">
        <ResourceBar />
        <div className="pt-16 px-4 text-center">
          <p>Кошка не найдена</p>
          <button 
            onClick={() => navigate('/cats')}
            className="mt-4 bg-cat-primary text-white py-2 px-4 rounded-lg"
          >
            Вернуться к списку кошек
          </button>
        </div>
      </div>
    );
  }
  
  // Перевод редкости на русский
  const getRarityText = () => {
    switch (cat.rarity) {
      case 'common': return 'Обычная';
      case 'uncommon': return 'Необычная';
      case 'rare': return 'Редкая';
      case 'epic': return 'Эпическая';
      case 'legendary': return 'Легендарная';
      default: return 'Обычная';
    }
  };
  
  // Перевод редкости в цвет
  const getRarityColor = () => {
    switch (cat.rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };
  
  // Улучшение навыка
  const upgradeSkill = async (skillName) => {
    try {
      const response = await axios.patch(`${API_URL}/cat/${cat._id}/skill`, {
        skillName
      });
      
      if (response.data && response.data.cat) {
        setCat(response.data.cat);
      }
    } catch (error) {
      console.error('Ошибка при улучшении навыка:', error);
    }
  };
  
  return (
    <div className="pb-16">
      <ResourceBar />
      
      <div className="pt-16 px-4">
        {/* Верхняя панель с информацией о кошке */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{cat.name}</h1>
              <p className="text-sm text-gray-600">{cat.breed}</p>
              <p className={`text-sm font-medium ${getRarityColor()}`}>{getRarityText()}</p>
            </div>
            <div className="flex items-center bg-yellow-100 rounded-full px-3 py-1">
              <LevelIcon className="w-5 h-5 mr-1 text-yellow-500" />
              <span className="font-bold">{cat.level}</span>
            </div>
          </div>
          
          {/* Опыт и прогресс до следующего уровня */}
          {/* Опыт и прогресс до следующего уровня */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center">
                <ExpIcon className="w-4 h-4 mr-1 text-yellow-500" />
                <span>Опыт:</span>
              </div>
              <span>{cat.experience}/{cat.level * 100}</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-cat-primary h-2 rounded-full" 
                style={{ width: `${(cat.experience % 100)}%` }}
              ></div>
            </div>
          </div>
          
          {/* Информация о личности */}
          <div className="mt-4 text-sm">
            <p><span className="font-medium">Личность:</span> {cat.personality}</p>
            <p className="mt-1 text-gray-600 italic">
              "Кошки с {cat.personality.toLowerCase()} характером любят приключения и новые открытия."
            </p>
          </div>
        </div>
        
        {/* Статистика и навыки */}
        <h2 className="text-xl font-bold mb-3">Навыки</h2>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <FishingIcon className="w-5 h-5 mr-2 text-blue-500" />
                <span className="font-medium">Рыбалка</span>
              </div>
              <span className="text-sm">Уровень {cat.stats.fishing}</span>
            </div>
            <div className="bg-gray-200 h-3 rounded-full">
              <div 
                className="bg-blue-500 h-3 rounded-full" 
                style={{ width: `${Math.min(cat.stats.fishing * 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Увеличивает добычу рыбы на {cat.stats.fishing * 5}%
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <HuntingIcon className="w-5 h-5 mr-2 text-green-500" />
                <span className="font-medium">Охота</span>
              </div>
              <span className="text-sm">Уровень {cat.stats.hunting}</span>
            </div>
            <div className="bg-gray-200 h-3 rounded-full">
              <div 
                className="bg-green-500 h-3 rounded-full" 
                style={{ width: `${Math.min(cat.stats.hunting * 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Увеличивает добычу клубков шерсти на {cat.stats.hunting * 5}%
            </p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <CompassIcon className="w-5 h-5 mr-2 text-purple-500" />
                <span className="font-medium">Исследование</span>
              </div>
              <span className="text-sm">Уровень {cat.stats.exploring}</span>
            </div>
            <div className="bg-gray-200 h-3 rounded-full">
              <div 
                className="bg-purple-500 h-3 rounded-full" 
                style={{ width: `${Math.min(cat.stats.exploring * 10, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Увеличивает шанс редких находок на {cat.stats.exploring * 3}%
            </p>
          </div>
        </div>
        
        {/* Специальные навыки */}
        <h2 className="text-xl font-bold mb-3">Специальные навыки</h2>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {cat.skills && cat.skills.length > 0 ? (
            <div>
              {cat.skills.map(skill => (
                <div key={skill.name} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-cat-secondary">Уровень {skill.level}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {skill.name === 'Рыбалка' && `Повышает эффективность рыбалки на ${skill.level * 10}%`}
                    {skill.name === 'Охота' && `Повышает эффективность охоты на ${skill.level * 10}%`}
                    {skill.name === 'Исследование' && `Повышает шанс найти что-то интересное на ${skill.level * 5}%`}
                  </p>
                  
                  {/* Кнопка улучшения навыка */}
                  <button 
                    className="mt-2 bg-cat-secondary text-white text-xs py-1 px-3 rounded-full"
                    onClick={() => upgradeSkill(skill.name)}
                  >
                    Улучшить за 200 рыбы
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600">
              У кошки пока нет специальных навыков
            </p>
          )}
        </div>
        
        {/* Кнопки действий */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="bg-cat-primary text-white py-3 rounded-lg font-bold"
            onClick={() => navigate('/explore', { state: { selectedCat: cat } })}
          >
            Исследовать
          </button>
          
          <button 
            className="bg-cat-secondary text-white py-3 rounded-lg font-bold"
            onClick={() => navigate('/tasks')}
          >
            К заданиям
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatProfilePage;