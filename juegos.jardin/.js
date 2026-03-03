const animals = [
  { name: "León", img: "images/leon3.webp", sound: "sounds/leon.mp3" },
  { name: "Vaca", img: "images/vaca.jpg", sound: "sounds/vaca.mp3" },
  { name: "Perro", img: "images/perro.jpg", sound: "sounds/perro.mp3" },
  { name: "Elefante", img: "images/elefante2.jpg", sound: "sounds/elefante.mp3" },
  { name: "Gallina", img: "images/gallina.png", sound: "sounds/gallina.mp3" },
  { name: "Oveja", img: "images/oveja.jpeg", sound: "sounds/oveja.mp3" }
];

let animalCorrecto = null;
let puntosSesion = 0;
const puntosPorAcierto = 6;

const mensaje = document.getElementById("message");
const contenedorOpciones = document.getElementById("animalOptions");
const puntosTexto = document.getElementById("points");
const botonSonido = document.getElementById("playSound");

function limpiarElemento(elemento) {
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}

function loadRound() {
  mensaje.textContent = "";

  animalCorrecto = animals[Math.floor(Math.random() * animals.length)];
  const animalesMezclados = [...animals].sort(() => Math.random() - 0.5);

  limpiarElemento(contenedorOpciones);

  animalesMezclados.forEach(animal => {
    // contenedor de la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("col-4", "animal-card");

    // imagen
    const imagen = document.createElement("img");
    imagen.src = animal.img;
    imagen.alt = animal.name;
    imagen.addEventListener("click", () => {
      checkAnswer(animal.name);
    });

    // nombre
    const texto = document.createElement("p");
    const negrita = document.createElement("b");
    negrita.textContent = animal.name;
    texto.appendChild(negrita);

    // armar tarjeta
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(texto);

    // agregar al contenedor principal
    contenedorOpciones.appendChild(tarjeta);
  });
}

function checkAnswer(seleccionado) {
  if (seleccionado === animalCorrecto.name) {
    mensaje.textContent = "😊 ¡Muy bien!";
    try { new Audio("sounds/correct.mp3").play().catch(() => {}); } catch {}

    puntosSesion += puntosPorAcierto;
    puntosTexto.textContent = puntosSesion;

    setTimeout(loadRound, 800);
  } else {
    mensaje.textContent = "😅 Ups... probá otra vez.";
    try { new Audio("sounds/incorrect.mp3").play().catch(() => {}); } catch {}
  }
}

botonSonido.addEventListener("click", () => {
  if (animalCorrecto) {
    new Audio(animalCorrecto.sound).play();
  }
});

document.getElementById('exitBtn').addEventListener('click', async () => {
  const nombre = localStorage.getItem('usuario');

  if (nombre && puntosSesion > 0) {
    try {
      const resp = await fetch(
        'https://juegosinfantiles.tecnica4berazategui.edu.ar/essencial/excepcional/sumar_puntos.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            nombre: nombre,
            puntos: puntosSesion
          })
        }
      );

      const texto = await resp.text();
      try {
        const data = JSON.parse(texto);
        if (data && data.puntos != null) {
          localStorage.setItem('puntos', data.puntos);
        }
      } catch {
        console.warn('Respuesta no JSON:', texto);
      }
    } catch (error) {
      console.error('Error al enviar puntos:', error);
    }
  }

  window.location.href =
    'https://juegosinfantiles.tecnica4berazategui.edu.ar/essencial/principal.html';
});

loadRound();
