/**
 * Component for managing the region map
 */
class RegionMapManager {
    constructor() {
        // DOM elements
        this.elements = {
            regionMapContainer: null,
            regionMapCloseBtn: null,
            regionButtons: {}
        };

        // Timer for energy sync
        this.energySyncTimer = null;

        // Buildings in the city
        this.buildings = {
            arena: { 
                name: 'Cat Arena', 
                icon: 'medal',
                unlocked: true,
                description: 'Арена для соревнований и тренировок.' 
            },
            hallOfFame: { 
                name: 'Hall of Fame', 
                icon: 'crown',
                unlocked: true,
                description: 'Зал славы с историей города и достижениями.' 
            },
            academy: { 
                name: 'Cat Academy', 
                icon: 'graduation-cap',
                unlocked: true,
                description: 'Академия для обучения и улучшения ваших котов.' 
            },
            petShop: { 
                name: 'Cat Joys Shop', 
                icon: 'gift',
                unlocked: true,
                description: 'Магазин предметов и улучшений для котов.' 
            },
            workshop: { 
                name: 'Workshop', 
                icon: 'tools',
                unlocked: true,
                description: 'Мастерская для крафта и улучшения предметов.' 
            },
            townHall: { 
                name: 'Town Hall', 
                icon: 'landmark',
                unlocked: true,
                description: 'Центр управления городом и квесты от мэра.' 
            }
        };

        // Resource locations
        this.resourceLocations = {
            forest: {
                name: 'Forest',
                icon: 'tree',
                unlocked: true,
                description: 'Лес для сбора древесины.'
            },
            pond: {
                name: 'Pond',
                icon: 'water',
                unlocked: true,
                description: 'Пруд для ловли рыбы.'
            }
        };

        // Store original dimensions for resource locations when first created
        this.storeOriginalDimensions();

        // Create HTML for the region map
        this.createRegionMapHTML();
    }

    /**
     * Store original dimensions for resource locations when first created
     * This will serve as our "source of truth" for original dimensions
     */
    storeOriginalDimensions() {
        // If dimensions are already stored, don't overwrite them
        if (window.originalResourceDimensions) {
            return;
        }
        
        window.originalResourceDimensions = {
            forest: {
                wrapper: {
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px'
                },
                element: {
                    width: '100%',
                    height: '120px',
                    minHeight: '120px',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: 'scale(0.8)'
                }
            },
            pond: {
                wrapper: {
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px'
                },
                element: {
                    width: '100%',
                    height: '120px',
                    minHeight: '120px',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: 'scale(0.8)'
                }
            }
        };
        
        console.log('Original resource dimensions stored');
    }

