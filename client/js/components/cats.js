/**
 * Компонент для управления кошками
 */
class CatsManager {
    constructor() {
        // Импортируем storage
        this.storage = window.storage;

        // Данные о кошках
        this.cats = [];
        this.activeCats = 0;
        this.maxActiveCats = 3;

        // Информация о всех доступных кошках
        this.catsInfo = {
            builderHarry: {
                id: 'builderHarry',
                name: 'Котик-строитель Гарри',
                description: 'Энергичный рыжий кот в строительной каске',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/builder_harry.png'
            },
            fisherMarina: {
                id: 'fisherMarina',
                name: 'Марина Рыбачка',
                description: 'Синеватая кошка с повязкой на голове и рыболовной удочкой',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/fisher_marina.png'
            },
            merchantFelix: {
                id: 'merchantFelix',
                name: 'Купец Феликс',
                description: 'Толстый черный кот с жилеткой и монетой в лапе',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/merchant_felix.png'
            },
            keeperOscar: {
                id: 'keeperOscar',
                name: 'Хранитель Оскар',
                description: 'Педантичный серый кот с записной книжкой',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/keeper_oscar.png'
            },
            mysticLuna: {
                id: 'mysticLuna',
                name: 'Мистическая Луна',
                description: 'Загадочная кошка с мерцающими глазами',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/mystic_luna.png'
            },
            shadowKing: {
                id: 'shadowKing',
                name: 'Король Теней',
                description: 'Величественный черный кот с золотой короной',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/shadow_king.png'
            },
            goldenEmperor: {
                id: 'goldenEmperor',
                name: 'Золотой Император',
                description: 'Величественный кот с золотой шубой и драгоценными камнями',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/golden_emperor.png'
            },
            // Common cats (1 star)
            sleepyWhiskers: {
                id: 'sleepyWhiskers',
                name: 'Сонный Усик',
                description: 'Ленивый кот, который любит поспать на солнышке',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/sleepy_whiskers.png'
            },
            playfulPaws: {
                id: 'playfulPaws',
                name: 'Игривые Лапки',
                description: 'Веселый котенок, который обожает играть с клубком шерсти',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/playful_paws.png'
            },
            milkLover: {
                id: 'milkLover',
                name: 'Молоколюб',
                description: 'Кот, который обожает молоко и сливки',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/milk_lover.png'
            },
            sunSeeker: {
                id: 'sunSeeker',
                name: 'Солнечный Искатель',
                description: 'Кот, который всегда находит самое солнечное место',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/sun_seeker.png'
            },
            yarnMaster: {
                id: 'yarnMaster',
                name: 'Мастер Клубка',
                description: 'Кот, который превращает клубок в произведение искусства',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/yarn_master.png'
            },
            windowWatcher: {
                id: 'windowWatcher',
                name: 'Наблюдатель из Окна',
                description: 'Кот, который часами наблюдает за птицами',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/window_watcher.png'
            },
            boxExplorer: {
                id: 'boxExplorer',
                name: 'Исследователь Коробок',
                description: 'Кот, который обожает исследовать коробки',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/box_explorer.png'
            },
            purrMaster: {
                id: 'purrMaster',
                name: 'Мастер Мурлыканья',
                description: 'Кот с самым громким и успокаивающим мурлыканьем',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/purr_master.png'
            },
            napKing: {
                id: 'napKing',
                name: 'Король Дремы',
                description: 'Кот, который может спать в любой позе',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/nap_king.png'
            },
            treatHunter: {
                id: 'treatHunter',
                name: 'Охотник за Лакомствами',
                description: 'Кот, который всегда находит спрятанные лакомства',
                rarity: 'common',
                stars: 1,
                imageUrl: 'assets/images/cats/treat_hunter.png'
            },
            // Uncommon cats (2 stars)
            cleverMittens: {
                id: 'cleverMittens',
                name: 'Умные Варежки',
                description: 'Сообразительный кот, который любит решать головоломки',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/clever_mittens.png'
            },
            swiftShadow: {
                id: 'swiftShadow',
                name: 'Быстрая Тень',
                description: 'Проворный кот, который может поймать любую мышь',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/swift_shadow.png'
            },
            gardenGuardian: {
                id: 'gardenGuardian',
                name: 'Страж Сада',
                description: 'Кот, который защищает сад от вредителей',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/garden_guardian.png'
            },
            puzzleSolver: {
                id: 'puzzleSolver',
                name: 'Решатель Головоломок',
                description: 'Кот, который обожает разгадывать загадки',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/puzzle_solver.png'
            },
            musicLover: {
                id: 'musicLover',
                name: 'Любитель Музыки',
                description: 'Кот, который танцует под любую мелодию',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/music_lover.png'
            },
            bookKeeper: {
                id: 'bookKeeper',
                name: 'Хранитель Книг',
                description: 'Кот, который любит спать на книгах',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/book_keeper.png'
            },
            plantFriend: {
                id: 'plantFriend',
                name: 'Друг Растений',
                description: 'Кот, который ухаживает за комнатными растениями',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/plant_friend.png'
            },
            weatherWatcher: {
                id: 'weatherWatcher',
                name: 'Наблюдатель Погоды',
                description: 'Кот, который предсказывает погоду',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/weather_watcher.png'
            },
            artCritic: {
                id: 'artCritic',
                name: 'Искусствовед',
                description: 'Кот, который разбирается в искусстве',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/art_critic.png'
            },
            techWhiz: {
                id: 'techWhiz',
                name: 'Технический Гений',
                description: 'Кот, который разбирается в гаджетах',
                rarity: 'uncommon',
                stars: 2,
                imageUrl: 'assets/images/cats/tech_whiz.png'
            },
            // Rare cats (3 stars)
            mysticLuna: {
                id: 'mysticLuna',
                name: 'Мистическая Луна',
                description: 'Загадочная кошка с мерцающими глазами',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/mystic_luna.png'
            },
            shadowKing: {
                id: 'shadowKing',
                name: 'Король Теней',
                description: 'Величественный черный кот с золотой короной',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/shadow_king.png'
            },
            starGazer: {
                id: 'starGazer',
                name: 'Созерцатель Звезд',
                description: 'Кот, который читает будущее по звездам',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/star_gazer.png'
            },
            dreamWalker: {
                id: 'dreamWalker',
                name: 'Странник Снов',
                description: 'Кот, который путешествует по снам',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/dream_walker.png'
            },
            timeKeeper: {
                id: 'timeKeeper',
                name: 'Хранитель Времени',
                description: 'Кот, который всегда точно знает время',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/time_keeper.png'
            },
            windWhisperer: {
                id: 'windWhisperer',
                name: 'Шепчущий с Ветром',
                description: 'Кот, который понимает язык ветра',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/wind_whisperer.png'
            },
            moonDancer: {
                id: 'moonDancer',
                name: 'Танцор Луны',
                description: 'Кот, который танцует под светом луны',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/moon_dancer.png'
            },
            crystalSeer: {
                id: 'crystalSeer',
                name: 'Провидец Кристаллов',
                description: 'Кот, который видит будущее в кристаллах',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/crystal_seer.png'
            },
            forestSpirit: {
                id: 'forestSpirit',
                name: 'Дух Леса',
                description: 'Кот, который общается с деревьями',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/forest_spirit.png'
            },
            oceanSoul: {
                id: 'oceanSoul',
                name: 'Душа Океана',
                description: 'Кот, который понимает язык волн',
                rarity: 'rare',
                stars: 3,
                imageUrl: 'assets/images/cats/ocean_soul.png'
            },
            // Epic cats (4 stars)
            goldenEmperor: {
                id: 'goldenEmperor',
                name: 'Золотой Император',
                description: 'Величественный кот с золотой шубой и драгоценными камнями',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/golden_emperor.png'
            },
            crystalQueen: {
                id: 'crystalQueen',
                name: 'Хрустальная Королева',
                description: 'Элегантная кошка с кристаллическими украшениями',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/crystal_queen.png'
            },
            phoenixRising: {
                id: 'phoenixRising',
                name: 'Восставший Феникс',
                description: 'Кот с огненной шерстью и крыльями',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/phoenix_rising.png'
            },
            thunderLord: {
                id: 'thunderLord',
                name: 'Повелитель Грома',
                description: 'Кот, который управляет молниями',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/thunder_lord.png'
            },
            frostQueen: {
                id: 'frostQueen',
                name: 'Королева Мороза',
                description: 'Кошка, которая создает снежинки',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/frost_queen.png'
            },
            stormBringer: {
                id: 'stormBringer',
                name: 'Приносящий Бурю',
                description: 'Кот, который вызывает штормы',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/storm_bringer.png'
            },
            earthGuardian: {
                id: 'earthGuardian',
                name: 'Страж Земли',
                description: 'Кот, который защищает природу',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/earth_guardian.png'
            },
            lightBearer: {
                id: 'lightBearer',
                name: 'Носитель Света',
                description: 'Кот, который излучает солнечный свет',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/light_bearer.png'
            },
            shadowWalker: {
                id: 'shadowWalker',
                name: 'Странник Теней',
                description: 'Кот, который путешествует между мирами',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/shadow_walker.png'
            },
            starChild: {
                id: 'starChild',
                name: 'Дитя Звезд',
                description: 'Кот, рожденный из звездной пыли',
                rarity: 'epic',
                stars: 4,
                imageUrl: 'assets/images/cats/star_child.png'
            },
            // Legendary cats (5 stars)
            cosmicGuardian: {
                id: 'cosmicGuardian',
                name: 'Космический Страж',
                description: 'Древний кот, хранящий тайны вселенной',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/cosmic_guardian.png'
            },
            timeMaster: {
                id: 'timeMaster',
                name: 'Повелитель Времени',
                description: 'Мудрый кот, способный путешествовать во времени',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/time_master.png'
            },
            dragonHeart: {
                id: 'dragonHeart',
                name: 'Сердце Дракона',
                description: 'Кот с сердцем дракона и крыльями',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/dragon_heart.png'
            },
            eternalPhoenix: {
                id: 'eternalPhoenix',
                name: 'Вечный Феникс',
                description: 'Кот, который возрождается из пепла',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/eternal_phoenix.png'
            },
            celestialEmperor: {
                id: 'celestialEmperor',
                name: 'Небесный Император',
                description: 'Кот, правитель звездных королевств',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/celestial_emperor.png'
            },
            voidWalker: {
                id: 'voidWalker',
                name: 'Странник Пустоты',
                description: 'Кот, который путешествует между измерениями',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/void_walker.png'
            },
            ancientOne: {
                id: 'ancientOne',
                name: 'Древний',
                description: 'Кот, который помнит начало времен',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/ancient_one.png'
            },
            dreamWeaver: {
                id: 'dreamWeaver',
                name: 'Ткач Снов',
                description: 'Кот, который создает миры во снах',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/dream_weaver.png'
            },
            starForge: {
                id: 'starForge',
                name: 'Кузница Звезд',
                description: 'Кот, который создает новые звезды',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/star_forge.png'
            },
            cosmicOracle: {
                id: 'cosmicOracle',
                name: 'Космический Оракул',
                description: 'Кот, который знает судьбу вселенной',
                rarity: 'legendary',
                stars: 5,
                imageUrl: 'assets/images/cats/cosmic_oracle.png'
            }
        };

        // Элементы DOM для управления кошками
        this.elements = {
            catsPanel: document.querySelector('.cats-panel'),
            catsContainer: document.getElementById('cats-container'),
            activeCatsCount: document.getElementById('active-cats-count'),
            maxCatsCount: document.getElementById('max-cats-count')
        };

        // Добавляем кнопку закрытия
        this.addCloseButton();
    }

