let score = 0;
let timeLeft = 30;
let energy = 0;
let timerInterval;
let moveInterval;
let collisionInterval;
let gameOver = false;
let uibyeongPosition = 95;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');
const restartBtn = document.getElementById('restartBtn');
const clickBtn = document.getElementById('clickBtn');

function startGame() {
  score = 0;
  timeLeft = 30;
  energy = 0;
  gameOver = false;
  uibyeongPosition = 95;

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '0%';
  restartBtn.style.display = 'none';
  clickBtn.style.display = 'inline-block';

  uibyeong.style.left = `${uibyeongPosition}%`;

  // 사무라이 애니메이션 재시작
  samurai.style.animation = 'none';
  samurai.offsetHeight; // 강제 리플로우
  samurai.style.animation = 'runLeft 30s linear forwards';
  samurai.style.left = '80%';

  clickBtn.addEventListener('click', increaseEnergy);
  restartBtn.removeEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveUibyeong, 100);
  collisionInterval = setInterval(checkCollision, 100);
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
  clearInterval(collisionInterval);
  clickBtn.removeEventListener('click', increaseEnergy);
  gameOver = true;

  alert(message);
  restartBtn.style.display = 'inline-block';
  clickBtn.style.display = 'none';
}

// 게임 시작
document.addEventListener('DOMContentLoaded', startGame);
