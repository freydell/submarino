
var home, records, credits, play;


const MOVEMENT = 60;
const R = 20;
const Y = -100;

//variables de seccion
home = this.document.getElementById('home');
records = this.document.getElementById('record');
credits = this.document.getElementById('credits');
play = this.document.getElementById('play');

//variables home
var info = document.getElementById('info_home');
var btnCredits = document.getElementById('creditos_home');
var btnRecord = document.getElementById('record_home');
var btnPlay = document.getElementById('play_home');
var popUp = document.getElementById('popUp');

//variables  menus
var backFromRecord = document.getElementById('back_from_record');
var backFromCredits = document.getElementById('back_from_credits');

//variables para mover el personaje 
var mvLeft = document.getElementById('mvLeft');
var mvRight = document.getElementById('mvRight');

//campo de juego
var canvas = document.getElementById("play_field");
var pause = document.getElementById('pause');
var pausePopUp = document.getElementById('pausePopUp');
var gameLost = document.getElementById('gameLost');
var btnRecordPause = document.getElementById('record_pause');
var btnRestartGame = document.getElementById('restart_game');
var play_again = document.getElementById('play_again');
var go_home = document.getElementById('go_home');

var ctx = canvas.getContext('2d');
var pts = document.getElementById('pts');
var puntos = 0;
var cw = canvas.width, ch = canvas.height;
var numObstaculos = Math.floor(cw / 55);

//iniciales
var obtaculos = [];
var imgs = [];
var submarino = new submarinoPlayer();

var imgAlga = new Image();
imgAlga.src = "./img/img/algas1.png";
imgs.push(imgAlga);

var imgEstrella = new Image();
imgEstrella.src = "./img/img/estrella2.png";
imgs.push(imgEstrella);

var imgPeces = new Image();
imgPeces.src = "./img/img/pez.png";
imgs.push(imgPeces);

var imgBotella = new Image();
imgBotella.src = "./img/img/botella2.png";
imgs.push(imgBotella);

var imgAncla = new Image();
imgAncla.src = "./img/img/ancla2.png";
imgs.push(imgAncla);

function goToRecord(section) {
    records.classList.remove('hide');
    records.classList.add('show');
    records.classList.add(section);

    document.getElementById(section).classList.remove('show');
    document.getElementById(section).classList.add('hide');
}

let animateInterval;

function creditos() {
    home.classList.remove('show');
    home.classList.add('hide');

    credits.classList.remove('hide');
    credits.classList.add('show');
    credits.classList.add('home');
}


function playGame() {
    home.classList.remove('show');
    home.classList.add('hide');

    play.classList.remove('hide');
    play.classList.add('show');
    initSubmarino();
    animate();

}


function goBack(section) {
    var sectionVariables = document.getElementById(section).classList;
    sectionVariables.forEach((secClass) => {
        if (secClass === "home") {
            home.classList.remove('hide');
            home.classList.add('show');
            document.getElementById(section).classList.remove("home");
        } else if (secClass === "play") {
            document.getElementById("play").classList.remove('hide');
            document.getElementById("play").classList.add('show');
            document.getElementById(section).classList.remove("play");
        }
    })
    document.getElementById(section).classList.remove('show');
    document.getElementById(section).classList.add('hide');
}

function goHome() {
    home.classList.remove('hide');
    home.classList.add('show');
    play.classList.remove('show');
    play.classList.add('hide');
    pausePopUp.classList.remove('show');
    pausePopUp.classList.add('hide');

    cancelAnimationFrame(animateFrameRequest);
    restarPositions();

}



//clase submarino
function submarinoPlayer() {
    this.x = cw / 2;
    this.y = ch / 1.3;
    this.size = 8;

}

//funcion que hace desplazar el personaje el valor de la constante de desplazamiento
function move(valToMove) {
    submarino.x += valToMove;
    if (submarino.x + 20 > cw) {
        submarino.x -= valToMove;
    } else if (submarino.x < 0) {
        submarino.x -= valToMove;
    }
}

let imgSubma = new Image(100,100);

function initSubmarino() {
    imgSubma.src = "./img/img/submarino.png";
}


for (var i = 1; i <= numObstaculos; i++) {
    var obs = new Obstaculo();
    var img = imgs[(Math.floor((Math.random() * 5) + 1)) - 1];
    obs.img = img;
    obs.id = i;
    obs.x = ((cw / numObstaculos) * i) - 30;
    obs.y = Math.floor((Math.random() * Y) + -10);
    obs.r = R;
    obs.k = 0;
    obs.type = 0;
    obs.lvl = 1;
    obtaculos.push(obs);
}

