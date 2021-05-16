const ipc = require('electron').ipcRenderer;

let currentPath = '';

ipc.send('getFiles');

ipc.on('currentPath', (event, path) => {

    currentPath = path;
    displayPath();

});

ipc.on('clear',() => {clearFiles()});

ipc.on('directories', (event, directories) => {

    directories.forEach(directory => {
        addDirectoryElement(directory);
    });

});

ipc.on('files', (event, files) => {

    files.forEach(file => {
        addFileElement(file);
    });

});

function clickOnDirectory(fileName){

    ipc.send('goToDirectory',fileName);

}

function clickOnFile(fileName){

    ipc.send('clickOnFile',fileName);

}

function clearFiles(){

    document.getElementById("files").innerHTML = "";
    addDirectoryElement({name: "../"});

}

function addDirectoryElement(directory){

    const name = directory.name;

    let directoryElement = document.createElement("a");
    directoryElement.setAttribute("href","#");

    if(name != "../"){

        directoryElement.setAttribute("class","list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-primary");

    }

    else{

        directoryElement.setAttribute("class","list-group-item list-group-item-action list-group-item-success");

    }

    directoryElement.append(document.createTextNode(name));
    directoryElement.setAttribute("onClick","clickOnDirectory('" + name + "')");

    if(name != "../"){

        const date = directory.date;

        let badge = document.createElement("span");
        badge.setAttribute("class","badge bg-primary rounded-pill");
        badge.append(document.createTextNode(date));
        directoryElement.append(badge);

    }

    document.getElementById("files").append(directoryElement);

}

function addFileElement(file){

    const name = file.name;
    const date = file.date;

    let fileElement = document.createElement("a");
    fileElement.setAttribute("href","#");
    fileElement.setAttribute("class","list-group-item d-flex justify-content-between align-items-center list-group-item-action list-group-item-light");
    fileElement.append(document.createTextNode(name));
    // fileElement.setAttribute("onClick","clickOnFile('" + name + "')");
    let badge = document.createElement("span");
    badge.setAttribute("class","badge bg-primary rounded-pill");
    badge.append(document.createTextNode(date));
    fileElement.append(badge);
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