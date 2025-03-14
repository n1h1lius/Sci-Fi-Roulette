// ================================================================================
// MAIN VARS
// ================================================================================

game_header = "<GAME>";
debug_header = "<DEBUG>";

// PLAYER 
// ----------------------------------------------------------------------------

const gameState = {
  players: [
    { id: 1, tokens: 100, currentBet: [], totalBet: 0 },
    { id: 2, tokens: 100, currentBet: [], totalBet: 0 },
    { id: 3, tokens: 100, currentBet: [], totalBet: 0 },
    { id: 4, tokens: 100, currentBet: [], totalBet: 0 },
  ],
  currentPlayerIndex: 0,
  rounds: 0,
};

// GAME LOGIC
// ----------------------------------------------------------------------------

const initialTokens = 100;
let selectedNumber = null;

const gameAPI = {
  isGame: false,
  soloMode: false,
  multiMode: false,
  aiMode: false,
};

const debugAPI = {
  alwaysWin: false,
  alwaysLose: false
};

// BET VARS
// ----------------------------------------------------------------------------

let tokensUI, roundsUI;

const sithNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]; 
const jediNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

const betProbabilities = {
  Pares: 18 / 36,
  Impares: 18 / 36,
  Sith: sithNumbers.length / 36,
  Jedi: jediNumbers.length / 36,
  SingleNumber: 1 / 36,
  Zero: 1 / 36 * 50 // x50 Bonus 
};

// ================================================================================
// GENERAL FUNCTIONS
// ================================================================================

const gameUtils = {
  initTokensForPlayers() {
    gameState.players.forEach(player => {
      player.tokens = initialTokens;
      gameUtils.updateTokensUI(player.id);
    });
  },
  updateRounds() {
    gameState.rounds++;
    const roundCount = document.getElementById('round-count');
    if (roundCount) {
      roundCount.textContent = gameState.rounds;
    }
  },
  updateTokensUI(playerId) {
    const tokenCount = document.getElementById(`token-count-player-${playerId}`);
    if (tokenCount) {
      tokenCount.textContent = gameState.players[playerId - 1].tokens;
    }
  },
  deductTokens(playerId, amount) {
    gameState.players[playerId - 1].tokens -= amount;
    gameUtils.updateTokensUI(playerId);
  },
  addTokens(playerId, amount) {
    gameState.players[playerId - 1].tokens += amount;
    gameUtils.updateTokensUI(playerId);
  },
  switchPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    updatePlayerTurnUI();
  }
};

function setupGameFunctions() {
  /* This functions makes sure every html element is fetch after DOM is loaded */

  // Fetch HTML Items
  tokensUI = document.getElementById('tokens-ui');
  roundsUI = document.getElementById('rounds-ui');
  const spinButton = document.getElementById('spin-button');
  const exitButton = document.getElementById('exit-button');
  const gameBoard = document.getElementById('game-board');

  // Init Game Vars
  window.gameAPI.isGame = true;
  window.gameAPI.soloMode = true;
  gameUtils.initTokensForPlayers();
  gameState.rounds = 0;

  // Launch logic only if html elements found
  if (spinButton) {
      // Handle spin button click
      spinButton.addEventListener('click', () => {
          // Grabs Bet Amount, filters it and launches a Spin Roulette
          window.electron.logSystem(header, 'log', 'Botón "Girar" presionado.');

          // Check if player has made any bets
          if (gameState.players[gameState.currentPlayerIndex].currentBet.length == 0){
            window.soundAPI.playErrorSound();
            window.modalsAPI.showNotification('Realiza alguna apuesta para poder girar la ruleta.'); 
            return;
          }

          // Roulette Spin Animation Launch
          window.soundAPI.playClickBetSound();
          spinRoulette();
      });

      // Handle spin button hover
      spinButton.addEventListener('mouseenter', () => {
          window.soundAPI.playHoverSound();
      })

      // Trace Log Entry
      window.electron.logSystem(header, 'log', 'Spin Button Set-up Successfull.');

  }

  if (exitButton){
    // Handle exit button click
    exitButton.addEventListener('click', () => {
        window.soundAPI.playLoseRoundSound();
        window.sceneLoaderAPI.loadMainMenuScene();
    });
    // Handle exit button hover
    exitButton.addEventListener('mouseenter', () => {
      window.soundAPI.playHoverSound();
    })
  }

  if (gameBoard){
    // Handle Bet Buttons Click
    gameBoard.addEventListener('click', (event) => {
      if (event.target.tagName == 'BUTTON'){

        window.soundAPI.playclickBetNumberSound();

        // Capture button text
        const pressedButton = event.target.textContent.trim(); 

        // Capture button class
        const classButton = event.target.className; 

        // Call to Show Bet Modal
        window.modalsAPI.showBetModal(pressedButton, classButton);
      }
    });

    // Handle Bet Buttons Hover
    gameBoard.addEventListener('mouseover', (event) => {
      if (event.target.tagName == 'BUTTON'){
        window.soundAPI.playHoverSound();
      }
    })
    
  }
}

