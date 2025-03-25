// client/src/components/expeditions/ExpeditionsScreen.js
import React from 'react';
import Button from '../ui/Button';

const ExpeditionsScreen = ({ 
  expeditions, 
  playerLevel, 
  dailyExpeditionDone,
  onStartExpedition
}) => {
  const watchtowerUnlocked = playerLevel >= 4;
  
  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ежедневные вылазки</h1>
        {watchtowerUnlocked ? (
          <p className="text-gray-600">
            {dailyExpeditionDone 
              ? 'Вы уже совершили вылазку сегодня. Возвращайтесь завтра!'
              : 'Выберите локацию для сегодняшней вылазки'}
          </p>
        ) : (
          <p className="text-gray-600">
            Постройте Башню наблюдения, чтобы открыть доступ к вылазкам
          </p>
        )}
      </div>
      
      {!watchtowerUnlocked && (
        <div className="text-center py-10">
          <span className="text-5xl mb-4 block">🔭</span>
          <h2 className="text-xl font-semibold mb-2">Башня наблюдения</h2>
          <p className="text-gray-600 mb-4">
            Откроется на уровне 4. Текущий уровень: {playerLevel}
          </p>
        </div>
      )}
      
      {watchtowerUnlocked && !dailyExpeditionDone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expeditions
            .filter(exp => exp.unlockLevel <= playerLevel)
            .map(expedition => (
              <div 
                key={expedition.id} 
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div 
                  className="h-32 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${expedition.imageUrl || '/assets/images/expeditions/default.png'})` 
                  }}
                />
                
                <div className="p-4">
                  <h3 className="font-bold text-lg">{expedition.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{expedition.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Возможные награды:</p>
                    <div className="flex flex-wrap gap-2">
                      {expedition.rewards.guaranteed.wood && (
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          🪵 {expedition.rewards.guaranteed.wood.min}-{expedition.rewards.guaranteed.wood.max}
                        </span>
                      )}
                      {expedition.rewards.guaranteed.fish && (
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          🐟 {expedition.rewards.guaranteed.fish.min}-{expedition.rewards.guaranteed.fish.max}
                        </span>
                      )}
                      {expedition.rewards.chance.catFood && (
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          🥫 Шанс
                        </span>
                      )}
                      {expedition.rewards.chance.coins && (
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
                          💰 Шанс
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onStartExpedition(expedition.id)}
                    className="w-full"
                  >
                    Начать вылазку
                  </Button>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {watchtowerUnlocked && dailyExpeditionDone && (
        <div className="text-center py-10">
          <span className="text-5xl mb-4 block">🌙</span>
          <h2 className="text-xl font-semibold mb-2">Вернитесь завтра</h2>
          <p className="text-gray-600">
            Вы уже совершили вылазку сегодня. Новая вылазка будет доступна завтра.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpeditionsScreen;