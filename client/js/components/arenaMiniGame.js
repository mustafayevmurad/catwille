/**
 * Arena Mini-Game Component
 * Mini-game for cat battles with other players (simulated)
 */
class ArenaMiniGame {
    constructor() {
        // DOM elements
        this.elements = {
            container: null,
            gameArea: null,
            battlePrep: null,
            opponent: null,
            opponentImg: null,
            opponentName: null,
            battleButton: null,
            gameplayArea: null,
            targetArea: null,
            resultScreen: null,
            resultMessage: null,
            starsEarned: null,
            coinsEarned: null,
            closeButton: null,
            energyDisplay: null,
            returnButton: null
        };

        // Game state
        this.state = {
            score: 0,
            opponentScore: 0,
            maxScore: 50,
            isPlaying: false,
            timer: 25,
            maxTime: 25,
            energyCost: 10,
            timerInterval: null,
            stars: 0,
            coins: 0,
            currentOpponent: null,
            gameOver: false,
            // Match 3 game specific properties
            grid: [],
            gridSize: { rows: 9, cols: 6 },
            tileTypes: 6,
            selectedTile: null,
            animating: false,
            comboCount: 0
        };

        // List of random opponent names (will be replaced with real player names in the future)
        this.opponentNames = [
            "Whisker Master", "Paw Champion", "Furball Fighter", 
            "Purr Warrior", "Shadow Cat", "Meow Knight",
            "Felix Clawsome", "Tabby Terror", "Calico Crusher",
            "Siamese Striker", "Bengal Beast", "Persian Prince",
            "Maine Coon Master", "Ragdoll Ranger", "Sphynx Slayer"
        ];

        // Cat avatar images
        this.catAvatars = [
            'assets/images/cats/old_tom.svg', 
            'assets/images/cats/old_tom.svg',
            'assets/images/cats/old_tom.svg',
            'assets/images/cats/old_tom.svg',
            'assets/images/cats/old_tom.svg'
        ];

        // Create game HTML
        this.createGameHTML();
    }