// ================================================================================
// ROULETTE FUNCTIONS
// ================================================================================

async function spinRoulette() {
  /* This function handles Roulette logic and animation. All benefits and loses are calculated and added and deducted here. */

  // Deactivate all buttons
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(button => {
    button.disabled = true;
  });

  // Generate a random number as winning Number
  const winningNumber = Math.floor(Math.random() * 37);

  // Trace Log Entry
  window.electron.logSystem(header, 'log', `Starting Roulette Sequence. Winner Number: ${winningNumber}`);

  // ----------------------------------------------------------------------------
  // SPIN THE ROULETTE [ANIMATION]
  // ----------------------------------------------------------------------------

  // How many times the roulette will spin 
  const totalRounds = 2;
  // Time in ms for each button hover animation
  const pauseTime = 60;
  const winningNumberPauseTime = 2000; 

  // Fetch all buttons
  const numberButtons = document.querySelectorAll('.numeros-tablero .numero');
  const totalButtons = numberButtons.length;

  // Iterate through all buttons and display animation
  for (let round = 0; round < totalRounds; round++) {
      for (let i = 0; i < totalButtons; i++) {

        window.soundAPI.playBetBeepSound();

        // Hover Animation #1
        numberButtons[i].style.backgroundColor = '#ffcc00'; 
        numberButtons[i].style.color = '#000';

        // Generate a new promise to wait for animation to dissapear
        await new Promise(resolve => setTimeout(resolve, pauseTime));

        // Hover Animation #2 (Return to original Style)
        numberButtons[i].style.backgroundColor = '';
        numberButtons[i].style.color = '';
      }
  }

  // Last Round - Diplay Winning Number Animation
  for (let i = 0; i < totalButtons; i++) {
    window.soundAPI.playBetBeepSound();

    // Hover Animation #1
    numberButtons[i].style.backgroundColor = '#ffcc00';
    numberButtons[i].style.color = '#000'; 

    // Generate a new promise to wait for animation to dissapear
    await new Promise(resolve => setTimeout(resolve, pauseTime));

    if (i === winningNumber) {
        // Generate a new promise to wait additional time for winning Number animation to dissapear
        await new Promise(resolve => setTimeout(resolve, winningNumberPauseTime));
        // Hover Animation #2 (Return to original Style)
        numberButtons[i].style.backgroundColor = '';
        numberButtons[i].style.color = '';
        break; 
    }

    // Hover Animation #2 (Return to original Style)
    numberButtons[i].style.backgroundColor = '';
    numberButtons[i].style.color = '';
  }


  // Reactivate all buttons
  allButtons.forEach(button => {
    button.disabled = false;
  });

  // ----------------------------------------------------------------------------
  // SPIN THE ROULETTE [LOGIC] - [EARNINGS AND LOSES]
  // ----------------------------------------------------------------------------

  const playerBets = gameState.players[gameState.currentPlayerIndex].currentBet;

  let hits = 0;
  let fails = 0;
  let earnings = 0;
  let loses = 0;

  let selectedNumberWinner = false;
  let abusiveBetCounter = 0;

  // Substract Bet Tokens from Player's Balance
  gameState.players[gameState.currentPlayerIndex].tokens += gameState.players[gameState.currentPlayerIndex].totalBet;
  window.electron.logSystem(game_header, 'log', `Current Player Tokens After Bets Substract: ${gameState.players[gameState.currentPlayerIndex].tokens}`);

  // CALCULATE ABUSIVE BETING BEHAVIOUR
  // ----------------------------------------------------------------------------
  for (const bet of playerBets) {
    if (bet.number === 'Pares' || bet.number === 'Impares' || bet.number === 'Sith' || bet.number === 'Jedi') {
      abusiveBetCounter++;
    }
  }

  // CALCULATE EARNINGS AND LOSES
  // ----------------------------------------------------------------------------

  for (const bet of playerBets) {
    /* This loop calculates each bet value in earnings or loses based on its specific bet type odds */ 
    let betProb = 0;
    let isHit = false;
  
    // Checks if Player bet for Pairs
    if (bet.number === 'Pares') {
      betProb = betProbabilities.Pares;
      isHit = (winningNumber % 2 === 0);
      if (isHit && abusiveBetCounter > 1){betProb = 1;}

    // Checks if Player bet for Odds
    } else if (bet.number === 'Impares') {
      betProb = betProbabilities.Impares;
      isHit = (winningNumber % 2 !== 0);
      if (isHit && abusiveBetCounter > 1){betProb = 1;}
    
    // Checks if Player bet for Sith
    } else if (bet.number === 'Sith') {
      betProb = betProbabilities.Sith;
      isHit = sithNumbers.includes(winningNumber);
      if (isHit && abusiveBetCounter > 1){betProb = 1;}

    // Checks if Player bet for Jedi
    } else if (bet.number === 'Jedi') {
      betProb = betProbabilities.Jedi;
      isHit = jediNumbers.includes(winningNumber);
      if (isHit && abusiveBetCounter > 1){betProb = 1;}

    // Checks if Player bet for a specific number
    } else if (bet.number === winningNumber) {
      betProb = betProbabilities.SingleNumber;
      isHit = true;

      // Check if hit was zero for better bonus
      if(winningNumber === 0){betProb = betProbabilities.Zero;}
      
      // Activate flag boolean for winning notification
      selectedNumberWinner = true;

    }
  
    // Add or Substract tokens in case of hit or fail
    if (isHit) {
      hits++;
      const reward = bet.betAmount * (1 / betProb);
      earnings += reward;
    } else {
      fails++;
      loses += bet.betAmount;
    }
  }
  
  // Trace Log Entry
  window.electron.logSystem(header, 'log', `Hits: ${hits}, Fails: ${fails}, Earnings: ${earnings}, Loses: ${loses}`);
  
  // Apply Tokens to Player
  const netEarnings = earnings;
  gameState.players[gameState.currentPlayerIndex].tokens += Math.floor(netEarnings);

  // Update Tokens UI
  tokensUI.textContent = gameState.players[gameState.currentPlayerIndex].tokens;

  // RESET VARS
  // ----------------------------------------------------------------------------

  // Add 1 Round
  gameState.rounds++;
  roundsUI.textContent = gameState.rounds;
  
  // Clear Bet Logs UI from last bets
  document.getElementById('bet-logs').innerHTML = '';
  // Reset Total Bet from the HUD
  document.getElementById('total-bet-int').textContent = '0';
  // Reset Player Last Bets
  gameState.players[gameState.currentPlayerIndex].currentBet = [];
  // Reset Player Total Bet
  gameState.players[gameState.currentPlayerIndex].totalBet = 0;

  // SHOW RESULTS TO PLAYER
  // ----------------------------------------------------------------------------
  let resultsMessage = `NÚMERO GANADOR: ${winningNumber}<br><br>Aciertos: ${hits} || Fallos: ${fails} || Ganancias: ${earnings} || Perdidas: ${loses}<br><br>`;

  // If Player's Bet Number was Winngin Number
  if (selectedNumberWinner) {
    window.soundAPI.playForceWithYouSound();
    resultsMessage += `¡Tu número seleccionado ${winningNumber} ha sido el número ganador! ¡La fuerza está contigo!`;
  }
  // If Player's Bet Number wasn't Winning Number but was a winning bet
  else if (hits > 0){
    window.soundAPI.playWinRoundSound();
    resultsMessage += `Lamentablemente tu número seleccionado no ha sido el número ganador. Resistete al lado oscuro.`;
  }
  // If no Player's Bet was a winning bet
  else if (hits == 0){
    window.soundAPI.playLoseRoundSound();
    resultsMessage += `¡Lo has perdido todo! ¡La fuerza te ha abandonado!`;
  }

  await window.modalsAPI.showNotification(resultsMessage);

  // CHECK IF PLAYER HAS ENOUGH TOKENS TO PLAY
  // ----------------------------------------------------------------------------
  if (gameState.players[gameState.currentPlayerIndex].tokens < 1) {

    window.soundAPI.playNoTokensSound();
    await window.modalsAPI.showNotification('No tienes suficientes tokens para jugar. Su carencia de fe resulta molesta. ¡Márchate de aquí!');

    // If player's run out of tokens, he's sent back to Main Menu
    window.sceneLoaderAPI.loadMainMenuScene();
  }

}

