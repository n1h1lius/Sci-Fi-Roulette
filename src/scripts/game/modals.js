// ================================================================================
// MAIN VARS
// ================================================================================

const modals_header = '<MODALS>'

let betModal, playerBetText, betAmountInput, betAcceptButton, betCancelButton, betLogFrame, totalBetInt;
let modal, messageElement, closeButton;
let debugModal, debugCloseButton, alwaysWinCheckbox, alwaysLoseCheckbox, alwaysPushCheckbox;
let rulesModal, rulesTextFrame, showRulesButton, hideRulesButton;

const colorDictionary = {
  'numero rojo': 'Sith',
  'numero negro': 'Jedi',
  'numero cero': 'Verde'
}

// ================================================================================
// MAIN FUNCTIONS
// ================================================================================

  function setupRulesModalVars(rulesModalId, rulesButtonId, rulesCloseButtonId, rulesTextFrameId){
    /* This function is intended to be used when called from main, so it does not load all modal functions. Just Rules Modal*/

    rulesModal = document.getElementById(rulesModalId);
    rulesTextFrame = document.getElementById(rulesTextFrameId);
    showRulesButton = document.getElementById(rulesButtonId);
    hideRulesButton = document.getElementById(rulesCloseButtonId);
    
    showRulesButton.onclick = () => {
      window.soundAPI.playClickSound();
      showRulesModal();
    }

    showRulesButton.addEventListener('mouseenter' , () => {
      window.soundAPI.playHoverSound();
    });

  }

  function setupModalFunctions(){
    /* This functions makes sure every html element is fetch after DOM is loaded */

    // BET MODAL VARS
    betModal = document.getElementById('bet-modal');
    playerBetText = document.getElementById('player-bet-text');
    betAmountInput = document.getElementById('bet-amount-input');
    betAcceptButton = document.getElementById('accept-bet-button');
    betCancelButton = document.getElementById('cancel-bet-button');
    betLogFrame = document.getElementById('bet-logs');
    totalBetInt = document.getElementById('total-bet-int');

    // NOTIFICATION MODAL VARS
    modal = document.getElementById('notification-modal');
    messageElement = document.getElementById('notification-message');
    closeButton = document.getElementById('modal-close-button');

    // RULES MODAL VARS
    setupRulesModalVars('rules-modal', 'rules-button', 'rules-modal-close-button', 'rules-scrollable');

    // DEBUG VARS
    debugModal = document.getElementById('debug-modal');
    debugCloseButton = document.getElementById('debug-close-button');
    alwaysWinCheckbox = document.getElementById('always-win-checkbox');
    alwaysLoseCheckbox = document.getElementById('always-lose-checkbox');

  }

