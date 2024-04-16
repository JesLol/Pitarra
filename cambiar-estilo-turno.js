function cambiarMostradorTurno(fichaRoja, fichaAmarilla, turno){
    if(turno==1){
        fichaAmarilla.style.opacity="1";
        fichaRoja.style.opacity="0";
    }
    else{
        fichaAmarilla.style.opacity="0";
        fichaRoja.style.opacity="1";
    }
}