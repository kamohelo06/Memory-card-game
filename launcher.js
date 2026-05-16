// BUTTONS
let openBtn = document.getElementById("openGameBtn");
let saveBtn = document.getElementById("saveSettingsBtn");
let loadBtn = document.getElementById("loadSettingsBtn");
let resetBtn = document.getElementById("resetSettingsBtn");

// OPEN GAME
openBtn.addEventListener("click", function () {
    let name = document.getElementById("playerName").value.trim();
    let board = document.getElementById("boardSize").value;
    let difficulty = document.getElementById("difficulty").value;
    let theme = document.querySelector('input[name="theme"]:checked').value;

    if (name === "") {
        alert("Please enter your name before starting!");
        return;
    }

    sessionStorage.setItem("playerName", name);
    sessionStorage.setItem("boardSize", board);
    sessionStorage.setItem("difficulty", difficulty);
    sessionStorage.setItem("theme", theme);

    window.location.href = "game.html";
});

// SAVE SETTINGS
saveBtn.addEventListener("click", function () {
    let name = document.getElementById("playerName").value.trim();
    let board = document.getElementById("boardSize").value;
    let difficulty = document.getElementById("difficulty").value;
    let theme = document.querySelector('input[name="theme"]:checked').value;

    let settings = { name, board, difficulty, theme };
    localStorage.setItem("launcherSettings", JSON.stringify(settings));
    alert("Settings saved!");
});

// LOAD SETTINGS
loadBtn.addEventListener("click", function () {
    let saved = localStorage.getItem("launcherSettings");

    if (!saved) {
        alert("No saved settings found!");
        return;
    }

    let settings = JSON.parse(saved);

    document.getElementById("playerName").value = settings.name || "";
    document.getElementById("boardSize").value = settings.board || "4x4";
    document.getElementById("difficulty").value = settings.difficulty || "medium";

    let themeRadio = document.querySelector('input[name="theme"][value="' + settings.theme + '"]');
    if (themeRadio) themeRadio.checked = true;

    updatePreview();
    alert("Settings loaded!");
});

// RESET SETTINGS
resetBtn.addEventListener("click", function () {
    document.getElementById("setupForm").reset();
    updatePreview();
});

//Change 1: Added live preview functionality
// Old code: updatePreview was never called — preview always showed "No settings selected yet."
// Replaced with:
function updatePreview() {
    let name = document.getElementById("playerName").value.trim() || "Player";
    let board = document.getElementById("boardSize").value;
    let difficulty = document.getElementById("difficulty").value;
    let theme = document.querySelector('input[name="theme"]:checked').value;

    let cardCount = board === "4x5" ? 20 : board === "6x6" ? 36 : 16;

    document.getElementById("previewText").innerText =
        "Player: " + name + " | Board: " + board + " (" + cardCount + " cards) | Difficulty: " + difficulty + " | Theme: " + theme;
}

// Attach live preview to all inputs
document.getElementById("playerName").addEventListener("input", updatePreview);
document.getElementById("boardSize").addEventListener("change", updatePreview);
document.getElementById("difficulty").addEventListener("change", updatePreview);
document.querySelectorAll('input[name="theme"]').forEach(r => r.addEventListener("change", updatePreview));

// Run on page load
updatePreview();
//- End Change 1
