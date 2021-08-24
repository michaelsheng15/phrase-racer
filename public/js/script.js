const api = "https://random-words-api.vercel.app/word";
const wordDisplay = document.getElementById("word");
const userInput = document.getElementById("input");
const score = document.getElementById("scoreDisplay");

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
      renderNewQuote();
      scoreVal++;
      score.innerHTML = scoreVal - 1;
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });
});

function getRandomQuote() {
  return fetch(api)
    .then((response) => response.json())
    .then((data) => data[0].word);
}

async function renderNewQuote() {
  const word = await getRandomQuote();
  wordDisplay.innerHTML = "";
  //splitting the word into
  word.split("").forEach((character) => {
    //creating a span for each character
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character.toLowerCase();

    //Setting the word display by adding all the spans together to reform the word
    wordDisplay.appendChild(characterSpan);
  });

  //everytime a new word generates, we clear the user textbox
  userInput.value = null;
}
