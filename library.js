// Seleccionar elementos del DOM y definir variables de estado
const audio = document.getElementById('musica-fondo');
const tablero = document.querySelector('.tablero_juego');
const mensajeTurno = document.querySelector('.turno_juego');
const finJuego = document.querySelector('.finjuego');
const resultadoFinal = document.querySelector('.endgame__result');
const botonReset = document.querySelector('.botonFinjuego');
const marcador = {
    x: 0,
    o: 0
};

let turnoX = true; // Indica de quién es el turno actual
let turno = 0; // Contador de turnos
const maximoTurnos = 9; // Número máximo de turnos en una partida
const jugadores = {// Configuración de los jugadores
    x: 'cross',
    o: 'circle'
};
// Imágenes asociadas a los jugadores
const imagenes = {
    cross: 'images/milei.png',
    circle: 'images/pedro.png'
};
// Posiciones ganadoras posibles
const posicionVictorias = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let indiceUltimo = true;// Indica quién comenzó la última partida
let ultimoMovimiento = null;// Último movimiento realizado
// Seleccionar elementos de los jugadores

const jugadorXelement = document.querySelector('.scoreboard__player[data-player="x"]');
const jugadorOelement = document.querySelector('.scoreboard__player[data-player="o"]');


// Iniciar el juego al cargar la página
iniciarJuego();

function iniciarJuego() {
    crearTablero();// Crear el tablero
    turnoX = !indiceUltimo; // Cambiar el turno de ser necesario
    indiceUltimo = turnoX; // Actualizar quién comenzó la última partida

    turno = 0; // Reiniciar el contador de turnos
    finJuego.classList.remove('show'); // Ocultar el mensaje de fin de juego
    tablero.addEventListener('click', audioPrimerClick, { once: true });// Escuchar primer clic en el tablero
    resaltarJugador();// Resaltar el jugador activo
}
// Función para crear el tablero del juego
function crearTablero() {
    const cells = 9; // Número de celdas en el tablero
    // Eliminar celdas existentes en el tablero
    while (tablero.firstChild) {
        tablero.removeChild(tablero.firstChild);
    }
    // Crear nuevas celdas en el tablero
    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.addEventListener('click', manejarJuego);
        tablero.appendChild(div);
    }
}

function manejarJuego(e) {
    const celdaActual = e.currentTarget;// Obtiene la celda actual que se hizo clic
    if (celdaActual.querySelector('img')) {// Verifica si la celda ya está ocupada
        return; // Si la celda ya tiene una imagen, termina la función y no hace nad
    }

    const turnoActual = turnoX ? jugadores.x : jugadores.o;// Determina el jugador actual basado en el turno
    turno++;// Incrementa el contador de turnos

    formaJugador(celdaActual, turnoActual);// Dibuja la forma del jugador actual en la celda

    ultimoMovimiento = celdaActual;  // Registra el último movimiento realizado

    if (comprobacionGanador(turnoActual)) {// Verifica si el jugador actual ha ganado
        incrementoPuntuacion(turnoX ? 'x' : 'o');// Actualiza el marcador del jugador ganador
        muestraFinJuego(true); // Muestra el mensaje de fin de juego indicando que hay un ganador
        return;
    }

    if (turno === maximoTurnos) { // Verifica si se ha alcanzado el máximo de turnos (empate)
        // Empate - eliminar todas las fichas excepto la última
        reiniciarTableroMenosUltimoMovimiento();
        turno = 1; // Se cuenta la última ficha
        return;
    }

    cambiarTurno(); // Cambia el turno al siguiente jugador
}

function formaJugador(elemento, jugador) {
    // Crea un elemento <img>
    const img = document.createElement('img');
    // Asigna la fuente de la imagen según el jugador actual
    img.src = imagenes[jugador];
    // Agrega la imagen como hijo del elemento proporcionado (celda del tablero)

    elemento.appendChild(img);
}

