let score = 0;
let timeLeft = 30;
let energy = 100;
let timerInterval;
let energyInterval;
let moveInterval;
let gameOver = false;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');
const restartBtn = document.getElementById('restartBtn');

function startGame() {
  score = 0;
  timeLeft = 30;
  energy = 100;
  gameOver = false;

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '100%';
  restartBtn.style.display = 'none';

  uibyeong.style.left = '0%';
  samurai.style.left = '80%';

  uibyeong.addEventListener('click', increaseScore);

  timerInterval = setInterval(updateTimer, 1000);
  energyInterval = setInterval(decreaseEnergy, 1000);
  moveInterval = setInterval(moveUibyeong, 100);

  // 충돌 체크 반복
  setInterval(() => {
    if (!gameOver) checkCollision();
  }, 100);
}

function increaseScore() {
  if (gameOver) return;
  score += 10;
  scoreDisplay.textContent = `점수: ${score}`;
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  if (timeLeft <= 0) {
    endGame('⏱ 시간 초과! 실패했습니다.');
  }
}

function decreaseEnergy() {
  energy -= 3;
  gaugeFill.style.width = `${energy}%`;
  if (energy <= 0) {
    endGame('⚡ 에너지가 소진되었습니다!');
  }
}

let uibyeongPosition = 0;
function moveUibyeong() {
  uibyeongPosition += 1;
  uibyeong.style.left = `${uibyeongPosition}%`;
  if (uibyeongPosition >= 80) {
    uibyeongPosition = 80;
  }
}

function checkCollision() {
  const samuraiRect = samurai.getBoundingClientRect();
  const uibyeongRect = uibyeong.getBoundingClientRect();

  if (
    samuraiRect.left < uibyeongRect.right &&
    samuraiRect.right > uibyeongRect.left &&
    samuraiRect.top < uibyeongRect.bottom &&
    samuraiRect.bottom > uibyeongRect.top
  ) {
    endGame('🎯 체포 성공!');
  }
}

function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(energyInterval);
  clearInterval(moveInterval);
  uibyeong.removeEventListener('click', increaseScore);
  gameOver = true;

  alert(message);
  restartBtn.style.display = 'inline-block';
}

