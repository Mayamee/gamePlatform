const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let paddleWidth = 200;
let paddleHeight = 20;
let paddleX = (canvas.width - paddleWidth) / 2;
let x = paddleX + paddleWidth / 2;
let y = canvas.height - 50;
const rand = (low, high) => low + Math.random() * (high - low);
let startAngle = rand(Math.PI / 4, (Math.PI * 3) / 4);
let dx = 10 * Math.cos(startAngle);
let dy = 10 * Math.sin(startAngle);
let ballRadius = 10;
let currentColor = "#363636";

let rightPressed = false;
let leftPressed = false;
const _DELTA_ = 1.01;
let _ITER_ = 0;
let _LIVES_ = 5;
let _ROUND_ = 1;
document.getElementById("round").innerHTML = _ROUND_;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 157;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 };
  }
}
function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status == 1) {
        brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
        brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawBall(color, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
function drawScore() {
  ctx.font = "16px Hack";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + _ITER_, 8, 20);
}
function drawPaddle(color) {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

const newColor = () =>
  "#" + (Math.random().toString(16) + "000000").substring(2, 8).toUpperCase();
//--!--
const newRadius = (low, high) =>
  low + Math.floor(Math.random() * (high - low + 1));
//--!--
function respawn() {
  paddleX = (canvas.width - paddleWidth) / 2;
  x = paddleX + paddleWidth / 2;
  y = canvas.height - 50;
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(currentColor, ballRadius);
  drawPaddle(currentColor);
  drawBricks();
  collisionDetection();
  drawScore();
  document.getElementById("lives").innerHTML = _LIVES_;
  x += dx;
  y += dy;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      if (Math.abs(dy) < 100) {
        dy *= _DELTA_;
      }
    } else {
      _LIVES_--;
      respawn();
      if (_LIVES_ < 0) {
        document.getElementById("over").innerHTML = "OVER";
        alert("GAME OVER");
        document.location.reload();
      }
    }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 15;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 15;
  }
}
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}
function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;

          _ITER_++;
          if (_ITER_ == brickRowCount * brickColumnCount) {
            document.getElementById("victory").innerHTML = "is ours";
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
          if (!(_ITER_ % 10) && paddleWidth < canvas.width * 0.4) {
            paddleWidth = paddleWidth * 1.2;
            _ROUND_++;
            document.getElementById("round").innerHTML = _ROUND_;
          }
          currentColor = newColor();
        }
      }
    }
  }
}
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
  if (paddleX < 0) {
    paddleX = 0;
  }
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
}
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
let interval = setInterval(draw, 10);
