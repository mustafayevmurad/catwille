/**
 * Компонент для управления картой города
 */
class CityMapManager {
    constructor() {
        // DOM элементы
        this.elements = {
            cityMapContainer: null,
            cityMapCloseBtn: null,
            forestBtn: null,
            pondBtn: null,
            adventuresBtn: null,
            buildingButtons: {}
        };

        // Здания на карте
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

        // Локации сбора ресурсов
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

        // Создаем HTML для карты города
        this.createCityMapHTML();
    }

    /**
     * Создает HTML структуру для карты города
     */
    createCityMapHTML() {
        // Создаем контейнер карты города
        const cityMapContainer = document.createElement('div');
        cityMapContainer.className = 'city-map-container';
        cityMapContainer.id = 'city-map-container';
        cityMapContainer.style.display = 'none';
        cityMapContainer.style.paddingTop = '100px'; // Add padding for fixed top elements
        cityMapContainer.style.boxSizing = 'border-box';
        cityMapContainer.style.height = '100vh';
        cityMapContainer.style.overflowY = 'auto';

        // Клонируем верхнюю панель
        const originalTopBar = document.querySelector('.top-bar');
        const originalEnergyContainer = document.querySelector('.energy-container');
        const originalBottomMenu = document.querySelector('.bottom-menu');

        if (originalTopBar) {
            const topBarClone = originalTopBar.cloneNode(true);
            topBarClone.style.position = 'fixed';
            topBarClone.style.top = '0';
            topBarClone.style.left = '0';
            topBarClone.style.right = '0';
            topBarClone.style.zIndex = '2000';
            topBarClone.style.display = 'flex';
            topBarClone.style.width = 'calc(100% - 12px)';
            
            // Копируем все обработчики событий
            const originalButtons = originalTopBar.querySelectorAll('button, .menu-btn');
            const clonedButtons = topBarClone.querySelectorAll('button, .menu-btn');
            originalButtons.forEach((btn, index) => {
                const clonedBtn = clonedButtons[index];
                const clonedEvents = btn.cloneNode(true);
                clonedBtn.replaceWith(clonedEvents);
            });
            
            cityMapContainer.appendChild(topBarClone);
        }

        if (originalEnergyContainer) {
            const energyContainerClone = originalEnergyContainer.cloneNode(true);
            energyContainerClone.style.position = 'fixed';
            energyContainerClone.style.top = '53px';
            energyContainerClone.style.left = '0';
            energyContainerClone.style.right = '0';
            energyContainerClone.style.width = '100%';
            energyContainerClone.style.zIndex = '2000';
            energyContainerClone.style.display = 'flex';
            energyContainerClone.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            
            // Копируем все элементы энергии
            const originalEnergyBar = originalEnergyContainer.querySelector('.energy-bar');
            const clonedEnergyBar = energyContainerClone.querySelector('.energy-bar');
            if (originalEnergyBar && clonedEnergyBar) {
                clonedEnergyBar.style.width = originalEnergyBar.style.width;
            }
            
            cityMapContainer.appendChild(energyContainerClone);
        }

        // Клонируем нижнюю панель
        if (originalBottomMenu) {
            const bottomMenuClone = originalBottomMenu.cloneNode(true);
            
            
            // Очищаем все существующие обработчики событий
            const newBottomMenu = bottomMenuClone.cloneNode(true);
            
            // Находим и обновляем кнопку Map
            const mapBtn = newBottomMenu.querySelector('#map-btn');
            if (mapBtn) {
                const icon = mapBtn.querySelector('i');
                const span = mapBtn.querySelector('span');
                if (icon) icon.className = 'fas fa-home';
                if (span) span.textContent = 'Home';
                
                // Сохраняем стили для круглой кнопки
                mapBtn.style.position = 'absolute';
                mapBtn.style.top = '-20px';
                mapBtn.style.left = '50%';
                mapBtn.style.transform = 'translateX(-50%)';
                mapBtn.style.borderRadius = '50%';
                mapBtn.style.width = '70px';
                mapBtn.style.height = '70px';
                mapBtn.style.zIndex = '2020';
                mapBtn.style.backgroundColor = '#ffffff';
                mapBtn.style.display = 'flex';
                mapBtn.style.flexDirection = 'column';
                mapBtn.style.alignItems = 'center';
                mapBtn.style.justifyContent = 'center';
                mapBtn.style.boxShadow = '0 3px 6px rgba(0,0,0,0.25)';
                
                if (icon) {
                    icon.style.fontSize = '26px';
                    icon.style.marginBottom = '2px';
                    icon.style.color = '#333';
                }
                
                if (span) {
                    span.style.fontSize = '12px';
                    span.style.fontWeight = 'bold';
                    span.style.color = '#333';
                }
                
                // Simplify the event handling for Home button - create a new button without any event listeners
                const newHomeBtn = document.createElement('button');
                newHomeBtn.id = 'map-btn';
                newHomeBtn.className = mapBtn.className;
                newHomeBtn.innerHTML = mapBtn.innerHTML;
                newHomeBtn.style.cssText = mapBtn.style.cssText;
                
                // Add a direct click handler
                newHomeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Home button clicked in city map');
                    this.hideMap();
                });
                
                // Replace the old button
                mapBtn.parentNode.replaceChild(newHomeBtn, mapBtn);
            }
            
