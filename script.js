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
let arrowInterval;

let currentBattleId = ''; // 전역 변수로 선언
// let battleId = '';


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

const cheerSound = document.getElementById('cheerSound');
const characters = [document.getElementById('samurai'), document.getElementById('uibyeong')];
const effects = ['effect-bounce', 'effect-rotate', 'effect-scale'];

const tickerText = document.getElementById('ticker-text');
const cheeringTicker = "비유장군! 적군이 도망갑니다. 적장을 빨리 잡아라...,  와!,  와!,  의병장 할아버지, 힘내세요! 왜장(사무라이)을 반드시 잡아요! ";
const standbyTicker = "조선시대 임진(1592)/정유(1597) 전쟁 시 척제공 장몽기 의병장께서 활동하신 전투장소를 배경으로 한 감란의병 게임 시뮬레이션입니다. (척제공 장몽기 의병역사자료관[블로그])";


// const duration = 3000; // 비행 시간 3초
// const vy = 0.8;        // 초기 수직 속도 증가
const speed = 1.2;       // 속도 줄이기
const gravity = 0.002;   // 중력 증가

function getCheeringTicker(battleId) {
  const battleNames = {
    battlefield01: "감란의병 전투 ",
    battlefield02: "화원 전투(1592.04.) ",
    battlefield03: "해안-화담 전투(1592.04.26.) ",
    battlefield04: "경림 전투(1592.05.05) ",
    battlefield05: "화원일대 전투(1592.08.19.) ",
    battlefield06: "모량천-당현 전투(1592.08.25~26.) ",
    battlefield07: "함창/당교 전투(1593.02.21.) ",
    battlefield08: "당현-삼구 전투(1593.05.21.) ",
    battlefield09: "창암 전투(1594.07.02.) ",
    battlefield10: "화왕산성 전투(1597.08.18.) ",
    battlefield11: "달성 전투(1597.08.29.) ",
    battlefield12: "함창/당교 전투(1597.12.05.) "
  };
  
  const battleName = battleNames[battleId] || "감란의병 전투";
  const cheeringTicker = "비유장군! 적군이 도망갑니다. 적장을 빨리 잡아라..., 와!, 와!, 의병장 할아버지, 힘내세요! 왜장(사무라이)을 반드시 잡아요!";
  // console.log("battleId:", battleId);
  // console.log("battleName:", battleName);
  return `${battleName}: ${cheeringTicker}`;
}


function spawnAngledArrow() {
  const battlefield = document.getElementById('game-area');
  const rect = battlefield.getBoundingClientRect();

  // const battlefieldWidth = rect.width;
  // const battlefieldHeight = rect.height;
  const battlefieldWidth = rect.left + rect.width / 2;
  const battlefieldHeight = rect.top + rect.height / 2;
  
  const arrow = document.createElement('div');
  arrow.classList.add('arrow');

  const startX = window.innerWidth / 2;
  const startY = 0;

  const angleDeg = Math.random() * 180;
  const angleRad = angleDeg * (Math.PI / 180);

  const speed = 0.6;
  const gravity = 0.002;

  const vx = speed * Math.cos(angleRad);
  const vy = speed * Math.sin(angleRad);

  const initialAngle = Math.atan2(vy, vx) * (180 / Math.PI);
  arrow.style.transform = `rotate(${initialAngle}deg)`;
  arrow.style.left = `${startX}px`;
  arrow.style.top = `${startY}px`;

  document.getElementById('game-area').appendChild(arrow);

  const startTime = Date.now();
  const duration = 3000;
  const interval = 20;

  // 💾 화살 높이 저장
  const arrowHeight = arrow.offsetHeight;

  const motion = setInterval(() => {
    const t = Date.now() - startTime;
    const x = startX + vx * t;
    const y = startY + vy * t + gravity * t * t;

    arrow.style.left = `${x}px`;
    arrow.style.top = `${y}px`;

    const angle = Math.atan2(vy + gravity * t * 2, vx) * (180 / Math.PI);
    arrow.style.transform = `rotate(${angle}deg)`;

    // console.log('화살 각도:', angle); // 확인용


    if (t >= duration-500) {
      clearInterval(motion);
      // console.log('t:', t);      

      // const screenHeight = window.innerHeight;
      // const screenWidth = window.innerWidth;
      console.log(`battlefield 크기: ${battlefieldWidth} × ${battlefieldHeight}`);

      const arrowY = battlefieldHeight * 0.80; // 화면 하단 80% 지점
      // 모바일 보정 (예: 높이가 700px 이하일 경우)
      if (battlefieldHeight < 700) {
        arrowY = battlefieldHeight * 0.85; // 더 아래로 조정
      }

      const isNearBottom = y >= battlefieldHeight - 40;
      const isMidAngle = angle >= 45 && angle <= 135;
      
      // if (isNearBottom && isMidAngle) {
        const stuckArrow = document.createElement('div');
        stuckArrow.classList.add('arrow');
        stuckArrow.style.left = `${Math.abs(x)}px`;
        // stuckArrow.style.left = `${x}px`;
        const offset = Math.floor(Math.random() * 60) - 30; // -30 ~ +29
        stuckArrow.style.top = `${arrowY - arrowHeight + offset}px`;
      
        // stuckArrow.style.transform = `rotate(${angle}deg)`;
        const randomOffset = Math.floor(Math.random() * 61) - 30; // -30 ~ +30
        const finalAngle = angle + randomOffset;
        stuckArrow.style.transform = `rotate(${finalAngle}deg)`;

        stuckArrow.style.filter = 'brightness(1.5)'; // 🔆 밝기 증가
        stuckArrow.style.position = 'absolute';
        stuckArrow.style.zIndex = 101;

        document.getElementById('game-area').appendChild(stuckArrow);

        const redDot = document.createElement('div');
        redDot.style.position = 'absolute';
        redDot.style.width = '10px';
        redDot.style.height = '10px';
        redDot.style.backgroundColor = 'red';
        redDot.style.borderRadius = '50%';
        redDot.style.left = `${battlefieldWidth/2}px`;       
        redDot.style.top = `${battlefieldHeight/2}px`;       
        // redDot.style.top = `${arrowY - arrowHeight + offset}px`;  
        redDot.style.zIndex = '999';
        document.getElementById('game-area').appendChild(redDot);
      // }

      arrow.remove();
    }

  }, interval);
}