function cambiarTurno() {
    // Cambia el turno al siguiente jugador
    turnoX = !turnoX;
    // Resalta al jugador actual en la interfaz

    resaltarJugador();
    // Quita la clase 'scoreboard__player--active' de todos los jugadores

    document.querySelectorAll('.scoreboard__player').forEach(jugador => {
        jugador.classList.remove('scoreboard__player--active');
    });
    // Selecciona al jugador actual y le añade la clase 'scoreboard__player--active'

    const currentPlayerElement = document.querySelector(`.scoreboard__player[data-player="${turnoX ? 'x' : 'o'}"]`);
    currentPlayerElement.classList.add('scoreboard__player--active');
}

function comprobacionGanador(jugador) {
    // Obtén todas las celdas del tablero

    const celdas = document.querySelectorAll('.cell');
    // Verifica si alguna combinación de celdas forma una línea ganadora para el jugador actual

    const ganador = posicionVictorias.some(array => {
        return array.every(posicion => {
            // Verifica si todas las celdas en la combinación actual contienen la imagen del jugador actual

            return celdas[posicion].querySelector('img')?.src.includes(imagenes[jugador]);
        });
    });
    // Devuelve true si hay un ganador, de lo contrario, devuelve false
    return ganador;
}

function muestraFinJuego(ganador) {
    // Muestra el mensaje de fin de juego
    if (ganador) {
        // Si hay un ganador, muestra el mensaje con el nombre del ganador y reproduce la música correspondiente
        finJuego.classList.add('show');
        resultadoFinal.textContent = `¡${turnoX ? 'Milei' : 'Pedro'} ha ganado la partida!\n `;
        musicaVictoria(turnoX ? 'x' : 'o');
    } else {
        // Si hay un empate, muestra el mensaje de empate
        finJuego.classList.add('show');
        resultadoFinal.textContent = '¡Empate!';
    }
}

function musicaVictoria(jugador) {
    // Crea objetos de audio para las victorias de X y O
    const musicaGanadorX = new Audio('music/audio miley.mp3');
    const musicaGanadorO = new Audio('music/PedroPedro.mp3');
    // Reproduce la música correspondiente según el jugador que ganó
    if (jugador === 'x') {
        // Reproduce la música para la victoria de X y maneja cualquier error

        musicaGanadorX.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de X:', error);
        });
    } else if (jugador === 'o') {
        // Reproduce la música para la victoria de O y maneja cualquier error
        musicaGanadorO.play().catch(error => {
            console.log('Error al reproducir la música para la victoria de O:', error);
        });
    }
}

function incrementoPuntuacion(jugador) {
    // Incrementa la puntuación del jugador y actualiza la visualización de la puntuación
    marcador[jugador]++;
    document.querySelector(`.scoreboard__player[data-player="${jugador}"] .tablero_puntuacion`).textContent = marcador[jugador];
}

function audioPrimerClick() {
    // Reproduce el audio de fondo en el primer clic y maneja cualquier error
    console.log('Reproduciendo audio...');
    audio.play().catch(error => {
        console.log('Error al reproducir el audio:', error);
    });
}

function resaltarJugador() {
    // Resalta al jugador actual en la interfaz
    if (turnoX) {
        jugadorXelement.classList.add('scoreboard__player--active');
        jugadorOelement.classList.remove('scoreboard__player--active');
        jugadorOelement.classList.add('scoreboard__player2--active');
    } else {
        jugadorXelement.classList.remove('scoreboard__player--active');
        jugadorOelement.classList.add('scoreboard__player--active');
        jugadorOelement.classList.remove('scoreboard__player2--active');
    }
}

function reiniciarTableroMenosUltimoMovimiento() {
    // Reinicia el tablero, eliminando todas las fichas excepto la última jugada
    const celda = document.querySelectorAll('.cell');

    celda.forEach(cell => {
        if (cell !== ultimoMovimiento) {
            cell.innerHTML = '';// Elimina la ficha de la celda
            cell.addEventListener('click', manejarJuego, { once: true });
        }
    });

    // Cambiar el turno después de limpiar el tablero
    turnoX = !turnoX; // Cambiar el turno al otro jugador
    resaltarJugador(); // Actualizar la visualización del turno
}

botonReset.addEventListener('click', iniciarJuego);
