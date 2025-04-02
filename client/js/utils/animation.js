/**
 * Утилиты для анимации элементов
 */
class AnimationUtils {
    /**
     * Анимирует свойство элемента от одного значения к другому
     * @param {HTMLElement} element - HTML элемент
     * @param {string} property - CSS свойство
     * @param {number|string} from - Начальное значение
     * @param {number|string} to - Конечное значение
     * @param {number} duration - Длительность анимации в миллисекундах
     * @param {string} [unit=''] - Единица измерения (px, %, em и т.д.)
     * @param {Function} [easing=null] - Функция плавности
     * @returns {Promise} - Promise, который разрешается по окончании анимации
     */
    static animate(element, property, from, to, duration, unit = '', easing = null) {
        return new Promise(resolve => {
            if (!element) {
                console.error('Animation error: Element is not defined');
                resolve();
                return;
            }
            
            // Приводим значения к числам
            const fromValue = parseFloat(from);
            const toValue = parseFloat(to);
            const totalChange = toValue - fromValue;
            
            const startTime = performance.now();
            
            // Функция обновления анимации
            function update() {
                const currentTime = performance.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Применяем функцию плавности, если она указана
                const easedProgress = easing ? easing(progress) : progress;
                
                // Рассчитываем текущее значение
                const currentValue = fromValue + totalChange * easedProgress;
                
                // Обновляем свойство
                element.style[property] = `${currentValue}${unit}`;
                
                // Продолжаем анимацию, если она не завершена
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    resolve();
                }
            }
            
            // Запускаем анимацию
            requestAnimationFrame(update);
        });
    }
    
    /**
     * Анимация появления элемента с затуханием
     * @param {HTMLElement} element - HTML элемент
     * @param {number} duration - Длительность анимации в миллисекундах
     */
    static fadeIn(element, duration = 300) {
        if (!element) return Promise.resolve();
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        return this.animate(element, 'opacity', 0, 1, duration);
    }
    
    /**
     * Анимация исчезновения элемента с затуханием
     * @param {HTMLElement} element - HTML элемент
     * @param {number} duration - Длительность анимации в миллисекундах
     */
    static fadeOut(element, duration = 300) {
        if (!element) return Promise.resolve();
        
        return this.animate(element, 'opacity', 1, 0, duration)
            .then(() => {
                element.style.display = 'none';
            });
    }
    
    /**
     * Функции плавности (easing functions)
     */
    static easing = {
        // Линейная функция
        linear: t => t,
        
        // Плавное начало
        easeInQuad: t => t * t,
        
        // Плавное окончание
        easeOutQuad: t => t * (2 - t),
        
        // Плавное начало и окончание
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        
        // Плавное отскакивание
        bounce: t => {
            const a = 4 / 11;
            const b = 8 / 11;
            const c = 9 / 10;
            
            const ca = 4356 / 361;
            const cb = 35442 / 1805;
            const cc = 16061 / 1805;
            
            const t2 = t * t;
            
            return t < a
                ? 7.5625 * t2
                : t < b
                    ? 9.075 * t2 - 9.9 * t + 3.4
                    : t < c
                        ? ca * t2 - cb * t + cc
                        : 10.8 * t * t - 20.52 * t + 10.72;
        }
    };
}
