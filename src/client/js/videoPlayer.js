const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('volume');
const timeline = document.getElementById('timeline');
const fullScreenBtn = document.getElementById('fullScreen');
const fullScreenIcon = fullScreenBtn.querySelector('i');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = volumeRange.value;
video.volume = volumeValue;

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);
const hideControls = () => videoControls.classList.remove('showing');

video.addEventListener('loadeddata', () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
});
video.addEventListener('timeupdate', () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
});
playBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playBtnIcon.classList = 'fas fa-pause';
  } else {
    video.pause();
    playBtnIcon.classList = 'fas fa-play';
  }
});
muteBtn.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = 'fas fa-volume-up';
    volumeRange.value = volumeValue;
  } else {
    video.muted = true;
    muteBtnIcon.classList = 'fas fa-volume-mute';
    volumeRange.value = 0;
  }
});
volumeRange.addEventListener('input', (evt) => {
  const {
    target: { value },
  } = evt;
  if (Number(value) === 0) {
    video.muted = true;
    muteBtnIcon.classList = 'fas fa-volume-mute';
  } else {
    video.muted = false;
    muteBtnIcon.classList = 'fas fa-volume-up';
  }
  volumeValue = value;
  video.volume = value;
});
timeline.addEventListener('input', (evt) => {
  const {
    target: { value },
  } = evt;
  video.currentTime = value;
});
fullScreenBtn.addEventListener('click', () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = 'fas fa-expand';
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = 'fas fa-compress';
  }
});
videoContainer.addEventListener('mousemove', () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add('showing');
  controlsMovementTimeout = setTimeout(hideControls, 3000);
});
videoContainer.addEventListener('mouseleave', () => {
  controlsTimeout = setTimeout(hideControls, 3000);
});
