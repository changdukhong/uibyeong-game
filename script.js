let score = 0;
let timeLeft = 30;
let energy = 0;
let gameOver = false;

let samuraiPosition = 75;
let uibyeongPosition = 95;

const baseSpeed = 0.13;
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
let battlefield_rect;   // 테스트용 <<<<<<<<<
let flipIntervalId = null;

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
const cheeringTicker = "비유장군! 적군이 도망갑니다. 적장 잡으러 돌격...,  와!,  와!,  의병장 할아버지, 힘내세요! 왜장(사무라이)을 반드시 잡아요! ";
const standbyTicker = "조선시대 임진(1592)/정유(1597) 전쟁 시 척제공 장몽기 의병장께서 활동하신 전투장소를 배경으로 한 감란의병 게임 시뮬레이션입니다. (척제공 장몽기 의병역사자료관[블로그])";


// const duration = 3000; // 비행 시간 3초
// const vy = 0.8;        // 초기 수직 속도 증가
const speed = 1.2;       // 속도 줄이기
const gravity = 0.002;   // 중력 증가

function getCheeringTicker(battleId) {
  const battleNames = {
    battlefield01: "감란의병 전투 : 임진년(1592) ~ 정유년(1597)까지 척제공 장몽기 의병장이 감란일기를 통하여 경상도 지역에서 왜적에 대항하여 의병 항쟁을 벌이신 감란의병 전투 일기이다. ",
    battlefield02: "화원 전투(1592.04.) : 와룡산 아래 병영을 세우고 화원 길 옆에 병사를 매복시켜 왜군을 수차례 공격하여 승리로 이끌고 전세를 반전시킨 전투이다.  ",
    battlefield03: "해안-화담 전투(1592.04.26.) : 왜군이 해안을 점령했다는 급보에 단번에 내달아 적군을 격파하고 화담까지 추격, 적군을 담수에 빠뜨려 익사시킨 전투이다. ",
    battlefield04: "경림 전투(1592.05.05) : 왜군이 경림 현성에 양식을 약탈하자 최동보와 함께 병사들을 부락과 삼림에 은폐시키고, 화공으로 적을 혼란에 빠뜨려 크게 이긴 전투이다. ",
    battlefield05: "화원일대 전투(1592.08.19.) : 장공은 수백명의 병사들을 수정동, 법교동에 매복시키고, 참대롱과 횃불로 일제히 적군을 향해 돌격하여 적을 강물에 빠지게 하여 큰 승리로 이끈 전투이다.  ",
    battlefield06: "모량천-당현 전투(1592.08.25~26.) : 조성, 백상대와 함께 세갈래 횃불을 준비하여, 왜장 가등청정이 진격해오자 매복한 병사들이 활과 화공으로 공격하여 수많은 왜군을 참수한 전투이다.  ",
    battlefield07: "함창/당교 전투(1593.02.21.) : 순찰사 한효순 칠군군대와 곽재우, 이눌, 김응생, 장몽기, 김응하, 이계수, 백여광, 최동보 등의 연합군이 구성되어 당교까지 진격하여 적군을 대파한 전투이다. ",
    battlefield08: "당현-삼구 전투(1593.05.21.) : 장공은 산과 들판에 흩어진 병사들을 집결시켜 당현에 주둔해 있던 왜군을 추격하여 격파하고, 패주하는 적을 삼구지방까지 계속 추격한 전투이다. ",
    battlefield09: "창암 전투(1594.07.02.) : 장공은 신령에 진군하여 권응수, 이곡과 함께 연합작전을 펼쳐 창암에서 왜군을 맞아 치열한 전투를 벌였고, 적장은 팔이 절단되는 중상을 입고 패주한 전투이다. ",
    battlefield10: "화왕산성 전투(1597.08.18.) : 의병군들은 화왕산에 진을 치고, 왜군 가등청정의 대규모 병력이 쳐들어오자, 곽재우, 최동보, 손처약 등은 붉은 옷을 입고 적군을 혼란시키며 방어하여 북상 진격을 크게 저지한 전투이다. ",
    battlefield11: "달성 전투(1597.08.29.) : 왜군이 팔공산성에 접근하자 관찰사 이용순, 병마사 김응서와 함께 장몽기, 권응수, 최동보 병력 1000여명이 모여 여러차례 격전을 벌였고, 6일간 8차례 교전에서 큰 승리로 이끈 전투이다. ",
    battlefield12: "함창/당교 전투(1597.12.05.) : 장공이 당교를 지나던 중 갑작스런 왜군의 포위공격을 받아 아침 6시부터 저녁 7시까지 장시간 치열한 전투를 벌였으나, 진퇴양난 상황에서 적의 총탄에 맞아 장렬히 전사한 전투이다. "
  };
  
  const battleName = battleNames[battleId] || "감란의병 전투";
  //const cheeringTicker = "비유장군! 적군이 도망갑니다. 적장을 빨리 잡아라..., 와!, 와!, 의병장 할아버지, 힘내세요! 왜장(사무라이)을 반드시 잡아요!";
  const cheeringTicker = "[감란일기 중에서... 발췌]";
  return `${battleName} ${cheeringTicker}`;
  // console.log("battleId:", battleId);
  // console.log("battleName:", battleName);
  // return `${battleName}: ${cheeringTicker}`;
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function showCommanderPortrait() {
  const portraitImage = document.getElementById('portrait-image');
  const portraitContainer = document.getElementById('portrait-container');

  if (!portraitImage || !portraitContainer) {
    console.warn('portrait elements not found');
    return;
  }

  portraitContainer.style.display = 'block';

  // ✅ 기존 flip 타이머 제거
  if (flipIntervalId !== null) {
    clearInterval(flipIntervalId);
  }

  // ✅ 새 flip 타이머 설정
  flipIntervalId = setInterval(() => {
    portraitImage.classList.toggle('flip-horizontal');
  }, 7000);
}

function hideCommanderPortrait() {
  const portrait = document.getElementById('portrait-container');
  if (!portrait) return;
  portrait.style.display = 'none'; // 게임 시작 시 숨김
}


function showEagle() {
  const eagle = document.getElementById('eagle');
  eagle.style.display = 'block'; // 독수리 표시
}


function spawnAngledArrow() {
  const battlefield = document.getElementById('game-area');
  const rect = battlefield.getBoundingClientRect();

  const battlefieldWidth = rect.width;
  const battlefieldHeight = rect.height;

  const arrow = document.createElement('div');
  arrow.classList.add('arrow');

  // 시작 위치: battlefield 기준 가운데
  const startX = battlefieldWidth / 2;
  const startY = 0;

  const angleDeg = Math.random() * 180;
  const angleRad = angleDeg * (Math.PI / 180);

  const speed = 0.6;
  const gravity = 0.002;

  const vx = speed * Math.cos(angleRad);
  const vy = speed * Math.sin(angleRad);

  const initialAngle = Math.atan2(vy, vx) * (180 / Math.PI);
  arrow.style.transform = `rotate(${initialAngle}deg)`;

  // 초기 위치: % 기준으로 배치
  const startXRatio = startX / battlefieldWidth;
  const startYRatio = startY / battlefieldHeight;
  arrow.style.left = `${startXRatio * 100}%`;
  arrow.style.top = `${startYRatio * 100}%`;
  arrow.style.position = 'absolute';
  arrow.style.transform += ' translate(-50%, -50%)';

  battlefield.appendChild(arrow);

  const startTime = Date.now();
  const duration = 3000;
  const interval = 20;

  const motion = setInterval(() => {
    const t = Date.now() - startTime;
    const x = startX + vx * t;
    const y = startY + vy * t + gravity * t * t;

    const xRatio = x / battlefieldWidth;
    const yRatio = y / battlefieldHeight;

    arrow.style.left = `${xRatio * 100}%`;
    arrow.style.top = `${yRatio * 100}%`;

    const angle = Math.atan2(vy + gravity * t * 2, vx) * (180 / Math.PI);
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    if (t >= duration - 500) {
      clearInterval(motion);

      const arrowYRatio = battlefieldHeight < 700 ? 0.85 : 0.90;
      // if (isMobileDevice()) {
      //   arrowYRatio -= 0.05; // 예: 0.90 → 0.85
      // }
      const finalYRatio = arrowYRatio;

      const stuckArrow = document.createElement('div');
      stuckArrow.classList.add('arrow');

      const offset = Math.floor(Math.random() * 60) - 30; // -30 ~ +29
      const finalAngle = angle + Math.floor(Math.random() * 61) - 30;

      stuckArrow.style.position = 'absolute';
      stuckArrow.style.left = `${xRatio * 100}%`;
      stuckArrow.style.top = `${finalYRatio * 100}%`;
      stuckArrow.style.transform = `translate(-50%, -50%) rotate(${finalAngle}deg)`;
      stuckArrow.style.zIndex = 101;
      stuckArrow.style.filter = 'brightness(1.5)';

      battlefield.appendChild(stuckArrow);

      // 중앙 붉은 점 (디버깅용)
      //const redDot = document.createElement('div');
      //redDot.style.position = 'absolute';
      //redDot.style.width = '10px';
      //redDot.style.height = '10px';
      //redDot.style.backgroundColor = 'red';
      //redDot.style.borderRadius = '50%';
      //redDot.style.left = '50%';
      //redDot.style.top = '50%';
      //redDot.style.transform = 'translate(-50%, -50%)';
      //redDot.style.zIndex = '999';
      //battlefield.appendChild(redDot);

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
  // eagle excursion in the sky
  const eagle = document.getElementById('eagle');
  eagle.style.display = 'none'; // 게임 시작 시 독수리 제거

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  hideCommanderPortrait(); // ✅ 초상화 숨김
  
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

  showEagle(); // 대기 상태에서 독수리 등장

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  showCommanderPortrait(); // ✅ 초상화 표시  
  
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
  // const battlefield_rect = battlefield.getBoundingClientRect(); // test용

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


































































































































































