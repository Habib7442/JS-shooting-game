import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

const SPEED = 300;
const ENEMYSPEED = 150;
const BULLET_SPEED = 500;

let gameIsOver = false;

kaboom({
  background: [255, 153, 0, 1],
});

loadSprite("player", "sprites/player1.png");
loadSprite("bullet", "sprites/bullets.png");
loadSprite("enemy", "sprites/enemy.png");

// Player

let playerImage = "player";

const player = add([
  sprite(playerImage),
  pos(80, 150),
  scale(0.5),
  area(),
  "player",
]);
let score = 0;

onKeyDown("left", () => {
  if (!gameIsOver) player.move(-SPEED, 0);
});
onKeyDown("right", () => {
  if (!gameIsOver) player.move(SPEED, 0);
});
onKeyDown("up", () => {
  if (!gameIsOver) player.move(0, -SPEED);
});
onKeyDown("down", () => {
  if (!gameIsOver) player.move(0, SPEED);
});

// Enemy

onMousePress("left", () => {
  if (!gameIsOver) shoot(player.pos);
});

function shoot(playerPos) {
  const bullet = add([
    sprite("bullet"),
    pos(playerPos.x + 160, playerPos.y + 100),
    scale(0.1),
    area(),
    "bullet",
  ]);

  bullet.onUpdate(() => {
    bullet.move(BULLET_SPEED, 0);
    if (bullet.pos.x > width()) {
      destroy(bullet);
    }
  });
  bullet.onCollide("enemy", (player, enemy) => {
    destroy(player);
    addKaboom(player.pos);
    score += 1;
    updateScoreLabel();
  });
}

player.onCollide("enemy", (player) => {
  if (!gameIsOver) {
    gameIsOver = true;
    setBackground([5, 0, 0, 1]);
    gameOver.text = "Game Over";
    destroy(player);
    addKaboom(player.pos);
    clearInterval(enemySpawnInterval);
  }
});

const enemySpawnInterval = setInterval(() => {
  for (let i = 0; i < 5; i++) {
    let x = width();
    let y = rand(0, height());

    let enemy = add([sprite("enemy"), pos(x, y), scale(0.09), area(), "enemy"]);

    enemy.onUpdate(() => {
      enemy.move(-ENEMYSPEED, 0);
      if (enemy.pos.x < -enemy.width) {
        destroy(enemy);
      }
    });
  }
}, 5000);



// Display score
const scoreLabel = add([text(`Score: ${score}`), pos(12, 12)]);

// Display game over

const gameOver = add([text(""), pos(1050, 15)]);

// Update score label
function updateScoreLabel() {
  scoreLabel.text = `Score: ${score}`;
}

// Update score label initially and whenever the score changes
updateScoreLabel();