//Clase obstaculo
function Obstaculo() {
    this.img, this.id, this.x, this.y, this.r, this.lvl, this.type;
    this.render = function (ctx, x, y, R) {
        if (y > ch) {
            this.k = 0;
            this.y = Math.floor((Math.random() * Y) + -10);
            this.img = imgs[(Math.floor((Math.random() * 5) + 1)) - 1];
            nuevoNivel(this, roundPts(puntos));
        }
        ctx.drawImage(this.img, x, y, R, R);
    }
}

//cambia el nivel de los obstaculos
function nuevoNivel(obstaculo_cambia, duracion) {

    if (duracion < 2) {
        obstaculo_cambia.lvl = 1.1;
    } else if (duracion > 5 && duracion <= 10) {
        obstaculo_cambia.lvl = 1.2;

    } else if (duracion > 10 && duracion <= 20) {
        obstaculo_cambia.lvl = 1.5;
    } else if (duracion > 20 && duracion <= 30) {
        obstaculo_cambia.lvl = 1.8;
    } else if (duracion > 30 && duracion <= 50) {
        obstaculo_cambia.lvl = 2;

    } else if (duracion > 50 && duracion <= 60) {
        obstaculo_cambia.lvl = 3;

    }
}
//animationFrame 
var animateFrameRequest;
//function que anima los objetos del juego
function animate() {
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(imgSubma, submarino.x, submarino.y, 40,15);

    //obstaculos
    obtaculos.forEach((element) => {
        element.k += 1;
        element.render(ctx, element.x, (element.y + element.k) * element.lvl, R);
    });
    animateFrameRequest = requestAnimationFrame(animate);
    collitions();
    puntos += 1;
    pts.textContent = roundPts(puntos);
}

//redondea el valor de los puntos a segundos
function roundPts() {
    return Math.floor(puntos / 60);
}

//funcion para detectar colisiones
function collitions() {
    obtaculos.forEach((obstaculo) => {
        let xDistance = submarino.x - obstaculo.x;
        let yDistance = submarino.y - ((obstaculo.y + obstaculo.k) * obstaculo.lvl);

        var hit = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        var t = (submarino.size / 2 + obstaculo.r / 2);
        if (hit <= t) {
            cancelAnimationFrame(animateFrameRequest);
            gameLost.classList.remove('hide');
            gameLost.classList.add('show');
            document.getElementById('puntaje').textContent = roundPts(puntos) + ' Segundos';
        }
    });
}

//pausar el juego
function pauseGame() {
    cancelAnimationFrame(animateFrameRequest);
    mvLeft.style.zIndex = -1;
    mvRight.style.zIndex = -1;
    pausePopUp.classList.remove('hide');
    pausePopUp.classList.add('show');
}

//retoma el juego
function restartGame() {
    mvLeft.style.zIndex = 0;
    mvRight.style.zIndex = 0;
    pausePopUp.classList.remove('show');
    pausePopUp.classList.add('hide');
    setTimeout(() => {
        animateFrameRequest = requestAnimationFrame(animate);
    }, 100);
}
function restarPositions() {
    mvLeft.style.zIndex = 0;
    mvRight.style.zIndex = 0;
    obtaculos.forEach((obs) => {
        obs.y = Math.floor((Math.random() * Y) + -10);
        obs.lvl = 1;
        obs.k = 0;
        ctx.clearRect(0, 0, cw, ch);
        obs.render(ctx, obs.x, (obs.y + obs.k) * obs.lvl, R);
    });
    submarino.x = cw / 2;
    gameLost.classList.remove('show');
    gameLost.classList.add('hide');
    puntos = 0;

}
//volver a crear una nueva partida
function goPlayAgain() {
    restarPositions();
    setTimeout(() => {
        animateFrameRequest = requestAnimationFrame(animate);
    }, 500);
}

window.addEventListener('load', function () {

    btnCredits.onclick = creditos;
    btnPlay.onclick = playGame;

    //game options
    pause.onclick = pauseGame;
    btnRestartGame.onclick = restartGame;
    play_again.onclick = goPlayAgain;

    //botones movilidad personaje
    mvLeft.addEventListener('click', function () {
        move(-MOVEMENT);
    });

    mvRight.addEventListener('click', function () {
        move(MOVEMENT);
    });

    backFromRecord.addEventListener('click', function () {
        goBack('record');
    });
    backFromCredits.addEventListener('click', function () {
        goBack('credits');
    });

    go_home.addEventListener('click', function () {
        goHome();
    });

    btnRecord.addEventListener('click', function () {
        goToRecord('home');
    });

});