    /**
     * Create game HTML structure
     */
    createGameHTML() {
        // Create container
        const container = document.createElement('div');
        container.className = 'arena-mini-game';
        container.id = 'arena-mini-game';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.backgroundColor = '#f5f5f5';
        container.style.display = 'none';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'flex-start';
        container.style.zIndex = '2000';
        container.style.overflow = 'hidden';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'mini-game-header';
        header.style.width = '100%';
        header.style.backgroundColor = '#9C27B0'; // Purple for arena
        header.style.color = 'white';
        header.style.padding = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        header.style.position = 'relative';
        header.style.zIndex = '10';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Cat Arena Battle';
        title.style.margin = '0';
        title.style.fontSize = '18px';
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.className = 'close-button';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.fontSize = '20px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';
        
        header.appendChild(title);
        header.appendChild(closeButton);
        this.elements.closeButton = closeButton;
        
        // Create energy display
        const energyDisplay = document.createElement('div');
        energyDisplay.className = 'arena-energy-display';
        energyDisplay.style.backgroundColor = 'white';
        energyDisplay.style.padding = '10px';
        energyDisplay.style.margin = '10px';
        energyDisplay.style.borderRadius = '8px';
        energyDisplay.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        energyDisplay.style.display = 'flex';
        energyDisplay.style.alignItems = 'center';
        energyDisplay.style.width = '90%';
        energyDisplay.style.justifyContent = 'center';
        energyDisplay.innerHTML = '<i class="fas fa-bolt" style="color: #FFD700; margin-right: 5px;"></i> <span>Energy: 0/0</span>';
        this.elements.energyDisplay = energyDisplay;

        // Create battle preparation screen
        const battlePrep = document.createElement('div');
        battlePrep.className = 'battle-preparation';
        battlePrep.style.width = '90%';
        battlePrep.style.margin = '10px';
        battlePrep.style.padding = '20px';
        battlePrep.style.backgroundColor = 'white';
        battlePrep.style.borderRadius = '8px';
        battlePrep.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        battlePrep.style.display = 'flex';
        battlePrep.style.flexDirection = 'column';
        battlePrep.style.alignItems = 'center';
        battlePrep.style.justifyContent = 'center';
        
        // Opponent display
        const opponent = document.createElement('div');
        opponent.className = 'opponent-display';
        opponent.style.display = 'flex';
        opponent.style.flexDirection = 'column';
        opponent.style.alignItems = 'center';
        opponent.style.marginBottom = '20px';
        
        // Opponent image
        const opponentImg = document.createElement('img');
        opponentImg.className = 'opponent-img';
        opponentImg.src = 'assets/images/cats/old_tom.svg'; // Placeholder
        opponentImg.alt = 'Opponent';
        opponentImg.style.width = '100px';
        opponentImg.style.height = '100px';
        opponentImg.style.borderRadius = '50%';
        opponentImg.style.border = '3px solid #9C27B0';
        opponentImg.style.backgroundColor = '#f0f0f0';
        opponentImg.style.objectFit = 'cover';
        opponentImg.style.marginBottom = '10px';
        
        // Opponent name
        const opponentName = document.createElement('h3');
        opponentName.className = 'opponent-name';
        opponentName.textContent = 'Finding opponent...';
        opponentName.style.margin = '0';
        opponentName.style.fontSize = '16px';
        opponentName.style.fontWeight = 'bold';
        
        opponent.appendChild(opponentImg);
        opponent.appendChild(opponentName);
        
        // Battle button
        const battleButton = document.createElement('button');
        battleButton.className = 'battle-button';
        battleButton.textContent = 'Start Battle!';
        battleButton.style.backgroundColor = '#9C27B0';
        battleButton.style.color = 'white';
        battleButton.style.border = 'none';
        battleButton.style.borderRadius = '4px';
        battleButton.style.padding = '12px 24px';
        battleButton.style.fontSize = '16px';
        battleButton.style.fontWeight = 'bold';
        battleButton.style.cursor = 'pointer';
        battleButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        battleButton.style.transition = 'background-color 0.3s';
        
        // Battle info text
        const battleInfo = document.createElement('p');
        battleInfo.className = 'battle-info';
        battleInfo.innerHTML = 'Match 3 or more identical items to score points!<br>Each battle costs <strong>10 energy</strong>';
        battleInfo.style.textAlign = 'center';
        battleInfo.style.margin = '20px 0 0 0';
        battleInfo.style.color = '#666';
        
        battlePrep.appendChild(opponent);
        battlePrep.appendChild(battleButton);
        battlePrep.appendChild(battleInfo);
        
        this.elements.battlePrep = battlePrep;
        this.elements.opponent = opponent;
        this.elements.opponentImg = opponentImg;
        this.elements.opponentName = opponentName;
        this.elements.battleButton = battleButton;

        // Create gameplay area (hidden initially)
        const gameplayArea = document.createElement('div');
        gameplayArea.className = 'gameplay-area';
        gameplayArea.style.width = '90%';
        gameplayArea.style.margin = '10px';
        gameplayArea.style.backgroundColor = 'white';
        gameplayArea.style.borderRadius = '8px';
        gameplayArea.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        gameplayArea.style.display = 'none';
        gameplayArea.style.flexDirection = 'column';
        gameplayArea.style.alignItems = 'center';
        gameplayArea.style.justifyContent = 'space-between';
        gameplayArea.style.position = 'relative';
        gameplayArea.style.overflow = 'hidden';
        gameplayArea.style.padding = '10px';
        
        // Game info bar
        const gameInfoBar = document.createElement('div');
        gameInfoBar.className = 'game-info-bar';
        gameInfoBar.style.width = '100%';
        gameInfoBar.style.padding = '10px';
        gameInfoBar.style.display = 'flex';
        gameInfoBar.style.justifyContent = 'space-between';
        gameInfoBar.style.borderBottom = '1px solid #eee';
        
        // Score display
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        scoreDisplay.innerHTML = 'Score: <span id="player-score">0</span>';
        scoreDisplay.style.fontWeight = 'bold';
        
        // Timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.className = 'timer-display';
        timerDisplay.innerHTML = 'Time: <span id="timer">25</span>s';
        timerDisplay.style.fontWeight = 'bold';
        
        gameInfoBar.appendChild(scoreDisplay);
        gameInfoBar.appendChild(timerDisplay);
        
        // Game grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'match3-grid-container';
        gridContainer.style.width = '100%';
        gridContainer.style.maxWidth = '300px';
        gridContainer.style.aspectRatio = '2/3';
        gridContainer.style.margin = '10px auto';
        gridContainer.style.backgroundColor = '#f0f0f0';
        gridContainer.style.borderRadius = '4px';
        gridContainer.style.position = 'relative';
        gridContainer.style.overflow = 'hidden';
        
        gameplayArea.appendChild(gameInfoBar);
        gameplayArea.appendChild(gridContainer);
        
        this.elements.gameplayArea = gameplayArea;
        this.elements.gridContainer = gridContainer;
        
        // Create result screen (hidden initially)
        const resultScreen = document.createElement('div');
        resultScreen.className = 'result-screen';
        resultScreen.style.width = '90%';
        resultScreen.style.margin = '10px';
        resultScreen.style.padding = '20px';
        resultScreen.style.backgroundColor = 'white';
        resultScreen.style.borderRadius = '8px';
        resultScreen.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        resultScreen.style.display = 'none';
        resultScreen.style.flexDirection = 'column';
        resultScreen.style.alignItems = 'center';
        resultScreen.style.justifyContent = 'center';
        
        // Result message
        const resultMessage = document.createElement('h3');
        resultMessage.className = 'result-message';
        resultMessage.textContent = 'Battle Complete!';
        resultMessage.style.fontSize = '20px';
        resultMessage.style.margin = '0 0 20px 0';
        resultMessage.style.textAlign = 'center';
        
        // Result details
        const resultDetails = document.createElement('div');
        resultDetails.className = 'result-details';
        resultDetails.style.display = 'flex';
        resultDetails.style.flexDirection = 'column';
        resultDetails.style.alignItems = 'center';
        resultDetails.style.width = '100%';
        resultDetails.style.marginBottom = '20px';
        
        // Scores comparison
        const scoresCompare = document.createElement('div');
        scoresCompare.className = 'scores-compare';
        scoresCompare.style.display = 'flex';
        scoresCompare.style.justifyContent = 'space-around';
        scoresCompare.style.width = '100%';
        scoresCompare.style.marginBottom = '20px';
        
        // Player score
        const playerScoreDisplay = document.createElement('div');
        playerScoreDisplay.className = 'player-score-display';
        playerScoreDisplay.innerHTML = '<span>You</span><br><strong>0</strong>';
        playerScoreDisplay.style.textAlign = 'center';
        playerScoreDisplay.style.fontSize = '16px';
        
        // VS
        const vsText = document.createElement('div');
        vsText.textContent = 'VS';
        vsText.style.fontSize = '18px';
        vsText.style.fontWeight = 'bold';
        vsText.style.alignSelf = 'center';
        
        // Opponent score
        const opponentScoreDisplay = document.createElement('div');
        opponentScoreDisplay.className = 'opponent-score-display';
        opponentScoreDisplay.innerHTML = '<span>Opponent</span><br><strong>0</strong>';
        opponentScoreDisplay.style.textAlign = 'center';
        opponentScoreDisplay.style.fontSize = '16px';
        
        scoresCompare.appendChild(playerScoreDisplay);
        scoresCompare.appendChild(vsText);
        scoresCompare.appendChild(opponentScoreDisplay);
        
        // Rewards
        const rewards = document.createElement('div');
        rewards.className = 'rewards';
        rewards.style.display = 'flex';
        rewards.style.flexDirection = 'column';
        rewards.style.alignItems = 'center';
        rewards.style.width = '100%';
        rewards.style.marginTop = '10px';
        
        // Stars earned
        const starsEarned = document.createElement('div');
        starsEarned.className = 'stars-earned';
        starsEarned.innerHTML = '<i class="fas fa-star" style="color: #FFD700;"></i> Stars Earned: <span>0</span>';
        starsEarned.style.marginBottom = '10px';
        starsEarned.style.fontSize = '16px';
        
        // Coins earned
        const coinsEarned = document.createElement('div');
        coinsEarned.className = 'coins-earned';
        coinsEarned.innerHTML = '<i class="fas fa-coins" style="color: #FFD700;"></i> Coins Earned: <span>0</span>';
        coinsEarned.style.fontSize = '16px';
        
        rewards.appendChild(starsEarned);
        rewards.appendChild(coinsEarned);
        
        resultDetails.appendChild(scoresCompare);
        resultDetails.appendChild(rewards);
        
        // Return button
        const returnButton = document.createElement('button');
        returnButton.className = 'return-button';
        returnButton.textContent = 'Return to Arena';
        returnButton.style.backgroundColor = '#9C27B0';
        returnButton.style.color = 'white';
        returnButton.style.border = 'none';
        returnButton.style.borderRadius = '4px';
        returnButton.style.padding = '12px 24px';
        returnButton.style.fontSize = '16px';
        returnButton.style.fontWeight = 'bold';
        returnButton.style.cursor = 'pointer';
        returnButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        returnButton.style.marginTop = '10px';
        
        resultScreen.appendChild(resultMessage);
        resultScreen.appendChild(resultDetails);
        resultScreen.appendChild(returnButton);
        
        this.elements.resultScreen = resultScreen;
        this.elements.resultMessage = resultMessage;
        this.elements.starsEarned = starsEarned.querySelector('span');
        this.elements.coinsEarned = coinsEarned.querySelector('span');
        this.elements.returnButton = returnButton;
        
        // Add all elements to container
        container.appendChild(header);
        container.appendChild(energyDisplay);
        container.appendChild(battlePrep);
        container.appendChild(gameplayArea);
        container.appendChild(resultScreen);
        
        // Add container to document
        document.body.appendChild(container);
        this.elements.container = container;
        
        // Initialize event listeners
        this.initEventListeners();
    }

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Close button
        this.elements.closeButton.addEventListener('click', () => {
            this.close();
        });
        
