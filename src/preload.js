// ================================================================================
// IMPORTS
// ================================================================================

const path = require('path');
const tools = require(path.join(__dirname, 'scripts', 'tools.js'));
const { contextBridge } = require('electron');

// ================================================================================
// EXPORTS
// ================================================================================

contextBridge.exposeInMainWorld('electron', {
    logSystem: tools.logSystem,
});
