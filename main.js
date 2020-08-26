// variable decleration
let life = 3;
let score = 0;

let headerContainer = document.querySelector(".header-container");
let scoreLabel = document.querySelector(".score");
let livesLabel = document.querySelector(".lives");
const main = document.querySelector(".main");
let container = document.querySelector(".brick-container");

//create 71 bricks
for (let i = 0; i <= 71; i++) {
  let createBricks = document.createElement("div");
  createBricks.classList.add("brick");
  container.append(createBricks);
}
//DOM Variables
let ball = document.getElementById("ball");
let board = document.getElementById("platform");
let brick = document.querySelector(".brick");
const bricks = document.querySelectorAll(".brick");

//create game over display
let createGameOver = document.createElement("h1");
createGameOver.classList.add("game-over");
main.appendChild(createGameOver);

//assign to variable
let gameOver = document.querySelector(".game-over");
gameOver.textContent = "GAME OVER!";

//create start game
let createStartGame = document.createElement("h1");
createStartGame.classList.add("start-game");
main.appendChild(createStartGame);

//assign to variable
let startGame = document.querySelector(".start-game");
startGame.textContent = "Press SPACE to start!";

//create game finish
let createEndGame = document.createElement("h1");
createEndGame.classList.add("finishing");
main.appendChild(createEndGame);
//assign to variable
let endGame = document.querySelector(".finishing");
endGame.textContent = "Congratulations!!!";

//position of the paddle, ball

let containerW = main.offsetWidth;
let containerH = main.offsetHeight;

let moveX = 3 * (Math.random() > 0.5 ? 1 : -1);
let moveY = -3;

let timer = null;
let counter = 0;

let gameEnd = false;
const ballD = ball.offsetWidth;
let paddleX = board.offsetLeft;
const paddleXDefault = board.offsetLeft;
let paddleY = board.offsetTop;
const paddleW = board.offsetWidth;
const paddleH = board.offsetHeight;
let x = containerW / 2 + paddleW / 2;
let y = containerH - 40;
// to give random color to the bricks
bricks.forEach((brick) => {
  let r = 1 + Math.random() * 255;
  let g = 1 + Math.random() * 255;
  let b = 1 + Math.random() * 255;
  let brickColor = `rgb(${r},${g},${b})`;
  brick.style.backgroundColor = brickColor;
});
//Event for paddle movement while pressing left and right arrow key.

document.addEventListener("keydown", function (e) {
  switch (e.code) {
    case "ArrowLeft":
      paddleX = paddleX - 30;

      if (paddleX <= 0) {
        paddleX = 0;
      }
      board.style.left = `${paddleX}px`;
      break;
    case "ArrowRight":
      paddleX = paddleX + 30;

      if (paddleX >= containerW - 70) {
        paddleX = containerW - 70;
      }
      board.style.left = `${paddleX}px`;
      break;
  }
  //make ball move with paddle
  if (!space && counter === 0) {
    x = paddleX;
    ball.style.left = `${x + paddleW / 2}px`;
  }
});

//Event to start the game while pressing the spacebar
let space = document.addEventListener("keypress", function (e) {
  if (e.code == "Space" && counter == 0 && !gameEnd) {
    bricks.forEach((brick) => {
      let r = 1 + Math.random() * 255;
      let g = 1 + Math.random() * 255;
      let b = 1 + Math.random() * 255;
      let brickColor = `rgb(${r},${g},${b})`;
      if (counter == 0) {
        brick.style.backgroundColor = brickColor;
      }
    });

    counter += 1;
    startGame.style.display = "none";
    //funtion to bounce the ball when spacebar is pressed.
    ballSimulate();
    timer = setInterval(ballSimulate, 1000 / 60);
  }
});

//funtion to bounce the ball
let ballSimulate = () => {
  x += moveX;
  y += moveY;
  //condition to check the ball colliding with the paddle
  const collidepaddle = collidePaddle(
    board.offsetLeft,
    board.offsetTop,
    paddleW,
    paddleH
  );
  if (collidepaddle) {
    //if the ball collides with the paddle, move the ball upwards
    moveY = -1 * Math.abs(moveY);
  } else if (y >= main.offsetHeight && life > 0) {
    //if the ball goes out of main container reduce the life
    looseLife();
  }
  if (x > containerW - 25 || x <= 0) {
    //to change the direction of the ball when it hits left and right sides of the container
    moveX *= -1;
  }
  bricks.forEach((brick) => {
    if (brick.style.visibility === "hidden") {
      return;
    }
    const collidebrick = collideBrick(
      brick.offsetLeft,
      brick.offsetTop,
      brick.offsetWidth,
      brick.offsetHeight
    );
    //condition to check if the ball hits the brick and make the visibility of the brick hidden
    if (collidebrick) {
      score += 20;
      scoreLabel.textContent = `Score: ${score}`;
      moveY = Math.abs(moveY);
      brick.style.visibility = "hidden";
      //game finish function call
      gameFinish();
    }
  });
  ball.style.top = `${y}px`;
  ball.style.left = `${x}px`;
};

//function to reduce life when ball goes out of the container
function looseLife() {
  life -= 1;
  counter = 0;
  livesLabel.textContent = `Lives: ${life}`;
  ballReset();
  clearInterval(timer);
  if (life === 0) {
    clearInterval(timer);
    gameEnd = true;
    gameOver.style.display = "block";
    setTimeout(() => {
      location.reload();
    }, 3000);
  }
}

//function which checks collide of ball with the paddle
function collidePaddle(paddleX, paddleY, paddleW, paddleH) {
  return (
    paddleX - ballD < x &&
    paddleX + paddleW > x &&
    paddleY - ballD < y &&
    paddleY > y
  );
}

//function which checks collide of ball with the bricks
let collideBrick = (brickX, brickY, brickW, brickH) => {
  const br = ballD / 2;
  const bx = x + br;
  const by = y + br;
  const blueHitBox = brickX - br < bx && brickX + br + brickW > bx;
  const redHitBox = brickY < by && brickY + brickH > by;

  if (y >= 0) {
    if (blueHitBox && brickY - br < by && brickY > by) {
      moveY = -1 * Math.abs(moveY);
      return true;
    } else if (
      blueHitBox &&
      brickY + brickH < by &&
      brickY + brickH + br > by
    ) {
      moveY = 1 * Math.abs(moveY);
      return true;
    } else if (redHitBox && bx > brickX - br && bx < brickX) {
      moveX = -1 * Math.abs(moveX);
      return true;
    } else if (redHitBox && bx > brickX + brickW && bx < brickX + brickW + br) {
      moveX = 1 * Math.abs(moveX);
      return true;
    }
  } else if (y <= 0) {
    moveY = 1 * Math.abs(moveY);
  }
};
//Reset ball position
let ballReset = () => {
  x = containerW / 2 + paddleW / 2;
  y = containerH - 40;
  board.style.left = `${paddleXDefault}px`;
  paddleX = paddleXDefault;
  moveX = 2 * (Math.random() > 0.5 ? 1 : -1);
  moveY = -2;
};

//Game finish function
let finishCounter = 0;
let gameFinish = () => {
  finishCounter = 0;
  // let bricksArray = Array.prototype.slice.call(bricks);
  bricks.forEach((b) => {
    if (b.style.visibility === "hidden") {
      finishCounter++;
    }
  });

  if (finishCounter === bricks.length) {
    ballReset();
    clearInterval(timer);
    gameEnd = true;
    endGame.style.display = "block";
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
};
