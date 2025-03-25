// client/src/pages/CatsPage.js
import React from 'react';
import { useGame } from '../context/GameContext';
import CatsScreen from '../components/cats/CatsScreen';
import ResourceBar from '../components/ui/ResourceBar';
import Navbar from '../components/ui/Navbar';
import LoadingScreen from '../components/ui/LoadingScreen';

const CatsPage = () => {
  const { 
    loading,
    playerLevel,
    resources,
    cats,
    activeCats,
    actions
  } = useGame();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ResourceBar resources={resources} />
      
      <CatsScreen
        cats={cats}
        activeCats={activeCats}
        playerLevel={playerLevel}
        onActivateCat={actions.activateCat}
        onDeactivateCat={actions.deactivateCat}
      />
      
      <Navbar />
    </div>
  );
};

export default CatsPage;