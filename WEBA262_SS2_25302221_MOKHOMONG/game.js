// GET SETTINGS
let playerName = sessionStorage.getItem("playerName");
let boardSize = sessionStorage.getItem("boardSize");
let difficulty = sessionStorage.getItem("difficulty");
let theme = sessionStorage.getItem("theme");

// DISPLAY SETTINGS
document.getElementById("displayPlayer").innerText = playerName;
document.getElementById("displayBoardSize").innerText = boardSize;
document.getElementById("displayDifficulty").innerText = difficulty;
document.getElementById("displayTheme").innerText = theme;

// GAME VARIABLES
let time = 0;
let timerInterval;
let board = document.getElementById("gameBoard");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;

// BOARD SIZE → TOTAL CARDS
let totalCards = 16;
document.getElementById("displayPairsLeft").innerText = totalCards / 2;
if (boardSize === "4x5") totalCards = 20;
if (boardSize === "6x6") totalCards = 36;

// APPLY GRID CLASS
board.classList.add("board-" + boardSize);

// CREATE SYMBOLS
let values = [];

if (theme === "letters") {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let i = 0; i < totalCards / 2; i++) {
        values.push(letters[i], letters[i]);
    }

} else if (theme === "symbols") {
    let symbols = ["★","♠","♣","♥","♦","☀","☂","☕","♫","✓","✿","⚽"];
    for (let i = 0; i < totalCards / 2; i++) {
        values.push(symbols[i], symbols[i]);
    }

} else 
// SHUFFLE
values.sort(() => 0.5 - Math.random());

// CREATE CARDS
values.forEach(val => {
    let card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.value = val;
    card.innerText = "";

    card.addEventListener("click", flipCard);
    board.appendChild(card);
});
startTimer();
// FLIP CARD
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.innerText = this.dataset.value;
    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        moves++;
        document.getElementById("displayMoves").innerText = moves;
        checkMatch();
    }
    log("Flipped: " + this.dataset.value);
}

// CHECK MATCH
function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matches++;
        document.getElementById("displayPairsLeft").innerText = (totalCards / 2) - matches;
        document.getElementById("displayMatches").innerText = matches;
        document.getElementById("displayScore").innerText = matches * 10;

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        if (matches === totalCards / 2) {
            setTimeout(() => {
                alert("🎉 You won " + playerName);
            }, 300);
        }
        clearInterval(timerInterval);

        reset();
    } else {
        setTimeout(() => {
            firstCard.innerText = "";
            secondCard.innerText = "";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            reset();
        }, 800);
    }
    log("Match found!");
}

// RESET
function reset() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("displayTime").innerText = time + " s";
    }, 1000);
}
document.getElementById("saveBtn").addEventListener("click", function () {

    let gameData = {
        values: values,
        moves: moves,
        matches: matches,
        time: time
    };

    localStorage.setItem("memoryGame", JSON.stringify(gameData));

    alert("Game saved!");
});

function log(message) {
    let logArea = document.getElementById("logArea");

    let entry = document.createElement("div");
    entry.classList.add("log-entry");
    entry.innerText = message;

    logArea.appendChild(entry);
}
document.getElementById("hintBtn").addEventListener("click", function () {

    let cards = document.querySelectorAll(".memory-card");

    cards.forEach(card => {
        card.innerText = card.dataset.value;
        card.classList.add("hint");
    });

    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains("matched")) {
                card.innerText = "";
                card.classList.remove("hint");
            }
        });
    }, 1000);
});
document.getElementById("loadBtn").addEventListener("click", function () {

    let saved = localStorage.getItem("memoryGame");

    if (!saved) {
        alert("No saved game!");
        return;
    }

    let data = JSON.parse(saved);

    values = data.values;
    moves = data.moves;
    matches = data.matches;
    time = data.time;

    document.getElementById("displayMoves").innerText = moves;
    document.getElementById("displayMatches").innerText = matches;
    document.getElementById("displayScore").innerText = matches * 10;
    document.getElementById("displayTime").innerText = time + " s";

    board.innerHTML = "";

    values.forEach(val => {
        let card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.value = val;
        card.innerText = "";

        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    alert("Game loaded!");
});
document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "index.html";
});