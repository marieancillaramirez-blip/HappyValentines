// ── Song Data ──────────────────────────────────────
const songs = [
  {
    id: 1,
    title: "Colors",
    artist: "Halsey",
    lyricSnippet: '"I found a love, for me... darling just dive right in and follow my lead. Well, I found a girl, beautiful and sweet. Oh, I never knew you were the someone waiting for me."',
    loveNote: "This song is literally us. The first time I heard it, I thought of you dancing with me in the kitchen at 2am. You make every ordinary moment feel like a movie scene.",
    duration: "4:23",
    gradient: "linear-gradient(135deg, rgba(136,19,55,.4), rgba(13,13,13,.8))"
  },
  {
    id: 2,
    title: "Pillow Talk",
    artist: "Zayne Malik",
    lyricSnippet: '"Cause all of me loves all of you. Love your curves and all your edges, all your perfect imperfections. Give your all to me, I\'ll give my all to you."',
    loveNote: "I love every single part of you, even the parts you think are flawed. You are my entire world and I wouldn't change a single thing about you, baby.",
    duration: "4:29",
    gradient: "linear-gradient(135deg, rgba(157,23,77,.4), rgba(13,13,13,.8))"
  },
  {
    id: 3,
    title: "I wanna be yours",
    artist: "Artic Monkeys",
    lyricSnippet: '"There goes my heart beating, cause you are the reason. I\'m losing my sleep, please come back now. And there goes my mind racing, and you are the reason that I\'m still breathing, I\'m hopeless now."',
    loveNote: "Remember that night we stayed up until sunrise just talking? You are the reason I believe in forever. Every heartbeat is for you.",
    duration: "3:24",
    gradient: "linear-gradient(135deg, rgba(153,27,27,.4), rgba(13,13,13,.8))"
  },
  {
    id: 4,
    title: "Eye Closed",
    artist: "Zayne Malike ft. Jisoo",
    lyricSnippet: '"So honey now, take me into your loving arms. Kiss me under the light of a thousand stars. Place your head on my beating heart. I\'m thinking out loud, maybe we found love right where we are."',
    loveNote: "When we're 70 and gray, I still want to be dancing with you. This song reminds me that what we have is timeless. You're my forever person.",
    duration: "4:41",
    gradient: "linear-gradient(135deg, rgba(120,53,15,.4), rgba(13,13,13,.8))"
  },
  {
    id: 5,
    title: "Valentine",
    artist: "Laufey",
    lyricSnippet: '"I have died every day waiting for you. Darling, don\'t be afraid, I have loved you for a thousand years. I\'ll love you for a thousand more."',
    loveNote: "It feels like my heart knew you before we ever met. Every moment with you feels like it was meant to be. I'd choose you in every lifetime. Happy Valentine's Day, my love.",
    duration: "4:45",
    gradient: "linear-gradient(135deg, rgba(112,26,117,.4), rgba(13,13,13,.8))"
  }
];

// ── State ──────────────────────────────────────────
let currentIndex = 0;
let isPlaying = false;
let progress = 0;
let progressInterval = null;

// ── DOM ────────────────────────────────────────────
const albumArt     = document.getElementById("albumArt");
const artGradient  = document.getElementById("artGradient");
const vinylDisc    = document.getElementById("vinylDisc");
const songTitle    = document.getElementById("songTitle");
const songArtist   = document.getElementById("songArtist");
const progressFill = document.getElementById("progressFill");
const timeCurrent  = document.getElementById("timeCurrent");
const timeDuration = document.getElementById("timeDuration");
const playBtn      = document.getElementById("playBtn");
const playIcon     = document.getElementById("playIcon");
const pauseIcon    = document.getElementById("pauseIcon");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const revealArea   = document.getElementById("revealArea");
const progressBar  = document.getElementById("progressBar");
const listContainer = document.getElementById("songListContainer");

// ── Helpers ────────────────────────────────────────
function parseDuration(str) {
  const parts = str.split(":");
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return m + ":" + String(s).padStart(2, "0");
}

function heartSVG(size) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
}

function equalizerHTML() {
  var delays = [0, 0.2, 0.4, 0.1];
  var html = '<div class="eq" aria-hidden="true">';
  delays.forEach(function(d) {
    html += '<span style="animation-delay:' + d + 's"></span>';
  });
  html += '</div>';
  return html;
}

