const fruits = ['🍎', '🍊', '🍉', '🍐', '🍓', '🍑', '🍍'];
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const timerElement = document.getElementById('timer');

let score = 0;
let lives = 100;
let timeLeft = 60;
let currentFruits = [];

const gravity = 0.009;

// Fonction pour créer un fruit
function createFruit() {
    const radius = Math.random() * 20 + 30;
    const x = Math.random() * canvas.width;
    const y = canvas.height + radius;
    const vx = (Math.random() - 0.5) * 3;
    // const vy = -Math.random() * 1 - 10;
    const vy = -Math.random() * 1 - 2;
    const emoji = fruits[Math.floor(Math.random() * fruits.length)];

    currentFruits.push({ x, y, vx, vy, radius, emoji });
}

// Fonction pour dessiner un fruit
function drawFruit(fruit) {
    ctx.font = `${fruit.radius * 2}px Arial`; // Adjust font size to match the fruit size
    if (fruit.y - fruit.radius >= canvas.height || fruit.x + fruit.radius * 2 < 0 || fruit.x + 20 > canvas.width || fruit.y - fruit.radius < 0) {
        ctx.globalAlpha = 0.4; // Set opacity to 0.4 for out-of-bounds fruits
    } else {
        ctx.globalAlpha = 1.0; // Full opacity for in-bounds fruits
    }
    ctx.fillText(fruit.emoji, fruit.x, fruit.y);
    ctx.globalAlpha = 1.0; // Reset opacity to default
}


// Fonction pour mettre à jour les fruits
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
        fruit.y - fruit.radius > 0 // Ensures the fruit is within the canvas bounds
    );

    if (fruitIndex !== -1) {
        score++;
        updateScore();
        currentFruits.splice(fruitIndex, 1); // Remove the first found fruit within bounds
    } else {
        lives--;
        updateLives();
    }

    if (lives <= 0 || timeLeft <= 0) {
        endGame();
    }
}



function endGame() {
    alert(`Your score is ${score}`);
    clearInterval(timerInterval);
    cancelAnimationFrame(animationFrameId);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // if (Math.random() < 0.05) {
    if (Math.random() < .009) {
        createFruit();
    }

    currentFruits.forEach(drawFruit);
    updateFruits();

    animationFrameId = requestAnimationFrame(animate);
}

let animationFrameId = requestAnimationFrame(animate);

const timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
        endGame();
    }
}, 1000);

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '0' && key <= '7') { // Check if the key pressed is between 1 and 7
        const index = parseInt(key); // Convert the key to an index (0 to 6)
        checkAnswer(index);
    }
});