// ================================================================================
// BET MODAL FUNCTIONS
// ================================================================================

  function appendBetLog(message, pressedButton, playerBets, betAmount) {
    /* This function handles the creation and appending of bet logs to the bet log frame */

    window.electron.logSystem(modals_header, 'log', `Storing Bet in Bet Logs - ${message}`);

    // LOG ENTRY DIV
    // ----------------------------------------------------------------------------
    const logEntry = document.createElement('div');
    logEntry.style.display = 'flex';
    logEntry.style.justifyContent = 'space-between';
    logEntry.style.alignItems = 'center';
    logEntry.className = 'entry-bet-log';

    // LOG ENTRY TEXT STORED IN P
    // ----------------------------------------------------------------------------
    const newLine = document.createElement('p'); 
    newLine.textContent = message; 
    newLine.style.margin = '0'; 
    newLine.style.flexGrow = '1';
    newLine.className = 'text-bet-log';

    // LOG ENTRY DELETE BUTTON
    // ----------------------------------------------------------------------------
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.style.marginLeft = '10px';
    deleteButton.className = "delete-bet-button";

    // Handling Button Logic
    deleteButton.onclick = () => {

      for (let i = 0; i < playerBets.length; i++) {

        if (playerBets[i].number == pressedButton) {
          // Play delete sound
          window.soundAPI.playDeleteBetSound();

          // Restore tokens on Player's Pool
          window.gameAPI.gameState.players[window.gameAPI.gameState.currentPlayerIndex].totalBet += playerBets[i].betAmount; 

          // Substract bet amount from HUD
          const currentPLayerTotalBet = Number(totalBetInt.textContent);
          totalBetInt.textContent = currentPLayerTotalBet - playerBets[i].betAmount

          // Delete bet object from Player Stored Bets
          playerBets.splice(i, 1);

          // Trace Log Entry
          window.electron.logSystem(modals_header, 'log', `Bet Deleted from Player Bets`);

          // Terminate loop for deletion has been completed
          break; 
        }
      }

      // Delete log entry from Bet Logs Frame
      logEntry.remove();

      // Trace Log Entry
      window.electron.logSystem(modals_header, 'log', `Bet Deleted Successfully - ${message}`);
    };

    // Handling Hover Button
    deleteButton.addEventListener('mouseenter' , () => {
      window.soundAPI.playHoverSound();
    });
    
    // ADDING LOG ENTRIES TO LOG FRAME
    // ----------------------------------------------------------------------------

    // Adding text and button to Log Entry
    logEntry.appendChild(newLine);
    logEntry.appendChild(deleteButton);

    // Adding Log Entry Container (div) to Log Frame
    betLogFrame.appendChild(logEntry);

    // Focus on the last log entry
    betLogFrame.scrollTop = betLogFrame.scrollHeight;

    // Trace Log Entry
    window.electron.logSystem(modals_header, 'log', `Apuesta Guardada - ${message}`);
  }

  function showBetModal(pressedButton, classButton) {
    /* This function handles showing Bet Modal and its logic related to handling player's bet */

    // Reset input stored value before showing modal
    betAmountInput.value = '';

    // Customize text to reflect which button was pressed (Number/Specific Bet)
    if (classButton in colorDictionary){playerBetText.textContent = `Apuesta al ${pressedButton} ${colorDictionary[classButton]}`;}
    else {playerBetText.textContent = `Apuesta a ${pressedButton}`;}

    // Show bet Modal
    betModal.style.display = 'block';

    // Trace Log Entry
    window.electron.logSystem(modals_header, 'log', "Show bet modal toggled on");

    // Modal Expansion Animation
    betModal.style.animation = 'fadeIn 0.5s forwards';
    betModal.querySelector('.modal-content').style.animation = 'modalExpand 0.5s forwards';

    // ----------------------------------------------------------------------------
    // HANDLING BET LOGIC
    // ----------------------------------------------------------------------------

    const currentPLayerTotalBet = Number(totalBetInt.textContent);
    const players = window.gameAPI.gameState.players;
    const playerIndex = window.gameAPI.gameState.currentPlayerIndex
    const playerBets = players[playerIndex].currentBet;
    const playerTokens = players[playerIndex].tokens;

    // PLAYER ACCEPTS BET - [ACCEPT BUTTON]
    // ----------------------------------------------------------------------------
    betAcceptButton.onclick = () => {
        // Check if player has enough tokens to make the bet
        const betAmount = parseInt(betAmountInput.value, 10);

        if (isNaN(betAmount) || betAmount <= 0) {
          window.soundAPI.playErrorSound();
          showNotification("Cantidad de tokens introducida no válida.");
          return;
        }

        else if (betAmount + currentPLayerTotalBet > playerTokens){
          window.soundAPI.playErrorSound();
          showNotification(`No tienes suficientes tokens para realizar esta apuesta.<br><br>Apuesta: ${betAmount} - Apuesta Total: ${currentPLayerTotalBet} - Tokens: ${playerTokens}`);
          return;
        }

        // Handling bet in case Player has enough tokens
        else {
          
          // Trace Log Entry
          window.electron.logSystem(modals_header, 'log', `Bet Application Received. Calculating Bet`);

          // Check all player bets to see if current bet has been already done
          for (apuesta of playerBets){
            if (apuesta.number == pressedButton){
              window.soundAPI.playErrorSound();
              showNotification("Ya has apostado a esta apuesta. Si deseas modificar la apuesta original, borra la apuesta anterior y hazla de nuevo");
              return;
            }
          }

          // Substract tokens from Player's Pool
          window.gameAPI.gameState.players[window.gameAPI.gameState.currentPlayerIndex].totalBet -= betAmount; 

          // Store Bet Object on Player's Bets List
          playerBets.push({number: pressedButton, color: colorDictionary[classButton], betAmount: betAmount});

          // Trace Log Entry
          window.electron.logSystem(modals_header, 'log', `Bet Stored in Player Bets || Player: ${playerIndex} || Total Bets: ${playerBets}`);
          
          // Updating Bet Log HUD
          window.electron.logSystem(modals_header, 'log', `Bet Accepted. Generating Bet Log Entry`);
          const message = `Apuesta de ${betAmount} tokens al ${pressedButton} ${classButton in colorDictionary ? colorDictionary[classButton] : ''}`;
          appendBetLog(message, pressedButton, playerBets, betAmount);

          // Updating total Bet HUD
          totalBetInt.textContent = currentPLayerTotalBet + betAmount;

          // Trace Log Entry
          window.electron.logSystem(modals_header, 'log', `Bet Log Generated Successfully.`);

        }

        // Hide Bet Modal once Bet has been generated and accepted
        hideBetModal(betAmount === 66);
    };

    // PLAYER CANCELS BET - [CANCEL BUTTON]
    // ----------------------------------------------------------------------------
    betCancelButton.onclick = () => {
        hideBetModal();
    };
  }

  function hideBetModal(order66=false) {
    /* This function handles hiding Bet Modal */

    // Generate a promise so it can be awaited
    return new Promise((resolve) => {
      // Easter Egg for 66 Tokens Bet
      if (order66){window.soundAPI.playOrder66Sound();}
      else {window.soundAPI.playClickGameSound();}
    
      // Hide Bet Modal Animation
      betModal.style.animation = 'fadeOut 0.5s forwards';

      // Await for Animation termination with "Animationed"
      betModal.addEventListener('animationend', () => {

      // Hide Bet Modal
      betModal.style.display = 'none';

      // Resolve promess to stop awaiting process
      resolve();

      // Trace Log Entry
      window.electron.logSystem(modals_header, 'log', "Show bet modal toggled off");

      }, { once: true }); // Make sure listener is executed only once
    });
  }

