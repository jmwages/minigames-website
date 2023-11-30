games = []

window.onload = pullGames;

function pullGames() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleGamesResponse);
    xhr.responseType = "json";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/gamelist-data-service.php");
    xhr.send();
}

function handleGamesResponse() {
    if (this.status == 200) {
        games = this.response;   /* JSON data */
  
    } else {
        console.log("Something went wrong! :(");
    }

    gameList = document.getElementById("gameList");

    for (i in games) {
        newDiv = createDiv(games[i]);
        gameList.appendChild(newDiv)
    }
}

/**
 * creates a formatted div for the given game
 */
function createDiv(game) {
    outerDiv = document.createElement("div");
    outerDiv.classList.add("bg-secondary", "p-2", "shadow", "mt-3", "container", "row", "rounded");

    imgSrc = game.image;
    title = game.title;
    description = game.description;
    link = game.link;

    img = document.createElement("img");
    img.src = imgSrc;
    img.classList.add("col-md-3", "rounded-pill");
    outerDiv.appendChild(img); 

    text = document.createElement("div");
    text.classList.add("col-md-4", "mt-4");
    titleVis = document.createElement("h2");
    titleVis.innerHTML = title;
    descVis = document.createElement("span");
    descVis.innerHTML = description;

    text.appendChild(titleVis);
    text.appendChild(document.createElement("br"));
    text.appendChild(descVis);

    outerDiv.appendChild(text);

    complete = document.createElement("a");
    complete.appendChild(outerDiv);
    complete.href = link;

    return complete;
}