    /**
     * Добавляет кнопку закрытия к панели кошек
     */
    addCloseButton() {
        if (!this.elements.catsPanel) {
            this.elements.catsPanel = document.querySelector('.cats-panel');
        }
        
        if (this.elements.catsPanel) {
            // Удаляем существующую кнопку закрытия, если она есть
            const existingButton = this.elements.catsPanel.querySelector('.close-button');
            if (existingButton) {
                existingButton.remove();
            }

            // Создаем новую кнопку закрытия
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '×';
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем всплытие события
                this.elements.catsPanel.style.display = 'none';
            });

            // Добавляем кнопку в начало панели
            this.elements.catsPanel.insertBefore(closeButton, this.elements.catsPanel.firstChild);
        }
    }

    /**
     * Обновление данных о кошках
     * @param {Object} userData - Данные пользователя
     */
    updateCats(userData) {
        if (!userData) return;

        // Обновляем список кошек
        if (userData.cats) {
            this.cats = userData.cats;
        }

        // Обновляем отображение
        this.updateDisplay();
    }

    /**
     * Обновление отображения кошек
     */
    updateDisplay() {
        if (!this.elements.catsContainer) {
            this.elements.catsContainer = document.getElementById('cats-container');
        }

        // Проверяем наличие кнопки закрытия и добавляем её, если нужно
        this.addCloseButton();

        if (!this.elements.catsContainer) {
            console.error('Контейнер для кошек не найден');
            return;
        }

        // Очищаем контейнер
        this.elements.catsContainer.innerHTML = '';

        // Если у пользователя нет кошек, показываем сообщение
        if (this.cats.length === 0) {
            const noCatsMsg = document.createElement('div');
            noCatsMsg.className = 'no-cats-message';
            noCatsMsg.textContent = 'У вас пока нет кошек. Постройте дома, чтобы привлечь кошек в поселение!';
            this.elements.catsContainer.appendChild(noCatsMsg);
            return;
        }

        // Создаем список кошек
        const catsList = document.createElement('div');
        catsList.className = 'cats-list';

        // Сортируем кошек по редкости
        const sortedCats = [...this.cats].sort((a, b) => {
            const aInfo = this.catsInfo[a.catId];
            const bInfo = this.catsInfo[b.catId];
            const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
            return rarityOrder[bInfo.rarity] - rarityOrder[aInfo.rarity];
        });

        // Создаем элементы списка
        sortedCats.forEach(cat => {
            const catInfo = this.catsInfo[cat.catId];
            if (!catInfo) return;

            const listItem = document.createElement('div');
            listItem.className = `cat-list-item ${catInfo.rarity}`;
            listItem.dataset.catId = cat.catId;

            // Создаем миниатюру
            const thumbnail = document.createElement('div');
            thumbnail.className = 'cat-thumbnail';
            thumbnail.style.backgroundImage = `url('${catInfo.imageUrl}')`;
            listItem.appendChild(thumbnail);

            // Создаем информацию
            const info = document.createElement('div');
            info.className = 'cat-list-info';

            // Имя кошки
            const name = document.createElement('div');
            name.className = 'cat-list-name';
            name.textContent = catInfo.name;
            info.appendChild(name);

            // Редкость и звезды
            const rarityStars = document.createElement('div');
            rarityStars.className = 'cat-list-rarity-stars';
            rarityStars.innerHTML = `${this.getRarityName(catInfo.rarity)} • ${catInfo.stars}⭐`;
            info.appendChild(rarityStars);

            listItem.appendChild(info);

            // Добавляем обработчик клика
            listItem.addEventListener('click', () => this.showCatCard(cat.catId));

            catsList.appendChild(listItem);
        });

        this.elements.catsContainer.appendChild(catsList);

        // Обновляем общее количество звезд
        const totalStars = this.getTotalStars();
        const totalStarsElement = document.getElementById('total-stars-count');
        if (totalStarsElement) {
            totalStarsElement.textContent = totalStars;
        }
    }

    /**
     * Показывает детальную карточку кошки
     * @param {string} catId - ID кошки
     */
    showCatCard(catId) {
        const cat = this.cats.find(c => c.catId === catId);
        const catInfo = this.catsInfo[catId];
        
        if (!cat || !catInfo) return;

        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'cat-card-modal';
        
        // Создаем карточку
        const card = this.createCatCard(cat, catInfo);
        modal.appendChild(card);

        // Добавляем кнопку закрытия
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close-button';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => modal.remove();
        modal.appendChild(closeButton);

        // Добавляем обработчик клика вне карточки
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Добавляем модальное окно на страницу
        document.body.appendChild(modal);
    }

    /**
     * Создает DOM-элемент карточки кошки
     * @param {Object} cat - Данные о кошке пользователя
     * @param {Object} catInfo - Полная информация о кошке
     * @returns {HTMLElement} - Элемент карточки кошки
     */
    createCatCard(cat, catInfo) {
        const catCard = document.createElement('div');
        catCard.className = `cat-card-baseball ${catInfo.rarity}`;
        catCard.dataset.catId = cat.catId;

        // Создаем верхнюю часть карточки с изображением и редкостью
        const cardTop = document.createElement('div');
        cardTop.className = 'card-top';

        // Уровень карточки (слева сверху)
        const cardLevel = document.createElement('div');
        cardLevel.className = 'card-level';
        cardLevel.textContent = catInfo.stars;
        cardTop.appendChild(cardLevel);

        // Создаем изображение кошки
        const catImage = document.createElement('div');
        catImage.className = 'cat-image-baseball';
        catImage.style.backgroundImage = `url('${catInfo.imageUrl}')`;
        cardTop.appendChild(catImage);

        // Добавляем метку редкости в верхней части
        const rarityBadge = document.createElement('div');
        rarityBadge.className = `rarity-badge ${catInfo.rarity}`;
        rarityBadge.textContent = this.getRarityName(catInfo.rarity);
        cardTop.appendChild(rarityBadge);

        catCard.appendChild(cardTop);

        // Создаем нижнюю часть карточки с информацией
        const cardBottom = document.createElement('div');
        cardBottom.className = 'card-bottom';

        // Имя кошки
        const catName = document.createElement('div');
        catName.className = 'cat-name-baseball';
        catName.textContent = catInfo.name;
        cardBottom.appendChild(catName);

        // Описание кошки
        const catDescription = document.createElement('div');
        catDescription.className = 'cat-description';
        catDescription.textContent = catInfo.description;
        cardBottom.appendChild(catDescription);

        // Звезды кошки (число в правом нижнем углу)
        const catStars = document.createElement('div');
        catStars.className = 'cat-stars-baseball';
        catStars.innerHTML = `${catInfo.stars}⭐`;
        cardBottom.appendChild(catStars);

        catCard.appendChild(cardBottom);

        return catCard;
    }

    /**
     * Получает название редкости на русском
     * @param {string} rarity - Код редкости
     * @returns {string} - Название редкости
     */
    getRarityName(rarity) {
        const rarityNames = {
            common: 'Обычная',
            uncommon: 'Необычная',
            rare: 'Редкая',
            epic: 'Эпическая',
            legendary: 'Легендарная'
        };
        return rarityNames[rarity] || rarity;
    }

    /**
     * Получает список всех кошек
     * @returns {Array} - Массив кошек
     */
    getAllCats() {
        return this.cats.map(cat => {
            const catInfo = this.catsInfo[cat.catId];
            return { ...cat, info: catInfo };
        });
    }

    /**
     * Показывает панель кошек
     */
    showCatsPanel() {
        if (!this.elements.catsPanel) {
            this.elements.catsPanel = document.querySelector('.cats-panel');
        }
        
        if (this.elements.catsPanel) {
            this.elements.catsPanel.style.display = 'block';
            this.updateDisplay();
        }
    }

    /**
     * Добавляет новую кошку пользователю
     * @param {string} catId - ID кошки для добавления
     */
    async addNewCat(catId) {
        try {
            // Проверяем, есть ли уже такая кошка
            if (this.hasCat(catId)) return;

            // Проверяем, существует ли информация о кошке
            if (!this.catsInfo[catId]) {
                console.error('Информация о кошке не найдена:', catId);
                return;
            }

            // Добавляем кошку в список
            this.cats.push({
                catId: catId
            });

            // Обновляем отображение
            this.updateDisplay();

            // Показываем сообщение
            alert(`Поздравляем! К вам присоединился новый кот: ${this.catsInfo[catId].name}`);

            // Сохраняем изменения в локальное хранилище
            const userData = this.storage.getUserData() || {};
            userData.cats = this.cats;
            this.storage.saveUserData(userData);
            
            // Обновляем звезды в интерфейсе игрока, если MainScene доступна
            if (window.mainScene && typeof window.mainScene.updatePlayerInterface === 'function') {
                window.mainScene.updatePlayerInterface();
            }

            return true;
        } catch (error) {
            console.error('Ошибка при добавлении кошки:', error);
            return false;
        }
    }

    /**
     * Проверяет, есть ли у пользователя определенная кошка
     * @param {string} catId - ID кошки
     * @returns {boolean} - Есть ли кошка у пользователя
     */
    hasCat(catId) {
        return this.cats.some(cat => cat.catId === catId);
    }

    /**
     * Возвращает общее количество звезд со всех карточек котов
     * @returns {number} - Общее количество звезд
     */
    getTotalStars() {
        let totalStars = 0;
        
        // Если у игрока есть кошки, считаем звезды
        if (this.cats && this.cats.length > 0) {
            this.cats.forEach(cat => {
                const catInfo = this.catsInfo[cat.catId];
                if (catInfo && catInfo.stars) {
                    totalStars += catInfo.stars;
                }
            });
        }
        
        // Обновляем отображение в панели кошек, если она открыта
        const totalStarsElement = document.getElementById('total-stars-count');
        if (totalStarsElement) {
            totalStarsElement.textContent = totalStars;
        }
        
        return totalStars;
    }

    /**
     * Добавляет следующую доступную кошку из списка
     * @returns {Promise<boolean>} - Успешно ли добавлена кошка
     */
    async unlockNextCat() {
        try {
            // Получаем список всех доступных кошек
            const catIds = Object.keys(this.catsInfo);
            
            // Находим первую кошку, которой у нас еще нет
            const nextCatId = catIds.find(catId => !this.hasCat(catId));
            
            if (!nextCatId) {
                alert('У вас уже есть все доступные кошки!');
                return false;
            }

            // Добавляем кошку
            await this.addNewCat(nextCatId);
            
            // Сохраняем изменения в локальное хранилище
            const userData = this.storage.getUserData() || {};
            userData.cats = this.cats;
            this.storage.saveUserData(userData);

            // Обновляем звезды в интерфейсе игрока
            if (window.mainScene && typeof window.mainScene.updatePlayerInterface === 'function') {
                window.mainScene.updatePlayerInterface();
            }

            return true;
        } catch (error) {
            console.error('Ошибка при добавлении кошки:', error);
            return false;
        }
    }
}