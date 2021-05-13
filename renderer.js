const ipc = require('electron').ipcRenderer;

// document.getElementById('ipc').addEventListener('click', () => {
//     ipc.send('log-error');
// });

ipc.send('getFiles');

ipc.on('files', (event, files) => {

    files.forEach(fileName => {
        // console.log(element);
        let fileElement = document.createElement("li");
        fileElement.append(document.createTextNode(fileName));
        fileElement.setAttribute("value", fileName)
        document.getElementById("files").append(fileElement);
    });

});