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

const winningPosition = [
    // Filas
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columnas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonales
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
}

function createBoard() {
    const cells = 9;

    while (gameBoard.firstElementChild) {
        gameBoard.firstElementChild.remove();
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
        return;
    }

    if (!hasWinningPossibility()) {
        removeAllExceptLast(currentCell);
        turn = 1;  // Reiniciar el contador de turnos a 1 ya que solo queda una ficha
        changeTurn();  // Cambiar el turno antes de salir de la función
        return;
    }

    if (turn === maxTurn) {
        showEndGame(false);
    } else {
        changeTurn();
    }
}

function drawShape(element, newClass) {
    element.classList.add(newClass);
}

function changeTurn() {
    isTurnX = !isTurnX;
    messageTurn.textContent = isTurnX ? 'X' : 'O';
}

function checkWinner(currentPlayer) {
    const cells = document.querySelectorAll('.cell');

    const winner = winningPosition.some(array => {
        return array.every(position => {
            return cells[position].classList.contains(currentPlayer);
        });
    });

    if (winner) {
        showEndGame(true);
        return true;
    }

    return false;
}

function showEndGame(winner) {
    endGame.classList.add('show');

    if (winner) {
        endGameResult.textContent = `¡${isTurnX ? 'X' : 'O'} ha ganado la partida!`;
    } else {
        endGameResult.textContent = 'El juego ha quedado en tablas';
    }
}

function hasWinningPossibility() {
    const cells = document.querySelectorAll('.cell');
    const positions = Array.from(cells).map(cell => {
        if (cell.classList.contains(players.x)) return players.x;
        if (cell.classList.contains(players.o)) return players.o;
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

function removeAllExceptLast(lastCell) {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        if (cell !== lastCell) {
            cell.classList.remove(players.x, players.o);
        }
    });

    // Permitir que las celdas se puedan hacer clic nuevamente
    cells.forEach(cell => {
        if (cell !== lastCell) {
            cell.addEventListener('click', handleGame, { once: true });
        }
    });
}

// Evento de botón
buttonReset.addEventListener('click', startGame);
