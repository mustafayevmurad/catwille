/**
 * Forest Mini-Game Component
 * Mini-game for harvesting wood resources
 */
class ForestMiniGame {
    constructor() {
        // DOM elements
        this.elements = {
            container: null,
            tree: null,
            treeImage: null,
            resourceCounter: null,
            closeButton: null,
            tapCounter: null,
            progressBar: null,
            energyDisplay: null,
            regenerationTimer: null
        };

        // Game state
        this.state = {
            // Current tree health (max 30)
            treeHealth: 30,
            // Maximum tree health
            maxTreeHealth: 30,
            // Number of taps since last resource gain
            tapCount: 0,
            // Number of taps required to get 1 wood
            tapsPerWood: 3,
            // Last regeneration timestamp
            lastRegenTime: Date.now(),
            // Regeneration interval in milliseconds (1 hour)
            regenInterval: 60 * 60 * 1000,
            // Amount to regenerate per interval
            regenAmount: 30,
            // Last tree state (0: healthy, 1: depleting, 2: depleted)
            treeState: 0
        };

        // Tree state images
        this.treeImages = [
            'assets/images/minigames/tree_healthy.svg',   // Healthy tree
            'assets/images/minigames/tree_depleting.svg', // Depleting tree
            'assets/images/minigames/tree_depleted.svg'   // Depleted tree
        ];

        // Load saved state if available
        this.loadState();
        
        // Create game HTML
        this.createGameHTML();
    }

