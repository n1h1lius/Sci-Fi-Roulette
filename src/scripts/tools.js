// ================================================================================
// IMPORTS
// ================================================================================

const fs = require('fs');
const path = require('path');

// ================================================================================
// MAIN VARS
// ================================================================================

const verbose = true;       // Enables Log Verbose Mode - False for no log
const outputLog = true;     // Enables Log Output to TXT log file - False for no output log file
const outputConsole = true; // Enables Log Output on Console - False for no output log console 

// ================================================================================
// LOG SYSTEM FUNCTION
// ================================================================================

function checkLogDir() {
    const logsPath = path.join(__dirname, '../../bin/logs');

    // Check if full path exists
    if (!fs.existsSync(logsPath)) {

        // Check if bin folder exists and create one if not
        const binPath = path.join(__dirname, '../../bin');
        if (!fs.existsSync(binPath)) {
            fs.mkdirSync(binPath);
        }

        // Create logs folder inside bin folder
        fs.mkdirSync(logsPath);

    }
}
function logSystem(sender, level, message, isNewSession = false) {

    if (verbose) {
        const date = new Date().toISOString();
        const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const logMessage = `///// ${sender} || [${level.toUpperCase()}] || (${date}) -> ${message}\n`;

        // OUTPUT IN LOG TXT FILE
        // ----------------------------------------------------------------------------
        if (outputLog) {
            
            const logFilePath = path.join(__dirname, `../../bin/logs/${formattedDate}.txt`);

            if (isNewSession) {
                // Check if Logs Folder exists
                checkLogDir();
                // If this is a new session writes a header on log file to identify sessions
                fs.appendFile(logFilePath, message, (err) => {if(err){console.error(`Can't edit Log File: ${err}`)}});
                
            } else {
                // Store output in txt file
                fs.appendFile(logFilePath, logMessage, (err) => {if (err) {console.error(`Can't edit Log File: ${err}`);}});

            }
        }

        // OUTPUT IN CONSOLE
        // ----------------------------------------------------------------------------
        if (outputConsole) {

            switch (level) {
                case 'info':
                    console.info(logMessage);
                    break;
                case 'warn':
                    console.warn(logMessage);
                    break;
                case 'error':
                    console.error(logMessage);
                    break;
                default:
                    console.log(logMessage);
            }

        }

    }
}

// ================================================================================
// EXPORTS
// ================================================================================

module.exports = { logSystem };

