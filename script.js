// 초기 변수 설정
let score = 0;
let timeLeft = 60;
let energy = 100;
let timerInterval;
let energyInterval;
let gameOver = false;

// DOM 요소 참조
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gaugeFill = document.getElementById('gauge-fill');
const uibyeong = document.getElementById('uibyeong');
const samurai = document.getElementById('samurai');

// 게임 시작
function startGame() {
  score = 0;
  timeLeft = 60;
  energy = 100;
  gameOver = false;

  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '100%';

  uibyeong.addEventListener('click', increaseScore);

  timerInterval = setInterval(updateTimer, 1000);
  energyInterval = setInterval(decreaseEnergy, 1000);
}

// 점수 증가
function increaseScore() {
  if (gameOver) return;
  score += 10;
  scoreDisplay.textContent = `점수: ${score}`;
}

// 타이머 감소
function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  if (timeLeft <= 0) {
    endGame('⏱ 시간이 다 되었습니다!');
  }
}

// 에너지 감소
function decreaseEnergy() {
  energy -= 2;
  gaugeFill.style.width = `${energy}%`;
  if (energy <= 0) {
    endGame('⚡ 에너지가 소진되었습니다!');
  }
}

// 충돌 체크 (사무라이와 의병장)
function checkCollision() {
  const samuraiRect = samurai.getBoundingClientRect();
  const uibyeongRect = uibyeong.getBoundingClientRect();

  if (
    samuraiRect.left < uibyeongRect.right &&
    samuraiRect.right > uibyeongRect.left &&
    samuraiRect.top < uibyeongRect.bottom &&
    samuraiRect.bottom > uibyeongRect.top
  ) {
    endGame('🎯 사무라이에게 잡혔습니다!');
  }
}

// 게임 종료
function endGame(message) {
  clearInterval(timerInterval);
  clearInterval(energyInterval);
  uibyeong.removeEventListener('click', increaseScore);
  gameOver = true;

  alert(message);
  resetGame();
}

// 게임 초기화
function resetGame() {
  score = 0;
  timeLeft = 60;
  energy = 100;
  scoreDisplay.textContent = `점수: ${score}`;
  timerDisplay.textContent = `남은 시간: ${timeLeft}초`;
  gaugeFill.style.width = '100%';
}

// 충돌 체크 반복
setInterval(() => {
  if (!gameOver) {
    checkCollision();
  }
}, 100);

// 게임 시작 호출
startGame();
