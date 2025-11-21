document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script loaded");

  let score = 0;
  let specialNumber = 0;
  let multiplier = 1;
  let gameOver = false;

  // 🔥 로컬스토리지에서 랭킹 불러오기
  let ranking = JSON.parse(localStorage.getItem("rankingData") || "[]");

  // 화면 요소들
  const startScreen = document.getElementById('startScreen');
  const howToPlayScreen = document.getElementById('howToPlayScreen');
  const gameScreen = document.getElementById('gameScreen');

  const scoreEl = document.getElementById('score');
  const specialEl = document.getElementById('special');
  const multiplierEl = document.getElementById('multiplier');
  const diceValueEl = document.getElementById('diceValue');
  const messageEl = document.getElementById('message');
  const rankingListEl = document.getElementById('rankingList');

  const rollBtn = document.getElementById('rollBtn');
  const restartBtn = document.getElementById('restartBtn');
  const nameInputSection = document.getElementById('nameInputSection');
  const playerNameInput = document.getElementById('playerName');
  const submitNameBtn = document.getElementById('submitNameBtn');

  const startBtn = document.getElementById('startBtn');
  const confirmBtn = document.getElementById('confirmBtn');

  // 화면 전환
  startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    howToPlayScreen.classList.add('active');
  });

  confirmBtn.addEventListener('click', () => {
    howToPlayScreen.classList.remove('active');
    gameScreen.classList.add('active');
    restartGame();
    renderRanking(); // 저장된 랭킹 표시
  });

  function generateSpecialNumber() {
    specialNumber = Math.floor(Math.random() * 6) + 1;
    multiplier = Math.floor(Math.random() * 9) + 2;
    specialEl.textContent = specialNumber;
    multiplierEl.textContent = multiplier;
  }

  function rollDice() {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 7); // 0~6
    diceValueEl.textContent = dice;

    if (dice === 0) {
      gameOver = true;
      messageEl.textContent = "💥 폭탄(0)! 게임 종료!";
      nameInputSection.style.display = "block";
      return;
    }

    if (dice === specialNumber) {
      const addedScore = dice * multiplier;
      score += addedScore;
      messageEl.textContent = `⭐ 특별 숫자! ${multiplier}배 보너스로 ${addedScore}점 추가!`;
    } else {
      score += dice;
      messageEl.textContent = "";
    }

    scoreEl.textContent = score;
    generateSpecialNumber();
  }

  function restartGame() {
    score = 0;
    gameOver = false;
    scoreEl.textContent = score;
    diceValueEl.textContent = "-";
    messageEl.textContent = "";
    nameInputSection.style.display = "none";
    playerNameInput.value = "";
    generateSpecialNumber();
  }

  // 🔥 랭킹 등록 + 저장
  function updateRanking(name, score) {
    ranking.push({ name, score });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);

    // 저장
    localStorage.setItem("rankingData", JSON.stringify(ranking));

    renderRanking();
  }

  // 🔥 랭킹 표시
  function renderRanking() {
    rankingListEl.innerHTML = "";
    ranking.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.name} - ${entry.score}점`;
      rankingListEl.appendChild(li);
    });
  }

  submitNameBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim() || "익명";
    updateRanking(name, score);
    nameInputSection.style.display = "none";
  });

  rollBtn.addEventListener("click", rollDice);
  restartBtn.addEventListener("click", restartGame);
});
