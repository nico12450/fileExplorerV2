const electron = require('electron');
// const glob = require("glob");
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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

  // mainWindow.maximize();
  mainWindow.show();
  mainWindow.setMenu(null);
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

ipc.on('goToPath', (event, path) => {

  try{

    process.chdir(path);
    sendFileList(event);

  }
  catch (error){

    console.log(error);

  }


});

// ipc.on('clickOnFile', (event, fileName) => {

//   console.log(getFileSize(fileName));

// });

function sendFileList(event){

  event.sender.send('clear');
  event.sender.send('currentPath', process.cwd());

  fs.readdir('./', { withFileTypes: true }, (err, files) => {

    const directories = files.filter(file => file.isDirectory()).map(file => {return {name: file.name, date: getCreationDate(file.name)}});
    const filesElements = files.filter(file => !file.isDirectory()).map(file => {return {name: file.name, date: getCreationDate(file.name), size: getFileSize(file.name)}});
    event.sender.send('directories',directories);
    event.sender.send('files',filesElements);

  });

}

function getFileInfos(fileName){
  return fs.statSync('./'+fileName);
}

function getCreationDate(fileName){

  const fileInfos = getFileInfos(fileName);
  const fileDate = fileInfos.birthtime;

  return fileDate.toLocaleDateString() + " " + fileDate.toLocaleTimeString();
}

function getFileSize(fileName){

  const fileInfos = getFileInfos(fileName);
  const fileSize = fileInfos.size;

  if (fileSize < 1024){

    return fileSize + ' octets';

  }
  else if(fileSize < 1024*1024){

    return Math.round(fileSize / 1024) + ' Ko';

  }
  else if(fileSize < 1024*1024*1024){

    return Math.round(fileSize / (1024*1024)) + ' Mo';

  }
  else if(fileSize < 1024*1024*1024*1024){

    return Math.round(fileSize / (1024*1024*1024)) + ' Go';

  }

  return Math.round(fileSize / (1024*1024*1024*1024)) + ' To';

}
