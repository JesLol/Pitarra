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
let fichasReales1 = 0;
let fichasReales2 = 0;
const maxFichas = 12; // Número máximo de fichas por jugador
let eliminarFicha = false; // Variable para controlar si se debe eliminar una ficha del oponente
let lineasTres = new Set(); // Conjunto para almacenar las líneas de tres ya completadas
const colindantes = new Set();
let sinFichas = false;
let piezaSeleccionada = {seleccionada:false, id:0, resultado:{}};
const mostradorFichaRoja = document.getElementById("mostrador-ficha-roja");
const mostradorFichaAmarilla = document.getElementById("mostrador-ficha-amarilla");
let victoria = {victoria:false, ganador:0};

//Busca la posicion en la matriz en la cual se encuentra el numero de casilla proporcionado
function buscarPosicion(tablero, numero) {
    let posiciones = [];
    for (let i = 0; i < tablero.length; i++) {
        for (let j = 0; j < tablero[i].length; j++) {
            for (let k = 0; k < tablero[i][j].length; k++) {
                if (tablero[i][j][k][1] === numero /*&& tablero[i][j][k][0] === 0*/) {
                    //if ((turno === 1 && fichasJugador1 < maxFichas) || (turno === 2 && fichasJugador2 < maxFichas)) {
                        posiciones.push([i, j, k]);
                        if (numero % 2 === 0 && posiciones.length >= 2) {
                            return { encontrado: true, posiciones: posiciones };
                        } else if (numero % 2 !== 0 && posiciones.length === 1) {
                            return { encontrado: true, posiciones: posiciones };
                        }
                    //}
                }
            }
        }
    }
    return { encontrado: false };
}
//Cambia el estado de la posicion de la matriz de 0 a 1 o 2
//(1 indicando que hay una pieza del jugador 1 y 2 indicando que hay una pieza del jugador 2)
function cambiarPosicion(tablero, posiciones, agregarFicha) {
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
    if(agregarFicha){
        fichasJugador1+=(fichas1!==0);
        fichasJugador2+=(fichas2!==0);
        fichasReales1+=(fichas1!==0);
        fichasReales2+=(fichas2!==0);
    }
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
    if(jugador==1){
        fichasReales1--;
    }
    else{
        fichasReales2--
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
//Encontrar las fichas colindantes(a las que el jugador se puede mover) cuando los jugadores terminan sus fichas
function encontrarColindantes(tablero, posiciones){
    colindantes.clear();
    for(let i = 0; i < posiciones.posiciones.length; i++){
        const cords = posiciones.posiciones[i];
        const x = cords[0];
        const y = cords[1];
        const z = cords[2];
        // Coordenadas adyacentes
        const adyacentes = [
            [x, y - 1, z],
            [x, y + 1, z],
            [x, y, z - 1],
            [x, y, z + 1]
        ];
        // Verifica los valores colindantes
        adyacentes.forEach(coords => {
            const [nx, ny, nz] = coords;
            if (nx >= 0 && nx < tablero.length && ny >= 0 && ny < tablero[0].length && nz >= 0 && nz < tablero[0][0].length) {
                if (tablero[nx][ny][nz][0] === 0) { // Verificar si el primer elemento es 0
                    colindantes.add(tablero[nx][ny][nz][1]);
                }
            }
        });
    }
}

// Función para agregar eventos de clic a los botones del tablero
function agregarEventosClick() { 
    const botones = document.querySelectorAll('.ficha-button');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            console.log("---------------------------------------------------")
            if(victoria.victoria==false){
                const id = parseInt(boton.id);
                const resultado = buscarPosicion(tablero, id);
                const [matriz, fila, columna] = resultado.posiciones[0];
                if (eliminarFicha) { //Entra aca para que el jugador elimine una ficha del rival
                    if (resultado.encontrado) {
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
                }else if(piezaSeleccionada.seleccionada&&tablero[matriz][fila][columna][0]==0){
                    if(colindantes.has(id)){
                        let cordFichaSeleccionada = buscarPosicion(tablero, piezaSeleccionada.id)
                        cambiarEstiloFicha(turno, piezaSeleccionada.id, false);//Cambia el estilo de la ficha seleccionada anteriormente a 0
                        cambiarEstiloFicha(turno, id, true);//Cambia el estado de la ficha seleccionada actualmente a 1
                        cambiarPosicion(tablero, resultado.posiciones, false); //Cambia el el valor del array de la matriz de 0 a turno 
                        for(let i=0; i<cordFichaSeleccionada.posiciones.length;i++){
                            const [x,y,z] = cordFichaSeleccionada.posiciones[i];
                            tablero[x][y][z][0]=0;
                        }
                        if(eliminarArraySet(lineasTres, piezaSeleccionada.id)!=false){
                            lineasTres.delete(eliminarArraySet(lineasTres, piezaSeleccionada.id));
                        }
                        if (verificarLinea(tablero, turno)) {
                            eliminarFicha = true;
                            console.log("Elimina una ficha del rival")
                        }
                        turno = turno === 1 ? 2 : 1;
                        piezaSeleccionada.seleccionada=false;
                        cambiarMostradorTurno(mostradorFichaRoja, mostradorFichaAmarilla, turno);
                    }else{
                        console.log("Haz un movimiento valido")
                    }
                }else if(sinFichas==true){ //Entra aca cuando ambos jugadores se acabaron sus fichas y deben empezar a mover sus piezas
                    if(tablero[matriz][fila][columna][0]==turno){
                        encontrarColindantes(tablero, resultado);
                        piezaSeleccionada.seleccionada=true;
                        piezaSeleccionada.id=id;
                        piezaSeleccionada.resultado=resultado;
                    }
                    else{
                        console.log(`Turno del jugador ${turno}`);
                    }
                }else{ //Entra aca cuando el jugador va a poner una ficha
                    if (resultado.encontrado && (fichasJugador1 < maxFichas || fichasJugador2 < maxFichas)) {
                        if(cambiarPosicion(tablero, resultado.posiciones, true)){
                            cambiarEstiloFicha(turno, id, true);
                            console.log('Fichas del jugador 1:', fichasJugador1);
                            console.log('Fichas del jugador 2:', fichasJugador2);
                            if (verificarLinea(tablero, turno)) {
                                eliminarFicha = true;
                                console.log("Elimina una ficha del rival")
                            }
                            turno = turno === 1 ? 2 : 1;
                            if(fichasJugador1 == maxFichas && fichasJugador2 == maxFichas){
                                sinFichas=true;
                                console.log("Sin fichas")
                            }
                            cambiarMostradorTurno(mostradorFichaRoja, mostradorFichaAmarilla, turno);
                        }else{
                            console.log("No puedes poner la ficha en una posicion ya ocupada")
                        }
                        
                    }else{
                        console.log(`El jugador ha alcanzado el máximo de fichas.`);
                    }
                }
                if(fichasReales1==2&&sinFichas==true){
                    console.log("Jugador 2 gana la partida")
                    victoria.victoria=true;
                    victoria.ganador=2;
                }else if(fichasReales2==2&&sinFichas==true){
                    console.log("Jugador 1 gana la partida")
                    victoria.victoria=true;
                    victoria.ganador=1;
                }
            }else{
                console.log(`Partida terminada. Jugador ${victoria.ganador} ganó.`);
            }
        });
    });
}

agregarEventosClick();