    /**
     * Creates HTML structure for the region map
     */
    createRegionMapHTML() {
        // Create region map container
        const regionMapContainer = document.createElement('div');
        regionMapContainer.className = 'region-map-container';
        regionMapContainer.id = 'region-map-container';
        regionMapContainer.style.display = 'none';
        regionMapContainer.style.visibility = 'hidden';
        regionMapContainer.style.zIndex = '-1';
        regionMapContainer.style.height = '100%';
        regionMapContainer.style.width = '100%';
        regionMapContainer.style.position = 'fixed';
        regionMapContainer.style.top = '0';
        regionMapContainer.style.left = '0';
        regionMapContainer.style.display = 'flex';
        regionMapContainer.style.flexDirection = 'column';
        regionMapContainer.style.backgroundColor = '#f2f2f2';
        regionMapContainer.style.backgroundImage = "none";
        regionMapContainer.style.overflow = 'auto';
        regionMapContainer.style.paddingTop = '0';
        regionMapContainer.style.paddingBottom = '60px';
        regionMapContainer.style.boxSizing = 'border-box';
        
        // Clone top bar
        const originalTopBar = document.querySelector('.top-bar');
        if (originalTopBar) {
            const topBarClone = originalTopBar.cloneNode(true);
            
            // Apply styles
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
            
            // Copy resource amounts
            const originalWoodAmount = originalTopBar.querySelector('#wood-amount');
            const clonedWoodAmount = topBarClone.querySelector('#wood-amount');
            if (originalWoodAmount && clonedWoodAmount) {
                clonedWoodAmount.textContent = originalWoodAmount.textContent;
            }
            
            const originalFishAmount = originalTopBar.querySelector('#fish-amount');
            const clonedFishAmount = topBarClone.querySelector('#fish-amount');
            if (originalFishAmount && clonedFishAmount) {
                clonedFishAmount.textContent = originalFishAmount.textContent;
            }
            
            const originalStarsAmount = originalTopBar.querySelector('#stars-amount');
            const clonedStarsAmount = topBarClone.querySelector('#stars-amount');
            if (originalStarsAmount && clonedStarsAmount) {
                clonedStarsAmount.textContent = originalStarsAmount.textContent;
            }
            
            const originalCoinsAmount = originalTopBar.querySelector('#coins-amount');
            const clonedCoinsAmount = topBarClone.querySelector('#coins-amount');
            if (originalCoinsAmount && clonedCoinsAmount) {
                clonedCoinsAmount.textContent = originalCoinsAmount.textContent;
            }
            
            regionMapContainer.appendChild(topBarClone);
        }

        // Clone energy container
        const originalEnergyContainer = document.querySelector('.energy-container');
        if (originalEnergyContainer) {
            const energyContainerClone = originalEnergyContainer.cloneNode(true);
            energyContainerClone.style.position = 'fixed';
            energyContainerClone.style.top = originalTopBar ? originalTopBar.offsetHeight + 'px' : '60px';
            energyContainerClone.style.left = '0';
            energyContainerClone.style.right = '0';
            energyContainerClone.style.zIndex = '2000';
            energyContainerClone.style.boxSizing = 'border-box';
            energyContainerClone.style.padding = '6px';
            regionMapContainer.appendChild(energyContainerClone);
        }

        // Create main content container that will scroll
        const scrollableContent = document.createElement('div');
        scrollableContent.className = 'scrollable-content';
        scrollableContent.style.paddingTop = '100px';
        scrollableContent.style.paddingBottom = '70px';
        scrollableContent.style.overflowY = 'auto';
        scrollableContent.style.height = '100%';
        scrollableContent.style.boxSizing = 'border-box';
        scrollableContent.style.display = 'flex';
        scrollableContent.style.flexDirection = 'column';
        scrollableContent.style.gap = '15px';
        
        // Resource Zones Section
        const resourceZonesSection = document.createElement('div');
        resourceZonesSection.className = 'resource-zones-section';
        resourceZonesSection.style.margin = '0 15px 15px 15px';
        
        // Resource Zones Header
        const resourceZonesHeader = document.createElement('div');
        resourceZonesHeader.textContent = 'Зоны добычи ресурсов';
        resourceZonesHeader.style.backgroundColor = '#5ea95c';
        resourceZonesHeader.style.color = '#fff';
        resourceZonesHeader.style.padding = '10px';
        resourceZonesHeader.style.borderRadius = '10px';
        resourceZonesHeader.style.textAlign = 'center';
        resourceZonesHeader.style.fontSize = '18px';
        resourceZonesHeader.style.fontWeight = 'bold';
        resourceZonesHeader.style.margin = '0 0 10px 0';
        resourceZonesSection.appendChild(resourceZonesHeader);
        
        // Resource Zones Container
        const resourceZonesContainer = document.createElement('div');
        resourceZonesContainer.className = 'resource-zones-container';
        resourceZonesContainer.style.display = 'flex';
        resourceZonesContainer.style.justifyContent = 'space-between';
        resourceZonesContainer.style.flexWrap = 'wrap';
        resourceZonesContainer.style.gap = '10px';
        resourceZonesSection.appendChild(resourceZonesContainer);
        
        // Forest Zone
        const forestZone = document.createElement('div');
        forestZone.className = 'resource-zone forest-zone';
        forestZone.style.width = 'calc(50% - 5px)';
        forestZone.style.height = '120px';
        forestZone.style.backgroundColor = '#e0e0e0';
        forestZone.style.borderRadius = '10px';
        forestZone.style.display = 'flex';
        forestZone.style.justifyContent = 'center';
        forestZone.style.alignItems = 'center';
        forestZone.style.position = 'relative';
        forestZone.style.cursor = 'pointer';
        
        const forestLabel = document.createElement('div');
        forestLabel.textContent = 'Forest';
        forestLabel.style.backgroundColor = '#333';
        forestLabel.style.color = '#fff';
        forestLabel.style.padding = '4px 8px';
        forestLabel.style.borderRadius = '4px';
        forestLabel.style.position = 'absolute';
        forestLabel.style.bottom = '10px';
        forestLabel.style.fontSize = '14px';
        forestZone.appendChild(forestLabel);
        
        forestZone.addEventListener('click', () => this.handleResourceLocationClick('forest'));
        resourceZonesContainer.appendChild(forestZone);
        this.elements.regionButtons.forest = forestZone;
        
        // Pond Zone
        const pondZone = document.createElement('div');
        pondZone.className = 'resource-zone pond-zone';
        pondZone.style.width = 'calc(50% - 5px)';
        pondZone.style.height = '120px';
        pondZone.style.backgroundColor = '#e0e0e0';
        pondZone.style.borderRadius = '10px';
        pondZone.style.display = 'flex';
        pondZone.style.justifyContent = 'center';
        pondZone.style.alignItems = 'center';
        pondZone.style.position = 'relative';
        pondZone.style.cursor = 'pointer';
        
        const pondLabel = document.createElement('div');
        pondLabel.textContent = 'Pond';
        pondLabel.style.backgroundColor = '#333';
        pondLabel.style.color = '#fff';
        pondLabel.style.padding = '4px 8px';
        pondLabel.style.borderRadius = '4px';
        pondLabel.style.position = 'absolute';
        pondLabel.style.bottom = '10px';
        pondLabel.style.fontSize = '14px';
        pondZone.appendChild(pondLabel);
        
        pondZone.addEventListener('click', () => this.handleResourceLocationClick('pond'));
        resourceZonesContainer.appendChild(pondZone);
        this.elements.regionButtons.pond = pondZone;
        
        // City Buildings Section
        const cityBuildingsSection = document.createElement('div');
        cityBuildingsSection.className = 'city-buildings-section';
        cityBuildingsSection.style.margin = '0 15px 15px 15px';
        
        // City Buildings Header
        const cityBuildingsHeader = document.createElement('div');
        cityBuildingsHeader.textContent = 'Городские постройки';
        cityBuildingsHeader.style.backgroundColor = '#5ea95c';
        cityBuildingsHeader.style.color = '#fff';
        cityBuildingsHeader.style.padding = '10px';
        cityBuildingsHeader.style.borderRadius = '10px';
        cityBuildingsHeader.style.textAlign = 'center';
        cityBuildingsHeader.style.fontSize = '18px';
        cityBuildingsHeader.style.fontWeight = 'bold';
        cityBuildingsHeader.style.margin = '0 0 10px 0';
        cityBuildingsSection.appendChild(cityBuildingsHeader);
        
        // City Buildings Container
        const cityBuildingsContainer = document.createElement('div');
        cityBuildingsContainer.className = 'city-buildings-container';
        cityBuildingsContainer.style.display = 'flex';
        cityBuildingsContainer.style.flexDirection = 'column';
        cityBuildingsContainer.style.gap = '10px';
        cityBuildingsSection.appendChild(cityBuildingsContainer);
        
        // Cat Arena (highlighted)
        const catArenaContainer = document.createElement('div');
        catArenaContainer.className = 'cat-arena-container';
        catArenaContainer.style.borderRadius = '10px';
        catArenaContainer.style.border = '2px solid #8e44ad';
        catArenaContainer.style.padding = '0';
        catArenaContainer.style.overflow = 'hidden';
        catArenaContainer.style.marginBottom = '10px';
        cityBuildingsContainer.appendChild(catArenaContainer);
        
        const catArena = document.createElement('div');
        catArena.className = 'city-building cat-arena';
        catArena.style.width = '100%';
        catArena.style.height = '150px';
        catArena.style.backgroundColor = '#e0e0e0';
        catArena.style.borderRadius = '8px';
        catArena.style.display = 'flex';
        catArena.style.justifyContent = 'center';
        catArena.style.alignItems = 'center';
        catArena.style.position = 'relative';
        catArena.style.cursor = 'pointer';
        
        const catArenaLabel = document.createElement('div');
        catArenaLabel.textContent = 'Cat Arena';
        catArenaLabel.style.backgroundColor = '#333';
        catArenaLabel.style.color = '#fff';
        catArenaLabel.style.padding = '4px 8px';
        catArenaLabel.style.borderRadius = '4px';
        catArenaLabel.style.position = 'absolute';
        catArenaLabel.style.bottom = '10px';
        catArenaLabel.style.fontSize = '14px';
        catArena.appendChild(catArenaLabel);
        
        catArena.addEventListener('click', () => this.handleBuildingClick('arena'));
        catArenaContainer.appendChild(catArena);
        this.elements.regionButtons.arena = catArena;
        
        // Row 1: Hall of Fame and Cat Joys Shop
        const buildingsRow1 = document.createElement('div');
        buildingsRow1.className = 'buildings-row';
        buildingsRow1.style.display = 'flex';
        buildingsRow1.style.justifyContent = 'space-between';
        buildingsRow1.style.gap = '10px';
        buildingsRow1.style.marginBottom = '10px';
        cityBuildingsContainer.appendChild(buildingsRow1);
        
        // Hall of Fame
        const hallOfFame = document.createElement('div');
        hallOfFame.className = 'city-building hall-of-fame';
        hallOfFame.style.width = 'calc(50% - 5px)';
        hallOfFame.style.height = '120px';
        hallOfFame.style.backgroundColor = '#e0e0e0';
        hallOfFame.style.borderRadius = '10px';
        hallOfFame.style.display = 'flex';
        hallOfFame.style.justifyContent = 'center';
        hallOfFame.style.alignItems = 'center';
        hallOfFame.style.position = 'relative';
        hallOfFame.style.cursor = 'pointer';
        
        const hallOfFameLabel = document.createElement('div');
        hallOfFameLabel.textContent = 'Hall of Fame';
        hallOfFameLabel.style.backgroundColor = '#333';
        hallOfFameLabel.style.color = '#fff';
        hallOfFameLabel.style.padding = '4px 8px';
        hallOfFameLabel.style.borderRadius = '4px';
        hallOfFameLabel.style.position = 'absolute';
        hallOfFameLabel.style.bottom = '10px';
        hallOfFameLabel.style.fontSize = '14px';
        hallOfFame.appendChild(hallOfFameLabel);
        
        hallOfFame.addEventListener('click', () => this.handleBuildingClick('hallOfFame'));
        buildingsRow1.appendChild(hallOfFame);
        this.elements.regionButtons.hallOfFame = hallOfFame;
        
        // Cat Joys Shop
        const catJoysShop = document.createElement('div');
        catJoysShop.className = 'city-building cat-joys-shop';
        catJoysShop.style.width = 'calc(50% - 5px)';
        catJoysShop.style.height = '120px';
        catJoysShop.style.backgroundColor = '#e0e0e0';
        catJoysShop.style.borderRadius = '10px';
        catJoysShop.style.display = 'flex';
        catJoysShop.style.justifyContent = 'center';
        catJoysShop.style.alignItems = 'center';
        catJoysShop.style.position = 'relative';
        catJoysShop.style.cursor = 'pointer';
        
        const catJoysShopLabel = document.createElement('div');
        catJoysShopLabel.textContent = 'Cat Joys Shop';
        catJoysShopLabel.style.backgroundColor = '#333';
        catJoysShopLabel.style.color = '#fff';
        catJoysShopLabel.style.padding = '4px 8px';
        catJoysShopLabel.style.borderRadius = '4px';
        catJoysShopLabel.style.position = 'absolute';
        catJoysShopLabel.style.bottom = '10px';
        catJoysShopLabel.style.fontSize = '14px';
        catJoysShop.appendChild(catJoysShopLabel);
        
        catJoysShop.addEventListener('click', () => this.handleBuildingClick('petShop'));
        buildingsRow1.appendChild(catJoysShop);
        this.elements.regionButtons.petShop = catJoysShop;
        
        // Row 2: Workshop and Cat Academy
        const buildingsRow2 = document.createElement('div');
        buildingsRow2.className = 'buildings-row';
        buildingsRow2.style.display = 'flex';
        buildingsRow2.style.justifyContent = 'space-between';
        buildingsRow2.style.gap = '10px';
        cityBuildingsContainer.appendChild(buildingsRow2);
        
        // Workshop
        const workshop = document.createElement('div');
        workshop.className = 'city-building workshop';
        workshop.style.width = 'calc(50% - 5px)';
        workshop.style.height = '120px';
        workshop.style.backgroundColor = '#e0e0e0';
        workshop.style.borderRadius = '10px';
        workshop.style.display = 'flex';
        workshop.style.justifyContent = 'center';
        workshop.style.alignItems = 'center';
        workshop.style.position = 'relative';
        workshop.style.cursor = 'pointer';
        
        const workshopLabel = document.createElement('div');
        workshopLabel.textContent = 'Workshop';
        workshopLabel.style.backgroundColor = '#333';
        workshopLabel.style.color = '#fff';
        workshopLabel.style.padding = '4px 8px';
        workshopLabel.style.borderRadius = '4px';
        workshopLabel.style.position = 'absolute';
        workshopLabel.style.bottom = '10px';
        workshopLabel.style.fontSize = '14px';
        workshop.appendChild(workshopLabel);
        
        workshop.addEventListener('click', () => this.handleBuildingClick('workshop'));
        buildingsRow2.appendChild(workshop);
        this.elements.regionButtons.workshop = workshop;
        
        // Cat Academy
        const catAcademy = document.createElement('div');
        catAcademy.className = 'city-building cat-academy';
        catAcademy.style.width = 'calc(50% - 5px)';
        catAcademy.style.height = '120px';
        catAcademy.style.backgroundColor = '#e0e0e0';
        catAcademy.style.borderRadius = '10px';
        catAcademy.style.display = 'flex';
        catAcademy.style.justifyContent = 'center';
        catAcademy.style.alignItems = 'center';
        catAcademy.style.position = 'relative';
        catAcademy.style.cursor = 'pointer';
        
        const catAcademyLabel = document.createElement('div');
        catAcademyLabel.textContent = 'Cat Academy';
        catAcademyLabel.style.backgroundColor = '#333';
        catAcademyLabel.style.color = '#fff';
        catAcademyLabel.style.padding = '4px 8px';
        catAcademyLabel.style.borderRadius = '4px';
        catAcademyLabel.style.position = 'absolute';
        catAcademyLabel.style.bottom = '10px';
        catAcademyLabel.style.fontSize = '14px';
        catAcademy.appendChild(catAcademyLabel);
        
        catAcademy.addEventListener('click', () => this.handleBuildingClick('academy'));
        buildingsRow2.appendChild(catAcademy);
        this.elements.regionButtons.academy = catAcademy;
        
        // Add sections to scrollable content
        scrollableContent.appendChild(resourceZonesSection);
        scrollableContent.appendChild(cityBuildingsSection);
        regionMapContainer.appendChild(scrollableContent);
        
        // Clone bottom menu
        const originalBottomMenu = document.querySelector('.bottom-menu');
        if (originalBottomMenu) {
            const bottomMenuClone = originalBottomMenu.cloneNode(true);
            bottomMenuClone.style.position = 'fixed';
            bottomMenuClone.style.bottom = '0';
            bottomMenuClone.style.left = '0';
            bottomMenuClone.style.right = '0';
            bottomMenuClone.style.zIndex = '2000';
            
            // Set up Home button
            const mapBtn = bottomMenuClone.querySelector('#map-btn');
            if (mapBtn) {
                // Replace with a new button to avoid event listener conflicts
                const newMapBtn = document.createElement('button');
                newMapBtn.id = 'map-btn';
                newMapBtn.className = mapBtn.className;
                newMapBtn.innerHTML = mapBtn.innerHTML;
                
                // Style the button
                newMapBtn.style.position = 'absolute';
                newMapBtn.style.top = '-20px';
                newMapBtn.style.left = '50%';
                newMapBtn.style.transform = 'translateX(-50%)';
                newMapBtn.style.borderRadius = '50%';
                newMapBtn.style.width = '70px';
                newMapBtn.style.height = '70px';
                newMapBtn.style.backgroundColor = '#fff';
                newMapBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                newMapBtn.style.display = 'flex';
                newMapBtn.style.flexDirection = 'column';
                newMapBtn.style.alignItems = 'center';
                newMapBtn.style.justifyContent = 'center';
                
                // Update to show Home icon
                const icon = newMapBtn.querySelector('i');
                const span = newMapBtn.querySelector('span');
                if (icon) {
                    icon.className = 'fas fa-home';
                    icon.style.fontSize = '26px';
                    icon.style.color = '#333';
                }
                if (span) {
                    span.textContent = 'Home';
                    span.style.fontSize = '12px';
                    span.style.fontWeight = 'bold';
                    span.style.color = '#333';
                }
                
                // Add event listener
                newMapBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.hideMap();
                });
                
                // Replace original button
                mapBtn.parentNode.replaceChild(newMapBtn, mapBtn);
            }
            
