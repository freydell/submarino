
var home, records, credits, play;


const MOVEMENT = 60;
const R = 20;
const Y = -100;

//variables de seccion
home = this.document.getElementById('home');
records = this.document.getElementById('record');
puntajemaximo = this.document.getElementById('puntajemaximo');
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
var backFromPuntajeMaximo = document.getElementById('back_from_puntajemaximo');

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
var go_record = document.getElementById('go_record');


var ctx = canvas.getContext('2d');
var puntosMoneda = document.getElementById('puntosMoneda');
var ptsMoneda = 0;
var pts = document.getElementById('pts');
var puntos = 0;
var cw = canvas.width, ch = canvas.height;
var numObstaculos = Math.floor(cw / 55);

//Sonidos
var coinSound = document.getElementById('coinSound');
var explosionSound = document.getElementById('explosionSound');
var moveForwardSound = document.getElementById('moveForward');
var powerSound = document.getElementById('powerSound');

//iniciales
var obtaculos = [];
var imgs = [];
var submarino = new submarinoPlayer();
//Flag para powerUp
var powerUp = false;
//var imgAlga = new Image();
var imgAlga = "./img/algas1.png";
imgs.push(imgAlga);

//var imgEstrella = new Image();
var imgEstrella = "./img/estrella3.svg";
imgs.push(imgEstrella);

//var imgPeces = new Image();
var imgPeces = "./img/pez3.svg";
imgs.push(imgPeces);

//var imgBotella = new Image();
var imgBotella = "./img/botella3.svg";
imgs.push(imgBotella);

//var imgAncla = new Image();
var imgAncla = "./img/ancla3.svg";
imgs.push(imgAncla);




//var imgMoneda = new Image();
//imgMoneda.src = "./img/moneda2.svg";
var imgMoneda = "./img/moneda2.svg";
imgs.push(imgMoneda);

//var imgPowerUp = new Image();
var imgPowerUp = "./img/tesoro.png";
imgs.push(imgPowerUp);

var imgStar = "./img/star.png";
imgs.push(imgStar);

function goToRecord(section) {
    records.classList.remove('hide');
    records.classList.add('show');
    records.classList.add(section);

    document.getElementById(section).classList.remove('show');
    document.getElementById(section).classList.add('hide');
}

function goToPuntajeMaximo(section) {
    puntajemaximo.classList.remove('hide');
    puntajemaximo.classList.add('show');
    puntajemaximo.classList.add(section);

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
    initImagenes();
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
    this.noInmune = true;

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

let imgSubma = new Image(50, 18);

function initSubmarino() {
    imgSubma.src = "./img/sub-final.png";
}

function initImagenes(){
    for (var i = 1; i <= numObstaculos; i++) {

        var obs = new Obstaculo();
        var img = imgs[(Math.floor((Math.random() * 8) + 1)) - 1];
        obs.img = new Image();
        obs.img.src = img;
        obs.coin = isCoin(obs.img);
        obs.powerUp = isPowerUp(obs.img);
        obs.id = i;
        obs.x = ((cw / numObstaculos) * i) - 30;
        obs.y = Math.floor((Math.random() * Y) + -10);
        obs.r = R;
        obs.k = 0;
        obs.type = 0;
        obs.lvl = 1;
        obtaculos.push(obs);

    }
}

puntosMoneda.textContent = 0;
var i = 0;
//Clase obstaculo
function Obstaculo() {
    this.img, this.id, this.x, this.y, this.r, this.lvl, this.type, this.coin, this.powerUp;
    this.probabilities = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7];
    this.render = function (ctx, x, y, R) {

        if (y > ch) {
            this.k = 0;
            this.y = Math.floor((Math.random() * Y) + -10);
            this.img = new Image();
            var imgAux = imgs[this.probabilities[(Math.floor((Math.random() * 21) + 1)) - 1]];
            this.img.src = imgAux;
            this.coin = isCoin(this.img);
            this.powerUp = isPowerUp(this.img);
            nuevoNivel(this, roundPts(puntos));
        }
        ctx.drawImage(this.img, x, y, R, 10);
        //console.log("Valores para crear img " + x +" "+ y+ " " + R + "Numero de img "+ i);
        i++;
    }
    //Convierte todos los objetos en monedas por un tiempo
    this.renderCoins = function(ctx, x, y, R){
        if (y > ch) {
            this.k = 0;
            this.y = Math.floor((Math.random() * Y) + -10);
            this.img = new Image();
            this.img.src = imgs[5];
            this.coin = isCoin(this.img);
            this.star = isStar(this.img);
            this.powerUp = isPowerUp(this.img);
            nuevoNivel(this, roundPts(puntos));
        }
        ctx.drawImage(this.img, x, y, R, 10);
    }

    this.isCoin = function(){
        return this.coin;
    }
    this.isPowerUp = function(){
        return this.powerUp;
    }
    this.isStar = function(){
      return this.star;
    }

}