// ── Render Song List ──────────────────────────────
function renderList() {
  var html = "";
  songs.forEach(function(song, i) {
    var active = i === currentIndex;
    html += '<button class="song-row' + (active ? " active" : "") + '" data-index="' + i + '">';
    html += '<span class="row-num">';
    if (active && isPlaying) {
      html += equalizerHTML();
    } else {
      html += (i + 1);
    }
    html += '</span>';
    html += '<div class="row-info">';
    html += '<div class="song-title">' + song.title + '</div>';
    html += '<div class="song-artist">' + song.artist + '</div>';
    html += '</div>';
    html += '<span class="row-heart">' + heartSVG(14) + '</span>';
    html += '<span class="row-dur">' + song.duration + '</span>';
    html += '</button>';
  });
  listContainer.innerHTML = html;

  listContainer.querySelectorAll(".song-row").forEach(function(row) {
    row.addEventListener("click", function() {
      selectSong(parseInt(row.dataset.index));
    });
  });
}

// ── Update Display ────────────────────────────────
function updateDisplay() {
  var song = songs[currentIndex];
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  timeDuration.textContent = song.duration;
  artGradient.style.background = song.gradient;

  if (isPlaying) {
    albumArt.classList.add("playing");
    vinylDisc.classList.add("spinning");
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    playBtn.setAttribute("aria-label", "Pause");
  } else {
    albumArt.classList.remove("playing");
    vinylDisc.classList.remove("spinning");
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
    playBtn.setAttribute("aria-label", "Play");
  }

  updateProgress();
  renderList();
}

function updateProgress() {
  var song = songs[currentIndex];
  var totalSec = parseDuration(song.duration);
  var currentSec = (progress / 100) * totalSec;
  progressFill.style.width = progress + "%";
  timeCurrent.textContent = formatTime(currentSec);
}

// ── Reveal Lyrics & Note ──────────────────────────
function showReveals() {
  var song = songs[currentIndex];
  revealArea.style.display = "none";
  revealArea.innerHTML = "";

  if (!isPlaying) return;

  setTimeout(function() {
    revealArea.style.display = "flex";
    revealArea.innerHTML =
      '<div class="reveal-card lyrics-card"><p>' + song.lyricSnippet + '</p></div>';
  }, 400);

  setTimeout(function() {
    revealArea.innerHTML +=
      '<div class="reveal-card note-card" style="animation-delay:.15s">' +
        '<div class="note-label">' + heartSVG(14) + '<span>Why this song reminds me of you</span></div>' +
        '<p>' + song.loveNote + '</p>' +
      '</div>';
  }, 1200);
}

// ── Progress Timer ────────────────────────────────
function startProgress() {
  stopProgress();
  progressInterval = setInterval(function() {
    if (progress >= 100) {
      stopProgress();
      goNext(true);
      return;
    }
    progress += 0.25;
    updateProgress();
  }, 100);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

// ── Actions ───────────────────────────────────────
function togglePlay() {
  isPlaying = !isPlaying;
  if (isPlaying) {
    startProgress();
    showReveals();
  } else {
    stopProgress();
    revealArea.style.display = "none";
  }
  updateDisplay();
}

function selectSong(index) {
  currentIndex = index;
  progress = 0;
  isPlaying = true;
  startProgress();
  updateDisplay();
  showReveals();
}

function goNext(auto) {
  if (currentIndex < songs.length - 1) {
    currentIndex++;
    progress = 0;
    isPlaying = true;
    startProgress();
    updateDisplay();
    showReveals();
  } else {
    isPlaying = false;
    progress = 0;
    stopProgress();
    updateDisplay();
    revealArea.style.display = "none";
  }
}

function goPrev() {
  if (progress > 10) {
    progress = 0;
    updateProgress();
    showReveals();
    return;
  }
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  progress = 0;
  isPlaying = true;
  startProgress();
  updateDisplay();
  showReveals();
}

// ── Click on progress bar to seek ─────────────────
progressBar.addEventListener("click", function(e) {
  var rect = progressBar.getBoundingClientRect();
  progress = ((e.clientX - rect.left) / rect.width) * 100;
  updateProgress();
});

// ── Events ────────────────────────────────────────
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", function() { goNext(false); });
prevBtn.addEventListener("click", goPrev);

// ── Init ──────────────────────────────────────────
updateDisplay();