        // Battle button
        this.elements.battleButton.addEventListener('click', () => {
            this.startBattle();
        });
        
        // Return button
        this.elements.returnButton.addEventListener('click', () => {
            this.resetGame();
        });
    }

    /**
     * Initialize grid event listeners
     */
    initGridEventListeners() {
        // Event delegation for tile clicks
        this.elements.gridContainer.addEventListener('click', (e) => {
            if (!this.state.isPlaying || this.state.gameOver || this.state.animating) return;
            
            const tile = e.target.closest('.match3-tile');
            if (!tile) return;
            
            const row = parseInt(tile.dataset.row);
            const col = parseInt(tile.dataset.col);
            
            this.handleTileClick(row, col);
        });
    }

    /**
     * Handle tile click
     */
    handleTileClick(row, col) {
        // If no tile is selected, select this one
        if (this.state.selectedTile === null) {
            this.state.selectedTile = { row, col };
            document.querySelector(`.match3-tile[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
            return;
        }
        
        // If the same tile is clicked, deselect it
        if (this.state.selectedTile.row === row && this.state.selectedTile.col === col) {
            document.querySelector(`.match3-tile[data-row="${row}"][data-col="${col}"]`).classList.remove('selected');
            this.state.selectedTile = null;
            return;
        }
        
        // Check if the clicked tile is adjacent to the selected tile
        const isAdjacent = 
            (Math.abs(this.state.selectedTile.row - row) === 1 && this.state.selectedTile.col === col) ||
            (Math.abs(this.state.selectedTile.col - col) === 1 && this.state.selectedTile.row === row);
        
        if (!isAdjacent) {
            // Deselect current and select new
            document.querySelector(`.match3-tile[data-row="${this.state.selectedTile.row}"][data-col="${this.state.selectedTile.col}"]`).classList.remove('selected');
            this.state.selectedTile = { row, col };
            document.querySelector(`.match3-tile[data-row="${row}"][data-col="${col}"]`).classList.add('selected');
            return;
        }
        
        // If the tiles are adjacent, swap them
        this.swapTiles(this.state.selectedTile.row, this.state.selectedTile.col, row, col);
    }

    /**
     * Swap two tiles
     */
    swapTiles(row1, col1, row2, col2) {
        // Prevent further actions while animating
        this.state.animating = true;
        
        // Deselect tile
        document.querySelector(`.match3-tile[data-row="${row1}"][data-col="${col1}"]`).classList.remove('selected');
        this.state.selectedTile = null;
        
        // Get the tile values
        const temp = this.state.grid[row1][col1];
        this.state.grid[row1][col1] = this.state.grid[row2][col2];
        this.state.grid[row2][col2] = temp;
        
        // Update the display
        this.updateGridDisplay();
        
        // Check for matches
        setTimeout(() => {
            const matches = this.checkForMatches();
            
            if (matches.length === 0) {
                // If no matches, swap back
                const temp = this.state.grid[row1][col1];
                this.state.grid[row1][col1] = this.state.grid[row2][col2];
                this.state.grid[row2][col2] = temp;
                
                this.updateGridDisplay();
                this.state.animating = false;
            } else {
                // Process matches
                this.processMatches(matches);
            }
        }, 300);
    }

    /**
     * Check for matches in the grid
     * @returns {Array} Array of matched tile positions
     */
    checkForMatches() {
        const matches = [];
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        
        // Check horizontal matches
        for (let row = 0; row < rows; row++) {
            let matchCount = 1;
            let tileType = this.state.grid[row][0];
            
            for (let col = 1; col < cols; col++) {
                if (this.state.grid[row][col] === tileType) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        // Add horizontal match
                        for (let i = col - matchCount; i < col; i++) {
                            matches.push({ row, col: i });
                        }
                    }
                    matchCount = 1;
                    tileType = this.state.grid[row][col];
                }
            }
            
            // Check for match at the end of row
            if (matchCount >= 3) {
                for (let i = cols - matchCount; i < cols; i++) {
                    matches.push({ row, col: i });
                }
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < cols; col++) {
            let matchCount = 1;
            let tileType = this.state.grid[0][col];
            
            for (let row = 1; row < rows; row++) {
                if (this.state.grid[row][col] === tileType) {
                    matchCount++;
                } else {
                    if (matchCount >= 3) {
                        // Add vertical match
                        for (let i = row - matchCount; i < row; i++) {
                            matches.push({ row: i, col });
                        }
                    }
                    matchCount = 1;
                    tileType = this.state.grid[row][col];
                }
            }
            
            // Check for match at the end of column
            if (matchCount >= 3) {
                for (let i = rows - matchCount; i < rows; i++) {
                    matches.push({ row: i, col });
                }
            }
        }
        
        // Remove duplicates (tiles that are part of both horizontal and vertical matches)
        const uniqueMatches = [];
        const matchPositions = new Set();
        
        for (const match of matches) {
            const posKey = `${match.row},${match.col}`;
            if (!matchPositions.has(posKey)) {
                matchPositions.add(posKey);
                uniqueMatches.push(match);
            }
        }
        
        return uniqueMatches;
    }

    /**
     * Process matches and update score
     */
    processMatches(matches) {
        // Add points
        const points = matches.length;
        this.state.score += points;
        
        // Update score display
        document.getElementById('player-score').textContent = this.state.score;
        
        // Show match effect
        for (const match of matches) {
            const tile = document.querySelector(`.match3-tile[data-row="${match.row}"][data-col="${match.col}"]`);
            if (tile) {
                this.createMatchEffect(tile);
                
                // Clear the matched tile
                this.state.grid[match.row][match.col] = -1; // Mark as empty
            }
        }
        
        // Apply gravity and refill after a delay
        setTimeout(() => {
            this.applyGravity();
            this.fillEmptyTiles();
            this.updateGridDisplay();
            
            // Check for cascading matches
            setTimeout(() => {
                const newMatches = this.checkForMatches();
                
                if (newMatches.length > 0) {
                    // Combo!
                    this.state.comboCount++;
                    
                    // Bonus points for combos
                    const comboBonus = Math.min(this.state.comboCount * 2, 10);
                    
                    // Process the new matches with combo bonus
                    this.processMatches(newMatches);
                } else {
                    // No more matches, end the turn
                    this.state.comboCount = 0;
                    this.state.animating = false;
                    
                    // Check if there are possible moves
                    if (!this.hasPossibleMoves()) {
                        // Regenerate the grid if no moves are possible
                        this.initializeGrid();
                        this.updateGridDisplay();
                    }
                }
            }, 300);
        }, 500);
    }

    /**
     * Apply gravity to make tiles fall
     */
    applyGravity() {
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        
        // Work from bottom to top for each column
        for (let col = 0; col < cols; col++) {
            // Find empty spaces and move tiles down
            for (let row = rows - 1; row >= 0; row--) {
                if (this.state.grid[row][col] === -1) {
                    // Look for the first non-empty tile above
                    for (let above = row - 1; above >= 0; above--) {
                        if (this.state.grid[above][col] !== -1) {
                            // Move that tile down to the current position
                            this.state.grid[row][col] = this.state.grid[above][col];
                            this.state.grid[above][col] = -1;
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Fill empty tiles with new random tiles
     */
    fillEmptyTiles() {
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.state.grid[row][col] === -1) {
                    this.state.grid[row][col] = Math.floor(Math.random() * this.state.tileTypes);
                }
            }
        }
    }

    /**
     * Check if there are possible moves left
     */
    hasPossibleMoves() {
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        
        // Check each position for potential matches if swapped with adjacent tiles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Check right
                if (col < cols - 1) {
                    // Swap temporarily
                    const temp = this.state.grid[row][col];
                    this.state.grid[row][col] = this.state.grid[row][col + 1];
                    this.state.grid[row][col + 1] = temp;
                    
                    // Check for matches
                    const matches = this.checkForMatches();
                    
                    // Swap back
                    this.state.grid[row][col + 1] = this.state.grid[row][col];
                    this.state.grid[row][col] = temp;
                    
                    if (matches.length > 0) {
                        return true;
                    }
                }
                
                // Check down
                if (row < rows - 1) {
                    // Swap temporarily
                    const temp = this.state.grid[row][col];
                    this.state.grid[row][col] = this.state.grid[row + 1][col];
                    this.state.grid[row + 1][col] = temp;
                    
                    // Check for matches
                    const matches = this.checkForMatches();
                    
                    // Swap back
                    this.state.grid[row + 1][col] = this.state.grid[row][col];
                    this.state.grid[row][col] = temp;
                    
                    if (matches.length > 0) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    /**
     * Create visual effect for a matched tile
     */
    createMatchEffect(tileElement) {
        const effectElement = document.createElement('div');
        effectElement.className = 'match-effect';
        effectElement.style.position = 'absolute';
        effectElement.style.width = '100%';
        effectElement.style.height = '100%';
        effectElement.style.left = '0';
        effectElement.style.top = '0';
        effectElement.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        effectElement.style.borderRadius = '8px';
        effectElement.style.animation = 'match-pop 0.3s ease-out';
        effectElement.style.zIndex = '5';
        
        // Add plus one text
        const plusOne = document.createElement('div');
        plusOne.textContent = '+1';
        plusOne.style.position = 'absolute';
        plusOne.style.left = '50%';
        plusOne.style.top = '50%';
        plusOne.style.transform = 'translate(-50%, -50%)';
        plusOne.style.color = '#9C27B0';
        plusOne.style.fontWeight = 'bold';
        plusOne.style.fontSize = '16px';
        
        effectElement.appendChild(plusOne);
        tileElement.appendChild(effectElement);
        
        // Remove effect after animation
        setTimeout(() => {
            if (effectElement.parentNode === tileElement) {
                tileElement.removeChild(effectElement);
            }
        }, 300);
    }

    /**
     * Initialize the match-3 grid
     */
    initializeGrid() {
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        
        // Create empty grid
        this.state.grid = Array(rows).fill().map(() => Array(cols).fill(0));
        
        // Fill with random tile types, but ensure no initial matches
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let tileType;
                
                // Avoid creating initial matches
                do {
                    tileType = Math.floor(Math.random() * this.state.tileTypes);
                    this.state.grid[row][col] = tileType;
                } while (this.hasInitialMatch(row, col));
            }
        }
        
        // Ensure the grid has possible moves
        while (!this.hasPossibleMoves()) {
            this.initializeGrid();
        }
    }

    /**
     * Check if placing a tile at the given position would create a match
     */
    hasInitialMatch(row, col) {
        const grid = this.state.grid;
        const tileType = grid[row][col];
        
        // Check horizontal match (need at least 3 same tiles in a row)
        if (col >= 2 && 
            grid[row][col-1] === tileType && 
            grid[row][col-2] === tileType) {
            return true;
        }
        
        // Check vertical match
        if (row >= 2 && 
            grid[row-1][col] === tileType && 
            grid[row-2][col] === tileType) {
            return true;
        }
        
        return false;
    }

    /**
     * Create and update the grid display
     */
    updateGridDisplay() {
        // Clear existing grid
        this.elements.gridContainer.innerHTML = '';
        
        const rows = this.state.gridSize.rows;
        const cols = this.state.gridSize.cols;
        const tileWidth = 100 / cols; // as percentage
        const tileHeight = 100 / rows; // as percentage
        
        // Add CSS keyframes for the match effect and selection effect if not already added
        if (!document.getElementById('match3-animations')) {
            const style = document.createElement('style');
            style.id = 'match3-animations';
            style.textContent = `
                @keyframes match-pop {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.3); opacity: 0; }
                }
                
                .match3-tile {
                    transition: transform 0.2s ease-in-out;
                }
                
                .match3-tile.selected {
                    transform: scale(0.9);
                    border: 3px solid #9C27B0 !important;
                    z-index: 10;
                }
                
                .match3-tile:active {
                    transform: scale(0.85);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create grid tiles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tileType = this.state.grid[row][col];
                
                // Skip rendering empty tiles (they'll be filled in by gravity)
                if (tileType === -1) continue;
                
                const tile = document.createElement('div');
                tile.className = 'match3-tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.style.position = 'absolute';
                tile.style.width = `${tileWidth}%`;
                tile.style.height = `${tileHeight}%`;
                tile.style.left = `${col * tileWidth}%`;
                tile.style.top = `${row * tileHeight}%`;
                tile.style.backgroundColor = 'white';
                tile.style.borderRadius = '8px';
                tile.style.border = '2px solid #f0f0f0';
                tile.style.boxSizing = 'border-box';
                tile.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                tile.style.cursor = 'pointer';
                tile.style.display = 'flex';
                tile.style.alignItems = 'center';
                tile.style.justifyContent = 'center';
                tile.style.userSelect = 'none';
                
                // Add icon based on tile type - use fixed 35px size
                const icons = ['🐱', '🐠', '🌲', '🌟', '🍖', '🎁']; // Added one more icon
                
                tile.innerHTML = `<div style="font-size: 35px; line-height: 1;">${icons[tileType]}</div>`;
                
                // Add to grid container
                this.elements.gridContainer.appendChild(tile);
            }
        }
    }

    /**
     * Select a random opponent
     */
    selectRandomOpponent() {
        const nameIndex = Math.floor(Math.random() * this.opponentNames.length);
        const avatarIndex = Math.floor(Math.random() * this.catAvatars.length);
        
        const opponent = {
            name: this.opponentNames[nameIndex],
            avatar: this.catAvatars[avatarIndex],
            skill: Math.floor(Math.random() * 25) + 10 // Reduced skill range to 10-35 (was 15-55)
        };
        
        this.state.currentOpponent = opponent;
        
        // Update the UI
        this.elements.opponentName.textContent = opponent.name;
        this.elements.opponentImg.src = opponent.avatar;
        
        // Generate an expected score based on opponent skill
        // This will be revealed at the end of the battle
        this.state.opponentScore = opponent.skill;
    }

    /**
     * Start the battle
     */
    startBattle() {
        try {
            // Check if player has enough energy
            if (!this.checkAndSpendEnergy()) {
                return;
            }
            
            // Hide preparation screen and show gameplay
            this.elements.battlePrep.style.display = 'none';
            this.elements.gameplayArea.style.display = 'flex';
            
            // Reset state
            this.state.score = 0;
            this.state.timer = this.state.maxTime;
            this.state.isPlaying = true;
            this.state.gameOver = false;
            this.state.animating = false;
            this.state.comboCount = 0;
            
            // Update UI
            document.getElementById('player-score').textContent = this.state.score;
            document.getElementById('timer').textContent = this.state.timer;
            
            // Initialize grid and event listeners
            this.initializeGrid();
            this.updateGridDisplay();
            this.initGridEventListeners();
            
            // Start timer
            this.state.timerInterval = setInterval(() => {
                this.state.timer--;
                document.getElementById('timer').textContent = this.state.timer;
                
                if (this.state.timer <= 0) {
                    this.endBattle();
                }
            }, 1000);
        } catch (error) {
            console.error('Error starting battle:', error);
            window.mainScene?.showMessage('Error starting battle. Please try again.');
            // Reset to preparation state
            this.resetGame();
        }
    }

    /**
     * End the battle
     */
    endBattle() {
        // Stop the game
        this.state.isPlaying = false;
        this.state.gameOver = true;
        
        // Clear interval
        clearInterval(this.state.timerInterval);
        
        // Calculate results and rewards
        this.calculateResults();
        
        // Hide gameplay area and show results
        this.elements.gameplayArea.style.display = 'none';
        this.elements.resultScreen.style.display = 'flex';
    }

    /**
     * Calculate battle results and rewards
     */
    calculateResults() {
        const playerScore = this.state.score;
        const opponentScore = this.state.opponentScore;
        
        // Update scores in results screen
        const playerScoreElement = this.elements.resultScreen.querySelector('.player-score-display strong');
        const opponentScoreElement = this.elements.resultScreen.querySelector('.opponent-score-display strong');
        
        playerScoreElement.textContent = playerScore;
        opponentScoreElement.textContent = opponentScore;
        
        // Determine winner and set message
        let resultMessage = '';
        let stars = 0;
        let coins = 0;
        
        if (playerScore > opponentScore) {
            // Player wins
            resultMessage = 'Victory! You defeated ' + this.state.currentOpponent.name + '!';
            
            // Calculate stars based on margin of victory
            const margin = playerScore - opponentScore;
            if (margin >= 15) stars = 3;
            else if (margin >= 8) stars = 2;
            else stars = 1;
            
            // Calculate coins based on performance
            coins = 10 + Math.min(playerScore, 10);
        } else if (playerScore === opponentScore) {
            // Draw
            resultMessage = 'Draw! You matched ' + this.state.currentOpponent.name + '!';
            stars = 1;
            coins = 8;
        } else {
            // Player loses
            resultMessage = 'Defeat! ' + this.state.currentOpponent.name + ' was too strong!';
            
            // Still give some coins for participating
            coins = 5;
        }
        
        // Update UI
        this.elements.resultMessage.textContent = resultMessage;
        this.elements.starsEarned.textContent = stars;
        this.elements.coinsEarned.textContent = coins;
        
        // Save rewards
        this.state.stars = stars;
        this.state.coins = coins;
        
        // Award resources to the player
        this.awardResources(stars, coins);
    }

    /**
     * Award resources to the player
     */
    awardResources(stars, coins) {
        // Add stars and coins to player's account
        if (window.resourcesManager) {
            // Set showAnimation to false to prevent the error
            window.resourcesManager.addResource('coins', coins, false);
        }
        
        // Track stars for hall of fame (will be implemented later)
        if (window.mainScene && window.mainScene.playerData) {
            window.mainScene.playerData.stars += stars;
            if (window.mainScene.updatePlayerInterface) {
                window.mainScene.updatePlayerInterface();
            }
        }
    }

    /**
     * Check if player has enough energy and spend it
     * @returns {boolean} Whether energy was successfully spent
     */
    checkAndSpendEnergy() {
        if (!window.resourcesManager) {
            console.error('Resources manager not found!');
            return false;
        }
        
        const energy = window.resourcesManager.resources.energy.amount;
        if (energy < this.state.energyCost) {
            // Not enough energy
            window.mainScene.showMessage('Not enough energy! You need ' + this.state.energyCost + ' energy to battle.');
            return false;
        }
        
        // Spend energy
        window.resourcesManager.spendResource('energy', this.state.energyCost);
        this.updateEnergyDisplay();
        return true;
    }

    /**
     * Update energy display
     */
    updateEnergyDisplay() {
        if (!window.resourcesManager) return;
        
        const energy = window.resourcesManager.resources.energy.amount;
        const maxEnergy = window.resourcesManager.resources.energy.limit;
        
        this.elements.energyDisplay.querySelector('span').textContent = `Energy: ${energy}/${maxEnergy}`;
    }

    /**
     * Reset the game to preparation state
     */
    resetGame() {
        // Stop any ongoing game
        if (this.state.isPlaying) {
            clearInterval(this.state.timerInterval);
            this.state.isPlaying = false;
        }
        
        // Reset state
        this.state.score = 0;
        this.state.timer = this.state.maxTime;
        this.state.gameOver = false;
        this.state.animating = false; // Make sure animating state is reset
        this.state.selectedTile = null; // Reset selected tile
        
        // Clear grid event listeners to prevent duplicates
        if (this.elements.gridContainer) {
            const gridContainer = this.elements.gridContainer;
            const newContainer = gridContainer.cloneNode(false);
            gridContainer.parentNode.replaceChild(newContainer, gridContainer);
            this.elements.gridContainer = newContainer;
        }
        
        // Hide result screen and show preparation
        this.elements.resultScreen.style.display = 'none';
        this.elements.gameplayArea.style.display = 'none';
        this.elements.battlePrep.style.display = 'flex';
        
        // Select a new opponent
        this.selectRandomOpponent();
    }

    /**
     * Open the Arena mini-game
     */
    open() {
        try {
            if (!this.elements.container) {
                this.createGameHTML();
            }
            
            // Show container
            this.elements.container.style.display = 'flex';
            
            // Select a random opponent
            this.selectRandomOpponent();
            
            // Update energy display
            this.updateEnergyDisplay();
        } catch (error) {
            console.error('Error opening arena mini-game:', error);
            if (window.mainScene) {
                window.mainScene.showMessage('Error opening Arena. Please try again later.');
                // Return to main scene or region map
                if (window.regionMapManager) {
                    window.regionMapManager.hideMap();
                }
            }
        }
    }

    /**
     * Close the Arena mini-game
     */
    close() {
        // Stop any ongoing game
        if (this.state.isPlaying) {
            clearInterval(this.state.timerInterval);
            this.state.isPlaying = false;
        }
        
        // Hide container
        if (this.elements.container) {
            this.elements.container.style.display = 'none';
        }
        
        // Return to region map (via callback)
        if (window.regionMapManager) {
            window.regionMapManager.hideMap();
        }
    }
}

// Make the ArenaMiniGame class globally available
window.ArenaMiniGame = ArenaMiniGame; 