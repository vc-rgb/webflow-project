<script>
document.addEventListener('DOMContentLoaded', function() {
  const wordList = document.querySelector('[data-looping-words-list]');
  const words = Array.from(wordList.children);
  const totalWords = words.length;
  const wordHeight = 100 / totalWords;
  const edgeElement = document.querySelector('[data-looping-words-selector]');
  let currentIndex = 0;

  // Цвета
  const activeColor = '#c6a025'; // жёлтый (можно поменять)
  const inactiveColor = '#2c2c2c'; // серый

  // Устанавливаем исходный цвет всем словам
  words.forEach(word => gsap.set(word, { color: inactiveColor }));

  function highlightCenterWord() {
    const centerIndex = (currentIndex + 1) % totalWords;
    
    words.forEach((word, i) => {
      gsap.to(word, {
        color: i === centerIndex ? activeColor : inactiveColor,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }

  function updateEdgeWidth() {
    const centerIndex = (currentIndex + 1) % totalWords;
    const centerWord = words[centerIndex];
    const centerWordWidth = centerWord.getBoundingClientRect().width;
    const listWidth = wordList.getBoundingClientRect().width;
    const percentageWidth = (centerWordWidth / listWidth) * 100;

    gsap.to(edgeElement, {
      width: `${percentageWidth}%`,
      duration: 0.5,
      ease: 'Expo.easeOut'
    });
  }

  function moveWords() {
    currentIndex++;
    
    gsap.to(wordList, {
      yPercent: -wordHeight * currentIndex,
      duration: 1.2,
      ease: 'elastic.out(1, 0.85)',
      onStart: () => {
        updateEdgeWidth();
        highlightCenterWord();
      },
      onComplete: function() {
        if (currentIndex >= totalWords - 3) {
          wordList.appendChild(wordList.children[0]);
          currentIndex--;
          gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
          words.push(words.shift());
        }
      }
    });
  }

  updateEdgeWidth();
  highlightCenterWord();

  gsap.timeline({ repeat: -1, delay: 1 })
    .call(moveWords)
    .to({}, { duration: 2 })
    .repeat(-1);
});
</script>
