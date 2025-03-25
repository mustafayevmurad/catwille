// client/src/components/expeditions/ExpeditionStoryScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const ExpeditionStoryScreen = ({ 
  expedition, 
  story,
  onCompleteExpedition
}) => {
  const [outcome, setOutcome] = useState(null);
  const navigate = useNavigate();
  
  const handleChoice = (choice) => {
    // Определяем результат выбора на основе шансов
    const random = Math.random();
    let cumulativeProbability = 0;
    
    const selectedOutcome = choice.outcomes.find(outcome => {
      cumulativeProbability += outcome.chance;
      return random <= cumulativeProbability;
    }) || choice.outcomes[0];
    
    setOutcome(selectedOutcome);
  };
  
  const handleComplete = () => {
    onCompleteExpedition(expedition.id, outcome);
    navigate('/expeditions');
  };
  
  if (!story) {
    // Если история не найдена, показываем общий результат
    return (
      <div className="min-h-screen pt-16 pb-20 px-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Результаты вылазки</h1>
          <p className="text-gray-600">Локация: {expedition.name}</p>
        </div>
        
        <div className="text-center py-8 flex-grow flex flex-col items-center justify-center">
          <span className="text-5xl mb-6">🎉</span>
          <h2 className="text-xl font-bold mb-3">Вылазка завершена!</h2>
          <p className="text-gray-600 mb-6">
            Вы успешно исследовали локацию и получили ресурсы:
          </p>
          
          <div className="flex gap-4 mb-8">
            {expedition.rewards.guaranteed.wood && (
              <div className="flex flex-col items-center">
                <span className="text-3xl">🪵</span>
                <span className="font-medium mt-1">
                  +{Math.floor(
                    expedition.rewards.guaranteed.wood.min + 
                    Math.random() * (expedition.rewards.guaranteed.wood.max - expedition.rewards.guaranteed.wood.min)
                  )}
                </span>
              </div>
            )}
            
            {expedition.rewards.guaranteed.fish && (
              <div className="flex flex-col items-center">
                <span className="text-3xl">🐟</span>
                <span className="font-medium mt-1">
                  +{Math.floor(
                    expedition.rewards.guaranteed.fish.min + 
                    Math.random() * (expedition.rewards.guaranteed.fish.max - expedition.rewards.guaranteed.fish.min)
                  )}
                </span>
              </div>
            )}
            
            {Math.random() < (expedition.rewards.chance.coins?.chance || 0) && (
              <div className="flex flex-col items-center">
                <span className="text-3xl">💰</span>
                <span className="font-medium mt-1">
                  +{Math.floor(
                    expedition.rewards.chance.coins.min + 
                    Math.random() * (expedition.rewards.chance.coins.max - expedition.rewards.chance.coins.min)
                  )}
                </span>
              </div>
            )}
          </div>
          
          <Button onClick={handleComplete}>
            Завершить вылазку
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Вылазка: {expedition.name}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        {!outcome ? (
          <>
            <p className="mb-6">{story.text}</p>
            
            <div className="space-y-3">
              {story.choices.map((choice, index) => (
                <Button 
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full"
                  variant={index === 0 ? 'primary' : 'secondary'}
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="mb-6">{outcome.text}</p>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Вы получили:</h3>
              <div className="flex flex-wrap gap-3">
                {outcome.rewards?.stars && (
                  <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                    <span>⭐</span>
                    <span>{outcome.rewards.stars}</span>
                  </div>
                )}
                
                {outcome.rewards?.cats && outcome.rewards.cats.length > 0 && (
                  <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                    <span>🐱</span>
                    <span>Новый кот!</span>
                  </div>
                )}
                
                {outcome.rewards?.wood && (
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span>🪵</span>
                    <span>+{outcome.rewards.wood}</span>
                  </div>
                )}
                
                {outcome.rewards?.fish && (
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <span>🐟</span>
                    <span>+{outcome.rewards.fish}</span>
                  </div>
                )}
              </div>
            </div>
            
            {outcome.penalties && (
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-red-600">Потери:</h3>
                <div className="flex flex-wrap gap-3">
                  {outcome.penalties?.energy && (
                    <div className="flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full">
                      <span>⚡</span>
                      <span>-{outcome.penalties.energy}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <Button onClick={handleComplete}>
              Завершить вылазку
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpeditionStoryScreen;