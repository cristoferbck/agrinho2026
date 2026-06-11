const player = document.getElementById('player');
const goodItem = document.getElementById('good-item');
const badItem = document.getElementById('bad-item');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');

let score = 0;
let time = 30;

// Função para posicionar itens aleatoriamente
function moveItem(item) {
    const container = document.getElementById('game-container');
    const maxX = container.clientWidth - item.offsetWidth;
    const maxY = container.clientHeight - item.offsetHeight - 50; // evitar sobreposição com chão
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    
    item.style.left = x + 'px';
    item.style.top = y + 'px';
}

// Detecta colisão entre jogador e item
function checkCollision(item, isGood) {
    const playerRect = player.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    
    if (
        playerRect.x < itemRect.x + itemRect.width &&
        playerRect.x + playerRect.width > itemRect.x &&
        playerRect.y < itemRect.y + itemRect.height &&
        playerRect.height + playerRect.y > itemRect.y
    ) {
        if (isGood) score++;
        else score--;
        scoreElement.textContent = score;
        moveItem(item);
    }
}

// Controla jogador com setas
document.addEventListener('keydown', (e) => {
    const step = 20;
    const container = document.getElementById('game-container');
    const maxX = container.clientWidth - player.offsetWidth;
    const maxY = container.clientHeight - player.offsetHeight;
    
    let left = player.offsetLeft;
    let top = player.offsetTop;

    switch(e.key) {
        case 'ArrowLeft':
            left = Math.max(0, left - step);
            break;
        case 'ArrowRight':
            left = Math.min(maxX, left + step);
            break;
        case 'ArrowUp':
            top = Math.max(0, top - step);
            break;
        case 'ArrowDown':
            top = Math.min(maxY, top + step);
            break;
    }
    player.style.left = left + 'px';
    player.style.top = top + 'px';

    checkCollision(goodItem, true);
    checkCollision(badItem, false);
});

// Itens caem periodicamente
setInterval(() => {
    moveItem(goodItem);
    moveItem(badItem);
}, 2000);

// Contador regressivo
const timer = setInterval(() => {
    time--;
    timeElement.textContent = time;
    if (time <= 0) {
        clearInterval(timer);
        alert(`Fim do jogo! Sua pontuação: ${score}`);
        location.reload();
    }
}, 1000);

// Inicializa posição inicial dos itens
moveItem(goodItem);
moveItem(badItem);