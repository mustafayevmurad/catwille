/**
 * Класс для управления Залом Славы и лидербордами
 */
class HallOfFameManager {
    constructor() {
        console.log("HallOfFameManager constructor called");
        
        // Ищем модальное окно в DOM
        this.modal = document.createElement('div');
        this.modal.id = 'hallOfFameModal';
        this.modal.className = 'modal';
        
        // Создаем HTML для модального окна
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Зал Славы</h2>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="leaderboard-tabs">
                        <div class="leaderboard-tab active" data-tab="stars">Звезды</div>
                        <div class="leaderboard-tab" data-tab="arena">Арена</div>
                        <div class="leaderboard-tab" data-tab="house">Дом</div>
                    </div>
                    <div class="leaderboard-content active" id="stars-content">
                        <h3>Коллекционеры звезд</h3>
                        <p>Игроки с наибольшим количеством звезд от карточек</p>
                        <div id="stars-list" class="leaderboard-list">
                            <div class="leaderboard-placeholder">Загрузка данных...</div>
                        </div>
                    </div>
                    <div class="leaderboard-content" id="arena-content">
                        <h3>Чемпионы арены</h3>
                        <p>Игроки с наибольшим количеством побед на арене</p>
                        <div id="arena-list" class="leaderboard-list">
                            <div class="leaderboard-placeholder">Загрузка данных...</div>
                        </div>
                    </div>
                    <div class="leaderboard-content" id="house-content">
                        <h3>Лучшие строители</h3>
                        <p>Игроки с самым высоким уровнем главного дома</p>
                        <div id="house-list" class="leaderboard-list">
                            <div class="leaderboard-placeholder">Загрузка данных...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем в DOM
        document.body.appendChild(this.modal);
        
        // Находим элементы в DOM
        this.closeBtn = this.modal.querySelector('.close-btn');
        this.tabs = this.modal.querySelectorAll('.leaderboard-tab');
        this.contents = this.modal.querySelectorAll('.leaderboard-content');
        
        // Добавляем обработчики событий
        this.closeBtn.addEventListener('click', () => this.closeModal());
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Подготавливаем данные для лидербордов
        this.leaderboardData = {
            stars: [
                { rank: 1, name: 'Александр', score: '7 ⭐' },
                { rank: 2, name: 'Мария', score: '6 ⭐' },
                { rank: 3, name: 'Иван', score: '5 ⭐' },
                { rank: 4, name: 'Екатерина', score: '4 ⭐' },
                { rank: 5, name: 'Дмитрий', score: '3 ⭐' }
            ],
            arena: [
                { rank: 1, name: 'Петр', score: '15 побед' },
                { rank: 2, name: 'Анна', score: '12 побед' },
                { rank: 3, name: 'Сергей', score: '10 побед' },
                { rank: 4, name: 'Ольга', score: '9 побед' },
                { rank: 5, name: 'Николай', score: '7 побед' }
            ],
            house: [
                { rank: 1, name: 'Елена', score: 'Уровень 5' },
                { rank: 2, name: 'Василий', score: 'Уровень 4' },
                { rank: 3, name: 'Татьяна', score: 'Уровень 3' },
                { rank: 4, name: 'Андрей', score: 'Уровень 2' },
                { rank: 5, name: 'Светлана', score: 'Уровень 1' }
            ]
        };
    }
    
    /**
     * Открывает модальное окно Зала Славы
     */
    openModal() {
        console.log("Opening Hall of Fame modal");
        this.modal.style.display = 'flex';
        
        // Загружаем данные в лидерборды
        this.loadLeaderboardData('stars');
        this.loadLeaderboardData('arena');
        this.loadLeaderboardData('house');
    }
    
    /**
     * Закрывает модальное окно Зала Славы
     */
    closeModal() {
        console.log("Closing Hall of Fame modal");
        this.modal.style.display = 'none';
    }
    
    /**
     * Переключает вкладку в Зале Славы
     * @param {string} tabId - ID вкладки для переключения
     */
    switchTab(tabId) {
        console.log(`Switching to tab: ${tabId}`);
        
        // Активируем нужную вкладку
        this.tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Показываем нужный контент
        this.contents.forEach(content => {
            if (content.id === `${tabId}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Загружаем данные если нужно
        this.loadLeaderboardData(tabId);
    }
    
    /**
     * Загружает данные для лидерборда
     * @param {string} tabId - ID вкладки
     */
    loadLeaderboardData(tabId) {
        console.log(`Loading data for ${tabId} leaderboard`);
        
        const listElement = document.getElementById(`${tabId}-list`);
        if (!listElement) return;
        
        // Очищаем список
        listElement.innerHTML = '';
        
        // Получаем данные для этого лидерборда
        const data = this.leaderboardData[tabId];
        
        // Создаем элементы для списка
        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'leaderboard-item';
            
            // Ранг
            const rankElement = document.createElement('div');
            rankElement.className = `leaderboard-rank ${item.rank <= 3 ? 'top-' + item.rank : ''}`;
            rankElement.textContent = item.rank;
            
            // Информация об игроке
            const playerInfo = document.createElement('div');
            playerInfo.className = 'leaderboard-player-info';
            
            const playerName = document.createElement('div');
            playerName.className = 'leaderboard-player-name';
            playerName.textContent = item.name;
            
            const playerScore = document.createElement('div');
            playerScore.className = 'leaderboard-player-score';
            playerScore.textContent = 'Любитель котов';
            
            playerInfo.appendChild(playerName);
            playerInfo.appendChild(playerScore);
            
            // Счет
            const scoreElement = document.createElement('div');
            scoreElement.className = 'leaderboard-value';
            scoreElement.textContent = item.score;
            
            // Добавляем все элементы
            itemElement.appendChild(rankElement);
            itemElement.appendChild(playerInfo);
            itemElement.appendChild(scoreElement);
            
            listElement.appendChild(itemElement);
        });
    }
}

// Создаем экземпляр менеджера Зала Славы
console.log("Creating Hall of Fame Manager instance");
window.hallOfFameManager = new HallOfFameManager();
console.log("Hall of Fame Manager created successfully"); 