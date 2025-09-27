let score = 0;
let timeLeft = 30;
let energy = 0;
let timerInterval;
let moveInterval;
let gameOver = false;
let uibyeongPosition = 80; // 시작 위치: 오른쪽

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');
const restartBtn = document.getElementById('restartBtn');

function startGame() {
  score = 0;
  timeLeft = 30;
  energy = 0;
  gameOver = false;
  uibyeongPosition = 80;

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '0%';
  restartBtn.style.display = 'none';

  uibyeong.style.left = `${uibyeongPosition}%`;
  samurai.style.left = '80%';
  samurai.style.animation = 'runLeft 30s linear forwards';

  uibyeong.addEventListener('click', increaseEnergy);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveUibyeong, 100);

  setInterval(() => {
    if (!gameOver) checkCollision();
  }, 100);
}

function increaseEnergy() {
  if (gameOver) return;
  energy = Math.min(energy + 5, 100);
  gaugeFill.style.width = `${energy}%`;
  score += 10;
  scoreDisplay.textContent = `점수: ${score}`;
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  if (timeLeft <= 0) {
    endGame('⏱ 시간 초과! 사무라이가 도망쳤습니다.');
  }
}

function moveUibyeong() {
  if (gameOver) return;
  uibyeongPosition -= energy * 0.05;
  uibyeongPosition = Math.max(uibyeongPosition, 0);
  uibyeong.style.left = `${uibyeongPosition}%`;
}

function checkCollision() {
  const samuraiRect = samurai.getBoundingClientRect();
  const uibyeongRect = uibyeong.getBoundingClientRect();

  if (
    samuraiRect.left < uibyeongRect.right &&
    samuraiRect.right > uibyeongRect.left
  ) {
    endGame('🎯 체포 성공!');
  }
}

function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(moveInterval);
  uibyeong.removeEventListener('click', increaseEnergy);
  gameOver = true;

  alert(message);
  restartBtn.style.display = 'inline-block';
}
