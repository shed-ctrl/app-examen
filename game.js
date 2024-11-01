// Agregar variables para los sonidos
const clickSound = new Audio('assets/click-sound.mp3');
const startSound = new Audio('assets/start-sound.mp3');
const endSound = new Audio('assets/end-sound.mp3');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

let score = 0;
let ghosts = [];
const maxGhosts = 5;
let gameOver = true;
let remainingTime = 30;
let timerInterval;

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// Clase para definir las propiedades y el movimiento de los fantasmas
class Ghost {
  constructor(x, y, imgSrc) {
    this.x = x;
    this.y = y;
    this.size = 200;
    this.opacity = 1;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.image = new Image();
    this.image.src = imgSrc;
    this.isFading = false;
    this.flash = false;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    ctx.restore();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mejora en la lógica de rebote en los bordes
    if (this.x <= 0 || this.x + this.size >= canvas.width) {
      this.speedX *= -1;
      this.x = Math.max(0, Math.min(this.x, canvas.width - this.size));
    }
    if (this.y <= 0 || this.y + this.size >= canvas.height) {
      this.speedY *= -1;
      this.y = Math.max(0, Math.min(this.y, canvas.height - this.size));
    }

    // Efecto de flash y desvanecimiento
    if (this.isFading) {
      if (this.flash) {
        this.opacity = 1; // Flash effect
        this.flash = false;
      } else {
        this.opacity -= 0.1;
      }

      if (this.opacity <= 0) {
        const index = ghosts.indexOf(this);
        if (index > -1) {
          ghosts.splice(index, 1);
          score++;
          scoreElement.textContent = `Puntuación: ${score}`;
          
          // Crear un nuevo fantasma si hay menos de 5 en pantalla
          if (ghosts.length < maxGhosts) {
            ghosts.push(new Ghost(Math.random() * canvas.width, Math.random() * canvas.height, 'assets/fantasma.png'));
          }
        }
      }
    }
  }

  fadeOut() {
    this.flash = true;
    this.isFading = true;
  }
}

// Crear fantasmas iniciales
function createGhosts() {
  ghosts = [];
  for (let i = 0; i < maxGhosts; i++) {
    const x = Math.random() * (canvas.width - 60);
    const y = Math.random() * (canvas.height - 60);
    ghosts.push(new Ghost(x, y, 'assets/fantasma.png'));
  }
}

// Actualizar y redibujar los fantasmas
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ghosts.forEach((ghost) => {
    ghost.update();
    ghost.draw();
  });
  if (!gameOver) requestAnimationFrame(updateGame);
}

// Manejar el clic en fantasmas y sumar puntos
canvas.addEventListener('click', (e) => {
  if (gameOver) return;

  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  ghosts.forEach((ghost) => {
    if (
      mouseX > ghost.x &&
      mouseX < ghost.x + ghost.size &&
      mouseY > ghost.y &&
      mouseY < ghost.y + ghost.size
    ) {
      ghost.fadeOut();
    }
  });
});

// Temporizador del juego
function startTimer() {
  remainingTime = 30;
  timerElement.textContent = `Tiempo: ${remainingTime}s`;
  timerInterval = setInterval(() => {
    remainingTime--;
    timerElement.textContent = `Tiempo: ${remainingTime}s`;

    if (remainingTime <= 0) {
      endGame();
    }
  }, 1000);
}

// Iniciar el juego
function startGame() {
  score = 0;
  gameOver = false;
  scoreElement.textContent = `Puntuación: ${score}`;
  timerElement.textContent = `Tiempo: ${remainingTime}s`;

  createGhosts();
  updateGame();
  startTimer();
}

// Terminar el juego y mostrar mensaje de fin
function endGame() {
  gameOver = true;
  clearInterval(timerInterval);
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Tiempo terminado`, canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
}

// Reiniciar el juego
function resetGame() {
  clearInterval(timerInterval);
  endGame();
  setTimeout(() => startGame(), 500);
}

// Asignar eventos a los botones
startButton.addEventListener('click', () => {
  if (gameOver) startGame();
});

restartButton.addEventListener('click', resetGame);
// Modificar la función startGame para reproducir sonido al iniciar
function startGame() {
    score = 0;
    gameOver = false;
    scoreElement.textContent = `Puntuación: ${score}`;
    timerElement.textContent = `Tiempo: ${remainingTime}s`;
  
    // Reproducir el sonido de inicio
    startSound.play();
  
    createGhosts();
    updateGame();
    startTimer();
  }
  
  // Modificar la función endGame para reproducir sonido al finalizar
  function endGame() {
    gameOver = true;
    clearInterval(timerInterval);
  
    // Reproducir el sonido de fin
    endSound.play();
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Tiempo terminado`, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(`Puntuación final: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
  }
  
  // Modificar el evento de clic en los fantasmas para reproducir el sonido al hacer clic
  canvas.addEventListener('click', (e) => {
    if (gameOver) return;
  
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;
  
    ghosts.forEach((ghost) => {
      if (
        mouseX > ghost.x &&
        mouseX < ghost.x + ghost.size &&
        mouseY > ghost.y &&
        mouseY < ghost.y + ghost.size
      ) {
        ghost.fadeOut();
        // Reproducir el sonido de clic
        clickSound.play();
      }
    });
  });