// ================================================================================
// DEBUG FUNCTIONS
// ================================================================================

// Shift + N For Debug Options
document.addEventListener('keydown', async (event) => {
  if (event.shiftKey && event.key.toLowerCase() === 'n') {
    await window.modalsAPI.showDebugModal();
  }
});

function toggleAlwaysWin(isChecked) {
  return new Promise((resolve) => {
    const alwaysLoseCheckbox = document.getElementById('always-lose-checkbox');
    if (isChecked) {
      alwaysLoseCheckbox.checked = false;
      debugAPI.alwaysLose = false;
      debugAPI.alwaysWin = true;
      window.electron.logSystem('Debug', "log", 'Always Win Mode Activated');
    } else {
      window.electron.logSystem('Debug', "log", 'Always Win Mode Deactivated');
      debugAPI.alwaysWin = false;
    }
    resolve();
  });
}

function toggleAlwaysLose(isChecked) {
  return new Promise((resolve) => {
    const alwaysWinCheckbox = document.getElementById('always-win-checkbox');
    if (isChecked) {
      alwaysWinCheckbox.checked = false;
      debugAPI.alwaysWin = false;
      debugAPI.alwaysLose = true;
      window.electron.logSystem('Debug', "log", 'Always Lose Mode Activated');
    } else {
      window.electron.logSystem('Debug', "log", 'Always Lose Mode Deactivated');
      debugAPI.alwaysLose = true;
    }
    resolve();
  });
}


// ================================================================================
// GAME SCENE LAUNCHER
// ================================================================================

window.soloGame = {
  startSoloGame: () => {
      // Alpha method to switch Scene and Load Everything with a callback
      window.sceneLoaderAPI.loadSoloGameScene(() => {

      // Load all elements after DOM's loaded
      setupGameFunctions();
      window.modalsAPI.setupModalFunctions();

      // Trace Log Entry
      window.electron.logSystem(header, 'log', 'Single Player Launched Successfully.');
    });
  },
};

// ================================================================================
// EXPORTS
// ================================================================================

window.gameAPI = {
  ...gameAPI,
  gameState,
  gameUtils,
  selectedNumber,
  spinRoulette,
  tokensUI
};
