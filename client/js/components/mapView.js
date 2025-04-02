/**
 * Component for managing the map view
 * Shows resource zones and city buildings
 */
class MapView {
    constructor() {
        // Container element
        this.mapContainer = null;
        
        // Elements references
        this.elements = {
            resourceZones: {},
            cityBuildings: {}
        };
        
        // Create the map structure
        this.createMapStructure();
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    /**
     * Creates the HTML structure for the map view
     */
    createMapStructure() {
        // Create map container
        this.mapContainer = document.createElement('div');
        this.mapContainer.className = 'map-container';
        this.mapContainer.style.display = 'none';
        this.mapContainer.style.position = 'absolute';
        this.mapContainer.style.top = '0';
        this.mapContainer.style.left = '0';
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.minHeight = '100%';
        this.mapContainer.style.zIndex = '1500';
        this.mapContainer.style.overflowY = 'auto';
        this.mapContainer.style.paddingBottom = '70px';
        
        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'map-content-wrapper';
        contentWrapper.style.paddingTop = '100px';
        contentWrapper.style.padding = '100px 15px 70px 15px';
        contentWrapper.style.boxSizing = 'border-box';
        contentWrapper.style.minHeight = '120%';
        contentWrapper.style.position = 'relative';
        contentWrapper.style.zIndex = '1';
        
        // Create resource zones section
        const resourceZonesSection = this.createResourceZonesSection();
        
        // Create city buildings section
        const cityBuildingsSection = this.createCityBuildingsSection();
        
        // Add sections to wrapper
        contentWrapper.appendChild(resourceZonesSection);
        contentWrapper.appendChild(cityBuildingsSection);
        
        // Add wrapper to container
        this.mapContainer.appendChild(contentWrapper);
        
        // Add container to document
        document.body.appendChild(this.mapContainer);
    }
    
    /**
     * Creates the resource zones section
     */
    createResourceZonesSection() {
        // Create zones container
        const zonesContainer = document.createElement('div');
        zonesContainer.className = 'zones-container';
        zonesContainer.style.display = 'flex';
        zonesContainer.style.justifyContent = 'space-between';
        zonesContainer.style.marginBottom = '150px';
        zonesContainer.style.gap = '80px';
        
        // Create forest zone
        const forestZone = this.createZone('forest', 'Forest');
        
        // Create pond zone
        const pondZone = this.createZone('pond', 'Pond');
        
        // Add zones to container
        zonesContainer.appendChild(forestZone);
        zonesContainer.appendChild(pondZone);
        
        return zonesContainer;
    }
    
    /**
     * Creates the city buildings section
     */
    createCityBuildingsSection() {
        // Create buildings container
        const buildingsContainer = document.createElement('div');
        buildingsContainer.className = 'buildings-container-map';
        buildingsContainer.style.display = 'flex';
        buildingsContainer.style.flexDirection = 'column';
        buildingsContainer.style.gap = '30px';
        
        // Create cat arena (with purple border)
        const catArenaWrapper = document.createElement('div');
        catArenaWrapper.style.border = '2px solid #8e44ad';
        catArenaWrapper.style.borderRadius = '15px';
        catArenaWrapper.style.padding = '3px';
        catArenaWrapper.style.marginBottom = '30px';
        
        const catArena = this.createBuilding('arena', 'Cat Arena');
        catArena.style.height = '150px';
        
        catArenaWrapper.appendChild(catArena);
        
        // Create first row of buildings
        const buildingsRow1 = document.createElement('div');
        buildingsRow1.className = 'buildings-row-map';
        buildingsRow1.style.display = 'flex';
        buildingsRow1.style.justifyContent = 'space-between';
        buildingsRow1.style.gap = '20px';
        
        // Hall of Fame
        const hallOfFame = this.createBuilding('hallOfFame', 'Hall of Fame');
        
        // Cat Joys Shop
        const catJoysShop = this.createBuilding('catJoysShop', 'Cat Joys Shop');
        
        // Add buildings to row 1
        buildingsRow1.appendChild(hallOfFame);
        buildingsRow1.appendChild(catJoysShop);
        
        // Create second row of buildings
        const buildingsRow2 = document.createElement('div');
        buildingsRow2.className = 'buildings-row-map';
        buildingsRow2.style.display = 'flex';
        buildingsRow2.style.justifyContent = 'space-between';
        buildingsRow2.style.gap = '20px';
        
        // Workshop
        const workshop = this.createBuilding('workshop', 'Workshop');
        
        // Cat Academy
        const catAcademy = this.createBuilding('catAcademy', 'Cat Academy');
        
        // Add buildings to row 2
        buildingsRow2.appendChild(workshop);
        buildingsRow2.appendChild(catAcademy);
        
        // Create third row of buildings
        const buildingsRow3 = document.createElement('div');
        buildingsRow3.className = 'buildings-row-map';
        buildingsRow3.style.display = 'flex';
        buildingsRow3.style.justifyContent = 'center';
        
        // City Hall (with gold border)
        const cityHall = this.createBuilding('cityHall', 'City Hall');
        cityHall.style.width = '80%';
        cityHall.style.height = '130px';
        cityHall.style.border = '2px solid #FFD700';
        cityHall.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
        
        // Add City Hall to row 3
        buildingsRow3.appendChild(cityHall);
        
        // Add all buildings to container
        buildingsContainer.appendChild(catArenaWrapper);
        buildingsContainer.appendChild(buildingsRow1);
        buildingsContainer.appendChild(buildingsRow2);
        buildingsContainer.appendChild(buildingsRow3);
        
        return buildingsContainer;
    }
    
    /**
     * Creates a resource zone element
     */
    createZone(id, name) {
        const zone = document.createElement('div');
        zone.id = `map-${id}`;
        zone.className = `resource-zone ${id}-zone`;
        zone.style.width = '48%';
        zone.style.height = '120px';
        zone.style.backgroundColor = 'rgba(224, 224, 224, 0.7)';
        zone.style.borderRadius = '10px';
        zone.style.display = 'flex';
        zone.style.justifyContent = 'center';
        zone.style.alignItems = 'center';
        zone.style.position = 'relative';
        zone.style.cursor = 'pointer';
        zone.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        zone.style.transition = 'transform 0.2s, box-shadow 0.2s';
        
        // Add hover effect
        zone.addEventListener('mouseenter', () => {
            zone.style.transform = 'translateY(-2px)';
            zone.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        
        zone.addEventListener('mouseleave', () => {
            zone.style.transform = 'translateY(0)';
            zone.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
        
        const label = document.createElement('div');
        label.textContent = name;
        label.style.backgroundColor = '#333';
        label.style.color = '#fff';
        label.style.padding = '5px 10px';
        label.style.borderRadius = '5px';
        label.style.position = 'absolute';
        label.style.bottom = '10px';
        label.style.fontSize = '14px';
        
        zone.appendChild(label);
        
        // Store reference
        this.elements.resourceZones[id] = zone;
        
        return zone;
    }
    
    /**
     * Creates a building element
     */
    createBuilding(id, name) {
        const building = document.createElement('div');
        building.id = `map-${id}`;
        building.className = `city-building ${id}-building`;
        building.style.width = id === 'arena' ? '100%' : '48%';
        building.style.height = '120px';
        building.style.backgroundColor = 'rgba(224, 224, 224, 0.7)';
        building.style.borderRadius = '10px';
        building.style.display = 'flex';
        building.style.justifyContent = 'center';
        building.style.alignItems = 'center';
        building.style.position = 'relative';
        building.style.cursor = 'pointer';
        building.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        building.style.transition = 'transform 0.2s, box-shadow 0.2s';
        
        // Add hover effect
        building.addEventListener('mouseenter', () => {
            building.style.transform = 'translateY(-2px)';
            building.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        
        building.addEventListener('mouseleave', () => {
            building.style.transform = 'translateY(0)';
            building.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
        
        const label = document.createElement('div');
        label.textContent = name;
        label.style.backgroundColor = '#333';
        label.style.color = '#fff';
        label.style.padding = '5px 10px';
        label.style.borderRadius = '5px';
        label.style.position = 'absolute';
        label.style.bottom = '10px';
        label.style.fontSize = '14px';
        
        building.appendChild(label);
        
        // Store reference
        this.elements.cityBuildings[id] = building;
        
        return building;
    }
    
    /**
     * Initializes event listeners for the map elements
     */
    initEventListeners() {
        // Add click handlers for resource zones
        for (const zoneId in this.elements.resourceZones) {
            const zone = this.elements.resourceZones[zoneId];
            zone.addEventListener('click', () => {
                this.handleResourceZoneClick(zoneId);
            });
        }
        
        // Add click handlers for city buildings
        for (const buildingId in this.elements.cityBuildings) {
            const building = this.elements.cityBuildings[buildingId];
            building.addEventListener('click', () => {
                this.handleBuildingClick(buildingId);
            });
        }
    }
    
    /**
     * Handles click on resource zone
     * @param {string} zoneId - The ID of the zone (forest, pond)
     */
    handleResourceZoneClick(zoneId) {
        console.log(`Clicked on resource zone: ${zoneId}`);
        
        // Hide the map view first
        this.hide();
        
        // Open the appropriate mini-game based on zone type
        switch (zoneId) {
            case 'forest':
                if (!window.forestMiniGame) {
                    window.forestMiniGame = new ForestMiniGame();
                }
                window.forestMiniGame.open();
                break;
            case 'pond':
                if (!window.fishingMiniGame) {
                    window.fishingMiniGame = new FishingMiniGame();
                }
                window.fishingMiniGame.open();
                break;
            default:
                this.showMessage(`Ресурсы ${zoneId === 'forest' ? 'леса' : 'пруда'} скоро будут доступны!`);
        }
    }
    
    /**
     * Handles click on city building
     * @param {string} buildingId - The ID of the building
     */
    handleBuildingClick(buildingId) {
        console.log(`Clicked on building: ${buildingId}`);
        
        // Hide the map view first
        this.hide();
        
        // Open the appropriate building or mini-game based on building type
        switch (buildingId) {
            case 'arena':
                if (!window.arenaMiniGame) {
                    window.arenaMiniGame = new ArenaMiniGame();
                }
                window.arenaMiniGame.open();
                break;
            case 'hallOfFame':
                if (!window.hallOfFameManager) {
                    window.hallOfFameManager = new HallOfFameManager();
                }
                window.hallOfFameManager.openModal();
                break;
            case 'catAcademy':
                this.showMessage('Академия котов скоро откроется!');
                break;
            case 'catJoysShop':
                this.showMessage('Магазин "Кошачьи радости" скоро откроется!');
                break;
            case 'workshop':
                this.showMessage('Мастерская скоро откроется!');
                break;
            case 'cityHall':
                this.showMessage('Ратуша скоро откроется!');
                break;
            default:
                this.showMessage(`Здание ${buildingId} находится в разработке!`);
        }
    }
    
    /**
     * Shows a message to the user
     * @param {string} message - The message to show
     */
    showMessage(message) {
        console.log(`MapView message: ${message}`);
        
        // Try to use main scene's showMessage method
        if (window.mainScene && typeof window.mainScene.showMessage === 'function') {
            window.mainScene.showMessage(message);
            return;
        }
        
        // Fallback to simple alert if mainScene is not available
        alert(message);
    }
    
    /**
     * Shows the map view
     */
    show() {
        // Reset visibility and z-index
        this.mapContainer.style.display = 'block';
        this.mapContainer.style.visibility = 'visible';
        this.mapContainer.style.zIndex = '1500';
        
        // Hide the main game area
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.style.display = 'none';
            gameArea.style.visibility = 'hidden';
        }
        
        // Show the top bar
        this.showTopBar();
        
        // Show the energy bar
        this.showEnergyBar();
        
        // Show the bottom menu
        this.showBottomMenu();
        
        // Make sure event listeners are initialized 
        // (important if new buildings are added dynamically)
        this.initEventListeners();
        
        console.log('MapView is now visible, all interactive elements should be functional');
    }
    
    /**
     * Clones and shows the top bar
     */
    showTopBar() {
        const originalTopBar = document.querySelector('.top-bar');
        if (!originalTopBar) return;
        
        // Check if we already have a cloned top bar
        let topBarClone = this.mapContainer.querySelector('.top-bar-clone');
        
        if (!topBarClone) {
            // Clone the top bar
            topBarClone = originalTopBar.cloneNode(true);
            topBarClone.className += ' top-bar-clone';
            
            // Use the exact styling from the original top bar
            topBarClone.style.position = 'fixed';
            topBarClone.style.top = '0';
            topBarClone.style.left = '0';
            topBarClone.style.right = '0';
            topBarClone.style.zIndex = '2000';
            topBarClone.style.width = 'calc(100% - 12px)';
            topBarClone.style.margin = '6px';
            topBarClone.style.borderRadius = '25px';
            topBarClone.style.border = '1px solid #c3964d';
            topBarClone.style.backgroundColor = '#e9bc75';
            topBarClone.style.display = 'flex';
            topBarClone.style.flexDirection = 'column';
            topBarClone.style.padding = '8px 12px';
            topBarClone.style.color = '#5a3921';
            topBarClone.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -2px 0 rgba(0, 0, 0, 0.1)';
            topBarClone.style.fontFamily = 'Arial, sans-serif';
            topBarClone.style.fontWeight = '600';
            
            // Add to map container
            this.mapContainer.appendChild(topBarClone);
        }
        
        // Sync resource values
        this.syncResourceValues(originalTopBar, topBarClone);
    }
    
    /**
     * Clones and shows the energy bar
     */
    showEnergyBar() {
        const originalEnergyBar = document.querySelector('.energy-container');
        if (!originalEnergyBar) return;
        
        // Check if we already have a cloned energy bar
        let energyBarClone = this.mapContainer.querySelector('.energy-container-clone');
        
        if (!energyBarClone) {
            // Clone the energy bar
            energyBarClone = originalEnergyBar.cloneNode(true);
            energyBarClone.className += ' energy-container-clone';
            
            // Position the energy bar properly
            energyBarClone.style.position = 'fixed';
            energyBarClone.style.top = '53px'; // Position below the top bar
            energyBarClone.style.left = '0';
            energyBarClone.style.right = '0';
            energyBarClone.style.zIndex = '2000';
            energyBarClone.style.boxSizing = 'border-box';
            energyBarClone.style.padding = '6px';
            energyBarClone.style.width = '100%';
            energyBarClone.style.display = 'flex';
            energyBarClone.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            
            // Add to map container
            this.mapContainer.appendChild(energyBarClone);
        }
        
        // Sync energy values
        this.syncEnergyValues(originalEnergyBar, energyBarClone);
    }
    
    /**
     * Clones and shows the bottom menu
     */
    showBottomMenu() {
        const originalBottomMenu = document.querySelector('.bottom-menu');
        if (!originalBottomMenu) return;
        
        // Check if we already have a cloned bottom menu
        let bottomMenuClone = this.mapContainer.querySelector('.bottom-menu-clone');
        
        if (!bottomMenuClone) {
            // Clone the bottom menu
            bottomMenuClone = originalBottomMenu.cloneNode(true);
            bottomMenuClone.className += ' bottom-menu-clone';
            bottomMenuClone.style.position = 'fixed';
            bottomMenuClone.style.bottom = '0';
            bottomMenuClone.style.left = '0';
            bottomMenuClone.style.right = '0';
            bottomMenuClone.style.width = '100%';
            bottomMenuClone.style.zIndex = '2000';
            bottomMenuClone.style.display = 'grid';
            bottomMenuClone.style.gridTemplateColumns = '1fr 1fr 1fr';
            bottomMenuClone.style.backgroundColor = '#fff';
            bottomMenuClone.style.borderTop = '1px solid #e0e0e0';
            bottomMenuClone.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            
            // Modify the map button to be a home button
            const mapBtn = bottomMenuClone.querySelector('#map-btn');
            if (mapBtn) {
                // Style the home button
                mapBtn.style.position = 'absolute';
                mapBtn.style.top = '-20px';
                mapBtn.style.left = '50%';
                mapBtn.style.transform = 'translateX(-50%)';
                mapBtn.style.borderRadius = '50%';
                mapBtn.style.width = '70px';
                mapBtn.style.height = '70px';
                mapBtn.style.backgroundColor = '#fff';
                mapBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                mapBtn.style.display = 'flex';
                mapBtn.style.flexDirection = 'column';
                mapBtn.style.alignItems = 'center';
                mapBtn.style.justifyContent = 'center';
                
                // Update icon and text
                const icon = mapBtn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-home';
                    icon.style.fontSize = '26px';
                    icon.style.color = '#333';
                    icon.style.marginBottom = '2px';
                }
                
                const text = mapBtn.querySelector('span');
                if (text) {
                    text.textContent = 'Home';
                    text.style.fontSize = '12px';
                    text.style.fontWeight = 'bold';
                    text.style.color = '#333';
                }
                
                // Add event listener for the home button
                const self = this;
                mapBtn.addEventListener('click', function() {
                    self.hide();
                });
            }
            
            // Add to map container
            this.mapContainer.appendChild(bottomMenuClone);
        }
    }
    
    /**
     * Syncs resource values between original and clone
     */
    syncResourceValues(original, clone) {
        // Sync wood amount
        const originalWood = original.querySelector('#wood-amount');
        const cloneWood = clone.querySelector('#wood-amount');
        if (originalWood && cloneWood) {
            cloneWood.textContent = originalWood.textContent;
        }
        
        // Sync fish amount
        const originalFish = original.querySelector('#fish-amount');
        const cloneFish = clone.querySelector('#fish-amount');
        if (originalFish && cloneFish) {
            cloneFish.textContent = originalFish.textContent;
        }
        
        // Sync coins amount
        const originalCoins = original.querySelector('#coins-amount');
        const cloneCoins = clone.querySelector('#coins-amount');
        if (originalCoins && cloneCoins) {
            cloneCoins.textContent = originalCoins.textContent;
        }
    }
    
    /**
     * Syncs energy values between original and clone
     */
    syncEnergyValues(original, clone) {
        // Sync energy bar
        const originalBar = original.querySelector('.energy-bar');
        const cloneBar = clone.querySelector('.energy-bar');
        if (originalBar && cloneBar) {
            cloneBar.style.width = originalBar.style.width;
        }
        
        // Sync energy text
        const originalText = original.querySelector('.energy-text');
        const cloneText = clone.querySelector('.energy-text');
        if (originalText && cloneText) {
            cloneText.textContent = originalText.textContent;
        }
    }
    
    /**
     * Hides the map view
     */
    hide() {
        // Hide the map container
        this.mapContainer.style.display = 'none';
        this.mapContainer.style.visibility = 'hidden';
        this.mapContainer.style.zIndex = '-1';
        
        // Show the main game area if it exists
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.style.display = 'flex';
            gameArea.style.visibility = 'visible';
            gameArea.style.position = 'relative';
        }
        
        // Make sure buildings container is visible
        const buildingsContainer = document.querySelector('.buildings-container');
        if (buildingsContainer) {
            buildingsContainer.style.display = 'block';
            buildingsContainer.style.visibility = 'visible';
        }
        
        // Make sure bottom menu in main view is visible
        const bottomMenu = document.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'grid';
            bottomMenu.style.visibility = 'visible';
            bottomMenu.style.position = 'fixed';
        }
        
        // Restore map button icon and text
        const mapBtn = document.querySelector('#map-btn');
        if (mapBtn) {
            const icon = mapBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-map';
            }
            
            const span = mapBtn.querySelector('span');
            if (span) {
                span.textContent = 'Map';
            }
        }
    }
}

// Make MapView globally available
window.MapView = MapView;

// Export for ES modules
export default MapView;