    /**
     * Load saved game state
     */
    loadState() {
        const savedState = localStorage.getItem('forestMiniGame');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                this.state = {...this.state, ...parsedState};
                
                // Ensure treeHealth is never below 0
                if (this.state.treeHealth < 0) {
                    this.state.treeHealth = 0;
                }
                
                // Check if regeneration should occur
                this.checkRegeneration();
            } catch (error) {
                console.error('Error loading forest mini-game state:', error);
                // Set default health if there was an error
                this.state.treeHealth = this.state.maxTreeHealth;
            }
        } else {
            // First time using the mini-game, set full health
            this.state.treeHealth = this.state.maxTreeHealth;
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
            localStorage.setItem('forestMiniGame', JSON.stringify(this.state));
        } catch (error) {
            console.error('Error saving forest mini-game state:', error);
        }
    }

    /**
     * Check and apply tree regeneration if needed
     */
    checkRegeneration() {
        const now = Date.now();
        const timeSinceRegen = now - this.state.lastRegenTime;
        
        if (timeSinceRegen >= this.state.regenInterval) {
            // Calculate how many regeneration periods have passed
            const periods = Math.floor(timeSinceRegen / this.state.regenInterval);
            const regenerationAmount = periods * this.state.regenAmount;
            
            if (regenerationAmount > 0) {
                // Apply regeneration by adding to current health, not replacing it
                const newHealth = Math.min(
                    this.state.maxTreeHealth, 
                    this.state.treeHealth + regenerationAmount
                );
                
                console.log(`Tree regenerating: ${this.state.treeHealth} → ${newHealth}`);
                this.state.treeHealth = newHealth;
                
                // Update the last regeneration time based on used periods
                this.state.lastRegenTime = now - (timeSinceRegen % this.state.regenInterval);
                
                // Update the tree state
                this.updateTreeState();
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
        container.className = 'forest-minigame-container';
        container.id = 'forest-mini-game';
        
        // Create mini-game wrapper
        const miniGame = document.createElement('div');
        miniGame.className = 'forest-minigame';
        
        // Create resources display
        const resources = document.createElement('div');
        resources.className = 'forest-resources';
        
        // Wood resource (left side)
        const woodContainer = document.createElement('div');
        woodContainer.className = 'forest-resource';
        
        const woodIcon = document.createElement('i');
        woodIcon.className = 'fas fa-tree';
        
        const resourceCounter = document.createElement('span');
        resourceCounter.id = 'wood-counter';
        resourceCounter.textContent = 'Wood: 0/0';
        
        woodContainer.appendChild(woodIcon);
        woodContainer.appendChild(resourceCounter);
        
        // Energy display (right side)
        const energyContainer = document.createElement('div');
        energyContainer.className = 'forest-resource';
        
        const energyIcon = document.createElement('i');
        energyIcon.className = 'fas fa-bolt';
        
        const energyCounter = document.createElement('span');
        energyCounter.id = 'energy-counter';
        energyCounter.textContent = 'Energy: 0/0';
        
        energyContainer.appendChild(energyIcon);
        energyContainer.appendChild(energyCounter);
        
        resources.appendChild(woodContainer);
        resources.appendChild(energyContainer);
        
        this.elements.resourceCounter = resourceCounter;
        this.elements.energyDisplay = energyCounter;
        
        // Create tree health display
        const healthDisplay = document.createElement('div');
        healthDisplay.className = 'tree-health-container';
        
        const healthLabel = document.createElement('div');
        healthLabel.className = 'tree-health-label';
        healthLabel.textContent = 'Tree Health: 0/0';
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'tree-health-bar';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'tree-health-progress';
        
        progressContainer.appendChild(progressBar);
        healthDisplay.appendChild(healthLabel);
        healthDisplay.appendChild(progressContainer);
        this.elements.progressBar = progressBar;
        
        // Create regeneration timer (can be added to health display)
        const regenDisplay = document.createElement('div');
        regenDisplay.className = 'regen-display';
        regenDisplay.textContent = 'Regenerates fully in: 1:00:00';
        healthDisplay.appendChild(regenDisplay);
        this.elements.regenerationTimer = regenDisplay;
        
        // Create game area
        const gameArea = document.createElement('div');
        gameArea.className = 'forest-game-area';
        
        // Create forest background
        const background = document.createElement('div');
        background.className = 'forest-background';
        gameArea.appendChild(background);
        
        // Create tree
        const tree = document.createElement('div');
        tree.className = 'forest-tree';
        
        // Create tap counter
        const tapCounter = document.createElement('div');
        tapCounter.className = 'forest-count';
        tapCounter.textContent = '0/3';
        
        gameArea.appendChild(tree);
        gameArea.appendChild(tapCounter);
        
        this.elements.tree = tree;
        this.elements.tapCounter = tapCounter;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'forest-close-btn';
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
        
        // Tree click
        this.elements.tree.addEventListener('click', () => {
            this.handleTreeTap();
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
     * Create tap effect animation
     * @param {MouseEvent} e - Mouse event
     */
    createTapEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'tap-effect';
        effect.style.position = 'absolute';
        effect.style.width = '30px';
        effect.style.height = '30px';
        effect.style.borderRadius = '50%';
        effect.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '5';
        effect.style.left = `${e.clientX}px`;
        effect.style.top = `${e.clientY}px`;
        effect.style.animation = 'tapEffect 0.5s ease-out';
        
        this.elements.tree.appendChild(effect);
        
        // Remove after animation
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
        
        // Add animation styles if not already in document
        if (!document.getElementById('tap-effect-style')) {
            const style = document.createElement('style');
            style.id = 'tap-effect-style';
            style.textContent = `
                @keyframes tapEffect {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Handle tree tap
     */
    handleTreeTap() {
        // Don't process if tree is depleted
        if (this.state.treeHealth <= 0) {
            this.showMessage('The tree is depleted. Please wait for regeneration.');
            return;
        }
        
        // Check if player has enough energy
        if (!this.checkAndSpendEnergy()) {
            this.showMessage('Not enough energy!');
            return;
        }
        
        // Increment tap count
        this.state.tapCount++;
        
        // Update tap counter display
        this.elements.tapCounter.textContent = `${this.state.tapCount} / ${this.state.tapsPerWood}`;
        
        // Check if we should give a resource
        if (this.state.tapCount >= this.state.tapsPerWood) {
            console.log(`Harvesting wood. Tree health before: ${this.state.treeHealth}`);
            
            // Reset tap count
            this.state.tapCount = 0;
            
            // Decrease tree health
            this.state.treeHealth--;
            
            console.log(`Tree health after harvesting: ${this.state.treeHealth}`);
            
            // Update UI
            this.updateTreeState();
            this.updateProgressBar();
            this.updateTreeHealthDisplay();
            
            // Add wood resource
            this.addWoodResource(1);
            
            // Save game state
            this.saveState();
        }
    }
    
    /**
     * Check if player has enough energy and spend it
     * @returns {boolean} Whether the operation was successful
     */
    checkAndSpendEnergy() {
        const energyCost = 1; // Cost per click
        
        // Try to use ResourcesManager if available
        if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.energy) {
            const energyResource = window.resourcesManager.resources.energy;
            
            // Check if player has enough energy
            if (energyResource.amount < energyCost) {
                return false;
            }
            
            // Spend energy
            energyResource.amount -= energyCost;
            
            // If energy is not at max, update next regeneration time
            if (energyResource.amount < energyResource.limit && energyResource.regenerationTime) {
                energyResource.nextRegeneration = Date.now() + energyResource.regenerationTime;
            }
            
            // Update energy display in main game
            window.resourcesManager.updateDisplay();
            
            // Update energy display in mini-game
            this.updateEnergyDisplay();
            
            return true;
        }
        
        // Fallback method if ResourcesManager is not available
        let currentEnergy = parseInt(localStorage.getItem('energy') || '100');
        const energyLimit = parseInt(localStorage.getItem('energyLimit') || '100');
        
        // Check if player has enough energy
        if (currentEnergy < energyCost) {
            return false;
        }
        
        // Spend energy
        currentEnergy -= energyCost;
        localStorage.setItem('energy', currentEnergy.toString());
        
        // Update energy display in top panel
        const energyTextElement = document.getElementById('energy-text');
        if (energyTextElement) {
            energyTextElement.textContent = `${currentEnergy}/${energyLimit}`;
        }
        
        // Update energy bar
        const energyBarElement = document.getElementById('energy-bar');
        if (energyBarElement) {
            const energyPercentage = (currentEnergy / energyLimit) * 100;
            energyBarElement.style.width = `${energyPercentage}%`;
        }
        
        // Update energy display in mini-game
        this.updateEnergyDisplay();
        
        return true;
    }

    /**
     * Add wood resources
     * @param {number} amount - Amount to add
     */
    addWoodResource(amount) {
        try {
            // Try to use ResourcesManager if available
            if (window.resourcesManager) {
                // Direct access to resources object
                if (window.resourcesManager.resources && window.resourcesManager.resources.wood) {
                    const woodResource = window.resourcesManager.resources.wood;
                    
                    // Check if storage is full
                    if (woodResource.amount >= woodResource.limit) {
                        this.showMessage('Хранилище дерева заполнено!');
                        return;
                    }
                    
                    // Add wood to resources
                    woodResource.amount += amount;
                    
                    // Update wood display in the main game
                    window.resourcesManager.updateDisplay();
                    
                    // Update display in mini-game
                    this.updateResourceDisplay();
                    
                    // Show success message
                    this.showMessage(`+${amount} Wood`);
                    
                    return;
                }
            }
            
            // Fallback method if ResourcesManager is not available or not accessible
            // Get current wood count
            let currentWood = parseInt(localStorage.getItem('wood') || '0');
            const woodLimit = parseInt(localStorage.getItem('woodLimit') || '50');
            
            // Check if storage is full
            if (currentWood >= woodLimit) {
                this.showMessage('Хранилище дерева заполнено!');
                return;
            }
            
            // Add wood
            currentWood += amount;
            
            // Save
            localStorage.setItem('wood', currentWood.toString());
            
            // Update display in mini-game
            this.updateResourceDisplay();
            
            // Direct update of the wood amount in top panel
            const woodAmountElement = document.getElementById('wood-amount');
            if (woodAmountElement) {
                woodAmountElement.textContent = currentWood;
            }
            
            // Show message
            this.showMessage(`+${amount} Wood`);
        } catch (error) {
            console.error('Error adding wood resource:', error);
            // Ensure the message is shown even if there was an error
            this.showMessage(`+${amount} Wood`);
        }
    }

    /**
     * Update tree state based on health
     */
    updateTreeState() {
        let newState;
        
        if (this.state.treeHealth <= 0) {
            newState = 2; // Depleted
        } else if (this.state.treeHealth <= this.state.maxTreeHealth / 3) {
            newState = 1; // Depleting
        } else {
            newState = 0; // Healthy
        }
        
        // Update image if state changed
        if (newState !== this.state.treeState) {
            this.state.treeState = newState;
            this.elements.treeImage.src = this.treeImages[newState];
        }
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        const percentage = (this.state.treeHealth / this.state.maxTreeHealth) * 100;
        
        // Update progress bar width
        this.elements.progressBar.style.width = `${percentage}%`;
        
        // Update health label
        const healthLabel = this.elements.container.querySelector('.tree-health-label');
        if (healthLabel) {
            healthLabel.textContent = `Tree Health: ${this.state.treeHealth}/${this.state.maxTreeHealth}`;
        }
        
        // Change color based on health
        if (percentage <= 20) {
            this.elements.progressBar.style.backgroundColor = '#f44336'; // Red when low
        } else if (percentage <= 50) {
            this.elements.progressBar.style.backgroundColor = '#ff9800'; // Orange when medium
        } else {
            this.elements.progressBar.style.backgroundColor = '#68b550'; // Green when high
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
        if (this.state.treeHealth < this.state.maxTreeHealth) {
            this.elements.regenerationTimer.textContent = `Regenerates fully in: ${formattedTime}`;
            this.elements.regenerationTimer.style.display = 'block';
        } else {
            this.elements.regenerationTimer.style.display = 'none';
        }
    }

    /**
     * Update resource display
     */
    updateResourceDisplay() {
        try {
            // Try to use ResourcesManager first
            if (window.resourcesManager && window.resourcesManager.resources && window.resourcesManager.resources.wood) {
                const woodAmount = Math.floor(window.resourcesManager.resources.wood.amount);
                const woodLimit = window.resourcesManager.resources.wood.limit;
                this.elements.resourceCounter.textContent = `Wood: ${woodAmount}/${woodLimit}`;
                return;
            }
            
            // Fallback to DOM elements
            const woodAmountElement = document.getElementById('wood-amount');
            const woodLimitElement = document.getElementById('wood-limit');
            
            if (woodAmountElement && woodLimitElement) {
                const woodAmount = woodAmountElement.textContent || '0';
                const woodLimit = woodLimitElement.textContent || '50';
                this.elements.resourceCounter.textContent = `Wood: ${woodAmount}/${woodLimit}`;
            }
        } catch (error) {
            console.error('Error updating resource display:', error);
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
        
        // Fallback message display
        const messageElement = document.createElement('div');
        messageElement.className = 'mini-game-message';
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '50%';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translate(-50%, -50%)';
        messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '10px 20px';
        messageElement.style.borderRadius = '4px';
        messageElement.style.zIndex = '3000';
        
        document.body.appendChild(messageElement);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 2000);
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
        console.log(`Opening forest mini-game. Current tree health: ${this.state.treeHealth}/${this.state.maxTreeHealth}`);
        
        // Check regeneration before opening
        this.checkRegeneration();
        
        // Sync with the main game resources
        this.syncWithMainGameResources();
        
        // Update tree health display
        this.updateTreeHealthDisplay();
        
        // Update displays
        this.updateResourceDisplay();
        this.updateEnergyDisplay();
        this.updateProgressBar();
        this.updateTreeState();
        
        // Reset tap counter
        this.state.tapCount = 0;
        this.elements.tapCounter.textContent = `${this.state.tapCount}/${this.state.tapsPerWood}`;
        
        // Show game container with flex display
        this.elements.container.style.display = 'flex';
        
        // Start update loop
        this.startUpdateLoop();
    }
    
    /**
     * Update tree health display
     */
    updateTreeHealthDisplay() {
        // Update progress bar
        this.updateProgressBar();
        
        // Update regeneration timer
        this.updateRegenTimer();
        
        // Add visual indicator of current health
        const healthLabel = this.elements.container.querySelector('.tree-health-container div:first-child');
        if (healthLabel) {
            healthLabel.textContent = `Tree Health: ${this.state.treeHealth}/${this.state.maxTreeHealth}`;
        }
    }

    /**
     * Sync with main game resources
     */
    syncWithMainGameResources() {
        // Update resource display
        this.updateResourceDisplay();
        
        // Update energy display
        this.updateEnergyDisplay();
        
        // Update tree health display
        this.updateTreeHealthDisplay();
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
        
        // Check if we were opened from region map
        if (window.wasOpenedFromRegionMap) {
            console.log('Returning to region map');
            window.wasOpenedFromRegionMap = false;
            
            if (window.regionMapManager) {
                window.regionMapManager.showMap();
            } else {
                // Fallback to main game if region map manager is not available
                if (window.mainScene) {
                    window.mainScene.showGameArea();
                }
            }
        } else {
            // Return to game area
            if (window.mainScene) {
                window.mainScene.showGameArea();
            }
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
}

// Make ForestMiniGame globally available
window.ForestMiniGame = ForestMiniGame; 