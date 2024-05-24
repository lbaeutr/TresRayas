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

// Select player elements
const playerXElement = document.querySelector('.scoreboard__player[data-player="x"]');
const playerOElement = document.querySelector('.scoreboard__player[data-player="o"]');

startGame();

function startGame() {
    createBoard();
    //messageTurn.textContent = isTurnX ? 'X' : 'O';
    isTurnX = true;
    turn = 0;
    endGame.classList.remove('show');
    gameBoard.addEventListener('click', playAudioOnFirstClick, { once: true });
    highlightCurrentPlayer(); // Highlight the current player at the start
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
    //messageTurn.textContent = isTurnX ? 'X' : 'O';
    highlightCurrentPlayer(); // Highlight the current player after the turn changes
    
    // Remover la clase 'scoreboard__player--active' de todos los jugadores
    document.querySelectorAll('.scoreboard__player').forEach(player => {
        player.classList.remove('scoreboard__player--active');
    });
    
    // Agregar la clase 'scoreboard__player--active' al jugador actual
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
        endGameResult.textContent = `¡${isTurnX ? 'Milei' : 'Perro'} ha ganado la partida!\n `;
        playMusicForResult(isTurnX ? 'x' : 'o');
    } else {
        endGame.classList.add('show');
        endGameResult.textContent = '¡Empate!';
        // Aquí podrías reproducir música para empate si deseas
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
        playerOElement.classList.add('scoreboard__player2--active'); // Agregar la clase scoreboard__player2--active cuando sea el turno de O
    } else {
        playerXElement.classList.remove('scoreboard__player--active');
        playerOElement.classList.add('scoreboard__player--active');
        playerOElement.classList.remove('scoreboard__player2--active'); // Remover la clase scoreboard__player2--active cuando sea el turno de X
    }
}



buttonReset.addEventListener('click', startGame);

