const audioToggleDiv = document.querySelector('#audio-toggle-switch'),
      audioToggle = audioToggleDiv.querySelector('i'),
      audio = document.getElementById("backgroundAudio");

window.onload = (e) => {
    e.preventDefault();
    audio.play();
};

audioToggleDiv.addEventListener('click', () => {
    if (audioToggle.classList.contains('fa-volume-high')) {
        audioToggle.classList.remove('fa-volume-high');
        audioToggle.classList.add('fa-volume-xmark');
        audio.pause();
    } else {
        audioToggle.classList.remove('fa-volume-xmark');
        audioToggle.classList.add('fa-volume-high');
        audio.play();
    }
})