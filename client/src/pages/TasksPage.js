// client/src/pages/TasksPage.js
import React from 'react';
import { useGame } from '../context/GameContext';
import TasksScreen from '../components/tasks/TasksScreen';
import ResourceBar from '../components/ui/ResourceBar';
import Navbar from '../components/ui/Navbar';
import LoadingScreen from '../components/ui/LoadingScreen';

const TasksPage = () => {
  const { 
    loading,
    resources,
    tasks,
    completedTasks,
    actions
  } = useGame();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ResourceBar resources={resources} />
      
      <TasksScreen
        tasks={tasks}
        completedTasks={completedTasks}
        onClaimReward={actions.claimTaskReward}
      />
      
      <Navbar />
    </div>
  );
};

export default TasksPage;