function speakTickerMessage() {
  const tickerText = document.getElementById('ticker-text').textContent;
  const utterance = new SpeechSynthesisUtterance(tickerText);
  utterance.lang = 'ko-KR';
  utterance.rate = 1.4;
  utterance.pitch = 1.2;
  utterance.volume = 1;

  // ✅ 남성 목소리 선택
  const voices = speechSynthesis.getVoices();
  const maleVoice = voices.find(v => v.lang === 'ko-KR' && v.name.includes('Male'));

  if (maleVoice) {
    utterance.voice = maleVoice;
  }

  speechSynthesis.speak(utterance);
}



const samuraiImages = [
  'images/samurai1.png',
  'images/samurai2.png'
];

let samuraiToggle = 0;

function assignAlternatingSamurai() {
  const samurai = document.getElementById('samurai');
  if (!samurai) return;

  samurai.style.backgroundImage = `url('${samuraiImages[samuraiToggle]}')`;
  samuraiToggle = (samuraiToggle + 1) % samuraiImages.length;
}


function applyRandomEffect(element) {
  const effect = effects[Math.floor(Math.random() * effects.length)];
  element.classList.add(effect);

  setTimeout(() => {
    element.classList.remove(effect);
  }, 600);
}

setInterval(() => {
  characters.forEach(applyRandomEffect);
}, 3000);


function startGame() {

  assignAlternatingSamurai();

  // ✅ 기존 화살 제거
  const existingArrows = document.querySelectorAll('.arrow');
  existingArrows.forEach(arrow => arrow.remove());


  // speakTickerMessage(); // 응원 메시지를 음성으로 출력


  
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

  tickerText.textContent = getCheeringTicker(currentBattleId);

  adjustCharacterBottom(); // ✅ 위치 조정

  document.body.removeEventListener('click', increaseEnergy);
  document.body.addEventListener('click', increaseEnergy);
  restartBtn.removeEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  timerInterval = setInterval(updateTimer, 1000);
  moveInterval = setInterval(moveCharacters, 30);
  energyDecayInterval = setInterval(decayEnergy, 100);

  // 🔥 포물선 화살 반복 생성 시작
  arrowInterval = setInterval(spawnAngledArrow, 1000); // 포물선 화살 반복


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

  tickerText.textContent = standbyTicker;

  document.body.removeEventListener('click', increaseEnergy);
  clearInterval(timerInterval);
  clearInterval(moveInterval);
  clearInterval(energyDecayInterval);
  clickBtn.removeEventListener('click', increaseEnergy);
  gameOver = true;

  
  clearInterval(arrowInterval); // 게임 종료 시 반복 중단

  
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

  const paddedNumber = String(randomIndex + 1).padStart(2, '0');
  currentBattleId = `battlefield${paddedNumber}`;

  // console.log("currentBattleId:", currentBattleId);

}

window.addEventListener('resize', adjustCharacterBottom);

document.addEventListener('DOMContentLoaded', startGame);










































































































































