const ipc = require('electron').ipcRenderer;

// document.getElementById('ipc').addEventListener('click', () => {
//     ipc.send('log-error');
// });

ipc.send('getFiles');

ipc.on('files', (event, files) => {

    clearFiles();

    files.forEach(fileName => {
        // console.log(element);
        let fileElement = document.createElement("li");
        fileElement.append(document.createTextNode(fileName));
        fileElement.setAttribute("onClick","clickOnFile(this.innerHTML)");
        document.getElementById("files").append(fileElement);
    });

});

function clickOnFile(fileName){

    ipc.send('goToDirectory',fileName);

}

function clearFiles(){

    document.getElementById("files").innerHTML = "<li onClick='clickOnFile(this.innerHTML)'>../</li>";

}