// ================================================================================
// NOTIFICATION MODAL FUNCTIONS
// ================================================================================

  function showNotification(message) {
    /* This function handles showing Notification Modal */

    // Generate a promise so it can be awaited
    return new Promise((resolve) => {
      // Setting Message Before Showing Modal
      messageElement.innerHTML = message;

      // Show Modal
      modal.style.display = 'block';

      // Trace Log Entry
      window.electron.logSystem(modals_header, 'log', "Show notification modal toggled on");

      // Modal Expansion Animation (Red Style)
      modal.style.animation = 'fadeIn 0.5s forwards';
      modal.querySelector('.modal-content').style.animation = 'modalExpand-red 0.5s forwards';

      // Handling Modal Termination
      closeButton.onclick = async () => {
        // Await Hiding Modal
        await hideNotification(); 
        // Resolve Notification Modal 
        resolve();
      };
    });
  }
  
  function hideNotification() {
    /* This function handles hiding Notification Modal */

    window.soundAPI.playClickGameSound();

    // Generate a promise so it can be awaited
    return new Promise((resolve) => {

      // Hiding Modal Animation
      modal.style.animation = 'fadeOut 0.5s forwards';

      // Await for Animation termination with "Animationed"
      modal.addEventListener('animationend', () => {
        // Hide Notification Modal
        modal.style.display = 'none';

        // Detach Event Listener
        closeButton.removeEventListener('click', hideNotification);

        // Resolve promess to stop awaiting process
        resolve();
        
        // Trace Log Entry
        window.electron.logSystem(modals_header, 'log', "Show notification modal toggled off");

      }, { once: true }); // Make sure listener is executed only once
    });
  }
 
// ================================================================================
// RULES MODAL FUNCTIONS
// ================================================================================

function showRulesModal() {
  /* This function handles showing Rules Modal */

  // Generate a promise so it can be awaited
  return new Promise((resolve) => {

    // Focus on top text frame (Scroll-up)
    rulesTextFrame.scrollTop = 0;
    
    // Show Modal
    rulesModal.style.display = 'block';

    // Trace Log Entry
    window.electron.logSystem(modals_header, 'log', "Show rules modal toggled on");

    // Modal Expansion Animation (Red Style)
    rulesModal.style.animation = 'fadeIn 0.5s forwards';
    rulesModal.querySelector('.modal-content').style.animation = 'modalExpand-red 0.5s forwards';

    // Handling Modal Termination
    hideRulesButton.onclick = async () => {
      // Await Hiding Modal
      await hideRulesModal(); 
      // Resolve Notification Modal 
      resolve();
    };
  });
}

function hideRulesModal() {
  /* This function handles hiding Rules Modal */

  window.soundAPI.playClickGameSound();

  // Generate a promise so it can be awaited
  return new Promise((resolve) => {

    // Hiding Modal Animation
    rulesModal.style.animation = 'fadeOut 0.5s forwards';

    // Await for Animation termination with "Animationed"
    rulesModal.addEventListener('animationend', () => {
      // Hide Rules Modal
      rulesModal.style.display = 'none';

      // Detach Event Listener
      hideRulesButton.removeEventListener('click', hideRulesModal);

      // Resolve promess to stop awaiting process
      resolve();
      
      // Trace Log Entry
      window.electron.logSystem(modals_header, 'log', "Show rules modal toggled off");

    }, { once: true }); // Make sure listener is executed only once
  });
}


// ================================================================================
// DEBUG MODAL FUNCTIONS (DEPRECATED)
// ================================================================================
function showDebugModal() {
    return new Promise((resolve) => {

      debugModal.style.display = 'block';
      debugModal.addEventListener('transitionend', resolve, { once: true });

      document.getElementById('always-win-checkbox').addEventListener('change', async (event) => {
      await toggleAlwaysWin(event.target.checked);
      });
  
      document.getElementById('always-lose-checkbox').addEventListener('change', async (event) => {
      await toggleAlwaysLose(event.target.checked);
      });
  
      document.getElementById('debug-close-button').addEventListener('click', async () => {
      await hideDebugModal();
      });
  
    });
  }

  function hideDebugModal() {
    window.soundAPI.playClickGameSound();
    return new Promise((resolve) => {
      const debugModal = document.getElementById('debug-modal');
      debugModal.style.display = 'none';
      debugModal.addEventListener('transitionend', resolve, { once: true });
    });
  }

// ================================================================================
// EXPORTS
// ================================================================================

  window.modalsAPI = {
    setupModalFunctions,
    setupRulesModalVars,
    showBetModal,
    showNotification,
    hideNotification,
    showRulesModal,
    hideRulesModal,
    showDebugModal,
    hideDebugModal
  }