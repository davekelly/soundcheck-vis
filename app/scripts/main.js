//Audio stuff---------------------------------------------
var contextClass = (window.AudioContext || window.webkitAudioContext);
//for sound to be passed into
var audioBuffer;
//for analyser node
var analyser;
//set empty array hald of fft size or equal to frequencybincount (you could put frequency bin count here if created)
var frequencyData = new Uint8Array(1024);


if (contextClass) {
  // Web Audio API is available.
  var audioContext = new contextClass();
  console.warn('yes!');
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Oh no! It appears your browser does not support the Web Audio API, please upgrade or use a different browser");
}

//load audio file from html tag
var audioElement = document.getElementById('soundFile');
//creating source node
var source = audioContext.createMediaElementSource(audioElement);

function createAnalyser() {
  //create analyser node
  analyser = audioContext.createAnalyser();
  //set size of how many bits we analyse on
  analyser.fftSize = 2048;
}
function connectAnalyser(source) {
  //connect to source
  source.connect(analyser);
  //pipe to speakers
  analyser.connect(audioContext.destination);
}

function playSound() {
  //passing in file
  //source.buffer = audioBuffer;
  createAnalyser();
  //creating source node
  connectAnalyser(source);

  //start playing
  audioElement.play();
}
function audioIsPlaying(audioElement) {
  console.log(audioElement.paused);
  return audioElement.paused;
}
function playButton(){
  if (audioIsPlaying(audioElement)) {
    playSound();
    update();
  } else {
    audioElement.pause();
  }
}
//play sound
document.getElementById('play-but').onclick = function(){
  playButton();
}

function update() {
  requestAnimationFrame(update);
  //constantly getting feedback from data
  analyser.getByteFrequencyData(frequencyData);

// Animation stuff--------------------------------
var lights = document.getElementsByTagName('i');
var totalLights = lights.length;

for (var i=0; i<totalLights; i++) {
  //set light colours
  var lightColour = i*10;
  lights[i].style.backgroundColor = 'hsla('+lightColour+',  80%, 50%, 0.8)';
  lights[i].style.borderColor = 'hsla('+lightColour+',  80%, 50%, 1)';
  //flash on frequency
  var freqDataKey = i*8;
  if (frequencyData[freqDataKey] > 160){
    //start animation on element
    lights[i].style.opacity = "1";
  } else {
    lights[i].style.opacity = "0.2";
  }
}
};