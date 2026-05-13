// BUTTONS
let openBtn = document.getElementById("openGameBtn");
let saveBtn = document.getElementById("saveSettingsBtn");
let loadBtn = document.getElementById("loadSettingsBtn");
let resetBtn = document.getElementById("resetSettingsBtn");

// OPEN GAME
openBtn.addEventListener("click", function () {
    let name = document.getElementById("playerName").value;
    let board = document.getElementById("boardSize").value;
    let difficulty = document.getElementById("difficulty").value;
    let theme = document.querySelector('input[name="theme"]:checked').value;

    if (name === "") {
        alert("Enter your name!");
        return;
    }

    // SAVE SETTINGS
    sessionStorage.setItem("playerName", name);
    sessionStorage.setItem("boardSize", board);
    sessionStorage.setItem("difficulty", difficulty);
    sessionStorage.setItem("theme", theme);

    window.location.href = "game.html";
});

// SAVE SETTINGS
saveBtn.addEventListener("click", function () {
    let name = document.getElementById("playerName").value;
    document.cookie = "playerName=" + name;
    alert("Settings saved!");
});

// LOAD SETTINGS
loadBtn.addEventListener("click", function () {
    let cookies = document.cookie.split(";");

    cookies.forEach(c => {
        c = c.trim();
        if (c.startsWith("playerName=")) {
            let name = c.split("=")[1];
            document.getElementById("playerName").value = name;
        }
    });

    alert("Settings loaded!");
});

// RESET SETTINGS
resetBtn.addEventListener("click", function () {
    document.getElementById("setupForm").reset();
});