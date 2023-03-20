let mediaRecorder;
let recordedBlobs;

const boxGroup = document.querySelector('#boxGroup');
const boxGrabacion = document.querySelector('#boxGrabacion');
const bolita = document.querySelector('.bolita');
const temporizador = document.querySelector('.temporizador');
const video = document.querySelector('#videoElement');
const buttonGrabar = document.querySelector('button#grabar');
const buttonPlay = document.querySelector('#play');
const buttonRePlay = document.querySelector('#rePlay');
const timeGroup = document.querySelector('.timeGroup');

const pregunta1 = document.querySelector('#pregunta1');
const pregunta2 = document.querySelector('#pregunta2');
const pregunta3 = document.querySelector('#pregunta3');
const pregunta4 = document.querySelector('#pregunta4');
const pantallaFinal = document.querySelector('#porFinTerminado');
const header = document.querySelector('#header');

const codec = 'video/mp4;codecs=h264,aac'
const videoGrabado = document.querySelector('#videoGrabado');

let startTime, endTime, disminuirTiempo;

buttonRePlay.addEventListener('click', () => {
  videoGrabado.src = null;
  videoGrabado.srcObject = null;
  buttonRePlay.disabled = true;
  buttonPlay.disabled = true;
  buttonGrabar.disabled = false;
  videoGrabado.style.display = 'none';
  video.style.display = 'block';
})

function actualizarTiempo() {
  const tiempoTranscurrido = Math.floor(Date.now() / 1000) - startTime;
  const segundosRestantes = Math.max(endTime - tiempoTranscurrido, 0);
  const minutos = Math.floor(segundosRestantes / 60).toString().padStart(2, "0");
  const segundos = (segundosRestantes % 60).toString().padStart(2, "0");
  temporizador.innerHTML = `${minutos}:${segundos}`;

  // Hacer que la bolita palpite mas rapido si queda menos de 10 segundos
  if (segundosRestantes <= 10) {
    bolita.style.animation = "pulsate 0.5s ease-out infinite";
  } else {
    bolita.style.animation = "";
  }

  // Finalizar la grabación si se llega al límite de tiempo
  if (segundosRestantes === 0) {
    clearInterval(disminuirTiempo);
    stopRecording();
  }
}
// Establecer límite de 2 minutos
video.addEventListener("loadedmetadata", function () {
  endTime = Math.min(Math.floor(video.duration), 120);
});

buttonGrabar.addEventListener('click', () => {
  if (buttonGrabar.textContent === 'Grabar') {
    startRecording();
    startTime = Math.floor(Date.now() / 1000);
    disminuirTiempo = setInterval(actualizarTiempo, 1000);
    actualizarTiempo();
    timeGroup.style.display = 'block';
  } else {
    stopRecording();
    // buttonGrabar.textContent = 'Grabar';
    // buttonPlay.disabled = false ;
    // video.style.display = 'none';
    // videoGrabado.style.display = 'block';
    // buttonGrabar.disabled = true;
    // timeGroup.style.display = 'none';
  }
})

buttonPlay.addEventListener('click', () => {
  const mimeType = codec.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, { type: mimeType });
  videoGrabado.src = null;
  videoGrabado.srcObject = null;
  videoGrabado.src = window.URL.createObjectURL(superBuffer);
  videoGrabado.controls = true;
  videoGrabado.play();
})

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  const options = { codec };

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  buttonGrabar.textContent = 'Stop';
  buttonPlay.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  buttonGrabar.textContent = 'Grabar';
  buttonPlay.disabled = false;
  video.style.display = 'none';
  videoGrabado.style.display = 'block';
  buttonGrabar.disabled = true;
  timeGroup.style.display = 'none';
  buttonRePlay.disabled = false;
}

function handleSuccess(stream) {
  // buttonPlay
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;

  video.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error: ', e);
    errorMsgElement.innerHTML = 'Permisos denegados para acceder a camara y microfono.';
  }
}

document.querySelector('#primerVideo').addEventListener('click', async () => {
  boxGroup.style.display = 'none';
  boxGrabacion.style.display = 'block';
  const constraints = {
    audio: {

    },
    video: {
      width: 863, height: 612,
    }
  };
  console.log('Usando media constraints: ', constraints);
  await init(constraints);
})
//asdasdasd