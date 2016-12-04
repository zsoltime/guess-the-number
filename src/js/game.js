const Game = (function () {
  'use strict';

  let target = 0;
  let min = 1;
  let max = 1000;
  let guess = '';
  let numberOfGuesses = 0;
  let timer = 0;
  let timerId = 0;

  function init() {
    target = random(min, max);

    // if no localstorage serve firsttime else show scores
    if (localStorage.getItem('g02guess')) {
      dom.startFirst.classList.add('hidden');
      dom.startPage.classList.remove('hidden');

      dom.bestGuesses.textContent = localStorage.getItem('g02guess');
      dom.bestTime.textContent = formatTime(localStorage.getItem('g02time'));
    }

    document.addEventListener('keydown', enterNumber);
    dom.start.addEventListener('click', startGame);

    render();
  }

  const dom = {
    min: document.getElementById('min'),
    max: document.getElementById('max'),
    guess: document.getElementById('guess'),
    guesses: document.getElementById('guesses'),
    bestGuesses: document.getElementById('bestguesses'),
    timer: document.getElementById('timer'),
    target: document.getElementById('target'),
    score: document.getElementById('score'),
    bestTime: document.getElementById('besttime'),
    start: document.getElementById('start'),
    splash: document.getElementsByClassName('splash')[0],
    startFirst: document.getElementsByClassName('start-first')[0],
    startPage: document.getElementsByClassName('start')[0],
    gameOver: document.getElementsByClassName('gameover')[0],
    game: document.getElementsByClassName('game')[0]
  };

  function render() {
    dom.min.textContent = min;
    dom.max.textContent = max;
    dom.guess.value = guess;
    dom.guesses.textContent = numberOfGuesses;
    displayTime();
  }

  function resetGame() {
    min = 1;
    max = 1000;
    guess = '';
    numberOfGuesses = 0;
    timer = 0;
    timerId = 0;
    target = random(min, max);
    render();
  }

  function startGame() {
    resetGame();
    dom.startFirst.classList.add('hidden');
    dom.startPage.classList.add('hidden');
    dom.splash.classList.add('hidden');
    dom.game.classList.remove('hidden');
    incTime();
  }

  function gameOver() {
    stopTimer();
    saveScore();
    dom.game.classList.add('hidden');
    dom.gameOver.classList.remove('hidden');
    dom.splash.classList.remove('hidden');

    dom.target.textContent = target;
    dom.score.textContent = numberOfGuesses;
  }

  function incTime() {
    timerId = setTimeout(function () {
      timer = timer + 1;
      displayTime();
      incTime();
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerId);
    // timerId = 0;
  }

  function displayTime() {
    dom.timer.textContent = formatTime(timer);
  }

  function formatTime(time) {
      let min = ('0' + Math.floor(time / 60)).slice(-2);
      let secs = ('0' + time % 60).slice(-2);
      return min + ':' + secs;
  }

  function enterNumber(event) {
    if (event.shiftKey === true) { return }

    if ((event.which >= 48 && event.which <= 57) ||
      (event.which >= 96 && event.which <= 105)) {
      event.preventDefault();

      let num = guess + event.which % 48;

      if (+num < max) {
        guess = num;
      }
    }

    // backspace
    if (event.which === 8) {
      event.preventDefault();
      guess = guess.length <= 1 ? '' : guess.slice(0, -1);
    }

    // ESC
    if (event.which === 27) {
      guess = '';
    }

    // enter
    if (event.which === 13 || event.which === 9) {
      event.preventDefault();
      if (!isNaN(+guess) && +guess > min && +guess < max) {
        numberOfGuesses += 1;
        checkGuess();
      }
      else {
        // make the guess number red and stop blinking for a moment
      }
    }
    render();
  }

  function checkGuess() {
    if (+guess === target) {
      gameOver();
    }
    else {
      adjustNumbers();
    }
  }

  function adjustNumbers() {
    if (guess < target) {
      min = guess;
    }
    else {
      max = guess;
    }
    guess = '';
    render();
  }

  function saveScore() {

    if (!localStorage.getItem('g02guess')) {
      localStorage.setItem('g02guess', numberOfGuesses);
      localStorage.setItem('g02time', timer);
    }
    else {
      if (numberOfGuesses < localStorage.getItem('g02guess')) {
        localStorage.setItem('g02guess', numberOfGuesses);
      }

      if (timer < localStorage.getItem('g02time')) {
        localStorage.setItem('g02time', timer);
      }
    }
  }

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    init: init
  }
})();

Game.init();