this.isCoin = function(img){
    return img.src === imgMoneda.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino");
}

this.isPowerUp = function(img){
    return img.src === imgPowerUp.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino");
}

this.isStar = function(img){
    return img.src === imgStar.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino");
}

//cambia el nivel de los obstaculos
function nuevoNivel(obstaculo_cambia, duracion) {

    if (duracion < 5) {
        obstaculo_cambia.lvl = 1.0;
    } else if (duracion > 5 && duracion <= 10) {
        obstaculo_cambia.lvl = 1.15;

    } else if (duracion > 10 && duracion <= 20) {
        obstaculo_cambia.lvl = 1.2;
    } else if (duracion > 20 && duracion <= 30) {
        obstaculo_cambia.lvl = 1.25;
    } else if (duracion > 30 && duracion <= 50) {
        obstaculo_cambia.lvl = 1.3;

    } else if (duracion > 50 && duracion <= 60) {
        obstaculo_cambia.lvl = 1.35;

    }
}
//animationFrame
var animateFrameRequest;

//function que anima los objetos del juego
function animate() {
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(imgSubma, submarino.x, submarino.y, 50,18);
     //Renderiza los obstaculos dependiendo del poder
    if(!powerUp){
        obtaculos.forEach((element) => {
            element.k += 1;
            element.render(ctx, element.x, (element.y + element.k) * element.lvl, R);
        });
        animateFrameRequest = requestAnimationFrame(animate);
        collitions();
        puntos += 1;
        pts.textContent = roundPts(puntos);
    }
    else{
        obtaculos.forEach((element) => {
            element.k += 1;
            element.renderCoins(ctx, element.x, (element.y + element.k) * element.lvl, R);
        });
        animateFrameRequest = requestAnimationFrame(animate);
        collitions();
        puntos += 1;
        pts.textContent = roundPts(puntos);
    }


}

//redondea el valor de los puntos a segundos
function roundPts() {
    return Math.floor(puntos / 60);
}



