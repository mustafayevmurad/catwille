/**
 * Fishing Mini-Game Component
 * Mini-game for fishing resources
 */
class FishingMiniGame {
    constructor() {
        // DOM elements
        this.elements = {
            container: null,
            pond: null,
            resourceCounter: null,
            closeButton: null,
            tapCounter: null,
            progressBar: null,
            energyDisplay: null,
            regenerationTimer: null
        };

        // Game state
        this.state = {
            // Current pond health (max 30)
            pondHealth: 30,
            // Maximum pond health
            maxPondHealth: 30,
            // Number of taps since last resource gain
            tapCount: 0,
            // Number of taps required to get 1 fish
            tapsPerFish: 3,
            // Last regeneration timestamp
            lastRegenTime: Date.now(),
            // Regeneration interval in milliseconds (1 hour)
            regenInterval: 60 * 60 * 1000,
            // Amount to regenerate per interval
            regenAmount: 30,
            // Last pond state (0: healthy, 1: depleting, 2: depleted)
            pondState: 0
        };

        // Load saved state if available
        this.loadState();
        
        // Create game HTML
        this.createGameHTML();
    }

    /**
     * Load saved game state
     */
    loadState() {
        const savedState = localStorage.getItem('fishingMiniGame');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                this.state = {...this.state, ...parsedState};
                
                // Ensure pondHealth is never below 0
                if (this.state.pondHealth < 0) {
                    this.state.pondHealth = 0;
                }
                
                // Check if regeneration should occur
                this.checkRegeneration();
            } catch (error) {
                console.error('Error loading fishing mini-game state:', error);
                // Set default health if there was an error
                this.state.pondHealth = this.state.maxPondHealth;
            }
        } else {
            // First time using the mini-game, set full health
            this.state.pondHealth = this.state.maxPondHealth;
            this.state.lastRegenTime = Date.now();
        }
    }

    /**
     * Save current game state
     */
    saveState() {
        try {
            // Update last regeneration time
            this.state.lastRegenTime = Date.now();
            localStorage.setItem('fishingMiniGame', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving fishing mini-game state:', error);
        }
    }

    /**
     * Check and apply pond regeneration if needed
     */
    checkRegeneration() {
        const now = Date.now();
        const timeSinceRegen = now - this.state.lastRegenTime;
        
        if (timeSinceRegen >= this.state.regenInterval) {
            // Calculate how many regeneration periods have passed
            const periods = Math.floor(timeSinceRegen / this.state.regenInterval);
            const regenerationAmount = periods * this.state.regenAmount;
            
            if (regenerationAmount > 0) {
                // Apply regeneration
                const newHealth = Math.min(
                    this.state.maxPondHealth, 
                    this.state.pondHealth + regenerationAmount
                );
                
                console.log(`Pond regenerating: ${this.state.pondHealth} → ${newHealth}`);
                this.state.pondHealth = newHealth;
                
                // Update the last regeneration time based on used periods
                this.state.lastRegenTime = now - (timeSinceRegen % this.state.regenInterval);
                
                // Update the pond state
                this.updatePondState();
                this.updateProgressBar();
            }
        }
    }

    /**
     * Create game HTML structure
     */
    createGameHTML() {
        // Create container
        const container = document.createElement('div');
        container.className = 'fishing-minigame-container';
        container.id = 'fishing-mini-game';
        
        // Create mini-game wrapper
        const miniGame = document.createElement('div');
        miniGame.className = 'fishing-minigame';
        
        // Create resources display
        const resources = document.createElement('div');
        resources.className = 'fishing-resources';
        
        // Fish resource (left side)
        const fishContainer = document.createElement('div');
        fishContainer.className = 'fishing-resource';
        
        const fishIcon = document.createElement('i');
        fishIcon.className = 'fas fa-fish';
        
        const resourceCounter = document.createElement('span');
        resourceCounter.id = 'fish-counter';
        resourceCounter.textContent = 'Fish: 0/0';
        
        fishContainer.appendChild(fishIcon);
        fishContainer.appendChild(resourceCounter);
        
        // Energy display (right side)
        const energyContainer = document.createElement('div');
        energyContainer.className = 'fishing-resource';
        
        const energyIcon = document.createElement('i');
        energyIcon.className = 'fas fa-bolt';
        
        const energyCounter = document.createElement('span');
        energyCounter.id = 'energy-counter';
        energyCounter.textContent = 'Energy: 0/0';
        
        energyContainer.appendChild(energyIcon);
        energyContainer.appendChild(energyCounter);
        
        resources.appendChild(fishContainer);
        resources.appendChild(energyContainer);
        
        this.elements.resourceCounter = resourceCounter;
        this.elements.energyDisplay = energyCounter;
        
        // Create pond health display
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'pond-health-container';
        
        const healthLabel = document.createElement('div');
        healthLabel.className = 'pond-health-label';
        healthLabel.textContent = 'Pond Health: 0/0';
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'pond-health-bar';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'pond-health-progress';
        
        progressContainer.appendChild(progressBar);
        healthDisplay.appendChild(healthLabel);
        healthDisplay.appendChild(progressContainer);
        this.elements.progressBar = progressBar;
        
        // Create regeneration timer
        const regenDisplay = document.createElement('div');
        regenDisplay.className = 'regen-display';
        regenDisplay.textContent = 'Regenerates fully in: 1:00:00';
        healthDisplay.appendChild(regenDisplay);
        this.elements.regenerationTimer = regenDisplay;
        
        // Create game area
        const gameArea = document.createElement('div');
        gameArea.className = 'fishing-game-area';
        
        // Create fishing background
        const background = document.createElement('div');
        background.className = 'fishing-background';
        gameArea.appendChild(background);
        
        // Create pond
        const pond = document.createElement('div');
        pond.className = 'fishing-pond';
        
        // Create tap counter
        const tapCounter = document.createElement('div');
        tapCounter.className = 'fishing-count';
        tapCounter.textContent = '0/3';
        
        gameArea.appendChild(pond);
        gameArea.appendChild(tapCounter);
        
        this.elements.pond = pond;
        this.elements.tapCounter = tapCounter;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'fishing-close-btn';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        
        // Assemble all components
        miniGame.appendChild(resources);
        miniGame.appendChild(healthDisplay);
        miniGame.appendChild(gameArea);
        miniGame.appendChild(closeButton);
        
        container.appendChild(miniGame);
        document.body.appendChild(container);
        
        this.elements.container = container;
        this.elements.closeButton = closeButton;
        
        // Initialize event listeners
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Close button click
        this.elements.closeButton.addEventListener('click', () => {
            this.close();
        });
        
        // Pond click
        this.elements.pond.addEventListener('click', (e) => {
            this.handlePondTap(e);
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && 
                this.elements.container && 
                this.elements.container.style.display !== 'none') {
                this.close();
            }
        });
    }

    /**
     * Handle pond tap
     */
    handlePondTap(e) {
        // Don't process if pond is depleted
        if (this.state.pondHealth <= 0) {
            this.showMessage('The pond is depleted. Please wait for regeneration.');
            return;
        }
        
        // Check if player has enough energy
        if (!this.checkAndSpendEnergy()) {
            this.showMessage('Not enough energy!');
            return;
        }
        
        // Create ripple effect
        this.createRippleEffect(e);
        
        // Increment tap count
        this.state.tapCount++;
        
        // Update tap counter display
        this.elements.tapCounter.textContent = `${this.state.tapCount}/${this.state.tapsPerFish}`;
        
        // Check if we should give a resource
        if (this.state.tapCount >= this.state.tapsPerFish) {
            // Reset tap count
            this.state.tapCount = 0;
            
            // Decrease pond health
            this.state.pondHealth--;
            
            // Update UI
            this.updatePondState();
            this.updateProgressBar();
            this.updatePondHealthDisplay();
            
            // Add fish resource
            this.addFishResource(1);
            
            // Save game state
            this.saveState();
        }
    }

    /**
     * Create ripple effect
     * @param {MouseEvent} e - Mouse event
     */
    createRippleEffect(e) {
        const rect = this.elements.pond.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'fishing-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.elements.pond.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }

    /**
     * Update pond state based on health
     */
    updatePondState() {
        const percentage = (this.state.pondHealth / this.state.maxPondHealth) * 100;
        
        if (percentage <= 20) {
            this.elements.pond.style.opacity = '0.5';
        } else if (percentage <= 50) {
            this.elements.pond.style.opacity = '0.7';
        } else {
            this.elements.pond.style.opacity = '1';
        }
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const percentage = (this.state.pondHealth / this.state.maxPondHealth) * 100;
        
        // Update progress bar width
        this.elements.progressBar.style.width = `${percentage}%`;
        
        // Update health label
        const healthLabel = this.elements.container.querySelector('.pond-health-label');
        if (healthLabel) {
            healthLabel.textContent = `Pond Health: ${this.state.pondHealth}/${this.state.maxPondHealth}`;
        }
        
        // Change color based on health
        if (percentage <= 20) {
            this.elements.progressBar.style.backgroundColor = '#f44336'; // Red when low
        } else if (percentage <= 50) {
            this.elements.progressBar.style.backgroundColor = '#ff9800'; // Orange when medium
        } else {
            this.elements.progressBar.style.backgroundColor = '#4a90e2'; // Blue when high
        }
    }

    /**
     * Update pond health display
     */
    updatePondHealthDisplay() {
        // Update progress bar
        this.updateProgressBar();
        
        // Update regeneration timer
        this.updateRegenTimer();
        
        // Add visual indicator of current health
        const healthLabel = this.elements.container.querySelector('.pond-health-label');
        if (healthLabel) {
            healthLabel.textContent = `Pond Health: ${this.state.pondHealth}/${this.state.maxPondHealth}`;
        }
    }

    /**
     * Update regeneration timer
     */
    updateRegenTimer() {
        const now = Date.now();
        const nextRegenTime = this.state.lastRegenTime + this.state.regenInterval;
        const timeRemaining = Math.max(0, nextRegenTime - now);
        
        // Convert to hours, minutes, seconds
        const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
        const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
        
        // Format time
        const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update display
        if (this.state.pondHealth < this.state.maxPondHealth) {
            this.elements.regenerationTimer.textContent = `Regenerates fully in: ${formattedTime}`;
            this.elements.regenerationTimer.style.display = 'block';
        } else {
            this.elements.regenerationTimer.style.display = 'none';
        }
    }

    /**
     * Check and spend energy
     * @returns {boolean} Whether the operation was successful
     */
    checkAndSpendEnergy() {
        const energyCost = 1; // Cost per click
        
        // Try to use ResourcesManager first
        if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.energy) {
            const energyResource = window.resourcesManager.resources.energy;
            
            // Check if player has enough energy
            if (energyResource.amount < energyCost) {
                return false;
            }
            
            // Spend energy
            energyResource.amount -= energyCost;
            
            // Update energy display in main game
            window.resourcesManager.updateDisplay();
            
            // Update energy display in mini-game
            this.updateEnergyDisplay();
            
            return true;
        }
        
        // Fallback to DOM elements
        const energyText = document.getElementById('energy-text');
        if (energyText) {
            const [currentEnergy, energyLimit] = energyText.textContent.split('/');
            
            if (parseInt(currentEnergy) < energyCost) {
                return false;
            }
            
            const newEnergy = parseInt(currentEnergy) - energyCost;
            energyText.textContent = `${newEnergy}/${energyLimit}`;
            
            // Update energy display in mini-game
            this.updateEnergyDisplay();
            
            return true;
        }
        
        return false;
    }

    /**
     * Add fish resource
     * @param {number} amount - Amount to add
     */
    addFishResource(amount) {
        try {
            // Try to use ResourcesManager first
            if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.fish) {
                const fishResource = window.resourcesManager.resources.fish;
                
                // Check if storage is full
                if (fishResource.amount >= fishResource.limit) {
                    this.showMessage('Хранилище рыбы заполнено!');
                    return;
                }
                
                // Add fish
                fishResource.amount += amount;
                
                // Update display in main game
                window.resourcesManager.updateDisplay();
                
                // Update display in mini-game
                this.updateResourceDisplay();
                
                // Show success message
                this.showMessage(`+${amount} Fish`);
                
                return;
            }
            
            // Fallback to DOM elements
            const fishAmountElement = document.getElementById('fish-amount');
            if (fishAmountElement) {
                const currentAmount = parseInt(fishAmountElement.textContent);
                fishAmountElement.textContent = (currentAmount + amount).toString();
                
                // Update display in mini-game
                this.updateResourceDisplay();
                
                // Show success message
                this.showMessage(`+${amount} Fish`);
            }
        } catch (error) {
            console.error('Error adding fish resource:', error);
        }
    }

    /**
     * Update resource display
     */
    updateResourceDisplay() {
        try {
            // Try to use ResourcesManager first
            if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.fish) {
                const fishAmount = Math.floor(window.resourcesManager.resources.fish.amount);
                const fishLimit = window.resourcesManager.resources.fish.limit;
                this.elements.resourceCounter.textContent = `Fish: ${fishAmount}/${fishLimit}`;
                return;
            }
            
            // Fallback to DOM elements
            const fishAmountElement = document.getElementById('fish-amount');
            const fishLimitElement = document.getElementById('fish-limit');
            
            if (fishAmountElement && fishLimitElement) {
                const fishAmount = fishAmountElement.textContent || '0';
                const fishLimit = fishLimitElement.textContent || '50';
                this.elements.resourceCounter.textContent = `Fish: ${fishAmount}/${fishLimit}`;
            }
        } catch (error) {
            console.error('Error updating resource display:', error);
        }
    }

    /**
     * Update energy display
     */
    updateEnergyDisplay() {
        try {
            // Try to use ResourcesManager first
            if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.energy) {
                const energy = window.resourcesManager.resources.energy;
                const currentEnergy = Math.floor(energy.amount);
                const energyLimit = energy.limit;
                
                if (this.elements.energyDisplay) {
                    this.elements.energyDisplay.textContent = `Energy: ${currentEnergy}/${energyLimit}`;
                    
                    // Update color based on energy level
                    if (currentEnergy <= energyLimit * 0.2) {
                        this.elements.energyDisplay.style.color = '#f44336'; // Red when low energy
                    } else {
                        this.elements.energyDisplay.style.color = '#5a3921'; // Default color
                    }
                }
                return;
            }
            
            // Fallback to DOM elements
            const energyText = document.getElementById('energy-text');
            if (energyText) {
                const [currentEnergy, energyLimit] = energyText.textContent.split('/');
                
                if (this.elements.energyDisplay) {
                    this.elements.energyDisplay.textContent = `Energy: ${currentEnergy}/${energyLimit}`;
                    
                    // Update color based on energy level
                    if (parseInt(currentEnergy) <= parseInt(energyLimit) * 0.2) {
                        this.elements.energyDisplay.style.color = '#f44336'; // Red when low energy
                    } else {
                        this.elements.energyDisplay.style.color = '#5a3921'; // Default color
                    }
                }
            }
        } catch (error) {
            console.error('Error updating energy display:', error);
        }
    }

    /**
     * Show message
     * @param {string} message - Message to show
     */
    showMessage(message) {
        // Use the main scene's message system if available
        if (window.mainScene && window.mainScene.showMessage) {
            window.mainScene.showMessage(message);
            return;
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'fishing-animation';
        messageElement.textContent = message;
        
        // Add to game area
        this.elements.pond.appendChild(messageElement);
        
        // Remove after animation
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 1000);
    }

    /**
     * Start game update loop
     */
    startUpdateLoop() {
        this.updateIntervalId = setInterval(() => {
            this.updateRegenTimer();
            this.checkRegeneration();
            this.updateEnergyDisplay();
        }, 1000);
    }

    /**
     * Stop game update loop
     */
    stopUpdateLoop() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
    }

    /**
     * Open the mini-game
     */
    open() {
        console.log(`Opening fishing mini-game. Current pond health: ${this.state.pondHealth}/${this.state.maxPondHealth}`);
        
        // Check regeneration before opening
        this.checkRegeneration();
        
        // Update displays
        this.updateResourceDisplay();
        this.updateEnergyDisplay();
        this.updateProgressBar();
        this.updatePondState();
        
        // Reset tap counter
        this.state.tapCount = 0;
        this.elements.tapCounter.textContent = `${this.state.tapCount}/${this.state.tapsPerFish}`;
        
        // Show game container
        this.elements.container.style.display = 'flex';
        
        // Start update loop
        this.startUpdateLoop();
    }

    /**
     * Close the mini-game
     */
    close() {
        // Save state
        this.saveState();
        
        // Hide container
        this.elements.container.style.display = 'none';
        
        // Stop update loop
        this.stopUpdateLoop();
        
        // Update resources in main scene if available
        if (window.resourcesManager && window.resourcesManager.updateResourceDisplay) {
            window.resourcesManager.updateResourceDisplay();
        }
        
        // Return to previous screen
        if (window.mainScene) {
            window.mainScene.showGameArea();
        }
    }
}

// Make FishingMiniGame globally available
window.FishingMiniGame = FishingMiniGame; 