const boxGroup = document.querySelector('#boxGroup');
const boxGrabacion = document.querySelector('#boxGrabacion');
const bolita = document.querySelector('.bolita');
const temporizador = document.querySelector('.temporizador');
const video = document.querySelector('#videoElement');
const buttonPlay = document.querySelector('#play');
const buttonStop = document.querySelector('#stop');
const buttonRePlay = document.querySelector('#rePlay');
const timeGroup = document.querySelector('.timeGroup');

const pregunta1 = document.querySelector('#pregunta1');
const pregunta2 = document.querySelector('#pregunta2');
const pregunta3 = document.querySelector('#pregunta3');
const pregunta4 = document.querySelector('#pregunta4');
const pantallaFinal = document.querySelector('#porFinTerminado');
const header = document.querySelector('#header');

// ---------------------

buttonPlay.addEventListener("click", function (ev) {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    .then(record)
    .catch(err => console.log(err));
})

let chunks = [];

function record(stream) {
  video.srcObject = stream;

  let mediaRecorder = new MediaRecorder(stream,{
    mimeType: 'video/webm;codecs=h264'
  });

  mediaRecorder.start();

  mediaRecorder.ondataavailable = function(e) {
    console.log(e.data);
    chunks.push(e.data);
  }

  mediaRecorder.onstop = function() {
    alert('Finalizo la grabacion')
    // binary larg object
    let blob = new Blob(chunks, {type:"video/webm"});

    chunks = [];

    download(blob);
  }
  setTimeout(() => mediaRecorder.stop(),5000)

  // mediaRecorder.stop();

  function download(blob) {
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "video_recorded.webm")
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function apagarCamara() {
    mediaRecorder.stop();
  }
}
// ---------------------


//Botones
function siguiente1() {
  pregunta1.style.display = 'none';
  pregunta2.style.display = 'block';
}
function siguiente2() {
  pregunta2.style.display = 'none';
  pregunta3.style.display = 'block';
}
function siguiente3() {
  pregunta3.style.display = 'none';
  pregunta4.style.display = 'block';
}

function atras2() {
  pregunta2.style.display = 'none';
  pregunta1.style.display = 'block';
}
function atras3() {
  pregunta3.style.display = 'none';
  pregunta2.style.display = 'block';
}
function atras4() {
  pregunta4.style.display = 'none';
  pregunta3.style.display = 'block';
}

function terminar() {
  ocultarBoxGrabacion();
  pantallaFinal.classList.remove('noVisible');
  pantallaFinal.classList.add('porFinTerminado');
  header.classList.add('noVisible');
  detenerCamara;
}


function ocultarBoxGroup() {
  boxGroup.style.display = 'none';
}
function mostrarBoxGroup() {
  boxGroup.style.display = 'block';
}
function ocultarBoxGrabacion() {
  boxGrabacion.style.display = 'none';
}
function mostrarBoxGrabacion() {
  boxGrabacion.style.display = 'block';
}
function clickPrimerVideo() {
  // mostrarCamara();
  // startRecording();
  ocultarBoxGroup();
  mostrarBoxGrabacion();
  buttonPlay.disabled = false;
}
function play() {
  startRecording();
  actualizarTiempo();
  startTime = Math.floor(Date.now() / 1000);
  disminuirTiempo = setInterval(actualizarTiempo, 1000);
  buttonPlay.disabled = true;
  buttonStop.disabled = false;
  timeGroup.style.display = 'block';
}
function stop() {
  stopRecording();
  endTime = Math.min(Math.floor(video.duration), 0);
  buttonRePlay.disabled = false;
  buttonStop.disabled = true;
  timeGroup.style.display = 'none';
}
function rePlay() {
  buttonRePlay.disabled = true;
  buttonPlay.disabled = false;
}



// -----------------------
// let startTime, endTime, disminuirTiempo;
// let mediaRecorder;
// let chunks = [];

// function actualizarTiempo() {
//   const tiempoTranscurrido = Math.floor(Date.now() / 1000) - startTime;
//   const segundosRestantes = Math.max(endTime - tiempoTranscurrido, 0);
//   const minutos = Math.floor(segundosRestantes / 60).toString().padStart(2, "0");
//   const segundos = (segundosRestantes % 60).toString().padStart(2, "0");
//   temporizador.innerHTML = `${minutos}:${segundos}`;

//   // Hacer que la bolita palpite mas rapido si queda menos de 10 segundos
//   if (segundosRestantes <= 10) {
//     bolita.style.animation = "pulsate 0.5s ease-out infinite";
//   } else {
//     bolita.style.animation = "";
//   }

//   // Finalizar la grabación si se llega al límite de tiempo
//   if (segundosRestantes === 0) {
//     clearInterval(disminuirTiempo);
//     stopRecording();
//   }
// }

// video.addEventListener("loadedmetadata", function () {
//   // Establecer límite de 2 minutos
//   endTime = Math.min(Math.floor(video.duration), 120);
// });

// function startRecording() {
//   navigator.mediaDevices.getUserMedia({ audio: true, video: true })
//     .then(function (stream) {
//       // Inicializar MediaRecorder
//       mediaRecorder = new MediaRecorder(stream);
//       mediaRecorder.ondataavailable = function (event) {
//         chunks.push(event.data);
//       };
//       mediaRecorder.onstop = function () {
//         // Crear URL para la última imagen
//         const blob = new Blob(chunks, { type: chunks[0].type });
//         const url = URL.createObjectURL(blob);
//         const img = document.createElement("img");
//         img.src = url;
//         document.getElementById("primerVideo").innerHTML = "";
//         document.getElementById("primerVideo").appendChild(img);
//         timeGroup.style.display = 'none';
//       };
//       mediaRecorder.start();
//     });
// }

// // Detener la grabación
// function stopRecording() {
//   if (mediaRecorder && mediaRecorder.state !== "inactive") {
//     mediaRecorder.stop();
//     timeGroup.style.display = 'none';
//   }
// }

// //Muestra la camara al iniciar la pagina
// function mostrarCamara() {
//   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//     .then(
//       (stream) => {
//         video.srcObject = stream;
//         console.log(stream);
//       }
//     )
//     .catch((error) => {
//       console.log(error);
//     })
// }

// function detenerCamara() {
//   const tracks = video.srcObject.getTracks();
//   tracks.forEach(function (track) {
//     track.stop();
//   });
//   video.srcObject = null;
// }
