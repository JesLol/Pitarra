let tablero = [[
    [[0,2],[0,1],[0,8]],
    [[0,4],[0,3],[0,10]],
    [[0,6],[0,5],[0,12]]
],[
    [[0,12],[0,10],[0,8]],
    [[0,11],[0,9],[0,7]],
    [[0,18],[0,16],[0,14]]
],[
    [[0,24],[0,17],[0,18]],
    [[0,22],[0,15],[0,16]],
    [[0,20],[0,13],[0,14]]
],[
    [[0,2],[0,4],[0,6]],
    [[0,19],[0,21],[0,23]],
    [[0,20],[0,22],[0,24]]
]];

let turno = 1; // Inicializar el turno
let fichasJugador1 = 0; // Contador de fichas del jugador 1
let fichasJugador2 = 0; // Contador de fichas del jugador 2
const maxFichas = 12; // Número máximo de fichas por jugador
let eliminarFicha = false; // Variable para controlar si se debe eliminar una ficha del oponente

function buscarPosicion(tablero, numero) {
    let posiciones = [];
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][1] === numero && tablero[i][j][k][0] === 0) {
                    if ((turno === 1 && fichasJugador1 < maxFichas) || (turno === 2 && fichasJugador2 < maxFichas)) {
                        posiciones.push([i, j, k]);
                        if (numero % 2 === 0 && posiciones.length >= 2) {
                            return { encontrado: true, posiciones: posiciones };
                        } else if (numero % 2 !== 0 && posiciones.length === 1) {
                            return { encontrado: true, posiciones: posiciones };
                        }
                    }
                }
            }
        }
    }
    return { encontrado: false };
}

function cambiarPosicion(tablero, posiciones) {
    for (const [i, j, k] of posiciones) {
        tablero[i][j][k][0] = turno;
        if (turno === 1) {
            fichasJugador1++;
        } else {
            fichasJugador2++;
        }
    }
}

function verificarLinea(tablero, jugador) {
    // Verificar filas
    for (let i = 0; i < tablero.length; i++) {
        let contador = 0;
        for (let j = 0; j < tablero[i].length; j++) {
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][0] === jugador) {
                    contador++;
                }
            }
        }
        if (contador === 3) {
            return true;
        }
    }

    // Verificar columnas
    for (let j = 0; j < tablero[0].length; j++) {
        let contador = 0;
        for (let i = 0; i < tablero.length; i++) {
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][0] === jugador) {
                    contador++;
                }
            }
        }
        if (contador === 3) {
            return true;
        }
    }

    // Verificar diagonales
    if (
        (tablero[0][0][0][0] === jugador && tablero[1][1][1][0] === jugador && tablero[2][2][2][0] === jugador) ||
        (tablero[0][2][0][0] === jugador && tablero[1][1][1][0] === jugador && tablero[2][0][2][0] === jugador)
    ) {
        return true;
    }

    return false;
}

function eliminarFichaOponente(tablero, jugador, fila, columna) {
    if (tablero[fila][columna][0][0] !== jugador) {
        console.log(`¡Error! No puedes eliminar una ficha que no pertenece al jugador ${jugador}.`);
        return;
    }
    tablero[fila][columna][0][0] = 0;
    if (jugador === 1) {
        fichasJugador1--;
    } else {
        fichasJugador2--;
    }
    console.log(`Se eliminó una ficha del jugador ${jugador === 1 ? 2 : 1}.`);
    eliminarFicha = false; // Desactivar la opción de eliminar ficha del oponente
    filaEliminar = -1; // Restablecer la fila de la ficha a eliminar
    columnaEliminar = -1; // Restablecer la columna de la ficha a eliminar
}

function agregarEventosClick() {
    const botones = document.querySelectorAll('.ficha-button');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            if (eliminarFicha) {
                const id = parseInt(boton.id);
                const resultado = buscarPosicion(tablero, id);
                if (resultado.encontrado && resultado.posiciones.length === 1) {
                    const [fila, columna] = resultado.posiciones[0];
                    console.log(tablero[fila][columna][0][0])
                    if (tablero[fila][columna][0][0] !== 0 && tablero[fila][columna][0][0] !== turno) {
                        console.log(`Se eligió eliminar una ficha del jugador ${tablero[fila][columna][0][0]}.`);
                        eliminarFichaOponente(tablero, tablero[fila][columna][0][0], fila, columna);
                        turno = turno === 1 ? 2 : 1;
                        console.log(tablero);
                    } else {
                        console.log('¡Error! Selecciona una ficha del oponente para eliminar.');
                    }
                }
            } else {
                const id = parseInt(boton.id);
                const resultado = buscarPosicion(tablero, id);
                if (resultado.encontrado) {
                    console.log(resultado);
                    cambiarPosicion(tablero, resultado.posiciones);
                    turno = turno === 1 ? 2 : 1;
                    console.log('Turno actual:', turno);
                    console.log('Fichas del jugador 1:', fichasJugador1);
                    console.log('Fichas del jugador 2:', fichasJugador2);
                    console.log(tablero);
                    if (verificarLinea(tablero, turno)) {
                        eliminarFicha = true;
                    }
                } else {
                    console.log(`La posición ${id} ya está ocupada o el jugador ha alcanzado el máximo de fichas.`);
                }
            }
        });
    });
}


agregarEventosClick();