const ipc = require('electron').ipcRenderer;

let currentPath = '';

ipc.send('getFiles');

ipc.on('currentPath', (event, path) => {

    currentPath = path;
    displayPath();

});

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

function displayPath(){

    let pathList = currentPath.split('\\');
    let navbar = document.getElementById('navbar');
    let associatedPath = '';
    navbar.innerHTML = "";

    for(let i = 0; i<pathList.length; i++){

        associatedPath += pathList[i]
        let navbarItem = document.createElement("li");

        if(i<pathList.length-1){
            navbarItem.setAttribute("class","breadcrumb-item");
            associatedPath += '/';
        }
        else{
            navbarItem.setAttribute("class","breadcrumb-item active");
            navbarItem.setAttribute("aria-current", "page");
        }

        navbarItem.setAttribute("onClick","goToPath('" + associatedPath + "')");

        let navBarTextElement = document.createElement("a");
        navBarTextElement.setAttribute("href","#");
        navBarTextElement.append(document.createTextNode(pathList[i]));

        navbarItem.append(navBarTextElement);
        navbar.append(navbarItem);

    }

}

function goToPath(path){
    ipc.send('goToPath', path);
}