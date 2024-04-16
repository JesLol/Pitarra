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
let lineasTres = new Set(); // Conjunto para almacenar las líneas de tres ya completadas
const mostradorFichaRoja = document.getElementById("mostrador-ficha-roja");
const mostradorFichaAmarilla = document.getElementById("mostrador-ficha-amarilla");

//Busca la posicion en la matriz en la cual se encuentra el numero de casilla proporcionado
function buscarPosicion(tablero, numero) {
    let posiciones = [];
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][1] === numero /*&& tablero[i][j][k][0] === 0*/) {
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
//Cambia el estado de la posicion de la matriz de 0 a 1 o 2
//(1 indicando que hay una pieza del jugador 1 y 2 indicando que hay una pieza del jugador 2)
function cambiarPosicion(tablero, posiciones) {
    let fichas1 = 0;
    let fichas2 = 0;
    for (const [i, j, k] of posiciones) {
        tablero[i][j][k][0] = turno;
        if (turno === 1) {
            fichas1++;
        } else {
            fichas2++;
        }
    }
    fichasJugador1+=(fichas1!==0);
    fichasJugador2+=(fichas2!==0);
}
//Verifica cuando se ha formado una linea de 3
function verificarLinea(tablero, jugador) {
    // Verificar filas
    for (let i = 0; i < tablero.length; i++) {
        let linea = [];
        for (let j = 0; j < tablero[i].length; j++) {
            let contador = 0;
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][0] === jugador) {
                    linea.push(tablero[i][j][k]);
                    contador++; //Aqui esta el error pipipi
                }
            }
            if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
                console.log(lineasTres.has(JSON.stringify(linea)))
                lineasTres.add(JSON.stringify(linea))
                console.log("fila hecha");
                console.log(JSON.stringify(linea));
                console.log(lineasTres)
                return true;
            }
        }
    }
    //Verificar columnas de la segunda y cuarta matriz
    for(let i = 1; i <= 3; i+=2){
        let linea = [];
        for(let j = 0; j < tablero[i].length; j++){
            let contador = 0;
            for(let k = 0; k < tablero[i][j].length; k++){
                if (tablero[i][k][j][0] === jugador){
                    linea.push(tablero[i][k][j]);
                    console.log(JSON.stringify(tablero[i][k][j]))
                    contador++;
                }
            }
            if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
                console.log(lineasTres.has(JSON.stringify(linea)))
                lineasTres.add(JSON.stringify(linea))
                console.log("Columna hecha");
                console.log(JSON.stringify(linea));
                console.log(lineasTres);
                return true;
            }
        }
    }
    //Verificar columnas de la primera y tercera matriz
    for(let i = 0; i <= 2; i += 2){
        let linea = [];
        let contador = 0;
        for(let j = 0; j < tablero[i].length; j++){
            if(tablero[i][j][1][0] === jugador){
                linea.push(tablero[i][j][1]);
                contador++;
            }
        }
        if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
            lineasTres.add(JSON.stringify(linea))
            console.log("Columna hecha");
            console.log(JSON.stringify(linea));
            console.log(lineasTres);
            return true;
        }
    }
    return false;
}

// Función para eliminar una ficha del oponente
function eliminarFichaOponente(tablero, jugador, matriz, fila, columna, id) {
    if (tablero[matriz][fila][columna][0] !== jugador) {
        console.log(`¡Error! No puedes eliminar una ficha que no pertenece al jugador ${jugador}.`);
        return;
    }
    cambiarEstiloFicha(jugador, id, false);
    tablero[matriz][fila][columna][0] = 0;
    jugadorAEliminar = jugador === 1 ? 2 : 1;
    eliminarFicha = false; // Desactivar la opción de eliminar ficha del oponente
}

function cambiarEstiloFicha(turno, id, aparecer) {
    const fichaRoja = document.querySelector(`.ficha-roja${id}`);
    const fichaAmarilla = document.querySelector(`.ficha-amarilla${id}`);
    if(turno === 1 && aparecer) {
        fichaAmarilla.style.opacity = '1';
    }else if(turno === 2 && aparecer) {
        fichaRoja.style.opacity = '1';
    }
    else if(turno === 1 && !aparecer){
        fichaAmarilla.style.opacity = '0';
    }
    else{
        fichaRoja.style.opacity = '0';
    }
}

// Función para agregar eventos de clic a los botones del tablero
function agregarEventosClick() { 
    const botones = document.querySelectorAll('.ficha-button');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            console.log("---------------------------------------------------")
            const id = parseInt(boton.id);
            const resultado = buscarPosicion(tablero, id);
            if (eliminarFicha) {
                console.log(resultado.posiciones)
                if (resultado.encontrado) {
                    const [matriz, fila, columna] = resultado.posiciones[0];
                    console.log(tablero[matriz][fila][columna][0])
                    if (tablero[matriz][fila][columna][0] !== 0 && tablero[matriz][fila][columna][0] == turno) {
                        console.log(`Se elimino una ficha del jugador ${turno}.`);
                        eliminarFichaOponente(tablero, tablero[matriz][fila][columna][0], matriz, fila, columna, id);
                        console.log(tablero);
                    } else {
                        console.log('¡Error! Selecciona una ficha del oponente para eliminar.');
                    }
                }
            } else {
                if (resultado.encontrado) {
                    console.log(resultado);
                    cambiarPosicion(tablero, resultado.posiciones);
                    cambiarEstiloFicha(turno, id, true);
                    console.log('Fichas del jugador 1:', fichasJugador1);
                    console.log('Fichas del jugador 2:', fichasJugador2);
                    console.log(tablero);
                    if (verificarLinea(tablero, turno)) {
                        eliminarFicha = true;
                        console.log("Elimina una ficha del rival")
                        //lineasTres.add(turno); // Agregar la línea de tres al conjunto
                    }
                    turno = turno === 1 ? 2 : 1;
                    cambiarMostradorTurno(mostradorFichaRoja, mostradorFichaAmarilla, turno);
                    
                } else {
                    console.log(`La posición ${id} ya está ocupada o el jugador ha alcanzado el máximo de fichas.`);
                }
                console.log(lineasTres)
            }
            if(eliminarFicha){
                console.log(`Eliminar ficha: ${eliminarFicha}`)
            }
            else{
                console.error(`Eliminar ficha: ${eliminarFicha}`)
            }
        });
    });
}

agregarEventosClick();