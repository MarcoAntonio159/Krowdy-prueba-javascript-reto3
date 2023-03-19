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

buttonGrabar.addEventListener('click', () => {
  if (buttonGrabar.textContent === 'Grabar') {
    startRecording();
  } else {
    stopRecording();
    buttonGrabar.textContent = 'Grabar';
    buttonPlay.disabled = false ;
    video.style.display = 'none';
    videoGrabado.style.display = 'block';
    buttonGrabar.disabled = true;
  }
})

buttonPlay.addEventListener('click', () => {
  const mimeType = codec.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
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
  const options = {codec};

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
  mediaRecorder.stop();
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
    handleSuccess(stream) ;
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