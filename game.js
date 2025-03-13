// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const rewardedAdButton = document.getElementById('rewardedAdButton');

// Player properties
let player = {
    x: 50,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    color: '#00f',
    vy: 0,
    gravity: 0.5,
    jumpPower: -10
};

// Obstacle array and properties
let obstacles = [];
const obstacleSpeed = 3;
const obstacleFrequency = 100;
let frameCount = 0;

// Coin array and properties
let coins = [];
const coinFrequency = 80;
let score = 0;

// Game state
let gameOver = false;

// Spawn an obstacle
function spawnObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 40,
        height: 40,
        color: '#f00'
    };
    obstacles.push(obstacle);
}

// Spawn a coin
function spawnCoin() {
    const coin = {
        x: canvas.width,
        y: canvas.height - 30,
        width: 20,
        height: 20,
        color: '#ff0'
    };
    coins.push(coin);
}

// Check collision
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Reset game state
function resetGame() {
    player.x = 50;
    player.y = canvas.height - 50;
    player.vy = 0;
    obstacles = [];
    coins = [];
    score = 0;
    frameCount = 0;
    gameOver = false;
    restartButton.style.display = 'none';
    rewardedAdButton.style.display = 'none';
    update();
}

// Game loop
function update() {
    if (gameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over - Score: ' + score, canvas.width / 2 - 120, canvas.height / 2);
        
        // Simulate interstitial ad (AdSense needs manual trigger or IMA SDK for true interstitials)
        setTimeout(() => {
            restartButton.style.display = 'block';
            rewardedAdButton.style.display = 'block';
        }, 2000); // Fake 2-second ad delay
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position (jumping)
    player.vy += player.gravity;
    player.y += player.vy;
    if (player.y > canvas.height - 50) {
        player.y = canvas.height - 50;
        player.vy = 0;
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Spawn obstacles and coins
    frameCount++;
    if (frameCount % obstacleFrequency === 0) {
        spawnObstacle();
    }
    if (frameCount % coinFrequency === 0) {
        spawnCoin();
    }

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

        if (isColliding(player, obstacles[i])) {
            gameOver = true;
        }

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Update and draw coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].x -= obstacleSpeed;
        ctx.fillStyle = coins[i].color;
        ctx.fillRect(coins[i].x, coins[i].y, coins[i].width, coins[i].height);

        if (isColliding(player, coins[i])) {
            score += 10;
            coins.splice(i, 1);
            continue;
        }

        if (coins[i].x + coins[i].width < 0) {
            coins.splice(i, 1);
        }
    }

    // Request next frame
    requestAnimationFrame(update);
}

// Start the game
update();

// Click to move right
canvas.addEventListener('click', () => {
    if (!gameOver) {
        player.x += 50;
    }
});

// Spacebar to jump
document.addEventListener('keydown', (event) => {
    if (!gameOver && event.code === 'Space' && player.y === canvas.height - 50) {
        player.vy = player.jumpPower;
    }
});

// Restart button event
restartButton.addEventListener('click', resetGame);

// Rewarded ad button (placeholder, AdSense doesn’t support rewarded ads natively)
rewardedAdButton.addEventListener('click', () => {
    alert('Rewarded ads not available with AdSense. Switch to AdMob for this feature!');
});