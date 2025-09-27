let score = 0;
let timeLeft = 30;
let energy = 0;
let gameOver = false;

let samuraiPosition = 80;
let uibyeongPosition = 95;
const samuraiSpeed = 0.3;
let uibyeongSpeed = 0.3; // 기본 속도 부여

let timerInterval;
let moveInterval;

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
  samuraiPosition = 80;
  uibyeongPosition = 95;
  uibyeongSpeed = 0.3; // 다시 시작 시에도 기본 속도 부여

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '0%';
  restartBtn.style.display = 'none';
  clickBtn.style.display = 'inline-block';

  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;

  clickBtn.addEventListener('click', increaseEnergy);
  restartBtn.removeEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveCharacters, 100);
}

function increaseEnergy() {
  if (gameOver) return;
  energy = Math.min(energy + 5, 100);
  gaugeFill.style.width = `${energy}%`;
  score += 10;
  scoreDisplay.textContent = `점수: ${score}`;
  uibyeongSpeed += 0.05; // 클릭 시 가속도 증가
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  if (timeLeft <= 0) {
    endGame('⏱ 시간 초과! 사무라이가 도망쳤습니다.');
  }
}

function moveCharacters() {
  if (gameOver) return;

  samuraiPosition -= samuraiSpeed;
  uibyeongPosition -= uibyeongSpeed;

  samuraiPosition = Math.max(samuraiPosition, 0);
  uibyeongPosition = Math.max(uibyeongPosition, 0);

  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;

  checkCollision();
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
  clickBtn.removeEventListener('click', increaseEnergy);
  gameOver = true;

  alert(message);
  restartBtn.style.display = 'inline-block';
  clickBtn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', startGame);