            regionMapContainer.appendChild(bottomMenuClone);
        }
        
        // Add to document
        document.body.appendChild(regionMapContainer);
        this.elements.regionMapContainer = regionMapContainer;
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Building and resource location click handlers
        for (const [key, element] of Object.entries(this.elements.regionButtons)) {
            element.addEventListener('click', () => {
                console.log(`Clicked on ${key}`);
                // Check if it's a building or resource location
                if (this.buildings[key]) {
                    if (this.buildings[key].unlocked) {
                        this.handleBuildingClick(key);
                    } else {
                        this.showBuildingUnlockInfo(key);
                    }
                } else if (this.resourceLocations[key]) {
                    if (this.resourceLocations[key].unlocked) {
                        this.handleResourceLocationClick(key);
                    } else {
                        this.showResourceLocationUnlockInfo(key);
                    }
                }
            });
        }
        
        // Additional keyboard navigation handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.regionMapContainer && 
                this.elements.regionMapContainer.style.display !== 'none') {
                if (window.mainScene) {
                    window.mainScene.showGameArea();
                } else {
                    this.hideMap();
                }
            }
        });
    }

    /**
     * Sync resource displays between cloned and main panels
     */
    syncResourceDisplays() {
        try {
            if (window.resourcesManager && !window.resourcesManager.isUpdating) {
                window.resourcesManager.isUpdating = true;
                
                // Sync resource values
                const resources = ['wood', 'fish'];
                resources.forEach(resource => {
                    const originalAmount = document.querySelector(`#${resource}-amount`);
                    const clonedAmount = this.elements.regionMapContainer?.querySelector(`#${resource}-amount`);
                    if (originalAmount && clonedAmount) {
                        clonedAmount.textContent = originalAmount.textContent;
                    }
                });
                
                // Sync energy
                const originalEnergyBar = document.querySelector('.energy-bar');
                const clonedEnergyBar = this.elements.regionMapContainer?.querySelector('.energy-bar');
                if (originalEnergyBar && clonedEnergyBar) {
                    clonedEnergyBar.style.width = originalEnergyBar.style.width;
                }
                
                const originalEnergyText = document.querySelector('.energy-text');
                const clonedEnergyText = this.elements.regionMapContainer?.querySelector('.energy-text');
                if (originalEnergyText && clonedEnergyText) {
                    clonedEnergyText.textContent = originalEnergyText.textContent;
                }
                
                const originalEnergyTimer = document.querySelector('.energy-timer');
                const clonedEnergyTimer = this.elements.regionMapContainer?.querySelector('.energy-timer');
                if (originalEnergyTimer && clonedEnergyTimer) {
                    clonedEnergyTimer.textContent = originalEnergyTimer.textContent;
                    clonedEnergyTimer.style.display = originalEnergyTimer.style.display;
                    clonedEnergyTimer.style.visibility = originalEnergyTimer.style.visibility;
                    clonedEnergyTimer.style.opacity = originalEnergyTimer.style.opacity;
                }
                
                setTimeout(() => {
                    if (window.resourcesManager) {
                        window.resourcesManager.isUpdating = false;
                    }
                }, 0);
            }
        } catch (error) {
            console.error('Error syncing resource displays:', error);
            if (window.resourcesManager) {
                window.resourcesManager.isUpdating = false;
            }
        }
    }

    /**
     * Show the region map
     */
    showMap() {
        console.log('RegionMapManager.showMap called');
        
        if (!this.elements.regionMapContainer) {
            this.createRegionMapHTML();
        }
        
        // First, make sure any city map is hidden
        if (window.cityMapManager) {
            const cityMapContainer = document.getElementById('city-map-container');
            if (cityMapContainer) {
                cityMapContainer.style.display = 'none';
                cityMapContainer.style.visibility = 'hidden';
                cityMapContainer.style.zIndex = '-1';
            }
        }
        
        // Reset all region map resources to original dimensions
        this.resetResourceElementDimensions();
        
        // Restore original forest and pond styles if they exist
        const forest = document.getElementById('forest');
        const pond = document.getElementById('pond');
        
        if (forest && window.originalForestStyles) {
            console.log('Restoring original forest styles');
            Object.assign(forest.style, window.originalForestStyles);
        }
        
        if (pond && window.originalPondStyles) {
            console.log('Restoring original pond styles');
            Object.assign(pond.style, window.originalPondStyles);
        }
        
        // Hide the main game area completely
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.style.display = 'none';
            gameArea.style.visibility = 'hidden';
        }
        
        // Hide buildings, forest, and pond
        const buildings = document.querySelector('.buildings-container');
        if (buildings) {
            buildings.style.display = 'none';
            buildings.style.visibility = 'hidden';
        }
        
        if (forest) {
            forest.style.display = 'none';
            forest.style.visibility = 'hidden';
        }
        
        if (pond) {
            pond.style.display = 'none';
            pond.style.visibility = 'hidden';
        }
        
        // Sync resource displays before showing
        this.syncResourceDisplays();
        
        // Start energy sync timer
        this.startEnergySyncTimer();
        
        // Make sure bottom menu in region map is visible
        const bottomMenu = this.elements.regionMapContainer.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'grid';
            bottomMenu.style.visibility = 'visible';
            bottomMenu.style.zIndex = '2000';
        }
        
        // Make sure top bar is visible
        const topBar = this.elements.regionMapContainer.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'flex';
            topBar.style.visibility = 'visible';
            topBar.style.zIndex = '2000';
        }
        
        // Make sure energy container is visible
        const energyContainer = this.elements.regionMapContainer.querySelector('.energy-container');
        if (energyContainer) {
            energyContainer.style.display = 'flex';
            energyContainer.style.visibility = 'visible';
            energyContainer.style.zIndex = '2000';
        }
        
        // Show the region map with proper z-index
        this.elements.regionMapContainer.style.zIndex = '1500';
        this.elements.regionMapContainer.style.display = 'flex';
        this.elements.regionMapContainer.style.visibility = 'visible';
        
        // Scroll to top with negative offset to show background behind top panel
        const scrollableContent = this.elements.regionMapContainer.querySelector('.scrollable-content');
        if (scrollableContent) {
            scrollableContent.scrollTop = 0;
            
            // Небольшая задержка, чтобы убедиться что карта видна перед прокруткой
            setTimeout(() => {
                scrollableContent.scrollTop = 0;
            }, 50);
        }
        
        console.log('Region map displayed');
    }

    /**
     * Reset all resource element dimensions to their original fixed sizes
     */
    resetResourceElementDimensions() {
        console.log('Resetting resource element dimensions');
        
        // Reset forest element
        const forestElement = this.elements.regionButtons['forest'];
        const forestWrapper = forestElement?.parentElement;
        
        if (forestWrapper && window.originalResourceDimensions?.forest) {
            console.log('Applying original forest dimensions');
            // Apply saved dimensions to wrapper
            Object.assign(forestWrapper.style, window.originalResourceDimensions.forest.wrapper);
            
            // Apply saved dimensions to element
            Object.assign(forestElement.style, window.originalResourceDimensions.forest.element);
        }
        
        // Reset pond element
        const pondElement = this.elements.regionButtons['pond'];
        const pondWrapper = pondElement?.parentElement;
        
        if (pondWrapper && window.originalResourceDimensions?.pond) {
            console.log('Applying original pond dimensions');
            // Apply saved dimensions to wrapper
            Object.assign(pondWrapper.style, window.originalResourceDimensions.pond.wrapper);
            
            // Apply saved dimensions to element
            Object.assign(pondElement.style, window.originalResourceDimensions.pond.element);
        }
        
        // If we saved specific styles from the region map, restore those as well
        if (forestWrapper && window.originalRegionMapForest) {
            console.log('Restoring specific region map forest styles');
            Object.assign(forestWrapper.style, window.originalRegionMapForest.wrapper);
            Object.assign(forestElement.style, window.originalRegionMapForest.element);
        }
        
        if (pondWrapper && window.originalRegionMapPond) {
            console.log('Restoring specific region map pond styles');
            Object.assign(pondWrapper.style, window.originalRegionMapPond.wrapper);
            Object.assign(pondElement.style, window.originalRegionMapPond.element);
        }
        
        // Принудительно применяем трансформацию независимо от сохраненных стилей
        if (forestElement) {
            forestElement.style.transform = 'scale(0.8)';
            console.log('Explicitly setting forest transform to scale(0.8)');
        }
        
        if (pondElement) {
            pondElement.style.transform = 'scale(0.8)';
            console.log('Explicitly setting pond transform to scale(0.8)');
        }
    }

    /**
     * Hide the region map
     */
    hideMap() {
        console.log('RegionMapManager.hideMap called');
        
        if (!this.elements.regionMapContainer) {
            console.error('Region map container not found');
            return;
        }
        
        // Stop energy sync timer
        this.stopEnergySyncTimer();
        
        // Store original styles before hiding
        const forest = document.getElementById('forest');
        const pond = document.getElementById('pond');
        const forestStyles = forest ? {
            display: forest.style.display,
            width: forest.style.width,
            height: forest.style.height
        } : null;
        const pondStyles = pond ? {
            display: pond.style.display,
            width: pond.style.width,
            height: pond.style.height
        } : null;
        
        // Hide the region map properly and immediately
        this.elements.regionMapContainer.style.display = 'none';
        this.elements.regionMapContainer.style.visibility = 'hidden';
        this.elements.regionMapContainer.style.zIndex = '-1'; // Move it below other content
        
        // Reset all cloned elements to prevent style issues
        const bottomMenu = this.elements.regionMapContainer.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'none';
            bottomMenu.style.visibility = 'hidden';
        }
        
        const topBar = this.elements.regionMapContainer.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'none';
            topBar.style.visibility = 'hidden';
        }
        
        const energyContainer = this.elements.regionMapContainer.querySelector('.energy-container');
        if (energyContainer) {
            energyContainer.style.display = 'none';
            energyContainer.style.visibility = 'hidden';
        }
        
        // Let the main scene handle showing the game area
        if (window.mainScene) {
            console.log('Calling mainScene.showGameArea from regionMap.hideMap');
            window.mainScene.showGameArea();
            
            // Restore original styles after showing game area
            if (forest && forestStyles) {
                Object.assign(forest.style, forestStyles);
            }
            if (pond && pondStyles) {
                Object.assign(pond.style, pondStyles);
            }
        } else {
            console.warn('mainScene not found in window, using fallback');
            
            // Fallback if mainScene isn't available
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                gameArea.style.display = 'flex';
                gameArea.style.visibility = 'visible';
            }
            
            // Show buildings, forest, and pond with original styles
            const buildings = document.querySelector('.buildings-container');
            if (buildings) buildings.style.display = 'flex';
            
            if (forest) {
                forest.style.display = 'block';
                if (forestStyles) {
                    Object.assign(forest.style, forestStyles);
                }
            }
            
            if (pond) {
                pond.style.display = 'block';
                if (pondStyles) {
                    Object.assign(pond.style, pondStyles);
                }
            }
        }
        
        console.log('Region map hidden');
    }

    /**
     * Hide the region map without redirecting to game area
     * Used for opening mini-games
     */
    hideMapWithoutRedirect() {
        console.log('RegionMapManager.hideMapWithoutRedirect called');
        
        if (!this.elements.regionMapContainer) {
            console.error('Region map container not found');
            return;
        }
        
        // Hide the region map properly and immediately
        this.elements.regionMapContainer.style.display = 'none';
        this.elements.regionMapContainer.style.visibility = 'hidden';
        this.elements.regionMapContainer.style.zIndex = '-1'; // Move it below other content
        
        // Reset all cloned elements to prevent style issues
        const bottomMenu = this.elements.regionMapContainer.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'none';
            bottomMenu.style.visibility = 'hidden';
        }
        
        const topBar = this.elements.regionMapContainer.querySelector('.top-bar');
        if (topBar) {
            topBar.style.display = 'none';
            topBar.style.visibility = 'hidden';
        }
        
        const energyContainer = this.elements.regionMapContainer.querySelector('.energy-container');
        if (energyContainer) {
            energyContainer.style.display = 'none';
            energyContainer.style.visibility = 'hidden';
        }
        
        console.log('Region map hidden without redirect');
    }

    /**
     * Handle building click
     * @param {string} buildingKey - Building key
     */
    handleBuildingClick(buildingKey) {
        console.log(`Opening ${buildingKey}`);
        
        // Call the appropriate method based on building type
        switch (buildingKey) {
            case 'arena':
                this.openArena();
                break;
            case 'hallOfFame':
                this.openHallOfFame();
                break;
            case 'academy':
                this.openAcademy();
                break;
            case 'petShop':
                this.openPetShop();
                break;
            case 'workshop':
                this.openWorkshop();
                break;
            default:
                console.warn(`Unknown building type: ${buildingKey}`);
                break;
        }
    }

    /**
     * Handle resource location click
     * @param {string} locationKey - Resource location key
     */
    handleResourceLocationClick(locationKey) {
        console.log(`Opening resource location: ${locationKey}`);
        
        // Call the appropriate method based on location type
        switch (locationKey) {
            case 'forest':
                this.openForestMiniGame();
                break;
            case 'pond':
                this.openPondMiniGame();
                break;
            default:
                console.warn(`Unknown resource location: ${locationKey}`);
                break;
        }
    }

    /**
     * Show building unlock information
     * @param {string} buildingKey - Building key
     */
    showBuildingUnlockInfo(buildingKey) {
        if (window.mainScene) {
            window.mainScene.showMessage('This building is locked! Complete quests to unlock it.');
        }
    }

    /**
     * Show resource location unlock information
     * @param {string} locationKey - Resource location key
     */
    showResourceLocationUnlockInfo(locationKey) {
        if (window.mainScene) {
            window.mainScene.showMessage('This resource location is locked! Complete quests to unlock it.');
        }
    }

    /**
     * Open the Forest mini-game
     */
    openForestMiniGame() {
        console.log('Opening Forest mini-game');
        
        // Set flag that mini-game was opened from region map
        window.wasOpenedFromRegionMap = true;
        
        // Store the original forest resource location from region map
        const forestElement = this.elements.regionButtons['forest'];
        const forestWrapper = forestElement?.parentElement;
        
        if (forestWrapper) {
            console.log('Storing forestWrapper dimensions:', forestWrapper.style.width);
            // Save original region map forest styles
            window.originalRegionMapForest = {
                wrapper: { 
                    width: forestWrapper.style.width,
                    minWidth: forestWrapper.style.minWidth,
                    maxWidth: forestWrapper.style.maxWidth
                },
                element: {
                    width: forestElement.style.width,
                    height: forestElement.style.height,
                    minHeight: forestElement.style.minHeight,
                    backgroundSize: forestElement.style.backgroundSize,
                    backgroundPosition: forestElement.style.backgroundPosition,
                    backgroundRepeat: forestElement.style.backgroundRepeat,
                    transform: forestElement.style.transform
                }
            };
        }
        
        // Save original main forest styles
        const forest = document.getElementById('forest');
        if (forest) {
            console.log('Storing forest styles:', forest.style.width, forest.style.height);
            window.originalForestStyles = {
                display: forest.style.display,
                width: forest.style.width,
                height: forest.style.height,
                backgroundImage: forest.style.backgroundImage,
                backgroundColor: forest.style.backgroundColor,
                backgroundSize: forest.style.backgroundSize
            };
        }
        
        // Check if the Forest mini-game manager exists
        if (!window.forestMiniGame) {
            // Create new Forest mini-game manager
            window.forestMiniGame = new ForestMiniGame();
        }
        
        // Hide the region map before opening mini-game
        this.elements.regionMapContainer.style.display = 'none';
        this.elements.regionMapContainer.style.visibility = 'hidden';
        this.elements.regionMapContainer.style.zIndex = '-1';
        
        // Open the Forest mini-game
        window.forestMiniGame.open();
    }

    /**
     * Open the Pond mini-game
     */
    openPondMiniGame() {
        console.log('Opening Pond mini-game');
        
        // Set flag that mini-game was opened from region map
        window.wasOpenedFromRegionMap = true;
        
        // Store the original pond resource location from region map
        const pondElement = this.elements.regionButtons['pond'];
        const pondWrapper = pondElement?.parentElement;
        
        if (pondWrapper) {
            console.log('Storing pondWrapper dimensions:', pondWrapper.style.width);
            // Save original region map pond styles
            window.originalRegionMapPond = {
                wrapper: { 
                    width: pondWrapper.style.width,
                    minWidth: pondWrapper.style.minWidth,
                    maxWidth: pondWrapper.style.maxWidth
                },
                element: {
                    width: pondElement.style.width,
                    height: pondElement.style.height,
                    minHeight: pondElement.style.minHeight,
                    backgroundSize: pondElement.style.backgroundSize,
                    backgroundPosition: pondElement.style.backgroundPosition,
                    backgroundRepeat: pondElement.style.backgroundRepeat,
                    transform: pondElement.style.transform
                }
            };
        }
        
        // Save original main pond styles
        const pond = document.getElementById('pond');
        if (pond) {
            console.log('Storing pond styles:', pond.style.width, pond.style.height);
            window.originalPondStyles = {
                display: pond.style.display,
                width: pond.style.width,
                height: pond.style.height,
                backgroundImage: pond.style.backgroundImage,
                backgroundColor: pond.style.backgroundColor,
                backgroundSize: pond.style.backgroundSize
            };
        }
        
        // Check if the Fishing mini-game manager exists
        if (!window.fishingMiniGame) {
            // Create new Fishing mini-game manager
            window.fishingMiniGame = new FishingMiniGame();
        }
        
        // Hide the region map before opening mini-game
        this.elements.regionMapContainer.style.display = 'none';
        this.elements.regionMapContainer.style.visibility = 'hidden';
        this.elements.regionMapContainer.style.zIndex = '-1';
        
        // Open the Fishing mini-game
        window.fishingMiniGame.open();
    }

    /**
     * Open Arena region
     */
    openArena() {
        if (window.mainScene) {
            // Check if the Arena mini-game manager exists
            if (!window.arenaMiniGame) {
                // Create new Arena mini-game manager
                window.arenaMiniGame = new ArenaMiniGame();
            }
            
            // Hide the region map before opening mini-game
            this.hideMapWithoutRedirect();
            
            // Open the Arena mini-game
            window.arenaMiniGame.open();
        }
    }

    /**
     * Open Hall of Fame region
     */
    openHallOfFame() {
        console.log("Opening Hall of Fame");
        if (window.hallOfFameManager) {
            console.log("hallOfFameManager found, opening modal");
            window.hallOfFameManager.openModal();
        } else {
            console.error("hallOfFameManager not found!");
            window.mainScene.showMessage("Ошибка: Зал Славы недоступен");
        }
    }

    /**
     * Open Academy region
     */
    openAcademy() {
        if (window.mainScene) {
            window.mainScene.showMessage('Cat Academy will be available in the next update!');
        }
    }

    /**
     * Open Pet Shop region
     */
    openPetShop() {
        if (window.mainScene) {
            window.mainScene.showMessage('Cat Joys Shop will be available in the next update!');
        }
    }

    /**
     * Open Workshop region
     */
    openWorkshop() {
        if (window.mainScene) {
            window.mainScene.showMessage('Workshop will be available in the next update!');
        }
    }

    /**
     * Start the energy sync timer
     */
    startEnergySyncTimer() {
        // Clear any existing timer
        this.stopEnergySyncTimer();
        
        // Start new timer that updates every second
        this.energySyncTimer = setInterval(() => {
            this.syncEnergyTimer();
        }, 1000);
    }

    /**
     * Stop the energy sync timer
     */
    stopEnergySyncTimer() {
        if (this.energySyncTimer) {
            clearInterval(this.energySyncTimer);
            this.energySyncTimer = null;
        }
    }

    /**
     * Sync the energy timer display
     */
    syncEnergyTimer() {
        const originalEnergyTimer = document.querySelector('.energy-timer');
        const clonedEnergyTimer = this.elements.regionMapContainer?.querySelector('.energy-timer');
        
        if (originalEnergyTimer && clonedEnergyTimer) {
            clonedEnergyTimer.textContent = originalEnergyTimer.textContent;
            clonedEnergyTimer.style.display = originalEnergyTimer.style.display;
            clonedEnergyTimer.style.visibility = originalEnergyTimer.style.visibility;
            clonedEnergyTimer.style.opacity = originalEnergyTimer.style.opacity;
        }
    }
}

// Make RegionMapManager globally available
window.RegionMapManager = RegionMapManager; 