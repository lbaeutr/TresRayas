const audio = document.getElementById('musica-fondo');
const gameBoard = document.querySelector('.game__board');
const messageTurn = document.querySelector('.game__turn');
const endGame = document.querySelector('.endgame');
const endGameResult = document.querySelector('.endgame__result');
const buttonReset = document.querySelector('.endgame__button');

let isTurnX = true;
let turn = 0;
const maxTurn = 9;
const players = {
    x: 'cross',
    o: 'circle'
};

const images = {
    cross: 'images/pene.png',
    circle: 'images/vagina.png'
};

const winningPosition = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

function startGame() {
    createBoard();
    messageTurn.textContent = isTurnX ? 'X' : 'O';
    isTurnX = true;
    turn = 0;
    endGame.classList.remove('show');
    gameBoard.addEventListener('click', playAudioOnFirstClick, { once: true });
}

function createBoard() {
    const cells = 9;

    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener('click', handleGame, { once: true });
        gameBoard.appendChild(div);
    }
}

function handleGame(e) {
    const currentCell = e.currentTarget;
    const currentTurn = isTurnX ? players.x : players.o;
    turn++;
    drawShape(currentCell, currentTurn);

    if (checkWinner(currentTurn)) {
        showEndGame(true);
        return;
    }

    if (turn === maxTurn) {
        startGame();  // Reiniciar el juego automáticamente en caso de empate
    } else {
        changeTurn();
    }
}

function drawShape(element, player) {
    const img = document.createElement('img');
    img.src = images[player];
    element.appendChild(img);
}

function changeTurn() {
    isTurnX = !isTurnX;
    messageTurn.textContent = isTurnX ? 'X' : 'O';
}

function checkWinner(player) {
    const cells = document.querySelectorAll('.cell');

    const winner = winningPosition.some(array => {
        return array.every(position => {
            return cells[position].querySelector('img')?.src.includes(images[player]);
        });
    });

    if (winner) {
        showEndGame(true);
        return true;
    }

    return false;
}

function showEndGame(winner) {
    if (winner) {
        endGame.classList.add('show');
        endGameResult.textContent = `¡${isTurnX ? 'X' : 'O'} ha ganado la partida!`;
    } else {
        startGame();  // Reiniciar automáticamente en caso de empate
    }
}

function playAudioOnFirstClick() {
    console.log('Reproduciendo audio...');
    audio.play().catch(error => {
        console.log('Error al reproducir el audio:', error);
    });
}

function hasWinningPossibility() {
    const cells = document.querySelectorAll('.cell');
    const positions = Array.from(cells).map(cell => {
        const img = cell.querySelector('img');
        if (img && img.src.includes(images.cross)) return players.x;
        if (img && img.src.includes(images.circle)) return players.o;
        return null;
    });

    return winningPosition.some(array => {
        const [a, b, c] = array;
        const values = [positions[a], positions[b], positions[c]];
        return values.includes(null) || 
            (values.filter(v => v === players.x).length > 0 && values.filter(v => v === players.o).length === 0) ||
            (values.filter(v => v === players.o).length > 0 && values.filter(v => v === players.x).length === 0);
    });
}

// Evento de botón
buttonReset.addEventListener('click', startGame);
