// ================================================================================
// IMPORTS
// ================================================================================

const path = require('path');

const { app, BrowserWindow} = require('electron');
const { logSystem } = require(path.join(__dirname, 'scripts', 'tools.js'));

// ================================================================================
// LOGS
// ================================================================================

header = '<MAIN>';
newSession = '///// ################################\n///// NEW SESSION\n///// ################################\n';

logSystem(1, 'info', newSession, true);

// ================================================================================
// CREATE WINDOW
// ================================================================================

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1000,
        height: 600,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    });

    win.loadFile('index.html');
}

// ================================================================================
// INIT
// ================================================================================

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
