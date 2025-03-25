// client/src/pages/HomePage.js
import React from 'react';
import { useGame } from '../context/GameContext';
import HomeScreen from '../components/home/HomeScreen';
import ResourceBar from '../components/ui/ResourceBar';
import Navbar from '../components/ui/Navbar';
import LoadingScreen from '../components/ui/LoadingScreen';

const HomePage = () => {
  const { 
    loading,
    playerLevel,
    resources,
    buildings,
    actions
  } = useGame();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <ResourceBar resources={resources} />
      
      <HomeScreen
        buildings={buildings}
        resources={resources}
        playerLevel={playerLevel}
        onCollectResource={actions.collectResource}
        onUpgradeBuilding={actions.upgradeBuilding}
      />
      
      <Navbar />
    </div>
  );
};

export default HomePage;