// client/src/pages/ExpeditionDetailsPage.js
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import ExpeditionStoryScreen from '../components/expeditions/ExpeditionStoryScreen';
import ResourceBar from '../components/ui/ResourceBar';
import LoadingScreen from '../components/ui/LoadingScreen';

const ExpeditionDetailsPage = () => {
  const { expeditionId } = useParams();
  const { 
    loading,
    expeditions,
    actions,
    currentExpedition
  } = useGame();
  
  // Если не идет вылазка или ID не совпадает, перенаправляем
  if (!loading && (!currentExpedition || currentExpedition !== expeditionId)) {
    return <Navigate to="/expeditions" replace />;
  }
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const expedition = expeditions.find(exp => exp.id === expeditionId);
  const story = actions.getExpeditionStory(expeditionId);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ResourceBar resources={{ energy: { amount: 0 } }} /> {/* Упрощенная версия */}
      
      <ExpeditionStoryScreen
        expedition={expedition}
        story={story}
        onCompleteExpedition={actions.completeExpedition}
      />
    </div>
  );
};

export default ExpeditionDetailsPage;