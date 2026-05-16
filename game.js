// GET SETTINGS
let playerName = sessionStorage.getItem("playerName");
let boardSize = sessionStorage.getItem("boardSize");
let difficulty = sessionStorage.getItem("difficulty");
let theme = sessionStorage.getItem("theme");

// DISPLAY SETTINGS
document.getElementById("displayPlayer").innerText = playerName || "Unknown";
document.getElementById("displayBoardSize").innerText = boardSize || "4x4";
document.getElementById("displayDifficulty").innerText = difficulty || "medium";
document.getElementById("displayTheme").innerText = theme || "numbers";

// GAME VARIABLES
let time = 0;
let timerInterval = null;
let board = document.getElementById("gameBoard");
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;
let gameStarted = false;

// BOARD SIZE → TOTAL CARDS
let totalCards = 16;
if (boardSize === "4x5") totalCards = 20;
if (boardSize === "6x6") totalCards = 36;
let totalPairs = totalCards / 2;

document.getElementById("displayPairsLeft").innerText = totalPairs;

// APPLY GRID CLASS
board.classList.add("board-" + boardSize);

// CREATE SYMBOLS
let values = [];

//Change 1: Fixed Numbers theme and ensured all three themes work correctly
/* Old code:
} else 
values.sort(() => 0.5 - Math.random());
(Numbers theme was missing — the else block had no body, creating an empty board)
*/
// Replaced with:
if (theme === "letters") {
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let i = 0; i < totalPairs; i++) {
        values.push(letters[i], letters[i]);
    }
} else if (theme === "symbols") {
    let symbolList = ["★","♠","♣","♥","♦","☀","☂","☕","♫","✓","✿","⚽","🎯","🔥","💎","🎮","🌙","🎵"];
    for (let i = 0; i < totalPairs; i++) {
        values.push(symbolList[i], symbolList[i]);
    }
} else {
    // Numbers theme
    for (let i = 1; i <= totalPairs; i++) {
        values.push(String(i), String(i));
    }
}
//- End Change 1

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

//Change 2: Added Start Game and Reset Game button functionality
// Timer now only starts when Start Game is clicked, not on page load
// Replaced with:
document.getElementById("startBtn").addEventListener("click", function () {
    if (gameStarted) return;
    gameStarted = true;
    this.disabled = true;
    document.getElementById("messageArea").innerText = "Game started! Find all matching pairs.";
    startTimer();
    log("Game started.");
});

document.getElementById("resetBtn").addEventListener("click", function () {
    clearInterval(timerInterval);
    time = 0;
    moves = 0;
    matches = 0;
    gameStarted = false;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    document.getElementById("displayTime").innerText = "0 s";
    document.getElementById("displayMoves").innerText = "0";
    document.getElementById("displayMatches").innerText = "0";
    document.getElementById("displayScore").innerText = "0";
    document.getElementById("displayPairsLeft").innerText = totalPairs;
    document.getElementById("messageArea").innerText = "Game reset. Click Start Game when ready.";
    document.getElementById("startBtn").disabled = false;

    values.sort(() => 0.5 - Math.random());
    board.innerHTML = "";
    values.forEach(val => {
        let card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.value = val;
        card.innerText = "";
        card.addEventListener("click", flipCard);
        board.appendChild(card);
    });

    log("Game reset.");
});
//- End Change 2

// FLIP CARD
function flipCard() {
    if (!gameStarted) {
        document.getElementById("messageArea").innerText = "Click Start Game first!";
        return;
    }
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
        document.getElementById("displayPairsLeft").innerText = totalPairs - matches;
        document.getElementById("displayMatches").innerText = matches;

        let score = (matches * 10) - Math.max(0, (moves - matches) * 2);
        document.getElementById("displayScore").innerText = Math.max(0, score);

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        document.getElementById("messageArea").innerText = "✅ Match! " + matches + " of " + totalPairs + " pairs found.";
        log("Match: " + firstCard.dataset.value);

        //Change 3: Replaced basic alert with a proper game over screen showing full stats
        /* Old code:
        if (matches === totalCards / 2) {
            setTimeout(() => { alert("🎉 You won " + playerName); }, 300);
        }
        clearInterval(timerInterval); // BUG: was stopping timer on every match not just the last
        */
        // Replaced with:
        if (matches === totalPairs) {
            clearInterval(timerInterval);
            setTimeout(() => { showGameOver(Math.max(0, score)); }, 400);
        }
        //- End Change 3

        reset();
    } else {
        document.getElementById("messageArea").innerText = "❌ No match. Try again!";
        log("No match: " + firstCard.dataset.value + " vs " + secondCard.dataset.value);
        setTimeout(() => {
            firstCard.innerText = "";
            secondCard.innerText = "";
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            reset();
        }, 800);
    }
}

