let speed = 1;
let score = 0;
let timeLeft = 30;
let uibyeong = document.getElementById("uibyeong");
let samurai = document.getElementById("samurai");
let cheerSound = document.getElementById("cheer-sound");

function increaseSpeed() {
  speed += 1;
  score += 10;
  document.getElementById("score").innerText = "점수: " + score;
  document.getElementById("cheer-sound").play();

  let fill = document.getElementById("gauge-fill");
  let currentWidth = parseInt(fill.style.width) || 0;
  let newWidth = Math.min(currentWidth + 10, 100);
  fill.style.width = newWidth + "%";

  // 응원 아바타 반응
  document.querySelectorAll(".supporter").forEach(s => {
    s.style.animation = "cheer 0.5s ease-in-out";
    setTimeout(() => s.style.animation = "bounceMove 5s linear infinite", 500);
  });
}

function moveUibyeong() {
  let uibyeongPos = parseInt(uibyeong.style.left || 0);
  uibyeongPos += speed;
  uibyeong.style.left = uibyeongPos + "px";

  let samuraiPos = parseInt(window.getComputedStyle(samurai).left);
  if (uibyeongPos + 100 >= samuraiPos) {
    alert("의병장이 사무라이를 잡았습니다! 🎉");
    clearInterval(gameLoop);
    clearInterval(timer);
  }
}

let gameLoop = setInterval(moveUibyeong, 100);

let timer = setInterval(() => {
  timeLeft--;
  document.getElementById("timer").innerText = "남은 시간: " + timeLeft + "초";
  if (timeLeft <= 0) {
    clearInterval(timer);
    clearInterval(gameLoop);
    alert("시간 초과! 사무라이를 놓쳤습니다.");
  }
}, 1000);
