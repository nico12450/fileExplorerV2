const ipc = require('electron').ipcRenderer;

// document.getElementById('ipc').addEventListener('click', () => {
//     ipc.send('log-error');
// });

ipc.send('getFiles');

ipc.on('clear',() => {clearFiles()});

ipc.on('directories', (event, directories) => {

    directories.forEach(directoryName => {
        addDirectoryElement(directoryName);
    });

});

ipc.on('files', (event, files) => {

    files.forEach(fileName => {
        addFileElement(fileName);
    });

});

function clickOnFile(fileName){

    ipc.send('goToDirectory',fileName);

}

function clearFiles(){

    document.getElementById("files").innerHTML = "";
    addDirectoryElement("../");

}

function addDirectoryElement(name){

    let directoryWrapperElement = document.createElement("a");
    directoryWrapperElement.setAttribute("href","#");
    let directoryElement = document.createElement("li");
    directoryElement.append(document.createTextNode(name));
    directoryElement.setAttribute("onClick","clickOnFile(this.innerHTML)");
    directoryWrapperElement.append(directoryElement);
    document.getElementById("files").append(directoryWrapperElement);

}

function addFileElement(name){

    let fileElement = document.createElement("li");
    fileElement.append(document.createTextNode(name));
    document.getElementById("files").append(fileElement);

}