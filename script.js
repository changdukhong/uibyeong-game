let clickCount = 0;
let timeLeft = 30;
let energy = 0;
let gameOver = false;

let samuraiPosition = 75;
let uibyeongPosition = 95;

const baseSpeed = 0.0;       // 기본 속도 없음
const maxSpeed = 0.12;       // 최대 속도
const minRatio = 0.0;        // 클릭 없으면 완전 정지

let uibyeongSpeed = 0.0;

let timerInterval;
let moveInterval;
let energyDecayInterval;
let startTime;

const clickDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');
const restartBtn = document.getElementById('restartBtn');
const clickBtn = document.getElementById('clickBtn');

function startGame() {
  clickCount = 0;
  timeLeft = 30;
  energy = 0;
  gameOver = false;

  samuraiPosition = 75;
  uibyeongPosition = 95;
  uibyeongSpeed = 0.0;
  startTime = Date.now();

  clickDisplay.textContent = `클릭 수: ${clickCount}`;
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
  clickCount += 1;
  clickDisplay.textContent = `클릭 수: ${clickCount}`;
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

  // ⏱ 사무라이 시간 기반 이동
  const elapsed = Date.now() - startTime;
  const totalDuration = 30000;
  const progress = Math.min(elapsed / totalDuration, 1);
  samuraiPosition = 75 * (1 - progress);

  // 🏃 의병장 속도 계산 (클릭 없으면 정지)
  const energyRatio = energy / 100;
  uibyeongSpeed = maxSpeed * (minRatio + energyRatio * (1 - minRatio));
  uibyeongPosition -= uibyeongSpeed;

  samuraiPosition = Math.max(samuraiPosition, 0);
  uibyeongPosition = Math.max(uibyeongPosition, 0);

  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;

  checkCollision();
}

function checkCollision() {
  const samuraiRect = samurai.getBoundingClientRect();

  if (!gameOver && samuraiRect.left <= 0) {
    endGame('💨 사무라이가 도망쳤습니다!');
    return;
  }

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

  samurai.style.left = `75%`;
  uibyeong.style.left = `95%`;

  alert(message);

  restartBtn.style.display = 'inline-block';
  clickBtn.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', startGame);
