let score = 0;
let timeLeft = 30;
let energy = 0;
let gameOver = false;

let samuraiPosition = 75;
let uibyeongPosition = 95;

const baseSpeed = 0.2;
let uibyeongSpeed = baseSpeed;

let timerInterval;
let moveInterval;
let energyDecayInterval;
let startTime;
let supporterTimeout;
let lastClickTime = Date.now();

let clickCount = 0;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');
const restartBtn = document.getElementById('restartBtn');
const clickBtn = document.getElementById('clickBtn');

const supporter1 = document.getElementById('supporter1');
const supporter2 = document.getElementById('supporter2');
const supporter3 = document.getElementById('supporter3');
const supporter4 = document.getElementById('supporter4');

// const cheerSound = document.getElementById('cheerSound');

function startGame() {
  score = 0;
  clickCount = 0;
  scoreDisplay.textContent = `클릭 수: ${clickCount}`;

  timeLeft = 30;
  energy = 0;
  gameOver = false;

  samuraiPosition = 75;
  uibyeongPosition = 95;
  uibyeongSpeed = baseSpeed;
  startTime = Date.now();

  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  updateGauge();
  hideSupporters();

  restartBtn.style.display = 'none';
  clickBtn.style.display = 'inline-block';

  samurai.style.left = `${samuraiPosition}%`;
  uibyeong.style.left = `${uibyeongPosition}%`;


  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (!isMobile && cheerSound.paused) {
    cheerSound.currentTime = 0;
    cheerSound.play().catch(e => console.warn("PC 오디오 실패:", e));
  }

  setRandomBattlefield(); // ✅ 배경 랜덤 설정

  adjustCharacterBottom(); // ✅ 위치 조정

  document.body.removeEventListener('click', increaseEnergy);
  document.body.addEventListener('click', increaseEnergy);
  restartBtn.removeEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveCharacters, 30);
  energyDecayInterval = setInterval(decayEnergy, 100);
}

clickBtn.addEventListener('click', () => {
  if (gameOver) return;

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 모바일은 사용자 클릭 시 한 번만 재생
    if (cheerSound.paused) {
      cheerSound.currentTime = 0;
      cheerSound.play().catch(e => console.warn("모바일 오디오 실패:", e));
    }
  } else {
    // PC는 startGame에서 재생하고 클릭 시 건드리지 않음
    // 아무 것도 하지 않음
  }
});

function increaseEnergy() {
  if (gameOver) return;
  energy = Math.min(energy + 5, 100);
  clickCount += 1;
  scoreDisplay.textContent = `클릭 수: ${clickCount}`;
  updateGauge();

  lastClickTime = Date.now();
  showSupporters();
  bounceSupporters(); // ✅ 바운스 실행

  clearTimeout(supporterTimeout);
  supporterTimeout = setTimeout(() => {
    const now = Date.now();
    if (now - lastClickTime >= 1500) {
      hideSupporters();
    }
  }, 1600);
}


function decayEnergy() {
  if (gameOver) return;
  energy = Math.max(energy - 2, 0);
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
    endGame('⏱ 시간 초과! 에휴, 놓쳤네…');
  }
}

function moveCharacters() {
  if (gameOver) return;

  const elapsed = Date.now() - startTime;
  const totalDuration = 30000;
  const progress = Math.min(elapsed / totalDuration, 1);
  samuraiPosition = 75 * (1 - progress);

  const energyRatio = energy / 100;
  const minRatio = 0.2;
  uibyeongSpeed = baseSpeed * (minRatio + energyRatio * (1 - minRatio));
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
    endGame('💨 에휴, 놓쳤네…');
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
  document.body.removeEventListener('click', increaseEnergy);
  clearInterval(timerInterval);
  clearInterval(moveInterval);
  clearInterval(energyDecayInterval);
  clickBtn.removeEventListener('click', increaseEnergy);
  gameOver = true;


  
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = ''; // ✅ 메시지 제거
  messageBox.classList.remove('hidden');

  // 사무라이 돌진 연출
  const samurai = document.getElementById('samurai');
  samurai.classList.add('charge');

  setTimeout(() => {
    samurai.classList.remove('charge');
  }, 2000);


  
  samurai.style.left = `75%`;
  uibyeong.style.left = `95%`;

  hideSupporters();

  cheerSound.pause();       // ✅ 함성 정지
  cheerSound.currentTime = 0;

 if (message.includes('체포')) {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showPopup(message); // ✅ 커스텀 팝업 실행

  restartBtn.style.display = 'inline-block';
  clickBtn.style.display = 'none';
}

function showSupporters() {
  supporter1.style.display = 'block';
  supporter2.style.display = 'block';
  supporter3.style.display = 'block';
  supporter4.style.display = 'block';
}

function hideSupporters() {
  supporter1.style.display = 'none';
  supporter2.style.display = 'none';
  supporter3.style.display = 'none';
  supporter4.style.display = 'none';
}

function bounceSupporters() {
  [supporter1, supporter2, supporter3, supporter4].forEach(s => {
    s.classList.remove('bounce');       // 기존 애니메이션 제거
    void s.offsetWidth;                 // 강제 리플로우
    s.classList.add('bounce');          // 다시 추가
  });
}

function adjustCharacterBottom() {
  const isMobile = window.innerWidth <= 768;
  const bottomValue = isMobile ? '10px' : '50px';

  samurai.style.bottom = bottomValue;
  uibyeong.style.bottom = bottomValue;
}

function showPopup(message) {
  document.getElementById('popup-message').textContent = message;
  document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('popup').classList.add('hidden');
}

function setRandomBattlefield() {
  const battlefield = document.getElementById('game-area');
  const backgrounds = [
    'images/battlefield01.png',
    'images/battlefield02.png',
    'images/battlefield03.png',
    'images/battlefield04.png',
    'images/battlefield05.png',
    'images/battlefield06.png',
    'images/battlefield07.png',
    'images/battlefield08.png',
    'images/battlefield09.png',
    'images/battlefield10.png',
    'images/battlefield11.png',
    'images/battlefield12.png'
  ];
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  battlefield.style.backgroundImage = `url('${backgrounds[randomIndex]}')`;
}

window.addEventListener('resize', adjustCharacterBottom);

document.addEventListener('DOMContentLoaded', startGame);






























