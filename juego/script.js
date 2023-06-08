const score = document.querySelector('.score');// Obtiene el elemento con la clase 'score' para mostrar la puntuación
const startScreen = document.querySelector('.startScreen');// Obtiene el elemento con la clase 'startScreen' para mostrar la pantalla de inicio
const gameArea = document.querySelector('.gameArea');// Obtiene el elemento con la clase 'gameArea' que representa el área del juego
let player = { speed: 5, score: 0 }; // Objeto que representa al jugador con su velocidad y puntuación
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }; // Objeto para almacenar las teclas presionadas por el jugador
const backgroundMusic = document.getElementById('backgroundMusic');//obtiene el elemento para reproducir el sonido

startScreen.addEventListener('click', start); // Agrega un evento de clic al elemento de pantalla de inicio para comenzar el juego
document.addEventListener('keydown', keyDown); // Agrega un evento de tecla presionada para detectar cuándo se presionan las teclas
document.addEventListener('keyup', keyUp); // Agrega un evento de tecla liberada para detectar cuándo se sueltan las teclas

function keyDown(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado de la tecla presionada
    keys[e.key] = true; // Establece la propiedad correspondiente de 'keys' en true para indicar que la tecla está presionada
  }

  function keyUp(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado de la tecla liberada
    keys[e.key] = false; // Establece la propiedad correspondiente de 'keys' en false para indicar que la tecla ha sido liberada
  }

function isCollide(a, b) {
  aRect = a.getBoundingClientRect(); // Obtiene las coordenadas y dimensiones del elemento a
  bRect = b.getBoundingClientRect(); // Obtiene las coordenadas y dimensiones del elemento b
  return !(
    aRect.bottom < bRect.top || // Comprueba si a está por encima de b
    aRect.top > bRect.bottom || // Comprueba si a está por debajo de b
    aRect.right < bRect.left || // Comprueba si a está a la izquierda de b
    aRect.left > bRect.right // Comprueba si a está a la derecha de b
  );
}
function moveLines() {
    let lines = document.querySelectorAll('.lines'); // Obtiene todos los elementos con la clase 'lines'
    lines.forEach(function (item) {
      if (item.y >= 650) { // Si la línea ha llegado al final del área del juego
        item.y -= 740; // Reinicia la posición de la línea hacia arriba
      }
      item.y += player.speed; // Mueve la línea hacia abajo según la velocidad del jugador
      item.style.top = item.y + 'px'; // Actualiza la posición vertical de la línea
    });
}

function endGame() {
  player.start = false; // Establece la bandera de inicio del jugador en falso para detener el juego
  startScreen.classList.remove('hide'); // Muestra la pantalla de inicio
  if (player.score >= 3000) {
    startScreen.innerHTML =
      '¡Has alcanzado la meta!<br>Puntuación final: ' +
      player.score +
      '<br>Pulsa de nuevo para volver a empezar';
  } else {
    startScreen.innerHTML =
      'Fin del juego<br>Puntuación final: ' +
      player.score +
      '<br>Pulsa de nuevo para volver a empezar';
  }
}

