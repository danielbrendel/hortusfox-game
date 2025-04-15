const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let cfgBuild;

function config(item)
{
    const filepath = path.resolve(__dirname, '..', item + '.json');
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
}

app.whenReady().then(() => {
    cfgBuild = config('build');
    
    mainWindow = new BrowserWindow({
        title: cfgBuild.name,
        width: cfgBuild.width,
        height: cfgBuild.height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true
        },
        icon: cfgBuild.icon
    });
    
    Menu.setApplicationMenu(null);
    mainWindow.loadFile(path.resolve(__dirname, '..', 'game', 'index.html'));
    mainWindow.maximize();
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});