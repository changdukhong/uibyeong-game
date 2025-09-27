let score = 0;
let timeLeft = 30;
let energy = 0;
let gameOver = false;

let samuraiPosition = 80;
let uibyeongPosition = 95;

const baseSpeed = 0.2;
let samuraiSpeed = baseSpeed * 1.2; // 현실적인 도망 속도
let uibyeongSpeed = baseSpeed;

let timerInterval;
let moveInterval;
let energyDecayInterval;

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
  samuraiSpeed = baseSpeed * 1.2;
  uibyeongSpeed = baseSpeed;

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  updateGauge();

  restartBtn.style.display = 'none';
  clickBtn.style.display = 'inline-block';

  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;

  clickBtn.addEventListener('click', increaseEnergy);
  restartBtn.removeEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveCharacters, 30);
  energyDecayInterval = setInterval(decayEnergy, 100);
}

function increaseEnergy() {
  if (gameOver) return;
  energy = Math.min(energy + 5, 100);
  score += 10;
  scoreDisplay.textContent = `점수: ${score}`;
  updateGauge();
}

function decayEnergy() {
  if (gameOver) return;
  energy = Math.max(energy - 1, 0);
  updateGauge();
}

function updateGauge() {
  gaugeFill.style.width = `${energy}%`;
  gaugeFill.style.background = energy > 50 ? '#0f0' : energy > 20 ? '#ff0' : '#f00';
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

  // 의병장 속도: 최소 50% 유지 + 에너지 반영
  const minRatio = 0.5;
  const energyRatio = energy / 100;
  uibyeongSpeed = baseSpeed * (minRatio + energyRatio * (1 - minRatio));

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

  // ✅ 도망 여부 먼저 확인
  if (!gameOver && samuraiRect.left <= 0) {
    endGame('💨 사무라이가 도망쳤습니다!');
    return;
  }

  // 이후에 체포 여부 확인
  const uibyeongRect = uibyeong.getBoundingClientRect();
  const samuraiCenter = samuraiRect.left + samuraiRect.width / 2;
  const uibyeongCenter = uibyeongRect.left + uibyeongRect.width / 2;
  const distance = Math.abs(samuraiCenter - uibyeongCenter);

  if (!gameOver && distance <= 5) {
    endGame('🎯 체포 성공!');
  }
}

function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(moveInterval);
  clearInterval(energyDecayInterval);
  clickBtn.removeEventListener('click', increaseEnergy);
  gameOver = true;

  // 정지 처리
  samuraiSpeed = 0;
  uibyeongSpeed = 0;

  alert(message);

  // 위치 초기화
  samuraiPosition = 80;
  uibyeongPosition = 95;
  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;

  restartBtn.style.display = 'inline-block';
  clickBtn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', startGame);
