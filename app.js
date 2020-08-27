//////////////////////////////VARIABLES///////////////////////////////
let life = 5;
let score = 0;

let headerContainer = document.querySelector('.header-container');
let scoreLabel = document.querySelector('.score');
let livesLabel = document.querySelector('.lives');
let mainContainer = document.querySelector('.container');
let ball = document.querySelector('.ball');
let gameOver = document.querySelector('.game-over');
let startGame = document.querySelector('.start-game');
let endGame = document.querySelector('.finishing');
let paddle = document.querySelector('.paddle');
let bricksContainer = document.querySelector('.bricks-container');
//create 72 bricks
for (let i = 0; i <= 59; i++) {
  let createBricks = document.createElement('div');
  createBricks.classList.add('bricks');
  bricksContainer.appendChild(createBricks);
}
let bricks = document.querySelectorAll('.bricks');
let breakSound = document.getElementById('break');
let applauseSound = document.getElementById('applause');
let loosingSound = document.getElementById('loosing');

let mainContainerW = mainContainer.offsetWidth;
let mainContainerH = mainContainer.offsetHeight;

let counter = 0;
let timer = null;
let gameEnd = false;

let moveX = 2 * (Math.random() > 0.5 ? 1 : -1);
let moveY = -2;

let ballD = ball.offsetWidth;
let ballX = mainContainerW / 2;
let ballY = 562;

let paddleX = paddle.offsetLeft;
const paddleXDefault = paddle.offsetLeft;
let paddleY = paddle.offsetTop;
let paddleW = paddle.offsetWidth;
let paddleH = paddle.offsetHeight;

///////////////////////////////MAKE PADDLE MOVE///////////////////////////////
let positionPaddle = (e) => {
  //make paddle move right
  if (e.code == 'ArrowRight') {
    paddleX += 30;
    paddle.style.left = `${paddleX}px`;
    if (paddleX >= mainContainerW - paddleW) {
      paddleX -= 30;
    }
  }
  //make paddle move left
  if (e.code == 'ArrowLeft') {
    paddleX -= 30;
    paddle.style.left = `${paddleX}px`;
    if (paddleX <= 0) {
      paddleX += 30;
    }
  }
  //make ball move with paddle
  if (!space && counter === 0) {
    ballX = paddleX;
    ball.style.left = `${ballX + paddleW / 2 - 5}px`;
  }
};
document.onkeydown = positionPaddle;

///////////////////////////////PADDLE COLISSION FORMULA///////////////////////////////
let collidePaddle = (paddleX, paddleY, paddleW, paddleH) => {
  return (
    paddleX < ballX &&
    paddleX - ballD + paddleW > ballX &&
    paddleY - ballD < ballY &&
    paddleY - ballD / 2 + paddleH > ballY
  );
};

