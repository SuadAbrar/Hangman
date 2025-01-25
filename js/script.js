// Game state
const words = [
  "algorithm",
  "interface",
  "debugging",
  "framework",
  "github",
  "javascript",
  "syntax",
  "variable",
];
let choosenWord = "";
let guessedLetter = [];
let wrongGuesses = 0;
const maxWrongGuesses = 6;
let hintChances = 3;

// Dom Elements
const message = document.getElementById("message");
const wordDisplay = document.getElementById("wordDisplay");
const chancesLeft = document.getElementById("chancesLeft");
const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const wrongGuessesDisplay = document.getElementById("wrongGuesses");
const restartButton = document.getElementById("restartGame");
const feedbackOverlay = document.getElementById("feedbackOverlay");
const gameResult = document.getElementById("gameResult");
const hangmanDrawing = document.getElementById("hangmanDrawing");

// Initialize Game
function initializeGame() {
  choosenWord = words[Math.floor(Math.random() * words.length)];
  guessedLetter = [];
  wrongGuesses = 0;
  hintChances = 3;

  updateWordDisplay();
  updateHangmanDrawing();

  wrongGuessesDisplay.textContent = `Wrong Guesses: ${wrongGuesses} / ${maxWrongGuesses}`;
  message.textContent = "Guess a letter";
  guessInput.disabled = false;
  submitGuess.disabled = false;
  restartButton.style.display = "none";

  // For resetting feedback message and animations
  gameResult.textContent = "";
  gameResult.className = "";

  guessInput.value = "";
}

// Display the word with underscore
function updateWordDisplay() {
  const display = choosenWord
    .split("")
    .map((letter) => (guessedLetter.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = display;
}

// Update Hangman Drawing
function updateHangmanDrawing() {
  const imageIndex = Math.min(wrongGuesses, maxWrongGuesses);
  const imagePath = `assets/images/hangman_${imageIndex}.png`;

  hangmanDrawing.style.backgroundImage = `url(${imagePath})`;
}

// Provide Hint
function provideHint() {
  if (hintChances <= 0) {
    message.textContent = "No hints left!";
    return;
  }

  // For finding letters that arenot gueesed yet
  const unguessedLetters = choosenWord
    .split("")
    .filter((letter) => !guessedLetter.includes(letter));
  message.textContent = "All letters are already revealed!";

  // For picking random letter from unguessed letter
  const hintLetter =
    unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];

  guessedLetter.push(hintLetter);
  hintChances--;
  updateWordDisplay();
  guessInput.focus();
  message.textContent = `${hintChances} hint(s) left.`;

  // If game won after hint is reaveled
  if (!wordDisplay.textContent.includes("_")) {
    triggerWinAnimation();
    restartButton.style.display = "inline-block";
  }
}
// New Game
function startNewGame() {
  // Create the overlay and confirmation dialog
  const overlay = document.createElement("div");
  const dialog = document.createElement("div");

  overlay.id = "custom-confirm-overlay";
  dialog.id = "custom-confirm-dialog";

  // Dialog content
  dialog.innerHTML = `
    <p>Are you sure you want to start a new game?</p>
    <div>
      <button id="confirmYes">Yes</button>
      <button id="confirmNo">No</button>
    </div>
  `;

  // Append to the body
  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  // Add event listeners for the buttons
  document.getElementById("confirmYes").addEventListener("click", () => {
    playClickSound();
    initializeGame();
    closeCustomConfirm(overlay, dialog);
  });

  document.getElementById("confirmNo").addEventListener("click", () => {
    playClickSound();
    closeCustomConfirm(overlay, dialog);
  });

  function closeCustomConfirm(overlay, dialog) {
    document.body.removeChild(overlay);
    document.body.removeChild(dialog);
  }
}

// Sound Effects
const clickSound = new Audio("assets/sounds/click.wav");
const winSound = new Audio("assets/sounds/win.wav");
const loseSound = new Audio("assets/sounds/lose.wav");

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playWinSound() {
  clickSound.currentTime = 0;
  winSound.play();
}
function playloseSound() {
  clickSound.currentTime = 0;
  loseSound.play();
}
// To trigger win animation
function triggerWinAnimation() {
  playWinSound();
  gameResult.textContent = "🎉 Congratulations! You won! 🎉";
  gameResult.className = "win-animation";
  feedbackOverlay.style.display = "flex";
  submitGuess.disabled = true;
  guessInput.disabled = true;
  hintButton.disabled = true;
  newGame.disabled = true;
  setTimeout(() => {
    feedbackOverlay.style.display = "none";
  }, 3000); // Hide animation after 3 seconds
}

// To trigger lose animation
function triggerLoseAnimation() {
  playloseSound();
  gameResult.textContent = `☠️ Game Over! The word was "${choosenWord}".`;
  gameResult.className = "lose-animation";
  feedbackOverlay.style.display = "flex";
  submitGuess.disabled = true;
  guessInput.disabled = true;
  hintButton.disabled = true;
  newGame.disabled = true;
  setTimeout(() => {
    feedbackOverlay.style.display = "none";
  }, 3000);
}

// Handle Guess
submitGuess.addEventListener("click", () => {
  playClickSound();
  const guess = guessInput.value.toLowerCase().trim();
  guessInput.value = "";

  if (!guess || guess.length !== 1 || !/[a-z]/.test(guess)) {
    message.textContent = "Please enter a valid letter.";
    return;
  }

  if (guessedLetter.includes(guess)) {
    message.textContent = `You already guessed "${guess}".`;
    return;
  }

  guessedLetter.push(guess);
  if (choosenWord.includes(guess)) {
    message.textContent = `Good guess!`;
  } else {
    wrongGuesses++;
    updateHangmanDrawing();
    message.textContent = `Bad try!`;
  }

  wrongGuessesDisplay.textContent = `Wrong Guesses: ${wrongGuesses} / ${maxWrongGuesses}`;
  updateWordDisplay();

  // Check if the game is won or lost
  if (!wordDisplay.textContent.includes("_")) {
    triggerWinAnimation();
    restartButton.style.display = "inline-block";
  } else if (wrongGuesses >= maxWrongGuesses) {
    triggerLoseAnimation();
    restartButton.style.display = "inline-block";
  }
  guessInput.focus();
});

// Handle ENTER key logic
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (restartButton.style.display === "inline-block") {
      restartButton.click();
    }
    submitGuess.click();
  }
});
// Handle hint request
hintButton.addEventListener("click", () => {
  playClickSound();
  provideHint();
});
// Handle new game request
newGame.addEventListener("click", () => {
  playClickSound();
  startNewGame();
});

// Handle Restart
restartButton.addEventListener("click", () => {
  playClickSound();
  initializeGame();
});
// Initialize the first game
initializeGame();
