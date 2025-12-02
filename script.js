const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timeBoard = document.getElementById('time');
const startBtn = document.getElementById('start-btn');

let score = 0;
let time = 30;
let activeMole = null;
let gameInterval;
let countdownInterval;

const hitSound = new Audio('assets/hit.wav');
const missSound = new Audio('assets/miss.wav');

// 🎨 Bonus mole asset (optional)
let bonusImage = "assets/mole.png"; // Replace if you have golden mole


/* ----------------------------------- */
/* 🎮 START GAME                       */
/* ----------------------------------- */
startBtn.addEventListener('click', () => {
  score = 0;
  time = 30;

  scoreBoard.textContent = score;
  timeBoard.textContent = time;
  startBtn.disabled = true;

  // Start mole generator
  gameInterval = setInterval(showMole, 800);

  // Timer countdown
  countdownInterval = setInterval(() => {
    time--;
    timeBoard.textContent = time;

    if (time <= 0) {
      endGame();
    }
  }, 1000);
});

/* ----------------------------------- */
/* 🐹 SHOW MOLE                        */
/* ----------------------------------- */
function showMole() {
  // Remove previous mole
  if (activeMole !== null) {
    holes[activeMole].innerHTML = '';
  }

  const index = Math.floor(Math.random() * holes.length);
  const mole = document.createElement('img');

  // 💛 10% chance to spawn BONUS mole
  let isBonus = Math.random() < 0.1;
  mole.src = isBonus ? "assets/golden-mole.png" : "assets/mole.png";
  mole.classList.add('mole');

  holes[index].appendChild(mole);
  setTimeout(() => mole.classList.add('up'), 50);

  activeMole = index;

  // ⏱️ Randomized speed for arcade feeling
  let popTime = isBonus ? 600 : Math.floor(Math.random() * 500) + 500;

  setTimeout(() => {
    mole.classList.remove('up');

    setTimeout(() => {
      if (holes[index].contains(mole)) holes[index].removeChild(mole);
      activeMole = null;
    }, 250);

  }, popTime);
}

/* ----------------------------------- */
/* 🎯 CLICK EVENTS                     */
/* ----------------------------------- */
holes.forEach(hole => {
  hole.addEventListener('click', () => {
    const mole = hole.querySelector('.mole');

    // 💥 HIT
    if (mole && mole.classList.contains('up')) {
      mole.classList.remove('up');

      // BONUS POINT CHECK
      let isBonus = mole.src.includes("golden-mole");
      let points = isBonus ? 5 : 1;
      score += points;

      scoreBoard.textContent = score;
      hitSound.currentTime = 0;
      hitSound.play();

      createFloatingText(hole, `+${points}`);   // Floating +1 effect
      screenFlash();                             // Screen flash

      setTimeout(() => {
        if (hole.contains(mole)) hole.removeChild(mole);
        activeMole = null;
      }, 200);

    } else {
      // ❌ MISS
      missSound.currentTime = 0;
      missSound.play();
      shakeScreen();
    }
  });
});

/* ----------------------------------- */
/* ⭐ FLOATING SCORE TEXT              */
/* ----------------------------------- */
function createFloatingText(hole, text) {
  const float = document.createElement('div');
  float.classList.add('float-text');
  float.textContent = text;

  hole.appendChild(float);

  setTimeout(() => float.remove(), 800);
}

/* ----------------------------------- */
/* ⚡ SCREEN EFFECTS                   */
/* ----------------------------------- */
function screenFlash() {
  document.body.classList.add('hit-flash');
  setTimeout(() => document.body.classList.remove('hit-flash'), 150);
}

function shakeScreen() {
  document.body.classList.add('miss-shake');
  setTimeout(() => document.body.classList.remove('miss-shake'), 300);
}

/* ----------------------------------- */
/* 🏁 END GAME                         */
/* ----------------------------------- */
function endGame() {
  clearInterval(gameInterval);
  clearInterval(countdownInterval);

  alert(`GAME OVER!\nYour score: ${score}`);

  startBtn.disabled = false;
}