//funcion para detectar colisiones
function collitions() {
    obtaculos.forEach((obstaculo) => {
        //console.log("O: "+obstaculo.img.src);
        //console.log("O.ic: "+obstaculo.isCoin());
        //console.log("O.ipu: "+obstaculo.isPowerUp());
        //console.log("M: "+imgMoneda.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino"));
        //if (obstaculo.img != imgMoneda && submarino.noInmune && obstaculo.img != imgStar) {
        if(!obstaculo.isCoin() && !obstaculo.isPowerUp() && obstaculo.img.src != imgStar.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino") && submarino.noInmune){
            let xDistance = submarino.x - obstaculo.x;
            let yDistance = submarino.y - ((obstaculo.y + obstaculo.k) * obstaculo.lvl);

            var hit = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var t = (submarino.size / 2 + obstaculo.r / 2);
            if (hit <= t) {
                cancelAnimationFrame(animateFrameRequest);
                explosionSound.play();

                gameLost.classList.remove('hide');
                gameLost.classList.add('show');
                document.getElementById('puntaje').textContent = roundPts(puntos) + ' Segundos ';
                document.getElementById('puntaje2').textContent = roundPtsMoneda(ptsMoneda) + ' Monedas';
            }
            localStorage.setItem('lastScore', roundPts(puntos));
            if ((parseInt(localStorage.getItem('lastScore')) >= parseInt(localStorage.getItem('maxScore')))) {
                localStorage.setItem('maxScore', localStorage.getItem('lastScore'));
            }
            document.getElementById('score').textContent = localStorage.getItem('maxScore') + ' Segundos';
            document.getElementById('scoresmall').textContent = 'Record: ' + localStorage.getItem('maxScore') + ' Segundos';
            document.getElementById('last_score').textContent = 'Actual puntaje: ' + localStorage.getItem('lastScore');
        }
        else if(obstaculo.isCoin()){
            let xDistance = submarino.x - obstaculo.x;
            let yDistance = submarino.y - ((obstaculo.y + obstaculo.k) * obstaculo.lvl);

            var hit = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var t = (submarino.size / 2 + obstaculo.r / 2);
            if (hit <= t) {
                ptsMoneda += 1;
                puntosMoneda.textContent = roundPtsMoneda(ptsMoneda);
                coinSound.play();
                obstaculo.img.src = "";

            }

        }
        else if (obstaculo.img.src === imgStar.replace(".","file:///D:/Universidad/Semestre%208/AppsMoviles/Submarino") && submarino.noInmune) {
            let xDistance = submarino.x - obstaculo.x;
            let yDistance = submarino.y - ((obstaculo.y + obstaculo.k) * obstaculo.lvl);

            var hit = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var t = (submarino.size / 2 + obstaculo.r / 2);

            if (hit <= t) {
                pts.style.color = "red"
                console.log(submarino.noInmune);
                submarino.noInmune = false;
                console.log(submarino.noInmune);
                moveForwardSound.pause();
                powerSound.play();
                inmuneTime();
            }


        }
        else if(obstaculo.isPowerUp()){
            let xDistance = submarino.x - obstaculo.x;
            let yDistance = submarino.y - ((obstaculo.y + obstaculo.k) * obstaculo.lvl);

            var hit = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
            var t = (submarino.size / 2 + obstaculo.r / 2);
            if (hit <= t) {
                obstaculo.img.src = "";
                moveForwardSound.pause();
                powerSound.play();
                powerUp = true;
                setTimeout(() => {
                    powerUp = false;
                    powerSound.pause();
                    moveForwardSound.play();
                    powerSound.currentTime = 0;
                }, 10000);

            }

        }
    });
}
function roundPtsMoneda() {
    return Math.floor(ptsMoneda / 25);
}

function inmuneTime() {
    setTimeout(function () {
        submarino.noInmune = true;
        console.log(submarino.noInmune);
        pts.style.color = "white"
        powerSound.pause();
        powerSound.currentTime = 0;
        moveForwardSound.play();
        // canvas.style.background = 'url(./img/fondo-juego.gif) no-repeat';
        // canvas.style.backgroundSize="cover";
    }, 10000);
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
    ptsMoneda = 0;
    puntosMoneda.textContent = ptsMoneda;

}
//volver a crear una nueva partida
function goPlayAgain() {
    restarPositions();
    setTimeout(() => {
        animateFrameRequest = requestAnimationFrame(animate);
    }, 500);
}

window.addEventListener('load', init);

function init() {

    if (!localStorage.maxScore && !localStorage.lastScore) {
        localStorage.setItem('maxScore', 0);
        localStorage.setItem('lastScore', 0);
    }
    document.getElementById('score').textContent = localStorage.maxScore + ' Segundos';
    document.getElementById('scoresmall').textContent = localStorage.maxScore + ' Segundos';
    document.getElementById('last_score').textContent = 'Actual puntaje: ' + localStorage.lastScore;

    btnCredits.onclick = creditos;
    btnPlay.onclick = playGame;
    moveForwardSound.volume = 0.5;
    moveForwardSound.play();
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
    backFromPuntajeMaximo.addEventListener('click', function () {
        goBack('puntajemaximo');
    });

    go_home.addEventListener('click', function () {
        goHome();
    });
    go_record.addEventListener('click', function () {
        goToPuntajeMaximo('play');
    });

    btnRecord.addEventListener('click', function () {
        goToRecord('home');
    });
    //loop para la cancion de fondo
    moveForwardSound.addEventListener('ended' , () => {
        moveForwardSound.currentTime = 0;
        moveForwardSound.play();
    }, false);


}


var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        //init();
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
