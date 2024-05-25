// Seleccionar elementos del DOM y definir variables de estado
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

let isTurnX = true; // Indica de quién es el turno actual
let turn = 0; // Contador de turnos
const maxTurn = 9; // Número máximo de turnos en una partida
const players = {// Configuración de los jugadores
    x: 'cross',
    o: 'circle'
};
// Imágenes asociadas a los jugadores
const images = {
    cross: 'images/milei.png',
    circle: 'images/pedro.png'
};
// Posiciones ganadoras posibles
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

let lastStarterWasX = true;// Indica quién comenzó la última partida
let lastMove = null;// Último movimiento realizado
// Seleccionar elementos de los jugadores

const playerXElement = document.querySelector('.scoreboard__player[data-player="x"]');
const playerOElement = document.querySelector('.scoreboard__player[data-player="o"]');


// Iniciar el juego al cargar la página
startGame();

function startGame() {
    createBoard();// Crear el tablero
    isTurnX = !lastStarterWasX; // Cambiar el turno de ser necesario
    lastStarterWasX = isTurnX; // Actualizar quién comenzó la última partida

    turn = 0; // Reiniciar el contador de turnos
    endGame.classList.remove('show'); // Ocultar el mensaje de fin de juego
    gameBoard.addEventListener('click', playAudioOnFirstClick, { once: true });// Escuchar primer clic en el tablero
    highlightCurrentPlayer();// Resaltar el jugador activo
}
// Función para crear el tablero del juego
function createBoard() {
    const cells = 9; // Número de celdas en el tablero
    // Eliminar celdas existentes en el tablero
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
    // Crear nuevas celdas en el tablero
    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener('click', handleGame);
        gameBoard.appendChild(div);
    }
}

function handleGame(e) {
    const currentCell = e.currentTarget;// Obtiene la celda actual que se hizo clic
    if (currentCell.querySelector('img')) {// Verifica si la celda ya está ocupada
        return; // Si la celda ya tiene una imagen, termina la función y no hace nad
    }

    const currentTurn = isTurnX ? players.x : players.o;// Determina el jugador actual basado en el turno
    turn++;// Incrementa el contador de turnos

    drawShape(currentCell, currentTurn);// Dibuja la forma del jugador actual en la celda

    lastMove = currentCell;  // Registra el último movimiento realizado

    if (checkWinner(currentTurn)) {// Verifica si el jugador actual ha ganado
        updateScore(isTurnX ? 'x' : 'o');// Actualiza el marcador del jugador ganador
        showEndGame(true); // Muestra el mensaje de fin de juego indicando que hay un ganador
        return;
    }

    if (turn === maxTurn) { // Verifica si se ha alcanzado el máximo de turnos (empate)
        // Empate - eliminar todas las fichas excepto la última
        resetBoardExceptLastMove();
        turn = 1; // Se cuenta la última ficha
        return;
    }

    changeTurn(); // Cambia el turno al siguiente jugador
}

function drawShape(element, player) {
    // Crea un elemento <img>
    const img = document.createElement('img');
    // Asigna la fuente de la imagen según el jugador actual
    img.src = images[player];
    // Agrega la imagen como hijo del elemento proporcionado (celda del tablero)

    element.appendChild(img);
}

function changeTurn() {
    // Cambia el turno al siguiente jugador
    isTurnX = !isTurnX;
    // Resalta al jugador actual en la interfaz

    highlightCurrentPlayer();
    // Quita la clase 'scoreboard__player--active' de todos los jugadores

    document.querySelectorAll('.scoreboard__player').forEach(player => {
        player.classList.remove('scoreboard__player--active');
    });
    // Selecciona al jugador actual y le añade la clase 'scoreboard__player--active'

    const currentPlayerElement = document.querySelector(`.scoreboard__player[data-player="${isTurnX ? 'x' : 'o'}"]`);
    currentPlayerElement.classList.add('scoreboard__player--active');
}

function checkWinner(player) {
    // Obtén todas las celdas del tablero

    const cells = document.querySelectorAll('.cell');
    // Verifica si alguna combinación de celdas forma una línea ganadora para el jugador actual

    const winner = winningPosition.some(array => {
        return array.every(position => {
            // Verifica si todas las celdas en la combinación actual contienen la imagen del jugador actual

            return cells[position].querySelector('img')?.src.includes(images[player]);
        });
    });
    // Devuelve true si hay un ganador, de lo contrario, devuelve false
    return winner;
}

function showEndGame(winner) {
    // Muestra el mensaje de fin de juego
    if (winner) {
        // Si hay un ganador, muestra el mensaje con el nombre del ganador y reproduce la música correspondiente
        endGame.classList.add('show');
        endGameResult.textContent = `¡${isTurnX ? 'Milei' : 'Pedro'} ha ganado la partida!\n `;
        playMusicForResult(isTurnX ? 'x' : 'o');
    } else {
        // Si hay un empate, muestra el mensaje de empate
        endGame.classList.add('show');
        endGameResult.textContent = '¡Empate!';
    }
}

function playMusicForResult(player) {
    // Crea objetos de audio para las victorias de X y O
    const musicForXWin = new Audio('music/audio miley.mp3');
    const musicForOWin = new Audio('music/PedroPedro.mp3');
    // Reproduce la música correspondiente según el jugador que ganó
    if (player === 'x') {
        // Reproduce la música para la victoria de X y maneja cualquier error

        musicForXWin.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de X:', error);
        });
    } else if (player === 'o') {
        // Reproduce la música para la victoria de O y maneja cualquier error
        musicForOWin.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de O:', error);
        });
    }
}

function updateScore(player) {
    // Incrementa la puntuación del jugador y actualiza la visualización de la puntuación
    playerScores[player]++;
    document.querySelector(`.scoreboard__player[data-player="${player}"] .scoreboard__score`).textContent = playerScores[player];
}

function playAudioOnFirstClick() {
    // Reproduce el audio de fondo en el primer clic y maneja cualquier error
    console.log('Reproduciendo audio...');
    audio.play().catch(error => {
        console.log('Error al reproducir el audio:', error);
    });
}

function highlightCurrentPlayer() {
    // Resalta al jugador actual en la interfaz
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
    // Reinicia el tablero, eliminando todas las fichas excepto la última jugada
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        if (cell !== lastMove) {
            cell.innerHTML = '';// Elimina la ficha de la celda
            cell.addEventListener('click', handleGame, { once: true });
        }
    });

    // Cambiar el turno después de limpiar el tablero
    isTurnX = !isTurnX; // Cambiar el turno al otro jugador
    highlightCurrentPlayer(); // Actualizar la visualización del turno
}

buttonReset.addEventListener('click', startGame);
