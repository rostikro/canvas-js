const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bird = {
    // Start pos
    // TODO: Set init data in `init` func
     x: 50, y: 150, width: 20, height: 20,
     
     // Experimental values for physics
     // Velocity indicates the vector of vertical speed pointing downwards.
      gravity: 0.5, jumpForce: -7, velocity: 0 
    };

let pipes = [];
let isGameOver = false;
let pipeWidth = 60;
let pipeGap = 150;

pipes.push(createPipe());

function createPipe() {
    let pipeY = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    return { x: canvas.width, y: pipeY };
}

// Updateing objects before rendering
function update() {
    if (isGameOver) return;

    // Physics stuff (very simple gravity implementation (but not so realistic :( )))
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (pipes[pipes.length - 1].x < canvas.width - 200) pipes.push(createPipe());

    // Move each pipe 2 pixels left
    pipes.forEach(pipe => { pipe.x -= 2; });

    if (pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }

    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipeGap)) {
            isGameOver = true;
        }
    });

    // Check if bird hits the ground or flies too high
    if (bird.y + bird.height > canvas.height || bird.y < 0) isGameOver = true;
}

function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        // Draw the second pipe lower
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap);
    });

    if (isGameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        // x is start of the text, so I moved it right for 100px
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}

function startLoop() {
    update();
    renderFrame();
    if (!isGameOver) requestAnimationFrame(startLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
});
function jump() {
    if (!isGameOver) bird.velocity = bird.jumpForce;
}




startLoop();
