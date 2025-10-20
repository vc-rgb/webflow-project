/**
 * Casino Looping Words Animation
 * Вертикальная анимация слов с подсветкой и динамической рамкой
 * Requires: GSAP 3.12.5+
 */
<script>
(function() {
  'use strict';
  
  // Константы конфигурации
  const CONFIG = {
    colors: {
      active: '#c6a025',      // Золотой цвет активного слова
      inactive: '#2c2c2c'     // Серый цвет неактивных слов
    },
    timing: {
      moveDuration: 1.2,      // Длительность перехода между словами
      interval: 2,            // Пауза между переходами (сек)
      initialDelay: 1         // Начальная задержка (сек)
    },
    animation: {
      ease: 'elastic.out(1, 0.85)',  // Эффект анимации слов
      edgeEase: 'Expo.easeOut'        // Эффект анимации рамки
    }
  };

  // Инициализация при загрузке DOM
  document.addEventListener('DOMContentLoaded', initLoopingWords);

  function initLoopingWords() {
    // Получаем элементы
    const wordList = document.querySelector('[data-looping-words-list]');
    const edgeElement = document.querySelector('[data-looping-words-selector]');
    
    // Проверка наличия элементов
    if (!wordList || !edgeElement) {
      console.warn('Looping words: Required elements not found');
      return;
    }

    const words = Array.from(wordList.children);
    const totalWords = words.length;
    
    if (totalWords === 0) {
      console.warn('Looping words: No words found in list');
      return;
    }

    const wordHeight = 100 / totalWords;
    let currentIndex = 0;

    // Устанавливаем начальный цвет
    words.forEach(word => {
      gsap.set(word, { color: CONFIG.colors.inactive });
    });

    /**
     * Подсвечивает центральное слово
     */
    function highlightCenterWord() {
      const centerIndex = (currentIndex + 1) % totalWords;
      
      words.forEach((word, i) => {
        gsap.to(word, {
          color: i === centerIndex ? CONFIG.colors.active : CONFIG.colors.inactive,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    }

    /**
     * Обновляет ширину рамки под центральное слово
     */
    function updateEdgeWidth() {
      const centerIndex = (currentIndex + 1) % totalWords;
      const centerWord = words[centerIndex];
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      const percentageWidth = (centerWordWidth / listWidth) * 100;

      gsap.to(edgeElement, {
        width: `${percentageWidth}%`,
        duration: 0.5,
        ease: CONFIG.animation.edgeEase
      });
    }

    /**
     * Перемещает слова вверх с анимацией
     */
    function moveWords() {
      currentIndex++;
      
      gsap.to(wordList, {
        yPercent: -wordHeight * currentIndex,
        duration: CONFIG.timing.moveDuration,
        ease: CONFIG.animation.ease,
        onStart: () => {
          updateEdgeWidth();
          highlightCenterWord();
        },
        onComplete: function() {
          // Перестановка для бесконечного loop
          if (currentIndex >= totalWords - 3) {
            wordList.appendChild(wordList.children[0]);
            currentIndex--;
            gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
            words.push(words.shift());
          }
        }
      });
    }

    // Начальная настройка
    updateEdgeWidth();
    highlightCenterWord();

    // Запуск бесконечной анимации
    gsap.timeline({ 
      repeat: -1, 
      delay: CONFIG.timing.initialDelay 
    })
      .call(moveWords)
      .to({}, { duration: CONFIG.timing.interval })
      .repeat(-1);
  }
})();
```

<script>
