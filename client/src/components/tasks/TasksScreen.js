// client/src/components/tasks/TasksScreen.js
import React from 'react';
import Button from '../ui/Button';

const TasksScreen = ({ 
  tasks, 
  completedTasks,
  onClaimReward
}) => {
  // Разделяем задания на ежедневные и достижения
  const dailyTasks = tasks.filter(task => task.type === 'daily');
  const achievements = tasks.filter(task => task.type === 'achievement');
  
  // Функция для отображения прогресса выполнения
  const renderProgress = (task, currentProgress) => {
    const percent = Math.min((currentProgress / task.goal.amount) * 100, 100);
    
    return (
      <div className="w-full mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span>Прогресс: {currentProgress}/{task.goal.amount}</span>
          <span>{Math.floor(percent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Задания</h1>
        <p className="text-gray-600">
          Выполняйте задания для получения наград
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ежедневные задания</h2>
        {dailyTasks.length > 0 ? (
          <div className="space-y-4">
            {dailyTasks.map(task => {
              const completed = completedTasks.includes(task.id);
              const taskProgress = task.currentProgress || 0;
              
              return (
                <div 
                  key={task.id} 
                  className={`bg-white rounded-lg p-4 shadow ${
                    completed ? 'border-green-500 border-2' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      
                      {!completed && renderProgress(task, taskProgress)}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 mb-2">
                        {task.rewards.stars > 0 && (
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{task.rewards.stars}</span>
                          </div>
                        )}
                        
                        {task.rewards.coins > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            <span>💰</span>
                            <span>{task.rewards.coins}</span>
                          </div>
                        )}
                      </div>
                      
                      {completed ? (
                        <span className="text-xs text-green-600 font-medium">
                          Выполнено
                        </span>
                      ) : taskProgress >= task.goal.amount ? (
                        <Button
                          variant="success"
                          className="text-xs py-1"
                          onClick={() => onClaimReward(task.id)}
                        >
                          Получить награду
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-600">
                          В процессе
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">
            Нет доступных заданий
          </p>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Достижения</h2>
        {achievements.length > 0 ? (
          <div className="space-y-4">
            {achievements.map(task => {
              const completed = completedTasks.includes(task.id);
              const taskProgress = task.currentProgress || 0;
              
              return (
                <div 
                  key={task.id} 
                  className={`bg-white rounded-lg p-4 shadow ${
                    completed ? 'border-green-500 border-2' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      
                      {!completed && renderProgress(task, taskProgress)}
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 mb-2">
                        {task.rewards.stars > 0 && (
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span>{task.rewards.stars}</span>
                          </div>
                        )}
                        
                        {task.rewards.coins > 0 && (
                          <div className="flex items-center gap-1 ml-2">
                            <span>💰</span>
                            <span>{task.rewards.coins}</span>
                          </div>
                        )}
                      </div>
                      
                      {completed ? (
                        <span className="text-xs text-green-600 font-medium">
                          Выполнено
                        </span>
                      ) : taskProgress >= task.goal.amount ? (
                        <Button
                          variant="success"
                          className="text-xs py-1"
                          onClick={() => onClaimReward(task.id)}
                        >
                          Получить награду
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-600">
                          {taskProgress}/{task.goal.amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">
            Нет доступных достижений
          </p>
        )}
      </div>
    </div>
  );
};

export default TasksScreen;