            // Обработчики для других кнопок меню и их позиционирование
            const catsBtn = newBottomMenu.querySelector('#cats-btn');
            if (catsBtn) {
                /*catsBtn.style.gridColumn = '1';
                catsBtn.style.marginLeft = '15px';
                catsBtn.style.marginRight = 'auto';
                catsBtn.style.width = '80px';
                catsBtn.style.borderRadius = '4px';
                catsBtn.style.marginBottom = '10px';*/
                catsBtn.addEventListener('click', () => {
                    if (window.mainScene) {
                        window.mainScene.showCatsPanel();
                    }
                });
            }

            const tasksBtn = newBottomMenu.querySelector('#tasks-btn');
            if (tasksBtn) {
                /*tasksBtn.style.gridColumn = '3';
                tasksBtn.style.marginRight = '15px';
                tasksBtn.style.marginLeft = 'auto';
                tasksBtn.style.width = '80px';
                tasksBtn.style.borderRadius = '4px';
                tasksBtn.style.marginBottom = '10px';*/
                tasksBtn.addEventListener('click', () => {
                    if (window.mainScene) {
                        window.mainScene.showQuestsPanel();
                    }
                });
            }
            
            cityMapContainer.appendChild(newBottomMenu);
        }

        // Заголовок
        const mapHeader = document.createElement('div');
        mapHeader.className = 'city-map-header';
        
        const mapTitle = document.createElement('h2');
        mapTitle.textContent = 'Карта города Catwille';
        mapHeader.appendChild(mapTitle);
        
        const closeButton = document.createElement('button');
        closeButton.className = 'city-map-close-btn';
        closeButton.id = 'city-map-close-btn';
        closeButton.innerHTML = '&times;';
        mapHeader.appendChild(closeButton);
        
        cityMapContainer.appendChild(mapHeader);

        // MOVED RESOURCE LOCATIONS SECTION TO TOP - BEFORE BUILDINGS
        // Контейнер для ресурсных локаций
        const resourcesContainer = document.createElement('div');
        resourcesContainer.className = 'resource-locations-container';
        resourcesContainer.style.marginTop = '20px';
        resourcesContainer.style.marginBottom = '50px'; // Increase space between sections
        resourcesContainer.style.padding = '15px';
        resourcesContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        resourcesContainer.style.borderRadius = '8px';
        resourcesContainer.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1)';
        
        // Добавляем заголовок для ресурсных локаций
        const resourcesHeader = document.createElement('div');
        resourcesHeader.className = 'section-header';
        resourcesHeader.textContent = 'Resource Locations';
        resourcesHeader.style.backgroundColor = '#4CAF50';
        resourcesHeader.style.color = 'white';
        resourcesHeader.style.padding = '10px';
        resourcesHeader.style.borderRadius = '5px';
        resourcesHeader.style.textAlign = 'center';
        resourcesHeader.style.fontWeight = 'bold';
        resourcesHeader.style.fontSize = '18px';
        resourcesHeader.style.marginBottom = '15px';
        resourcesContainer.appendChild(resourcesHeader);
        
        // Создаем контейнер для кнопок локаций
        const resourceButtonsContainer = document.createElement('div');
        resourceButtonsContainer.className = 'resource-buttons-container';
        
        // Enhance the container for buttons
        resourceButtonsContainer.style.display = 'flex';
        resourceButtonsContainer.style.justifyContent = 'center';
        resourceButtonsContainer.style.gap = '20px';
        resourceButtonsContainer.style.padding = '15px 0';
        resourceButtonsContainer.style.flexWrap = 'wrap';
        
        // Добавляем кнопки локаций
        for (const [key, location] of Object.entries(this.resourceLocations)) {
            const locationButton = document.createElement('div');
            locationButton.className = `resource-location-btn ${location.unlocked ? 'unlocked' : 'locked'}`;
            locationButton.id = `${key}-location-btn`;
            
            // Enhanced styling for resource buttons
            locationButton.style.backgroundColor = key === 'forest' ? '#4CAF50' : '#2196F3';
            locationButton.style.color = 'white';
            locationButton.style.padding = '15px 20px';
            locationButton.style.borderRadius = '8px';
            locationButton.style.margin = '10px';
            locationButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            locationButton.style.fontSize = '18px';
            locationButton.style.fontWeight = 'bold';
            locationButton.style.display = 'flex';
            locationButton.style.alignItems = 'center';
            locationButton.style.justifyContent = 'center';
            locationButton.style.minWidth = '120px';
            locationButton.style.cursor = 'pointer';
            locationButton.style.transition = 'transform 0.2s, box-shadow 0.2s';
            
            const locationIcon = document.createElement('i');
            locationIcon.className = `fas fa-${location.icon}`;
            locationIcon.style.fontSize = '24px';
            locationIcon.style.marginRight = '10px';
            
            const locationName = document.createElement('span');
            locationName.textContent = location.name;
            
            locationButton.appendChild(locationIcon);
            locationButton.appendChild(locationName);
            
            resourceButtonsContainer.appendChild(locationButton);
            this.elements[`${key}Btn`] = locationButton;
        }
        
        resourcesContainer.appendChild(resourceButtonsContainer);
        cityMapContainer.appendChild(resourcesContainer);
        
        // Добавляем разделитель
        const divider1 = document.createElement('div');
        divider1.className = 'section-divider';
        divider1.style.margin = '20px 0';
        cityMapContainer.appendChild(divider1);

        // Контейнер для зданий города
        const cityBuildingsContainer = document.createElement('div');
        cityBuildingsContainer.className = 'city-buildings-container';
        cityBuildingsContainer.style.marginTop = '300px'; // Extremely large margin to push buildings far down
        cityBuildingsContainer.style.marginBottom = '30px';
        cityBuildingsContainer.style.padding = '15px';
        cityBuildingsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        cityBuildingsContainer.style.borderRadius = '8px';
        cityBuildingsContainer.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1)';
        
        const cityHeader = document.createElement('div');
        cityHeader.className = 'section-header';
        cityHeader.textContent = 'City Buildings';
        cityHeader.style.backgroundColor = '#673AB7'; // Different color for distinction
        cityHeader.style.color = 'white';
        cityHeader.style.padding = '10px';
        cityHeader.style.borderRadius = '5px';
        cityHeader.style.textAlign = 'center';
        cityHeader.style.fontWeight = 'bold';
        cityHeader.style.fontSize = '18px';
        cityHeader.style.marginBottom = '15px';
        cityBuildingsContainer.appendChild(cityHeader);
        
        // Контейнер для зданий
        const buildingsGrid = document.createElement('div');
        buildingsGrid.className = 'city-buildings-grid';
        buildingsGrid.style.display = 'flex';
        buildingsGrid.style.flexWrap = 'wrap';
        buildingsGrid.style.justifyContent = 'center';
        buildingsGrid.style.gap = '15px';
        
        // Добавляем здания в сетку
        for (const [key, building] of Object.entries(this.buildings)) {
            const buildingElement = document.createElement('div');
            buildingElement.className = `city-building ${building.unlocked ? 'unlocked' : 'locked'}`;
            buildingElement.id = `city-building-${key}`;
            buildingElement.setAttribute('data-building', key);
            
            // Enhanced styling for building elements
            buildingElement.style.backgroundColor = '#f1f1f1';
            buildingElement.style.padding = '15px';
            buildingElement.style.borderRadius = '8px';
            buildingElement.style.margin = '8px';
            buildingElement.style.width = '130px';
            buildingElement.style.height = '100px';
            buildingElement.style.display = 'flex';
            buildingElement.style.flexDirection = 'column';
            buildingElement.style.alignItems = 'center';
            buildingElement.style.justifyContent = 'center';
            buildingElement.style.textAlign = 'center';
            buildingElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            buildingElement.style.transition = 'transform 0.2s, box-shadow 0.2s';
            buildingElement.style.cursor = 'pointer';
            buildingElement.style.position = 'relative';
            
            // Add hover effect
            buildingElement.addEventListener('mouseenter', () => {
                buildingElement.style.transform = 'translateY(-5px)';
                buildingElement.style.boxShadow = '0 6px 12px rgba(0,0,0,0.2)';
            });
            
            buildingElement.addEventListener('mouseleave', () => {
                buildingElement.style.transform = 'translateY(0)';
                buildingElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
            
            const buildingIcon = document.createElement('i');
            buildingIcon.className = `fas fa-${building.icon}`;
            buildingIcon.style.fontSize = '28px';
            buildingIcon.style.marginBottom = '10px';
            buildingIcon.style.color = '#673AB7'; // Match section header color
            
            const buildingName = document.createElement('div');
            buildingName.className = 'building-name';
            buildingName.textContent = building.name;
            buildingName.style.fontWeight = 'bold';
            buildingName.style.fontSize = '14px';
            
            buildingElement.appendChild(buildingIcon);
            buildingElement.appendChild(buildingName);
            
            if (!building.unlocked) {
                const lockIcon = document.createElement('div');
                lockIcon.className = 'lock-icon';
                lockIcon.innerHTML = '<i class="fas fa-lock"></i>';
                lockIcon.style.position = 'absolute';
                lockIcon.style.top = '5px';
                lockIcon.style.right = '5px';
                lockIcon.style.color = '#f44336';
                lockIcon.style.fontSize = '16px';
                buildingElement.appendChild(lockIcon);
                buildingElement.style.opacity = '0.7';
            }
            
            buildingsGrid.appendChild(buildingElement);
            this.elements.buildingButtons[key] = buildingElement;
        }
        
        cityBuildingsContainer.appendChild(buildingsGrid);
        cityMapContainer.appendChild(cityBuildingsContainer);

        // Добавляем разделитель перед приключениями
        const divider2 = document.createElement('div');
        divider2.className = 'section-divider';
        cityMapContainer.appendChild(divider2);

        // Кнопка приключений с заголовком
        const adventuresHeader = document.createElement('div');
        adventuresHeader.className = 'section-header';
        adventuresHeader.textContent = 'Game Activities';
        cityMapContainer.appendChild(adventuresHeader);
        
        const adventuresButton = document.createElement('div');
        adventuresButton.className = 'adventures-btn';
        adventuresButton.id = 'adventures-btn';
        
        const adventuresIcon = document.createElement('i');
        adventuresIcon.className = 'fas fa-compass';
        
        const adventuresText = document.createElement('span');
        adventuresText.textContent = 'Daily Adventures';
        
        adventuresButton.appendChild(adventuresIcon);
        adventuresButton.appendChild(adventuresText);
        
        cityMapContainer.appendChild(adventuresButton);
        this.elements.adventuresBtn = adventuresButton;

        // Добавляем карту в DOM
        document.body.appendChild(cityMapContainer);
        
        // Сохраняем ссылки на элементы
        this.elements.cityMapContainer = cityMapContainer;
        this.elements.cityMapCloseBtn = closeButton;
    }

    /**
     * Инициализирует обработчики событий для элементов карты
     */
    initEventListeners() {
        console.log('CityMapManager.initEventListeners called');
        
        // Обработчик для кнопки закрытия
        if (this.elements.cityMapCloseBtn) {
            this.elements.cityMapCloseBtn.addEventListener('click', () => {
                if (window.mainScene) {
                    window.mainScene.showGameArea();
                } else {
                    this.hideMap();
                }
            });
        }
        
        // Обработчики для зданий
        for (const [key, element] of Object.entries(this.elements.buildingButtons)) {
            element.addEventListener('click', () => {
                if (this.buildings[key].unlocked) {
                    this.handleBuildingClick(key);
                } else {
                    this.showBuildingUnlockInfo(key);
                }
            });
        }
        
        // Обработчики для ресурсных локаций с улучшенными эффектами
        if (this.elements.forestBtn) {
            // Hover effects for forest button
            this.elements.forestBtn.addEventListener('mouseenter', () => {
                this.elements.forestBtn.style.transform = 'translateY(-5px)';
                this.elements.forestBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            });
            this.elements.forestBtn.addEventListener('mouseleave', () => {
                this.elements.forestBtn.style.transform = 'translateY(0)';
                this.elements.forestBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            // Click effect for forest
            this.elements.forestBtn.addEventListener('click', () => {
                this.goToResourceLocation('forest');
            });
        }
        
        if (this.elements.pondBtn) {
            // Hover effects for pond button
            this.elements.pondBtn.addEventListener('mouseenter', () => {
                this.elements.pondBtn.style.transform = 'translateY(-5px)';
                this.elements.pondBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
            });
            this.elements.pondBtn.addEventListener('mouseleave', () => {
                this.elements.pondBtn.style.transform = 'translateY(0)';
                this.elements.pondBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            // Click effect for pond
            this.elements.pondBtn.addEventListener('click', () => {
                this.goToResourceLocation('pond');
            });
        }
        
        // Обработчик для кнопки приключений
        if (this.elements.adventuresBtn) {
            this.elements.adventuresBtn.addEventListener('click', () => {
                this.openAdventures();
            });
        }
        
        // Дополнительные обработчики для клавиш навигации
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.cityMapContainer.style.display !== 'none') {
                if (window.mainScene) {
                    window.mainScene.showGameArea();
                } else {
                    this.hideMap();
                }
            }
        });
    }

    /**
     * Синхронизация отображения ресурсов между клонированной и основной панелями
     */
    syncResourceDisplays() {
        console.log('Syncing resource displays');
        
        try {
            // Обновляем отображение ресурсов
            if (window.resourcesManager && !window.resourcesManager.isUpdating) {
                window.resourcesManager.isUpdating = true;
                
                // Синхронизируем значения ресурсов
                const resources = ['wood', 'fish'];
                resources.forEach(resource => {
                    const originalAmount = document.querySelector(`#${resource}-amount`);
                    const clonedAmount = this.elements.cityMapContainer.querySelector(`#${resource}-amount`);
                    if (originalAmount && clonedAmount) {
                        clonedAmount.textContent = originalAmount.textContent;
                    }
                });
                
                // Синхронизируем энергию
                const originalEnergyBar = document.querySelector('.energy-bar');
                const clonedEnergyBar = this.elements.cityMapContainer.querySelector('.energy-bar');
                if (originalEnergyBar && clonedEnergyBar) {
                    clonedEnergyBar.style.width = originalEnergyBar.style.width;
                }
                
                const originalEnergyText = document.querySelector('.energy-text');
                const clonedEnergyText = this.elements.cityMapContainer.querySelector('.energy-text');
                if (originalEnergyText && clonedEnergyText) {
                    clonedEnergyText.textContent = originalEnergyText.textContent;
                }
                
                const originalEnergyTimer = document.querySelector('.energy-timer');
                const clonedEnergyTimer = this.elements.cityMapContainer.querySelector('.energy-timer');
                if (originalEnergyTimer && clonedEnergyTimer) {
                    clonedEnergyTimer.textContent = originalEnergyTimer.textContent;
                }
                
                setTimeout(() => {
                    window.resourcesManager.isUpdating = false;
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
     * Отображает карту города
     */
    showMap() {
        console.log('CityMapManager.showMap called');
        
        if (!this.elements.cityMapContainer) {
            console.error('City map container not found');
            return;
        }
        
        // First, make sure any region map is hidden
        if (window.regionMapManager) {
            const regionMapContainer = document.getElementById('region-map-container');
            if (regionMapContainer) {
                regionMapContainer.style.display = 'none';
                regionMapContainer.style.visibility = 'hidden';
                regionMapContainer.style.zIndex = '-1';
            }
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
        
        const forest = document.getElementById('forest');
        if (forest) {
            forest.style.display = 'none';
            forest.style.visibility = 'hidden';
        }
        
        const pond = document.getElementById('pond');
        if (pond) {
            pond.style.display = 'none';
            pond.style.visibility = 'hidden';
        }
        
        // Sync resource displays before showing
        this.syncResourceDisplays();
        
        // Make sure bottom menu in city map is visible
        const bottomMenu = this.elements.cityMapContainer.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'flex';
            bottomMenu.style.visibility = 'visible';
            bottomMenu.style.zIndex = '1600';
        }
        
        // Show the city map with proper z-index
        this.elements.cityMapContainer.style.zIndex = '1500';
        this.elements.cityMapContainer.style.display = 'flex';
        this.elements.cityMapContainer.style.visibility = 'visible';
        
        console.log('City map displayed');
    }

    /**
     * Скрывает карту города
     */
    hideMap() {
        console.log('CityMapManager.hideMap called');
        
        if (!this.elements.cityMapContainer) {
            console.error('City map container not found');
            return;
        }
        
        // Hide the city map properly and immediately
        this.elements.cityMapContainer.style.display = 'none';
        this.elements.cityMapContainer.style.visibility = 'hidden';
        this.elements.cityMapContainer.style.zIndex = '-1'; // Move it below other content
        
        // Reset all cloned elements to prevent style issues
        const bottomMenu = this.elements.cityMapContainer.querySelector('.bottom-menu');
        if (bottomMenu) {
            bottomMenu.style.display = 'none';
        }
        
        // Let the main scene handle showing the game area
        if (window.mainScene) {
            console.log('Calling mainScene.showGameArea from cityMap.hideMap');
            window.mainScene.showGameArea();
        } else {
            console.warn('mainScene not found in window, using fallback');
            
            // Fallback if mainScene isn't available
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                gameArea.style.display = 'flex';
                gameArea.style.visibility = 'visible';
            }
            
            // Show buildings, forest, and pond
            const buildings = document.querySelector('.buildings-container');
            if (buildings) buildings.style.display = 'flex';
            
            const forest = document.getElementById('forest');
            if (forest) forest.style.display = 'block';
            
            const pond = document.getElementById('pond');
            if (pond) pond.style.display = 'block';
        }
        
        console.log('City map hidden');
    }

    /**
     * Обработчик клика по зданию
     * @param {string} buildingKey - Ключ здания
     */
    handleBuildingClick(buildingKey) {
        switch(buildingKey) {
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
            case 'townHall':
                this.openTownHall();
                break;
            default:
                console.log(`Здание ${buildingKey} еще не реализовано`);
        }
    }

    /**
     * Показывает информацию об условиях разблокировки здания
     * @param {string} buildingKey - Ключ здания
     */
    showBuildingUnlockInfo(buildingKey) {
        const building = this.buildings[buildingKey];
        if (!building) return;

        // Показываем информационное сообщение
        if (window.mainScene) {
            window.mainScene.showMessage(`Здание "${building.name}" пока заблокировано. Скоро откроется!`);
        }
    }

    /**
     * Переход к локации сбора ресурсов
     * @param {string} locationType - Тип локации (forest, pond)
     */
    goToResourceLocation(locationType) {
        const location = this.resourceLocations[locationType];
        if (!location || !location.unlocked) return;

        // Обрабатываем сбор ресурсов напрямую, без перехода на главный экран
        if (window.resourcesManager) {
            let resource;
            let amount = 1; // Базовое количество ресурса
            
            if (locationType === 'forest') {
                resource = 'wood';
            } else if (locationType === 'pond') {
                resource = 'fish';
            }
            
            if (resource) {
                // Проверяем, достаточно ли энергии
                if (window.mainScene && window.mainScene.playerData.energy > 0) {
                    // Уменьшаем энергию
                    window.mainScene.playerData.energy -= 1;
                    window.mainScene.updateEnergyBar();
                    
                    // Проверяем наличие активных котов для бонусов
                    if (window.catsManager) {
                        const cats = window.catsManager.getActiveCats();
                        cats.forEach(cat => {
                            if (cat.resourceType === resource) {
                                amount += cat.bonus;
                            }
                        });
                    }
                    
                    // Добавляем ресурсы
                    window.resourcesManager.addResource(resource, amount);
                    
                    // Показываем сообщение
                    if (window.mainScene) {
                        window.mainScene.showMessage(`Получено ${amount} ${resource === 'wood' ? 'дерева' : 'рыбы'}`);
                    }
                    
                    // Показываем анимацию сбора (без изменения оригинальной кнопки)
                    this.showResourceCollectionAnimation(locationType);
                } else {
                    // Недостаточно энергии
                    if (window.mainScene) {
                        window.mainScene.showMessage('Недостаточно энергии!');
                    }
                }
            }
        }
    }
    
    /**
     * Показывает анимацию сбора ресурсов
     * @param {string} locationType - Тип локации (forest, pond)
     */
    showResourceCollectionAnimation(locationType) {
        const locationButton = this.elements[`${locationType}Btn`];
        if (!locationButton) return;
        
        // Создаем элемент анимации отдельно от кнопки
        const animElement = document.createElement('div');
        animElement.className = 'resource-animation';
        
        const rect = locationButton.getBoundingClientRect();
        
        // Устанавливаем стили для анимации
        Object.assign(animElement.style, {
            position: 'fixed',
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px',
            zIndex: '1999',
            pointerEvents: 'none',
            backgroundColor: '#f0f7ff',
            borderRadius: '8px',
            opacity: '0.7',
            animation: 'pulse 0.3s ease-in-out'
        });
        
        // Создаем стиль для анимации, если его еще нет
        if (!document.getElementById('resource-animation-style')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'resource-animation-style';
            styleElement.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(0.95); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // Добавляем элемент в DOM и удаляем после завершения анимации
        document.body.appendChild(animElement);
        setTimeout(() => {
            if (animElement.parentNode) {
                document.body.removeChild(animElement);
            }
        }, 300);
    }

    /**
     * Открывает экран приключений
     */
    openAdventures() {
        // Здесь будет реализовано открытие экрана приключений
        if (window.mainScene) {
            window.mainScene.showMessage('Приключения будут доступны в следующем обновлении!');
        }
    }

    // Методы для открытия различных зданий (заглушки для будущей реализации)
    openArena() {
        if (window.mainScene) {
            window.mainScene.showMessage('Арена "Кошачьи состязания" скоро откроется!');
        }
    }

    openHallOfFame() {
        if (window.mainScene) {
            window.mainScene.showMessage('Зал Славы скоро откроется!');
        }
    }

    openAcademy() {
        if (window.mainScene) {
            window.mainScene.showMessage('Академия котов скоро откроется!');
        }
    }

    openPetShop() {
        if (window.mainScene) {
            window.mainScene.showMessage('Магазин "Кошачьи радости" скоро откроется!');
        }
    }

    openWorkshop() {
        if (window.mainScene) {
            window.mainScene.showMessage('Мастерская скоро откроется!');
        }
    }

    openTownHall() {
        if (window.mainScene) {
            window.mainScene.showMessage('Ратуша скоро откроется!');
        }
    }

    /**
     * Обновляет состояние разблокировки зданий
     * @param {Object} userData - Данные пользователя
     */
    updateBuildingsState(userData) {
        if (!userData || !userData.buildings) return;
        
        // Проверяем уровни зданий и разблокируем соответствующие здания на карте
        // В будущем здесь будет логика разблокировки зданий
        this.updateDisplay();
    }

    /**
     * Обновляет отображение карты города
     */
    updateDisplay() {
        // Обновляем отображение зданий
        for (const [key, building] of Object.entries(this.buildings)) {
            const element = this.elements.buildingButtons[key];
            if (element) {
                if (building.unlocked) {
                    element.classList.add('unlocked');
                    element.classList.remove('locked');
                    
                    // Удаляем иконку замка, если она есть
                    const lockIcon = element.querySelector('.lock-icon');
                    if (lockIcon) {
                        element.removeChild(lockIcon);
                    }
                } else {
                    element.classList.add('locked');
                    element.classList.remove('unlocked');
                    
                    // Добавляем иконку замка, если ее нет
                    if (!element.querySelector('.lock-icon')) {
                        const lockIcon = document.createElement('div');
                        lockIcon.className = 'lock-icon';
                        lockIcon.innerHTML = '<i class="fas fa-lock"></i>';
                        element.appendChild(lockIcon);
                    }
                }
            }
        }
        
        // Обновляем отображение ресурсных локаций
        for (const [key, location] of Object.entries(this.resourceLocations)) {
            const element = this.elements[`${key}Btn`];
            if (element) {
                if (location.unlocked) {
                    element.classList.add('unlocked');
                    element.classList.remove('locked');
                } else {
                    element.classList.add('locked');
                    element.classList.remove('unlocked');
                }
            }
        }
    }

    /**
     * Reset resource element dimensions using the original values
     * This is a helper method to restore resource elements to their original size
     * after they have been modified (e.g. by the drag handler)
     */
    resetResourceElementDimensions() {
        if (!window.originalResourceDimensions) {
            return;
        }
        
        // Forest resource
        this.resetSingleResourceDimensions('forest');
        
        // Pond resource
        this.resetSingleResourceDimensions('pond');
    }
    
    /**
     * Reset dimensions for a single resource element
     * @param {string} resourceKey - The resource key (forest, pond)
     */
    resetSingleResourceDimensions(resourceKey) {
        const dimensions = window.originalResourceDimensions[resourceKey];
        if (!dimensions) return;
        
        // Get the wrapper and element
        const wrapper = document.getElementById(`${resourceKey}-wrapper`);
        const element = document.getElementById(resourceKey);
        
        if (wrapper && dimensions.wrapper) {
            // Reset wrapper dimensions
            Object.keys(dimensions.wrapper).forEach(prop => {
                wrapper.style[prop] = dimensions.wrapper[prop];
            });
        }
        
        if (element && dimensions.element) {
            // Reset element dimensions
            Object.keys(dimensions.element).forEach(prop => {
                element.style[prop] = dimensions.element[prop];
            });
        }
    }
} 