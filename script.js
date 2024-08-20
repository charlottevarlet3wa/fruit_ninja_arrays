const fruits = ['🍎', '🍊', '🍉', '🍐', '🍓', '🍑', '🍍'];
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const timerElement = document.getElementById('timer');
const msgElem = document.getElementById('message');

let score = 0;
let lives = 3;
let timeLeft = 60;
let highestScore = 0;
let currentFruits = [];
let animationFrameId;
let timerInterval;

const gravity = 0.009;

function createFruit() {
    const radius = Math.random() * 20 + 30;
    const x = Math.random() * canvas.width;
    const y = canvas.height + radius;
    const vx = (Math.random() - 0.5) * 3;
    const vy = -Math.random() * 1 - 2;
    const emoji = fruits[Math.floor(Math.random() * fruits.length)];

    currentFruits.push({ x, y, vx, vy, radius, emoji });
}

function drawFruit(fruit) {
    ctx.font = `${fruit.radius * 2}px Arial`;
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
}

function updateFruits() {
    for (let i = currentFruits.length - 1; i >= 0; i--) {
        const fruit = currentFruits[i];
        fruit.vy += gravity;
        fruit.x += fruit.vx;
        fruit.y += fruit.vy;

        if (fruit.y - fruit.radius > canvas.height) {
            currentFruits.splice(i, 1);
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateLives() {
    livesElement.textContent = lives;
}

function updateTimer() {
    timerElement.textContent = timeLeft;
}

function checkAnswer(index) {
    const fruitToCheck = fruits[index];
    const fruitIndex = currentFruits.findIndex(fruit => 
        fruit.emoji === fruitToCheck && 
        fruit.y + fruit.radius <= canvas.height && 
        fruit.x + fruit.radius > 0 && 
        fruit.x - fruit.radius < canvas.width &&
        fruit.y - fruit.radius > 0 
    );

    if (fruitIndex !== -1) {
        score++;
        updateScore();
        currentFruits.splice(fruitIndex, 1);
    } else {
        lives--;
        updateLives();
    }

    if (lives <= 0) {
        displayMessage(`Game over ! Your high score is ${highestScore}`);
        endGame();
    }
}

function endGame() {
    if (score > highestScore) {
        highestScore = score;
    }
    clearInterval(timerInterval);
    cancelAnimationFrame(animationFrameId);
    resetGame();
}

function resetGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    currentFruits = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateScore();
    updateLives();
    updateTimer();

    startGame();
}

function startGame() {
    animationFrameId = requestAnimationFrame(animate);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame();
            displayMessage(`Well done ! Your highest score is ${highestScore}`);
        }
    }, 1000);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.009) {
        createFruit();
    }

    currentFruits.forEach(drawFruit);
    updateFruits();

    animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '7') {
        const index = parseInt(key);
        checkAnswer(index);
    }
});

function displayMessage(text) {
    msgElem.textContent = text;
}

// Start the game initially
startGame();
