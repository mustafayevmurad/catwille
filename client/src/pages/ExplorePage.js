// client/src/pages/ExplorePage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ResourceBar from '../components/ResourceBar';
import Loading from '../components/Loading';
import { FishingIcon, HuntingIcon, CompassIcon, EnergyIcon } from '../components/Icons';

const ExplorePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, cats, performAction, fetchCats } = useUser();
  
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionResult, setActionResult] = useState(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  
  // Получение кошек пользователя при загрузке страницы
  useEffect(() => {
    if (user) {
      fetchCats();
    }
  }, [user, fetchCats]);
  
  // Установка выбранной кошки из пропсов (если передана)
  useEffect(() => {
    if (location.state && location.state.selectedCat) {
      setSelectedCat(location.state.selectedCat);
    } else if (cats && cats.length > 0) {
      setSelectedCat(cats[0]);
    }
    
    // Установка предварительно выбранного действия (если передано)
    if (location.state && location.state.preselectedAction) {
      setSelectedAction(location.state.preselectedAction);
    }
  }, [location.state, cats]);
  
  if (loading || !user) {
    return <Loading />;
  }
  
  // Выполнение действия
  const handlePerformAction = async () => {
    if (!selectedCat || !selectedAction) return;
    
    try {
      setIsPerformingAction(true);
      setActionResult(null);
      
      // Проверка энергии
      if (user.energy.current < 10) {
        setActionResult({
          message: 'Недостаточно энергии для выполнения действия',
          success: false
        });
        setIsPerformingAction(false);
        return;
      }
      
      // Вызов действия через контекст
      const result = await performAction(selectedCat._id, selectedAction);
      
      setActionResult({
        ...result,
        success: true
      });
      
      // Если нашли кошку, предложить перейти на страницу кошек
      if (result.foundCat) {
        setTimeout(() => {
          if (window.confirm('Вы нашли новую кошку! Хотите посмотреть своих кошек?')) {
            navigate('/cats');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Ошибка при выполнении действия:', error);
      setActionResult({
        message: 'Произошла ошибка при выполнении действия',
        success: false
      });
    } finally {
      setIsPerformingAction(false);
    }
  };
  
  return (
    <div className="pb-16">
      <ResourceBar />
      
      <div className="pt-16 px-4">
        <h1 className="text-2xl font-bold mb-4">Исследование</h1>
        
        {/* Выбор кошки */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Выберите кошку для исследования:
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedCat?._id || ''}
            onChange={(e) => {
              const catId = e.target.value;
              const cat = cats.find(c => c._id === catId);
              setSelectedCat(cat);
            }}
          >
            {cats.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name} (Уровень {cat.level})</option>
            ))}
          </select>
        </div>
        
        {/* Информация о выбранной кошке */}
        {selectedCat && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="font-bold">{selectedCat.name}</h3>
            <p className="text-sm">Уровень: {selectedCat.level}</p>
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <FishingIcon className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-sm">Рыбалка: {selectedCat.stats.fishing}</span>
              </div>
              <div className="flex items-center mb-1">
                <HuntingIcon className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm">Охота: {selectedCat.stats.hunting}</span>
              </div>
              <div className="flex items-center">
                <CompassIcon className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-sm">Исследование: {selectedCat.stats.exploring}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Выбор действия */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Выберите действие:</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                selectedAction === 'fishing' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white'
              }`}
              onClick={() => setSelectedAction('fishing')}
            >
              <FishingIcon className={`w-6 h-6 mb-1 ${selectedAction === 'fishing' ? 'text-white' : 'text-blue-500'}`} />
              <span className="text-xs">Рыбалка</span>
            </button>
            
            <button
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                selectedAction === 'hunting' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white'
              }`}
              onClick={() => setSelectedAction('hunting')}
            >
              <HuntingIcon className={`w-6 h-6 mb-1 ${selectedAction === 'hunting' ? 'text-white' : 'text-green-500'}`} />
              <span className="text-xs">Охота</span>
            </button>
            
            <button
              className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                selectedAction === 'exploring' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white'
              }`}
              onClick={() => setSelectedAction('exploring')}
            >
              <CompassIcon className={`w-6 h-6 mb-1 ${selectedAction === 'exploring' ? 'text-white' : 'text-purple-500'}`} />
              <span className="text-xs">Исследовать</span>
            </button>
          </div>
        </div>
        
        {/* Стоимость энергии */}
        <div className="mb-6 bg-gray-50 rounded-lg p-3 flex items-center">
          <EnergyIcon className="w-5 h-5 mr-2 text-yellow-500" />
          <span>Стоимость действия: 10 энергии</span>
        </div>
        
        {/* Кнопка действия */}
        <button
          className="w-full bg-cat-primary text-white py-3 rounded-lg font-bold disabled:bg-gray-300"
          disabled={!selectedCat || !selectedAction || isPerformingAction || user.energy.current < 10}
          onClick={handlePerformAction}
        >
          {isPerformingAction ? 'Выполняем...' : 'Выполнить'}
        </button>
        
        {/* Результат действия */}
        {actionResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            actionResult.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <p className="font-medium">{actionResult.message}</p>
            
            {actionResult.success && actionResult.resources && (
              <div className="mt-2">
                <p className="text-sm font-medium">Получено:</p>
                <div className="flex flex-wrap">
                  {actionResult.resources.fish && (
                    <div className="mr-3 flex items-center">
                      <FishingIcon className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-sm">+{actionResult.resources.fish}</span>
                    </div>
                  )}
                  {actionResult.resources.yarnBalls && (
                    <div className="mr-3 flex items-center">
                      <HuntingIcon className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm">+{actionResult.resources.yarnBalls}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {actionResult.success && actionResult.experience && (
              <p className="text-sm mt-1">+{actionResult.experience} опыта</p>
            )}
            
            {actionResult.levelUp && (
              <p className="text-sm font-bold mt-1 text-yellow-600">Кошка повысила уровень!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;