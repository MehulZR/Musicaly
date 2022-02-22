const button = document.querySelector(".button");
const input = document.querySelector(".input");
const dragArea = document.querySelector(".container");
const audio = document.querySelector(".audio");
const currentTrack = document.querySelector(".current-track");
const playingNow = document.querySelector(".playing-now");
const playBtn = document.querySelector(".play-btn");
const nextBtn = document.querySelector(".next-btn");
const previousBtn = document.querySelector(".previous-btn");
const volumeInput = document.querySelector(".volume-input");
const volBtn = document.querySelector(".volume-slider");
const seeked = document.querySelector(".seeked");
const seeker = document.querySelector(".seeker");
const listBtn = document.querySelector(".list-btn");
const sidebar = document.querySelector(".sidebar");
const hero = document.querySelector(".hero");
const songsContainer = document.querySelector(".songs-container");
const trackSvg = document.querySelector(".track-svg");

let songsList = [];
let currentSongIndex = 0;
let previousSongIndex = 0;
let currentSongTime = 0;
let sidebarStatus = false;

listBtn.addEventListener("click", sidebarManager);
dragArea.addEventListener("dragover", dragOver);
dragArea.addEventListener("dragleave", dragLeave);
dragArea.addEventListener("drop", dragDrop);
button.addEventListener("click", () => input.click());
input.addEventListener("change", (e) => {
  fileList = e.target.files;
  handleFiles(fileList);
});
songsContainer.addEventListener("click", (e) => removeSong(e));
songsContainer.addEventListener("click", (e) => selectSong(e));
playBtn.addEventListener("click", playSong);
nextBtn.addEventListener("click", nextSong);
previousBtn.addEventListener("click", previousSong);
seeker.addEventListener("click", (e) => {
  currentSongTime = Math.round(
    (e.offsetX / seeker.offsetWidth) * audio.duration
  );
  audio.currentTime = currentSongTime;
});
volumeInput.oninput = (e) => {
  audio.volume = e.target.value / 100;
};

function sidebarManager() {
  if (sidebarStatus === false) {
    sidebar.style.left = 0;
    hero.style.marginLeft = "200px";
    sidebarStatus = true;
  } else {
    sidebar.style.left = "-200px";
    hero.style.marginLeft = 0;
    sidebarStatus = false;
  }
}
function dragOver(e) {
  e.preventDefault();
  this.classList.add("active");
}
function dragLeave() {
  this.classList.remove("active");
}
function dragDrop(e) {
  e.preventDefault();
  fileList = e.dataTransfer.files;
  handleFiles(fileList);
}
function handleFiles(fileList, callback) {
  if (fileList) {
    Object.keys(fileList).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[file]);
      reader.onload = () => {
        songsList.push({
          name: fileList[file].name,
          file: reader.result,
        });
        showSongsList();
      };
    });
  }
}

audio.ontimeupdate = () => {
  seeked.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  if (audio.paused) {
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
};
function nextSong() {
  if (currentSongIndex < songsList.length - 1) {
    previousSongIndex = currentSongIndex;
    currentSongIndex++;
    audio.pause();
    playSong();
  }
}
function previousSong() {
  if (currentSongIndex > 0) {
    previousSongIndex = currentSongIndex;
    currentSongIndex--;
    audio.pause();
    playSong();
  }
}
function playSong() {
  if (audio.paused) {
    if (songsList.length) {
      audio.src = songsList[currentSongIndex].file;
      playingNow.style.display = "block";
      currentTrack.textContent = songsList[currentSongIndex].name;
      if (currentSongIndex === previousSongIndex)
        audio.currentTime = currentSongTime;
      audio.play();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  } else {
    previousSongIndex = currentSongIndex;
    currentSongTime = audio.currentTime;
    audio.pause();
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
}
audio.onended = () => {
  currentSongTime = 0;
};
function showSongsList() {
  if (songsList.length > 0) {
    let html = "";
    songsList.forEach((song) => {
      html += `<li> <div class="song">
            <span>${song.name}</span><i class="fa-solid fa-xmark delete-btn"></i>
          </div></li>`;
    });
    songsContainer.innerHTML = html;
  } else {
    songsContainer.innerHTML = "<li>No Songs added</li>";
  }
}
showSongsList();
function removeSong(e) {
  if (e.target.classList.contains("delete-btn")) {
    let songName = e.target.parentElement.children[0].textContent;
    if (songName !== songsList[currentSongIndex].name) {
      songsList = songsList.filter((song) => {
        return song.name !== songName;
      });
      showSongsList();
    }
  }
}
function selectSong(e) {
  songsList.forEach((song, index) => {
    if (song.name === e.target.innerText) {
      currentSongIndex = index;
      currentSongTime = 0;
      audio.pause();
      playSong();
    }
  });
}
audio.onpause = () => {
  console.log("Paused");
  trackSvg.style.display = "none";
  dragArea.style.display = "flex";
};
audio.onplay = () => {
  console.log("Playing");
  dragArea.style.display = "none";
  trackSvg.style.display = "block";
};