function moveCars() {
  let car = document.querySelector('.car'); // Obtiene el elemento del auto del jugador
  let road = gameArea.getBoundingClientRect(); // Obtiene las coordenadas y dimensiones del área 

  if (player.start) {
    moveLines();

    if (keys.ArrowUp && player.y > road.top + 70) {
      player.y -= player.speed; // Mueve el auto del jugador hacia arriba
    }
    if (keys.ArrowDown && player.y < road.bottom - 85) {
      player.y += player.speed; // Mueve el auto del jugador hacia abajo
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;  // Mueve el auto del jugador hacia la izquierda
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;  // Mueve el auto del jugador hacia la derecha
    }

    car.style.top = player.y + 'px'; // Actualiza la posición vertical del auto del jugador
    car.style.left = player.x + 'px'; // Actualiza la posición horizontal del auto del jugador

/** window.requestAnimationFrame(moveCars) se utiliza para solicitar al navegador que ejecute la función moveCars en el siguiente ciclo 
 * de animación antes de que se repinte la pantalla. Esta función es parte de la API de animación 
 * del navegador y proporciona una forma eficiente de realizar animaciones suaves y optimizadas. */

    window.requestAnimationFrame(moveCars);//garantiza que la función moveCars se llame repetidamente en sincronía con la frecuencia de actualización de la pantalla

    let enemy = document.querySelector('.enemy');  // Obtiene el elemento del auto enemigo

    if (isCollide(car, enemy)) { // Comprueba si hay una colisión entre el auto del jugador y el auto enemigo
      console.log('Bang!');
      endGame();// Finaliza el juego si hay una colisión
    }

    if (enemy.y >= 750) { // Si el auto enemigo ha llegado al final del área del juego
      enemy.y = -300; // Reinicia la posición del auto enemigo hacia arriba
      enemy.style.left = Math.floor(Math.random() * (road.width + 50)) + 'px'; // Establece una posición horizontal aleatoria para el auto enemigo
    }

    enemy.y += player.speed; // Mueve el auto enemigo hacia abajo según la velocidad del jugador
    enemy.y += player.speed;
    enemy.style.top = enemy.y + 'px';// Actualiza la posición vertical del auto enemigo

    player.score++;// Incrementa la puntuación del jugador
    let ps = player.score - 1;
    score.innerText = 'Score: ' + ps; // Actualiza el marcador de puntuación

    if (player.score >= 3000) {
      endGame();
    }
  }
}

function start() {
  startScreen.classList.add('hide');// Oculta la pantalla de inicio
  gameArea.innerHTML = ''; // Limpia el área del juego
  player.start = true; // Establece la bandera de inicio del jugador en verdadero
  player.score = 0; // Restablece la puntuación del jugador a cero

  for (let x = 0; x < 5; x++) {
    let roadLine = document.createElement('div'); // Crea un elemento div para representar las líneas del camino
    roadLine.setAttribute('class', 'lines'); // Establece la clase del elemento div como 'lines'
    roadLine.y = x * 150; // Establece la posición vertical inicial de cada línea
    roadLine.style.top = roadLine.y + 'px'; // Establece la posición vertical del elemento div
    gameArea.appendChild(roadLine); // Agrega la línea al área del juego
  }
  let car = document.createElement('div'); // Crea un elemento div para representar el auto del jugador
  car.setAttribute('class', 'car'); // Establece la clase del elemento div como 'car'
  gameArea.appendChild(car); // Agrega el auto del jugador
  player.x = car.offsetLeft; // Obtiene la posición horizontal inicial del auto del jugador
  player.y = car.offsetTop; // Obtiene la posición vertical inicial del auto del jugador

  let enemy = document.createElement('div'); // Crea un elemento div para representar el auto enemigo
  enemy.setAttribute('class', 'enemy'); // Establece la clase del elemento div como 'enemy'
  enemy.y = -300; // Establece la posición vertical inicial del auto enemigo fuera del área visible
  enemy.style.top = enemy.y + 'px'; // Establece la posición vertical del elemento div
  enemy.style.left = player.x + 'px'; // Establece la posición horizontal del elemento div igual a la del auto del jugador
  enemy.style.backgroundColor = randomColor(); // Establece un color de fondo aleatorio para el auto enemigo
  gameArea.appendChild(enemy); // Agrega el auto enemigo al área del juego

  window.requestAnimationFrame(moveCars); // Inicia el bucle de animación del movimiento de los autos
}

function randomColor() {
  function c() {
    let hex = Math.floor(Math.random() * 256).toString(16);// Genera un número hexadecimal aleatorio entre 0 y 255
    return ('0' + String(hex)).substr(-2);// Formatea el número hexadecimal para que siempre tenga dos dígitos
  }
  return '#' + c() + c() + c();  // Devuelve un color hexadecimal aleatorio en formato #RRGGBB
}
backgroundMusic.play();
backgroundMusic.volume = 0.10;

