import {createRequire} from 'module';

const require = createRequire(import.meta.url);
import path from 'path';

const __dirname = path.resolve();

const {app, Tray, Menu, BrowserWindow} = require('electron/main')
const {spawn} = require('child_process');

let mainWindow;
let tray
let backendProcess;
const browserOption = {
    width          : 1720,
    height         : 860,
    minWidth       : 1440,
    minHeight      : 600,
    webPreferences : {
        nodeIntegration: true,
    },
    resizable      : true,
    autoHideMenuBar: true,
    show           : false,
    y              : 0,
    x              : 0,
    title : 'S'
}

const createWindow = async () => {
    mainWindow = new BrowserWindow(browserOption);
    await mainWindow.loadURL("http://localhost:3001/");
    mainWindow.on('closed', function () {
        mainWindow = null;
        if (backendProcess) backendProcess.kill();
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

function createTray() {
    tray = new Tray(`${__dirname}/src/assets/images/Autumn.jpg`);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Help',
            click: async () => {
                const manualWindow = new BrowserWindow(browserOption);
                await manualWindow.loadURL('https://thoracic-spring-58d.notion.site/29bb6d7c62584007ad8fa895f5e89973?pvs=4');
                manualWindow.show();
            },
        },
        {
            label: 'Start',
            click: () => {
                console.log(mainWindow.getSize())
                mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                app.quit();
            },
        },
    ]);

    tray.setToolTip('Seller Supporter');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        mainWindow.show();
    });

    mainWindow.on('close', function (event) {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
    });
}

const startBackend = () => {
    backendProcess = spawn('node', ['App.js'], {
        stdio: 'inherit',
        cwd  : __dirname,
    });
}


app.on('ready', () => {
    createWindow();
    createTray();
    startBackend();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// macOS 때문에 있음.
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
        startBackend();
    }
});