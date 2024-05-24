const audio = document.getElementById('musica-fondo');
const gameBoard = document.querySelector('.game__board');
const messageTurn = document.querySelector('.game__turn');
const endGame = document.querySelector('.endgame');
const endGameResult = document.querySelector('.endgame__result');
const buttonReset = document.querySelector('.endgame__button');
const playerScores = {
    x: 0,
    o: 0
};

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
        updateScore(isTurnX ? 'x' : 'o');
        showEndGame(true);
        return;
    }

    if (turn === maxTurn) {
        showEndGame(false);
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

    return winner;
}

function showEndGame(winner) {
    if (winner) {
        endGame.classList.add('show');
        endGameResult.textContent = `¡${isTurnX ? 'X' : 'O'} ha ganado la partida!`;
    } else {
        endGame.classList.add('show');
        endGameResult.textContent = '¡Empate!';
    }
}

function updateScore(player) {
    playerScores[player]++;
    document.querySelector(`[data-player="${player}"]`).textContent = playerScores[player];
}

function playAudioOnFirstClick() {
    console.log('Reproduciendo audio...');
    audio.play().catch(error => {
        console.log('Error al reproducir el audio:', error);
    });
}

buttonReset.addEventListener('click', startGame);
