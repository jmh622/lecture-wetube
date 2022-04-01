const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const volumeRange = document.getElementById('volume');

let volumeValue = video.volume;
volumeRange.value = volumeValue;

video.addEventListener('loadedmetadata', () => {
  totalTime.innerText = Math.floor(video.duration);
});
video.addEventListener('timeupdate', () => {
  currentTime.innerText = Math.floor(video.currentTime);
});
playBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playBtn.innerText = 'Pause';
  } else {
    video.pause();
    playBtn.innerText = 'Play';
  }
});
muteBtn.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = 'Mute';
    volumeRange.value = volumeValue;
  } else {
    video.muted = true;
    muteBtn.innerText = 'Unmute';
    volumeRange.value = 0;
  }
});
volumeRange.addEventListener('input', (evt) => {
  const {
    target: { value },
  } = evt;
  if (Number(value) === 0) {
    video.muted = true;
    muteBtn.innerText = 'Unmute';
  } else {
    video.muted = false;
    muteBtn.innerText = 'Mute';
  }
  volumeValue = value;
  video.volume = value;
});