//Change 3 continued: Game over screen function
function showGameOver(finalScore) {
    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.78); display:flex; align-items:center;
        justify-content:center; z-index:999;
    `;
    let box = document.createElement("div");
    box.style.cssText = `
        background:white; border-radius:16px; padding:40px 48px;
        text-align:center; max-width:420px; width:90%;
        box-shadow:0 10px 40px rgba(0,0,0,0.35);
    `;
    box.innerHTML = `
        <div style="font-size:3rem;margin-bottom:8px;">🎉</div>
        <h2 style="color:#1d3557;margin:0 0 20px 0;">You Won!</h2>
        <table style="width:100%;border-collapse:collapse;font-size:1rem;margin-bottom:24px;">
            <tr><td style="padding:8px;text-align:left;color:#555;">Player</td><td style="padding:8px;font-weight:bold;">${playerName}</td></tr>
            <tr style="background:#f3f7fb;"><td style="padding:8px;text-align:left;color:#555;">Score</td><td style="padding:8px;font-weight:bold;">${finalScore}</td></tr>
            <tr><td style="padding:8px;text-align:left;color:#555;">Moves</td><td style="padding:8px;font-weight:bold;">${moves}</td></tr>
            <tr style="background:#f3f7fb;"><td style="padding:8px;text-align:left;color:#555;">Time</td><td style="padding:8px;font-weight:bold;">${time}s</td></tr>
            <tr><td style="padding:8px;text-align:left;color:#555;">Difficulty</td><td style="padding:8px;font-weight:bold;">${difficulty}</td></tr>
            <tr style="background:#f3f7fb;"><td style="padding:8px;text-align:left;color:#555;">Board</td><td style="padding:8px;font-weight:bold;">${boardSize}</td></tr>
        </table>
        <div style="display:flex;gap:12px;justify-content:center;">
            <button onclick="location.reload()" style="padding:11px 22px;background:#457b9d;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">Play Again</button>
            <button onclick="window.location.href='index.html'" style="padding:11px 22px;background:#1d3557;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem;">Main Menu</button>
        </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}
//- End Change 3

// RESET TURN
function reset() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// TIMER
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        document.getElementById("displayTime").innerText = time + " s";
    }, 1000);
}

// SAVE SESSION
document.getElementById("saveBtn").addEventListener("click", function () {
    let cardStates = [];
    document.querySelectorAll(".memory-card").forEach(card => {
        cardStates.push({ value: card.dataset.value, matched: card.classList.contains("matched") });
    });
    let gameData = { values, moves, matches, time, cardStates };
    localStorage.setItem("memoryGame", JSON.stringify(gameData));
    alert("Game saved!");
    log("Game saved.");
});

// LOAD SESSION
document.getElementById("loadBtn").addEventListener("click", function () {
    let saved = localStorage.getItem("memoryGame");
    if (!saved) { alert("No saved game found!"); return; }
    let data = JSON.parse(saved);
    values = data.values;
    moves = data.moves;
    matches = data.matches;
    time = data.time;
    gameStarted = true;

    document.getElementById("displayMoves").innerText = moves;
    document.getElementById("displayMatches").innerText = matches;
    document.getElementById("displayScore").innerText = Math.max(0, (matches * 10) - Math.max(0, (moves - matches) * 2));
    document.getElementById("displayTime").innerText = time + " s";
    document.getElementById("displayPairsLeft").innerText = totalPairs - matches;
    document.getElementById("startBtn").disabled = true;

    board.innerHTML = "";
    data.cardStates.forEach(state => {
        let card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.value = state.value;
        if (state.matched) {
            card.classList.add("matched");
            card.innerText = state.value;
        } else {
            card.innerText = "";
            card.addEventListener("click", flipCard);
        }
        board.appendChild(card);
    });

    clearInterval(timerInterval);
    startTimer();
    alert("Game loaded!");
    log("Game loaded.");
});

// HINT
document.getElementById("hintBtn").addEventListener("click", function () {
    if (!gameStarted) { document.getElementById("messageArea").innerText = "Start the game first!"; return; }
    let cards = document.querySelectorAll(".memory-card:not(.matched)");
    cards.forEach(card => { card.innerText = card.dataset.value; card.classList.add("hint"); });
    setTimeout(() => {
        cards.forEach(card => {
            if (!card.classList.contains("matched")) { card.innerText = ""; card.classList.remove("hint"); }
        });
    }, 1000);
    log("Hint used.");
});

// BACK
document.getElementById("backBtn").addEventListener("click", function () {
    window.location.href = "index.html";
});

// LOG
function log(message) {
    let logArea = document.getElementById("logArea");
    let entry = document.createElement("div");
    entry.classList.add("log-entry");
    let now = new Date();
    entry.innerText = "[" + now.getHours() + ":" + String(now.getMinutes()).padStart(2,"0") + ":" + String(now.getSeconds()).padStart(2,"0") + "] " + message;
    logArea.prepend(entry);
}
