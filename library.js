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
    cross: 'images/milei.png',
    circle: 'images/pedro.png'
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

let lastStarterWasX = true;
let lastMove = null;

// Select player elements
const playerXElement = document.querySelector('.scoreboard__player[data-player="x"]');
const playerOElement = document.querySelector('.scoreboard__player[data-player="o"]');

startGame();

function startGame() {
    createBoard();
    isTurnX = !lastStarterWasX;
    lastStarterWasX = isTurnX;

    turn = 0;
    endGame.classList.remove('show');
    gameBoard.addEventListener('click', playAudioOnFirstClick, { once: true });
    highlightCurrentPlayer(); 
}

function createBoard() {
    const cells = 9;

    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener('click', handleGame);
        gameBoard.appendChild(div);
    }
}

function handleGame(e) {
    const currentCell = e.currentTarget;
    if (currentCell.querySelector('img')) {
        return;
    }

    const currentTurn = isTurnX ? players.x : players.o;
    turn++;
    drawShape(currentCell, currentTurn);

    lastMove = currentCell;

    if (checkWinner(currentTurn)) {
        updateScore(isTurnX ? 'x' : 'o');
        showEndGame(true);
        return;
    }

    if (turn === maxTurn) {
        // Empate - eliminar todas las fichas excepto la última
        resetBoardExceptLastMove();
        turn = 1; // Se cuenta la última ficha
        return;
    }

    changeTurn();
}

function drawShape(element, player) {
    const img = document.createElement('img');
    img.src = images[player];
    element.appendChild(img);
}

function changeTurn() {
    isTurnX = !isTurnX;
    highlightCurrentPlayer(); 
    
    document.querySelectorAll('.scoreboard__player').forEach(player => {
        player.classList.remove('scoreboard__player--active');
    });
    
    const currentPlayerElement = document.querySelector(`.scoreboard__player[data-player="${isTurnX ? 'x' : 'o'}"]`);
    currentPlayerElement.classList.add('scoreboard__player--active');
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
        endGameResult.textContent = `¡${isTurnX ? 'Milei' : 'Pedro'} ha ganado la partida!\n `;
        playMusicForResult(isTurnX ? 'x' : 'o');
    } else {
        endGame.classList.add('show');
        endGameResult.textContent = '¡Empate!';
    }
}

function playMusicForResult(player) {
    const musicForXWin = new Audio('music/audio miley.mp3');
    const musicForOWin = new Audio('music/PedroPedro.mp3');

    if (player === 'x') {
        musicForXWin.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de X:', error);
        });
    } else if (player === 'o') {
        musicForOWin.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de O:', error);
        });
    }
}

function updateScore(player) {
    playerScores[player]++;
    document.querySelector(`.scoreboard__player[data-player="${player}"] .scoreboard__score`).textContent = playerScores[player];
}

function playAudioOnFirstClick() {
    console.log('Reproduciendo audio...');
    audio.play().catch(error => {
        console.log('Error al reproducir el audio:', error);
    });
}

function highlightCurrentPlayer() {
    if (isTurnX) {
        playerXElement.classList.add('scoreboard__player--active');
        playerOElement.classList.remove('scoreboard__player--active');
        playerOElement.classList.add('scoreboard__player2--active'); 
    } else {
        playerXElement.classList.remove('scoreboard__player--active');
        playerOElement.classList.add('scoreboard__player--active');
        playerOElement.classList.remove('scoreboard__player2--active'); 
    }
}

function resetBoardExceptLastMove() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        if (cell !== lastMove) {
            cell.innerHTML = '';
            cell.addEventListener('click', handleGame, { once: true });
        }
    });

    // Cambiar el turno después de limpiar el tablero
    isTurnX = !isTurnX; // Cambiar el turno al otro jugador
    highlightCurrentPlayer(); // Actualizar la visualización del turno
}

buttonReset.addEventListener('click', startGame);
