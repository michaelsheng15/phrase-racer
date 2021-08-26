const socket = io();
const api = "https://random-word-api.herokuapp.com//word?number=1";

const wordDisplay = document.getElementById("word");
const userInput = document.getElementById("input");
const score = document.getElementById("scoreDisplay");
const startButton = document.getElementById("startGameButton");
const timer = document.getElementById("countdown");

let isPlaying = false;
let countdown = 5;
let scoreVal = 0;

userInput.addEventListener("input", () => {
  const targetWordCharArray = wordDisplay.querySelectorAll("span");
  const userInputCharArray = userInput.value.split("");

  let correct = true;
  //splits array into character spans
  targetWordCharArray.forEach((characterSpan, index) => {
    //stores the single character entered by user in the same array index as the target word
    const character = userInputCharArray[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;

      //if the character in user input is the same as the character in the target word from the same index
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    renderNewQuote();
    scoreVal++;
    score.innerHTML = scoreVal;
  }

});

function getRandomQuote() {
  return fetch(api)
    .then((response) => response.json())
    .then((data) => data[0]);
}

async function renderNewQuote() {
  const word = await getRandomQuote();
  console.log(word);
  wordDisplay.innerHTML = "";
  //splitting the word into
  word.split("").forEach((character) => {
    //creating a span for each character
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character.toLowerCase();

    //Setting the word display by adding all the spans together to reform the word
    wordDisplay.appendChild(characterSpan);
  });
  console.log(wordDisplay);

  //everytime a new word generates, we clear the user textbox
  userInput.value = null;
}

const startCountdownTimer = () => {

  let startCountdown = setInterval(() => {
    if (countdown <= 0) {
      // console.log("countdown finished");
      renderGame();
      clearInterval(startCountdown);
    }

    timer.innerHTML = countdown;
    countdown--;
  }, 1000);
};

userInput.style.visibility = 'hidden'
startButton.addEventListener("click", async () => {
  console.log("pressed");
  startButton.setAttribute("disabled", "disabled");
  startButton.style.visibility = 'hidden'
  startCountdownTimer();
});

const renderGame = () => {
  userInput.style.visibility = 'visible'
  score.style.visibility = 'visibile'
  userInput.focus();
  timer.remove();
  startButton.remove();
  renderNewQuote();
};

socket.on('welcome', (message) => {
  console.log(message);
})