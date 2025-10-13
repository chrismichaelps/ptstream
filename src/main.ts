import { ElectronBlocker } from '@cliqz/adblocker-electron';
import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import { UI_DIMENSIONS } from "../packages/constants";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: UI_DIMENSIONS.WINDOW.WIDTH,
    height: UI_DIMENSIONS.WINDOW.HEIGHT,
    resizable: false,
    autoHideMenuBar: true,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // If using Node.js features in the renderer
      contextIsolation: false, // Use this for compatibility with old code
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }


  // block ads
  ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInSession(session.defaultSession);
  });

  // Block popup windows and external views
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log('Popup blocked:', url);
    return { action: 'deny' }; // Block all popups
  });

  // Block new window requests
  mainWindow.webContents.on('did-attach-webview', (event) => {
    console.log('Webview attachment blocked');
    event.preventDefault();
  });

  // Block external navigation
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    console.log('External navigation blocked:', navigationUrl);
    event.preventDefault();
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
