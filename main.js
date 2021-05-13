const electron = require('electron');
// const glob = require("glob");
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1200,
    fullscreen: false,
    frame: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  mainWindow.maximize();
  mainWindow.show();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const ipc = electron.ipcMain;

ipc.on('getFiles', (event, data) => {

  sendFileList(event);

});

ipc.on('goToDirectory', (event,directory) => {

  try {

    process.chdir(directory);
    sendFileList(event);
    
  } catch (error) {

    console.log(error);
    
  }

});

// function sendFileList(event){
//   glob("*", {dot: true} ,function (er, files) {
//     event.sender.send('files', files);
//   });
// }

function sendFileList(event){

  event.sender.send('clear');

  fs.readdir('./', { withFileTypes: true }, (err, files) => {

    // console.log("\nCurrent directory files:");

    // if (err)
    //   console.log(err);
    // else {
    //   files.forEach(file => {
    //     console.log(file);
    //   })
    // }

    const directories = files.filter(file => file.isDirectory()).map(file => file.name);
    const filesElements = files.filter(file => !file.isDirectory()).map(file => file.name);
    event.sender.send('directories',directories);
    event.sender.send('files',filesElements);

  });

}
