const wrapper = document.getElementById("wrapper");
const question = document.getElementById("question");
const gif = document.getElementById("gif");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

let clickCount = 0; // Initialize a counter

yesBtn.addEventListener("click", () => {
  clickCount++; // Increase count by 1 each click

  if (clickCount === 1) {
    // First click: Show the love
    question.innerHTML = "Yaayyy me love youuu!";
    gif.src = "https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif";
  } else if (clickCount === 2) {
    // Second click: Go back to intro
    window.location.href = "intro.html";
  }
});

noBtn.addEventListener("mouseover", () => {
  const noBtnRect = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - noBtnRect.width;
  const maxY = window.innerHeight - noBtnRect.height;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  noBtn.style.left = randomX + "px";
  noBtn.style.top = randomY + "px";
});