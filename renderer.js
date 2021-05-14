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

    let directoryElement = document.createElement("a");
    directoryElement.setAttribute("href","#");
    directoryElement.setAttribute("class","list-group-item list-group-item-action list-group-item-primary");
    directoryElement.append(document.createTextNode(name));
    directoryElement.setAttribute("onClick","clickOnFile(this.innerHTML)");
    document.getElementById("files").append(directoryElement);

}

function addFileElement(name){

    let fileElement = document.createElement("a");
    fileElement.setAttribute("href","#");
    fileElement.setAttribute("class","list-group-item list-group-item-action list-group-item-light");
    fileElement.append(document.createTextNode(name));
    document.getElementById("files").append(fileElement);

}