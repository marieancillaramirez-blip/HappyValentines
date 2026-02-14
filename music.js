// ── Song Data ──────────────────────────────────────
const songs = [
  {
    id: 1,
    title: "Colors",
    artist: "Halsey",
    src: "Colors.mp3",
    lyricSnippet: '"Everything is blue His pills, his hands, his jeans And now Im covered in the colors Pulled apart at the seams And its blue And its blue Everything is grey His hair, his smoke, his dreams And now hes so devoid of color He dont know what it means And hes blue And hes blue"',
    loveNote: "i placed this song coz you really like this song reently and i also like it coz of the edits that came out of this audio.",
    duration: "0:43",
    gradient: "linear-gradient(135deg, rgba(136,19,55,.4), rgba(13,13,13,.8))"
  },
  {
    id: 2,
    title: "Pillow Talk",
    artist: "Zayne Malik",
    src: "Pillowtalk.mp3",
    lyricSnippet: '"I love to hold you close, tonight and always I love to wake up next to you So we\'ll piss off the neighbors In the place that feels the tears The place to lose your fears Yeah, reckless behavior A place that is so pure, so dirty and raw In the bed all day, bed all day, bed all day"',
    loveNote: "this song reallllyy reminds of you hehe and the things we'd do together- wholsesomely yes mwa",
    duration: "0:30",
    gradient: "linear-gradient(135deg, rgba(157,23,77,.4), rgba(13,13,13,.8))"
  },
  {
    id: 3,
    title: "I wanna be yours",
    artist: "Artic Monkeys",
    src: "Iwanna be yours.mp3",
    lyricSnippet: '"At least as deep as the Pacific Ocean Now I wanna be yours Secrets I have held in my heart Are harder to hide than I thought Maybe I just wanna be yours I wanna be yours, I wanna be yours"',
    loveNote: "this song was the song that keeps repeating in my head before we dated, my urge to post this song on my notes before was so strong XD but i wasnt so sure you liked mme to so i didnt XD",
    duration: "0:26",
    gradient: "linear-gradient(135deg, rgba(153,27,27,.4), rgba(13,13,13,.8))"
  },
  {
    id: 4,
    title: "Terrified",
    artist: "Katherine McPhee",
    src: "Terrified.mp3",
    lyricSnippet: '"You said it again, my hearts in motion Every word feels like a shooting star Im at the edge of my emotions Watching the shadows burning in the dark And Im in love"',
    loveNote: "when you recommended me this song i was truly terrified realizing that i feel abolutley deep and decided to trust you and my feelings that all will work out.",
    duration: "0:26",
    gradient: "linear-gradient(135deg, rgba(120,53,15,.4), rgba(13,13,13,.8))"
  },
  {
    id: 5,
    title: "Valentine",
    artist: "Laufey",
    src: "Valentine.mp3",
    lyricSnippet: '"Cause I think Ive fallen In love this time I blinked and suddenly, I had a valentine (Valentine)"',
    loveNote: "lastly,this song is dedicated to our first valentine together! the first of may!buon san valentino mi amore! happy valentines to us baby! ",
    duration: "0:43",
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
const mainAudio = document.getElementById("mainAudio");

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

  // Change source only if it's different
  // We use .getAttribute to avoid full URL comparison issues
  if (mainAudio.getAttribute('src') !== song.src) {
    mainAudio.src = song.src;
    progress = 0; // Reset progress for new song
  }

  // Update UI State
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
    mainAudio.play(); // Starts the MP3
    startProgress();  // Starts the progress bar
    showReveals();    // Shows the lyrics/note
  } else {
    mainAudio.pause(); // Pauses the MP3
    stopProgress();
    revealArea.style.display = "none";
  }
  updateDisplay();
}

mainAudio.addEventListener("timeupdate", () => {
  if (mainAudio.duration) {
    progress = (mainAudio.currentTime / mainAudio.duration) * 100;
    updateProgress();
  }
});

// Auto-play next song when current one ends
mainAudio.addEventListener("ended", () => {
  goNext(true);
});

function selectSong(index) {
  currentIndex = index;
  isPlaying = true;
  updateDisplay();
  mainAudio.play();
  showReveals();
}

function goNext(auto) {
  if (currentIndex < songs.length - 1) {
    currentIndex++;
    isPlaying = true; // Ensure state is set to playing
    updateDisplay();  // Update the src and UI
    mainAudio.play(); // Start the actual music
    showReveals();
  } else {
    // If it's the last song, stop everything
    isPlaying = false;
    mainAudio.pause();
    mainAudio.currentTime = 0;
    updateDisplay();
    revealArea.style.display = "none";
  }
}

function goPrev() {
  // If song is more than 3 seconds in, just restart the current song
  if (mainAudio.currentTime > 3) {
    mainAudio.currentTime = 0;
    mainAudio.play();
    return;
  }

  // Otherwise, go to the previous song
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = songs.length - 1; // Loop to the end if at the start
  }

  isPlaying = true;
  updateDisplay();
  mainAudio.play();
  showReveals();
}

// ── Click on progress bar to seek ─────────────────
progressBar.addEventListener("click", function(e) {
  var rect = progressBar.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  mainAudio.currentTime = pct * mainAudio.duration; // This moves the actual music
});

// ── Events ────────────────────────────────────────
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", function() { goNext(false); });
prevBtn.addEventListener("click", goPrev);

// ── Init ──────────────────────────────────────────
updateDisplay();
