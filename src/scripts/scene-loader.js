// ================================================================================
// LOGS
// ================================================================================

header = '<SCENE-LOADER>';


// ================================================================================
// LOAD SCENES METHODS
// ================================================================================

// MAIN MENU SCENE
// ----------------------------------------------------------------------------

function loadMainMenuScene(callback){
    const menu = document.getElementById('menu');
    if (menu) menu.remove();
    window.location.href = "index.html";
    if (callback){callback();}
}

// SOLO MODE SCENE
// ----------------------------------------------------------------------------

function loadSoloGameScene(callback) {
    const gameContainer = document.getElementById('game-container');

    // Clean Game Container
    gameContainer.innerHTML = '';

    // Fetch Game Scene HTML
    fetch('src/html/solo-game.html')
        .then(response => response.text())
        .then(data => {
            gameContainer.innerHTML = data;
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'src/css/game.css';

            // Load game.css
            document.head.appendChild(link);

            // Display Game Container and Hide Main Menu
            gameContainer.style.display = 'block';
            document.getElementById('main-menu').style.display = 'none';

            if (callback) {
                callback();
            }
        });
}

// ================================================================================
// EXPORTS
// ================================================================================

window.sceneLoaderAPI = {
    loadMainMenuScene,
    loadSoloGameScene,
};

