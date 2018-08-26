var inicio, menu, juego, instrucciones, creditos;

//inicializacion de secciones
inicio = this.document.getElementById('inicio');
men = this.document.getElementById('menu');
juego = this.document.getElementById('juego');
creditos = this.document.getElementById('creditos');
instrucciones = this.document.getElementById('instrucciones');

//variables de menu
var btnCreditos = document.getElementById('creditos_home');

function muestracreditos(){
    men.classlist.remove('show');
    men.classlist.add('hide');

    creditos.classList.remove('hide');
    creditos.classlist.add('show');
}

window.addEventListener('load', function () {
    btnCreditos.onclick= muestracreditos;
});
