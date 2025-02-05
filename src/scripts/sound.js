// ================================================================================
// LOGS
// ================================================================================

header = '<SOUND>';

// ================================================================================
// MAIN VARS
// ================================================================================

let isPlaying = false;  // Checks if music is being played
let isMuted = false;    // Checks if sound is muted
let isSpinning = false; // Checks if roulette is spinning for sound

// ================================================================================
// AUDIO FILES
// ================================================================================

// BUTTON SOUNDS
// ----------------------------------------------------------------------------
const hoverSound = new Audio('assets/sound/sounds/button-hover.mp3');
const clickSound = new Audio('assets/sound/sounds/button-click.mp3');

const clickGameSound = new Audio('assets/sound/sounds/button-click-game.mp3');
const clickBetSound = new Audio('assets/sound/sounds/button-bet.mp3');
const clickBetNumberSound = new Audio('assets/sound/sounds/bet-button.mp3');
const forceWithYouSound = new Audio('assets/sound/sounds/force.mp3');
const winRoundSound = new Audio('assets/sound/sounds/coins-1.mp3');
const loseRoundSound = new Audio('assets/sound/sounds/Lose-Round.mp3');
const noTokensSound = new Audio('assets/sound/sounds/no-tokens.mp3');

const beepBet = new Audio('assets/sound/sounds/bet-beep.mp3');
const deleteBetSound = new Audio('assets/sound/sounds/delete-bet.mp3');
const errorSound = new Audio('assets/sound/sounds/error.mp3');

const order66Sound = new Audio('assets/sound/sounds/order-66.mp3');

// ROULETTE SOUNDS
// ----------------------------------------------------------------------------

const rouletteSpin = new Audio('assets/sound/sounds/roulette-wheel.mp3');
rouletteSpin.loop = true;

// MUSIC 
// ----------------------------------------------------------------------------
const audio = new Audio('assets/sound/music/SW-Cantine.mp3');
audio.loop = true;

// ================================================================================
// HTML FETCHER
// ================================================================================

// BUTTONS 
// ----------------------------------------------------------------------------

// MUSIC BUTTONS
const toggleMusicButton = document.getElementById('toggle-music');
const toggleMusicIcon = toggleMusicButton.querySelector('img');

// AUDIO BUTTONS
const toggleSoundButton = document.getElementById('toggle-sound');
const toggleSoundIcon = toggleSoundButton.querySelector('img');

// ================================================================================
// MAIN FUNCTIONS
// ================================================================================

// MUSIC 
// ----------------------------------------------------------------------------

function updateVolume(value) {
    // Volume Value has to be a float between 0 and 1
    const volumeValue = value / 100; 
    audio.volume = volumeValue;
    window.electron.logSystem(header, 'log', `Volume Adjusted To: ${audio.volume}`);
}

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        window.electron.logSystem(header, 'log', 'Music Paused');
    } else {
        audio.play();
        window.electron.logSystem(header, 'log', 'Playing Music');
    }
    isPlaying = !isPlaying;
    updateMusicIcon();
}

function updateMusicIcon() {
    if (isPlaying) {
        toggleMusicIcon.src = 'assets/icons/music.png';
    } else {
        toggleMusicIcon.src = 'assets/icons/music-muted.png';
    }
}

function playMusicAutomatically() {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;
        window.electron.logSystem(header, 'log', 'Music launched Successfully');
    }
    updateMusicIcon();
    updateVolume(50);

}

playMusicAutomatically();

// SOUND 
// ----------------------------------------------------------------------------

function toggleSound() {
    if (isMuted) {
        window.electron.logSystem(header, 'log', "Sound is unmuted");
    } else {
        window.electron.logSystem(header, 'log', "Sound is muted");
    }

    isMuted = !isMuted;

    updateSoundIcon();
}

function updateSoundIcon() {
    if (isMuted) {
        toggleSoundIcon.src = 'assets/icons/speaker-muted.png';
    } else {
        toggleSoundIcon.src = 'assets/icons/speaker.png';
    }

}

// BUTTONS
// ----------------------------------------------------------------------------

function playHoverSound() {
    // Sound for buttons
    if (!isMuted) {hoverSound.play();}
}

function playClickSound() {
    // Sound for buttons
    if (!isMuted) {clickSound.play();}
}

function playClickGameSound(){
    if (!isMuted){clickGameSound.play();}
}

function playClickBetSound(){
    if (!isMuted){clickBetSound.play();}
}

function playclickBetNumberSound(){
    if (!isMuted){clickBetNumberSound.play();}
}

function playForceWithYouSound(){
    if (!isMuted){forceWithYouSound.play();}
}

function playWinRoundSound(){
    if (!isMuted){winRoundSound.play();}
}

function playLoseRoundSound(){
    if (!isMuted){loseRoundSound.play();}
}

function playNoTokensSound(){
    if (!isMuted){noTokensSound.play();}
}

function playBetBeepSound(){
    if (!isMuted){beepBet.play();}
}

function playDeleteBetSound(){
    if (!isMuted){deleteBetSound.play();}
}

function playErrorSound(){
    if (!isMuted){errorSound.play();}
}

function playOrder66Sound(){
    if (!isMuted){order66Sound.play();}
}

// ROULETTE
// ----------------------------------------------------------------------------

function toggleRouletteSpin(){
    isSpinning = !isSpinning;
    if(!isMuted) {
        if (isSpinning){
            rouletteSpin.play();
            window.electron.logSystem(header, 'log', 'Wheel Spinning');
        }
        else {
            rouletteSpin.pause();
            window.electron.logSystem(header, 'log', 'Wheel Stoped Spinning');
        }
    }
}

// ================================================================================
// EXPORTS
// ================================================================================

window.soundAPI = {
    toggleMusic,
    playHoverSound,
    playClickSound,
    playClickGameSound,
    playClickBetSound,
    playclickBetNumberSound,
    playForceWithYouSound,
    playWinRoundSound,
    playLoseRoundSound,
    playNoTokensSound,
    playBetBeepSound,
    playDeleteBetSound,
    playErrorSound,
    playOrder66Sound,
    toggleSound,
    updateVolume,
    toggleRouletteSpin,
};
