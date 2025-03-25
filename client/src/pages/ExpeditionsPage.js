// client/src/pages/ExpeditionsPage.js
import React from 'react';
import { useGame } from '../context/GameContext';
import ExpeditionsScreen from '../components/expeditions/ExpeditionsScreen';
import ResourceBar from '../components/ui/ResourceBar';
import Navbar from '../components/ui/Navbar';
import LoadingScreen from '../components/ui/LoadingScreen';

const ExpeditionsPage = () => {
  const { 
    loading,
    playerLevel,
    resources,
    expeditions,
    dailyExpeditionDone,
    actions
  } = useGame();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ResourceBar resources={resources} />
      
      <ExpeditionsScreen
        expeditions={expeditions}
        playerLevel={playerLevel}
        dailyExpeditionDone={dailyExpeditionDone}
        onStartExpedition={actions.startExpedition}
      />
      
      <Navbar />
    </div>
  );
};

export default ExpeditionsPage;