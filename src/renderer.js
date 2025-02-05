// ================================================================================
// MAIN VARS
// ================================================================================

sender = '<RENDERER>';

// ================================================================================
// HTML FETCHER
// ================================================================================

// BUTTONS 
// ----------------------------------------------------------------------------
const buttons = document.querySelectorAll('button');

// ================================================================================
// EVENT LISTENERS
// ================================================================================

// ----------------------------------------------------------------------------
// BUTTONS 
// ----------------------------------------------------------------------------

// MAIN MENU
// ----------------------------------------------------------------------------

// Single Player - SOLO MODE
document.getElementById('play-alone').addEventListener('click', () => {
    window.electron.logSystem(sender, 'log', 'Event Caught: Running Solo Game');
    window.soundAPI.playClickSound();
    window.soloGame.startSoloGame();
});

// Rules Modal
document.getElementById('rules-button-1').addEventListener('click', () => {
    window.electron.logSystem(sender, 'log', 'Event Caught: Rules Button Clicked');
    window.modalsAPI.setupRulesModalVars("rules-modal-1", "rules-button-1", "rules-modal-close-button-1", 'rules-scrollable-1');
    window.soundAPI.playClickSound();
    window.modalsAPI.showRulesModal();
});

// AUDIO
// ----------------------------------------------------------------------------

// Toggle Music
document.getElementById('toggle-music').addEventListener('click', () => {
    window.soundAPI.toggleMusic();
    window.soundAPI.playClickSound();
});

// Toggle Sound
document.getElementById('toggle-sound').addEventListener('click', () => {
    window.soundAPI.toggleSound();
    window.soundAPI.playClickSound();
});

// Volume Slider - Volume Control
document.getElementById('volume-slider').addEventListener('input', () => {
    // Parse string to float
    let volumeValue = parseFloat(document.getElementById('volume-slider').value);

    if (!isNaN(volumeValue)) {
        window.soundAPI.updateVolume(Number(volumeValue));
    }
});

// Buttons Sound - Hover
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        window.soundAPI.playHoverSound();
    });
});






