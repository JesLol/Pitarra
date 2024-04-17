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
        if(tablero[i][j][k][0] != 0){
            return false; //La funcion retorna falso en caso de que la primera posicion del array no sea 0, 
                          //lo que significa que es 1 o 2 y ya esta ocupada por algun jugador
        }else{
            tablero[i][j][k][0] = turno; //Si la primera posicion del array es 0; sigue con la funcion
        }
        if (turno === 1) {fichas1++;
        } else {fichas2++;}
    }
    fichasJugador1+=(fichas1!==0);
    fichasJugador2+=(fichas2!==0);
    return true;
}
//Verifica cuando se ha formado una linea de 3
function verificarLinea(tablero, jugador) {
    // Verificar filas
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            let linea = [];
            let contador = 0;
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][0] === jugador) {
                    linea.push(tablero[i][j][k]);
                    contador++;
                }
            }
            //Si el contador es 3 y el array de las posiciones no se encuentra en el set agrega el array de la linea al set
            if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
                lineasTres.add(JSON.stringify(linea))
                return true;
            }
        }
    }
    //Verificar columnas de la segunda y cuarta matriz
    for(let i = 1; i <= 3; i+=2){
        for(let j = 0; j < tablero[i].length; j++){
            let linea = [];
            let contador = 0;
            for(let k = 0; k < tablero[i][j].length; k++){
                if (tablero[i][k][j][0] === jugador){
                    linea.push(tablero[i][k][j]);
                    contador++;
                }
            }
            //Si el contador es 3 y el array de las posiciones no se encuentra en el set agrega el array de la linea al set
            if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
                lineasTres.add(JSON.stringify(linea))
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
        //Si el contador es 3 y el array de las posiciones no se encuentra en el set agrega el array de la linea al set
        if (contador === 3 && lineasTres.has(JSON.stringify(linea))==false) {
            lineasTres.add(JSON.stringify(linea))
            return true;
        }
    } return false;
}

//Funcion para eliminar el array de la linea de 3 del set en caso de que se elimine una ficha que este en la linea de tres
function eliminarArraySet(set, numeroABuscar) {
    for (let array of set) {
        const subarray = JSON.parse(array);
        for(let i = 0; i < 3; i++){
            if(subarray[i][1]==numeroABuscar){
                return array;
            }
        }
    }
    return false; // Si no encontramos devolvemos false
}

// Función para eliminar una ficha del oponente
function eliminarFichaOponente(tablero, jugador, id, posiciones) {
    let [matriz, fila, columna] = posiciones[0];
    if (tablero[matriz][fila][columna][0] !== jugador) {
        console.log(`¡Error! No puedes eliminar una ficha que no pertenece al jugador ${jugador}.`);
        return;
    }
    cambiarEstiloFicha(jugador, id, false);
    tablero[matriz][fila][columna][0] = 0;
    if(posiciones.length==2){
        [matriz, fila, columna] = posiciones[1];
        tablero[matriz][fila][columna][0] = 0;
    }
    if(eliminarArraySet(lineasTres, id)!=false){
        lineasTres.delete(eliminarArraySet(lineasTres, id));
    }
    jugadorAEliminar = jugador === 1 ? 2 : 1;
    eliminarFicha = false; // Desactivar la opción de eliminar ficha del oponente
    return true;
}

//Funcion para mostrar o dejar de mostrar las imagenes de las fichas
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
                if (resultado.encontrado) {
                    const [matriz, fila, columna] = resultado.posiciones[0];
                    if (tablero[matriz][fila][columna][0] !== 0 && tablero[matriz][fila][columna][0] == turno) {
                        if(eliminarFichaOponente(tablero, tablero[matriz][fila][columna][0], id, resultado.posiciones)){
                            console.log(`Ficha del rival eliminada: ${tablero[matriz][fila][columna][1]}`)
                        }else{
                            console.log("No se pudo eliminar la ficha del rival.");
                        }
                    } else {
                        console.log('¡Error! Selecciona una ficha del oponente para eliminar.');
                    }
                }
            } else {
                if (resultado.encontrado) {
                    if(cambiarPosicion(tablero, resultado.posiciones)){
                        cambiarEstiloFicha(turno, id, true);
                        console.log('Fichas del jugador 1:', fichasJugador1);
                        console.log('Fichas del jugador 2:', fichasJugador2);
                        if (verificarLinea(tablero, turno)) {
                            eliminarFicha = true;
                            console.log("Elimina una ficha del rival")
                            //lineasTres.add(turno); // Agregar la línea de tres al conjunto
                        }
                        turno = turno === 1 ? 2 : 1;
                        cambiarMostradorTurno(mostradorFichaRoja, mostradorFichaAmarilla, turno);
                    }else{
                        console.log("No puedes poner la ficha en una posicion ya ocupada por el rival")
                    }
                    
                } else {
                    console.log(`El jugador ha alcanzado el máximo de fichas.`);
                }
            }
        });
    });
}

agregarEventosClick();