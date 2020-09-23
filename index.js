const button = document.getElementById("play");
const score = document.getElementById("score");
const canvas = document.getElementById("game-canvas");

let ctx = canvas.getContext('2d');

const cell = 25;

let state = {
    gameover: true,
    pause: false,
    direction: 2,
    snake: [
        {x: 250, y: 200, direction: 2},
        {x: 250, y: 225, direction: 2},
        {x: 200, y: 250, direction: 2},
    ],

    food: { x: 0, y: 0 },
    score: 0,
};

function drawBoard() {
    for(let row = 0; row < 20; row++) {
        for(let column = 0; column < 20; column++) { 
            row % 2 === column % 2 ? ctx.fillStyle = "green" : ctx.fillStyle = "forestgreen";
            ctx.fillRect(0 + cell * row, 0 + cell * column, cell, cell); 
        } 
    }
}

function drawSnake() {
    for (let i = state.snake.length - 1; i >= 0; --i) {
        drawSnakePart(ctx, state.snake[i].x, state.snake[i].y, i === 0)
    }
}

function drawSnakePart(ctx, x, y, head = false) {  
    ctx.fillStyle = head ? "orange" : "yellow";
    ctx.fillRect(x, y, cell, cell);
}

function drawFood(ctx, x, y) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x + 12.5, y + 12.5, 10, 0, Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function generateFood() {
    let x = Math.floor(Math.random() * 20) * 25;
    let y = Math.floor(Math.random() * 20) * 25; 
    while (state.snake.some(part => part.x === x && part.y === y)) {
        x = Math.floor(Math.random() * 20) * 25;
        y = Math.floor(Math.random() * 20) * 25;
    }
    state.food = { x, y };
}

function eatFood() {
    let x = state.snake[0].x;
    let y = state.snake[0].y;

    let fx = state.food.x;
    let fy = state.food.y;

    if (x == fx && y == fy) {
      state.score++;
      score.innerHTML = "Score: " + state.score;
      addPart();
      generateFood();
    }
  }

function mod(m, val) {
    while (val < 0) {
        val +=m
    }
    return val % m
}

function addPart() {
    let tail = state.snake[state.snake.length-1];

    let direction = tail.direction;
    let x = tail.x
    let y = tail.y;

    switch(direction) {
        // UP
        case 1:
            y = mod(500, y - 25);
            break;
        // DOWN
        case -1: 
            y = mod(500, y + 25);
            break;
        // LEFT
        case 2:
            x = mod(500, x + 25);
            break;
        // RIGHT
        case -2:
            x = mod(500, x - 25);
            break;
    }

    state.snake.push({ x, y, direction });
}

function moveSnake() {
    let x = state.snake[0].x;
    let y = state.snake[0].y;

    switch(state.direction) {
        // UP
        case 1:
            y = mod(500, y + 25);
            break;
        // DOWN
        case -1: 
            y = mod(500, y - 25);
            break;
        // LEFT
        case 2:
            x = mod(500, x + 25);
            break;
        // RIGHT
        case -2:
            x = mod(500, x - 25);
            break;
    }

    const newSnake = [{ x, y, direction: state.direction }];
    const snakeLength = state.snake.length;
    for (let i = 1; i < snakeLength; i++) {
        newSnake.push({ ...state.snake[i-1] });
    }
    state.snake = newSnake;
}

let start = 0;
function draw(timestamp) {
    if(!state.pause) {
        start++;
        if (timestamp - start > 1000/ 10) {
            if (checkGameOver()){
                state.gameover = true;
                return;
            }
            moveSnake();
            drawBoard();
            drawFood(ctx, state.food.x, state.food.y);
            drawSnake();
            eatFood();
            start = timestamp;
        }
        if(!state.gameover) window.requestAnimationFrame(draw);
    } 
    else {
        window.requestAnimationFrame(draw);
        ctx.fillStyle = "black";
        ctx.font = "2.5em sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Pause", 500/2, 500/2); 
    }
}

function checkGameOver() {
    const head = state.snake[0];

    return state.snake.some(
        (part, i) => i !== 0 && head.x === part.x && head.y === part.y
    );
}

document.addEventListener("keydown", event => {
    let direction = 0;
    switch (event.key) {
        case "ArrowDown":
            direction = 1;
            break;
        case "ArrowUp":
            direction = -1;
            break;
        case "ArrowLeft":
            direction = -2;
            break;
        case "ArrowRight":
            direction = 2;
            break;     
    }

    switch(event.code){
        case "KeyP": //p
          enablePause();
          break;
      }

    if (
        direction && 
        state.direction === state.snake[0].direction &&
        state.direction !== -direction 
    ) {
        state.direction = direction;
    }
});

button.onclick = function() {
    if (state.gameover) {
        state = {
            gameover: false, 
            pause: false,
            direction: 2,
            snake: [
                {x: 200, y: 200, direction: 2},
                {x: 200, y: 225, direction: 2},
                {x: 200, y: 250, direction: 2},
            ],
            food: { x: 0, y: 0 },
            score: 0
        };
        score.innerHTML = "Score: " + 0;
        generateFood();
        window.requestAnimationFrame(draw);
    }
}

function enablePause() {
    state.pause = state.pause ? false : true;
}