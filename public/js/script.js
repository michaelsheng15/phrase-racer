const socket = io();
const api = "https://random-word-api.herokuapp.com//word?number=1";

const wordDisplay = document.getElementById("word");
const userInput = document.getElementById("input");
const score = document.getElementById("scoreDisplay");
const oppScore = document.getElementById("opponentScoreDisplay");
const startButton = document.getElementById("startGameButton");
const homeButton = document.getElementById('homeButton')
const startTimer = document.getElementById("countdown");

const timerElement = document.getElementById("timer");

let isPlaying = false;
let countdown = 5;
let scoreVal = 0;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

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
    score.innerHTML = "Your Score: " + scoreVal;
    socket.emit("scoreUpdate", scoreVal);
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
  console.log("5 second timer started");
  let startCountdown = setInterval(() => {
    if (countdown <= 0) {
      // console.log("countdown finished");
      renderGame();
      clearInterval(startCountdown);
    }

    startTimer.innerHTML = countdown;
    countdown--;
  }, 1000);
};

userInput.style.visibility = "hidden";

startButton.addEventListener("click", () => {
  socket.emit("startGame", "init");
});


socket.on("init", () => {
  startGame();
});

const startGame = () => {
  console.log("pressed");
  userInput.removeAttribute("disabled", "disabled");
  scoreVal = 0;
  startButton.setAttribute("disabled", "disabled");
  startButton.style.visibility = "hidden";
  homeButton.style.visibility = "hidden"
  startCountdownTimer();
};

const renderGame = () => {
  userInput.style.visibility = "visible";
  score.style.visibility = "visibile";
  startButton.style.visibility = "hidden";
  userInput.focus();
  startTimer.remove();
  renderNewQuote();
  startGameTimer();
};

let startTime;
const startGameTimer = () => {
  timerElement.innerText = 0;
  startTime = new Date();
  let gameCountdown = setInterval(() => {
    timer.innerText = "Time Left: " + getTimerTime();

    if (getTimerTime() <= 0) {
      clearInterval(gameCountdown);
      endGame();
    }
  }, 1000);
};

const getTimerTime = () => {
  return Math.floor(32 - (new Date() - startTime) / 1000);
};

const endGame = () => {
  userInput.setAttribute("disabled", "disabled");
  startButton.removeAttribute("disabled", "disabled");

  startButton.style.visibility = "visible";
  homeButton.style.visibility = "visible"

  wordDisplay.innerHTML = "Your Score: " + scoreVal;
  score.innerHTML = null;
  timer.innerText = null;
};

socket.on("updateOpponentScore", (score) => {
  console.log("Opponents Score: " + score);
  oppScore.innerHTML = "Opponent's Score: " + score;
});

socket.on("welcome", (message) => {
  console.log(message);
});



socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error); //sends users back to home if error
    location.href = "/";
  }
});


//Chat logic
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");

const $messages = document.querySelector("#messages"); //div where messages are rendered
const messageTemplate = document.querySelector("#message-template").innerHTML;

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //disabled send button here since client has just pressed send
  $messageFormButton.setAttribute("disabled", "disabled");

  console.log(e);

  const message = e.target.elements.Message.value;
  socket.emit("sendMessage", message, (error) => {
    //re-enable
    $messageFormButton.removeAttribute("disabled");

    //clear textbox ince sent
    $messageFormInput.value = "";

    //brings cursor back to input box
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered");
  });
});

socket.on("message", (message, username) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: username,
    message: message, //passing the data into template
  });
  $messages.insertAdjacentHTML("beforeend", html);
});