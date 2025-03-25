// client/src/pages/VillagePage.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import ResourceBar from '../components/ResourceBar';
import Loading from '../components/Loading';
import { LevelIcon } from '../components/Icons';

const VillagePage = () => {
  const { user, loading, buildings } = useUser();
  const [buildingData, setBuildingData] = useState([]);
  
  // Загрузка данных о зданиях
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    // для получения информации о типах зданий
    import('../data/buildings.json').then(data => {
      setBuildingData(data.buildings);
    });
  }, []);
  
  if (loading || !user) {
    return <Loading />;
  }
  
  // Получение информации о здании по ID
  const getBuildingInfo = (buildingId) => {
    return buildingData.find(b => b.id === buildingId) || null;
  };
  
  // Рендер здания
  const renderBuilding = (building) => {
    const buildingInfo = getBuildingInfo(building.buildingId);
    if (!buildingInfo) return null;
    
    return (
      <div 
        key={building.buildingId + building.position.x + building.position.y}
        className="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{buildingInfo.name}</h3>
            <p className="text-sm text-gray-600">{buildingInfo.description}</p>
          </div>
          <div className="flex items-center bg-gray-100 rounded-full px-2 py-1">
            <LevelIcon className="w-4 h-4 mr-1 text-yellow-500" />
            <span className="text-sm font-bold">{building.level}</span>
          </div>
        </div>
        
        {/* Информация о бонусах здания */}
        {buildingInfo.levels && buildingInfo.levels[building.level - 1] && (
          <div className="mt-3 bg-gray-50 p-2 rounded">
            <h4 className="text-sm font-medium mb-1">Бонусы:</h4>
            <ul className="text-xs">
              {Object.entries(buildingInfo.levels[building.level - 1]).map(([key, value]) => {
                // Пропускаем некоторые технические поля
                if (['level', 'buildCost', 'buildTime'].includes(key)) return null;
                
                return (
                  <li key={key} className="mb-1">
                    {key === 'maxCats' && `Максимум кошек: ${value}`}
                    {key === 'productionRate' && Object.entries(value).map(([resource, amount]) => 
                      `Добыча ${resource === 'fish' ? 'рыбы' : 'ресурсов'}: +${amount}/час`
                    )}
                    {key === 'craftingSpeed' && `Скорость крафта: x${value}`}
                    {key === 'expBoost' && `Бонус опыта: +${value * 100}%`}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        {/* Кнопка улучшения */}
        {building.level < (buildingInfo.maxLevel || 5) && (
          <div className="mt-3">
            <button className="w-full bg-cat-secondary text-white py-2 rounded-lg text-sm font-bold">
              Улучшить (Уровень {building.level + 1})
            </button>
            
            {/* Стоимость улучшения */}
            {buildingInfo.levels && buildingInfo.levels[building.level] && (
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Стоимость: {buildingInfo.levels[building.level].buildCost.fish} рыбы</span>
                <span>Время: {Math.floor(buildingInfo.levels[building.level].buildTime / 60)} мин</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="pb-16">
      <ResourceBar />
      
      <div className="pt-16 px-4">
        <h1 className="text-2xl font-bold mb-4">Ваше поселение</h1>
        
        {/* Информация о поселении */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <p className="text-center">
            Поселение уровня {Math.min(Math.floor(user.buildings.reduce((sum, b) => sum + b.level, 0) / 2), 10)}
          </p>
          <p className="text-sm text-center text-gray-600 mt-1">
            {user.buildings.length} зданий, {user.cats.length} кошек
          </p>
        </div>
        
        {/* Список зданий */}
        <h2 className="text-xl font-bold mb-3">Здания</h2>
        <div className="mb-6">
          {user.buildings.map(building => renderBuilding(building))}
        </div>
        
        {/* Кнопка постройки нового здания */}
        <button className="w-full bg-cat-primary text-white py-3 rounded-lg font-bold mb-6">
          Построить новое здание
        </button>
      </div>
    </div>
  );
};

export default VillagePage;