///////////////////////////////PADLE COLLIDE///////////////////////////////
let paddleCollide = () => {
  const collidepaddle = collidePaddle(paddleX, paddleY, paddleW, paddleH);
  if (collidepaddle) {
    moveY = -1 * Math.abs(moveY);
  } else if (ballY >= mainContainerH && life > 0) {
    life -= 1;
    counter = 0;
    livesLabel.textContent = `Lives: ${life}`;
    //play when loosing life
    loosingSound.play();
    ballReset();
    clearInterval(timer);

    if (life === 0) {
      clearInterval(timer);
      gameEnd = true;
      gameOver.style.display = 'block';
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  }
  if (ballX > mainContainerW - 25 || ballX <= 0) {
    moveX *= -1;
  }
};

///////////////////////////////BRICK COLISSION FORMULA///////////////////////////////
let collideBrick = (brickX, brickY, brickW, brickH) => {
  const br = ballD / 2;
  const bx = ballX + br;
  const by = ballY + br;
  const blueHitBox = brickX - br < bx && brickX + br + brickW > bx;
  const redHitBox = brickY < by && brickY + brickH > by;

  if (ballY >= 0) {
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
  } else {
    moveY = 1 * Math.abs(moveY);
  }
};

///////////////////////////////BRICKS COLLIDE///////////////////////////////
let bricksCollide = () => {
  bricks.forEach((brick) => {
    if (brick.style.visibility === 'hidden') {
      return;
    }
    //invoke brick collision function
    const collidebrick = collideBrick(
      brick.offsetLeft,
      brick.offsetTop,
      brick.offsetWidth - 10,
      brick.offsetHeight
    );
    if (collidebrick) {
      //add collide sound
      breakSound.play();
      //when ball hits gold brick
      if (brick.style.backgroundcolor == 'gold') {
        score += 1000;
        //when ball hits red brick
      } else if (brick.style.backgroundcolor == 'red') {
        score += 100;
        //when ball hit normal brick
      } else {
        score += 20;
      }
      //updates the score after hitting brick
      scoreLabel.textContent = `Score: ${score}`;
      //hides brick when hit
      brick.style.visibility = 'hidden';
      //game finish
      gameFinish();
    }
  });
};

///////////////////////////////SIMULATE BALL///////////////////////////////
let ballSimulate = () => {
  //ball movement
  ballX += moveX;
  ballY += moveY;
  //paddle collide
  paddleCollide();
  //bricks collide
  bricksCollide();
  //ball position
  ball.style.top = `${ballY}px`;
  ball.style.left = `${ballX}px`;
};

///////////////////////////////RESET BALL POSITION///////////////////////////////
let ballReset = () => {
  ballX = 1000 / 2;
  ballY = 562;
  paddle.style.left = `${paddleXDefault}px`;
  paddleX = paddleXDefault;
  moveX = 2 * (Math.random() > 0.5 ? 1 : -1);
  moveY = -2;
};

///////////////////////////////GAME FINISHING///////////////////////////////
let finishCounter = 0;
let gameFinish = () => {
  finishCounter = 0;
  // let bricksArray = Array.prototype.slice.call(bricks);
  bricks.forEach((b) => {
    if (b.style.visibility === 'hidden') {
      finishCounter++;
    }
  });
  if (finishCounter === bricks.length) {
    //reset ball position
    ballReset();
    //play applause
    applauseSound.play();
    //clear simulation
    clearInterval(timer);
    gameEnd = true;
    endGame.style.display = 'block';
    setTimeout(() => {
      location.reload();
    }, 5000);
  }
};

///////////////////////////////GAME VOLUME///////////////////////////////
let volOff = () => {
  breakSound.pause();
  applauseSound.pause();
  loosingSound.pause();
};
let volOn = () => {
  breakSound.play();
  applauseSound.play();
  loosingSound.play();
};
let volume = document.querySelector('.volume');
volume.addEventListener('click', () => {
  if (volume.classList.contains('fa-volume-off')) {
    volOff();
    volume.classList.remove('fa-volume-off');
    volume.classList.add('fa-volume-up');
  } else {
    volOn();
    volume.classList.remove('fa-volume-up');
    volume.classList.add('fa-volume-off');
  }
});

///////////////////////////////CHANGE BRICK COLOR TO RED///////////////////////////////
let changeBrickToRed = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  const randomNum2 = Math.round(Math.random() * bricks.length);
  const randomNum3 = Math.round(Math.random() * bricks.length);
  const randomNum4 = Math.round(Math.random() * bricks.length);
  const randomNum5 = Math.round(Math.random() * bricks.length);
  //adds 5 red brick after 5 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum1].style.backgroundcolor = 'red';

    bricks[randomNum2].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum2].style.backgroundcolor = 'red';

    bricks[randomNum3].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum3].style.backgroundcolor = 'red';

    bricks[randomNum4].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum4].style.backgroundcolor = 'red';

    bricks[randomNum5].style.backgroundImage = "url('./img/kim.jpg')";
    bricks[randomNum5].style.backgroundcolor = 'red';
  }, 5000);
};

///////////////////////////////CHANGE BRICK COLOR TO GOLD///////////////////////////////
let changeBrickToGold = () => {
  const randomNum1 = Math.round(Math.random() * bricks.length);
  //adds 1 gold brick after 10 seconds of life reset
  setTimeout(() => {
    bricks[randomNum1].style.backgroundImage = "url('./img/donald2.jpg')";
    bricks[randomNum1].style.backgroundcolor = 'gold';
  }, 10000);
};

///////////////////////////////BALL SIMULATION///////////////////////////////
let space = document.addEventListener('keyup', (e) => {
  if (e.code === 'Space' && counter === 0 && !gameEnd) {
    counter += 1;
    //remove instructions
    startGame.style.display = 'none';
    //change 5 bricks to red
    changeBrickToRed();
    //change brick to gold
    changeBrickToGold();
    //ball simulate speed
    timer = setInterval(ballSimulate, 750 / 100);
  }
});
