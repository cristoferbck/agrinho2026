const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const livesElement = document.getElementById("lives");
const messageElement = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let score = 0;
let lives = 3;
let timeLeft = 60;
let gameRunning = false;
let gameLoop;
let timerInterval;

const player = {
    x: 430,
    y: 420,
    width: 50,
    height: 50,
    speed: 20
};

const keys = {};

const items = [];

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

function createItem() {

    const isGood = Math.random() > 0.3;

    items.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 3,
        good: isGood
    });
}

function drawBackground(){

    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0,0,canvas.width,200);

    ctx.fillStyle = "#6cc96c";
    ctx.fillRect(0,200,canvas.width,300);

    ctx.fillStyle = "#a57c52";
    ctx.fillRect(0,430,canvas.width,70);

    for(let i=0;i<10;i++){
        ctx.fillStyle="#228B22";
        ctx.beginPath();
        ctx.arc(i*100+50,200,30,0,Math.PI*2);
        ctx.fill();

        ctx.fillStyle="#8B4513";
        ctx.fillRect(i*100+45,200,10,40);
    }
}

function drawPlayer(){

    ctx.fillStyle = "#1565C0";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "#FFD54F";
    ctx.beginPath();
    ctx.arc(player.x+25, player.y+15, 10, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#000";
    ctx.fillText("🚜", player.x+10, player.y+38);
}

function drawItems(){

    items.forEach(item => {

        if(item.good){
            ctx.font="30px Arial";
            ctx.fillText("🌽", item.x, item.y+30);
        } else {
            ctx.font="30px Arial";
            ctx.fillText("🗑️", item.x, item.y+30);
        }
    });
}

function updatePlayer(){

    if(keys["ArrowLeft"] || keys["a"]){
        player.x -= player.speed;
    }

    if(keys["ArrowRight"] || keys["d"]){
        player.x += player.speed;
    }

    player.x = Math.max(0,
        Math.min(canvas.width-player.width,player.x));
}

function updateItems(){

    for(let i=items.length-1;i>=0;i--){

        items[i].y += items[i].speed;

        if(collision(player,items[i])){

            if(items[i].good){
                score += 10;
            }else{
                lives--;
            }

            items.splice(i,1);
            updateUI();
            continue;
        }

        if(items[i].y > canvas.height){
            items.splice(i,1);
        }
    }
}

function collision(a,b){

    return a.x < b.x+b.width &&
           a.x+a.width > b.x &&
           a.y < b.y+b.height &&
           a.y+a.height > b.y;
}

function updateUI(){

    scoreElement.textContent = score;
    livesElement.textContent = lives;

    if(lives <= 0){
        endGame("Você perdeu!");
    }
}

function draw(){

    drawBackground();
    drawPlayer();
    drawItems();
}

function gameUpdate(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    updatePlayer();
    updateItems();
    draw();
}

function startGame(){

    score = 0;
    lives = 3;
    timeLeft = 60;

    items.length = 0;

    updateUI();

    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;

    messageElement.textContent = "";

    gameRunning = true;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timeLeft--;

        timerElement.textContent = timeLeft;

        if(timeLeft <= 0){
            endGame("Fim de jogo!");
        }

    },1000);

    clearInterval(gameLoop);

    gameLoop = setInterval(gameUpdate,1000/60);

    const spawnInterval = setInterval(() => {

        if(!gameRunning){
            clearInterval(spawnInterval);
            return;
        }

        createItem();

    },700);
}

function endGame(text){

    gameRunning = false;

    clearInterval(gameLoop);
    clearInterval(timerInterval);

    let medalha = "";

    if(score >= 300){
        medalha = "🏆 Agricultor Mestre";
    }else if(score >= 150){
        medalha = "🥇 Guardião do Campo";
    }else{
        medalha = "🌱 Jovem Produtor";
    }

    messageElement.innerHTML =
        `${text}<br>
        Pontuação Final: ${score}<br>
        ${medalha}`;
}

startBtn.addEventListener("click", startGame);

drawBackground();

ctx.fillStyle="#1f5d1f";
ctx.font="32px Arial";
ctx.fillText("Clique em Iniciar Jogo",280,250);