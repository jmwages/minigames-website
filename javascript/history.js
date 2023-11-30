historyData = []

if (sessionStorage.getItem("username") != null) {
    username = sessionStorage.getItem("username");
} else {
    alert("You Must Be Signed In To Use This Page!")
    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/sign-in.html');
}

window.addEventListener("DOMContentLoaded", function () {
    searchDiv = document.getElementById("searchDiv")
    historyForm = document.getElementById("search-form");
    userInput = document.getElementById("opponent-username");
    errorMsg = document.getElementById("errorMsg");

    searchResults = document.getElementById("results");
    searchAgain = document.getElementById("searchAgain");
    gamesDiv = document.getElementById("games");

    historyForm.addEventListener("submit", function (event) {
        pullHistory(username, userInput.value);
        event.preventDefault();
    }
    );

    userInput.addEventListener("input", function () {
        errorMsg.innerHTML = "";
    });

    searchAgain.addEventListener("click", function () {
        results.classList.add("d-none");
        searchDiv.classList.remove("d-none");
        gamesDiv.innerHTML = "";
    });
}
);

/**
 * retrieves game history between the given user and the given opponent
 */
function pullHistory(username, opponent) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleHistoryResponse);
    xhr.responseType = "json";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/history-data-service.php?user=" + username + "&opponent=" + opponent);
    xhr.send();

}

/**
 * if the data has been retreived sucessfully then it is 
 * displayed in the window. If not the appropriate errors are thrown
 */
function handleHistoryResponse() {
    if (this.status == 200) {
        historyData = this.response;   /* JSON data */

        if (historyData.length > 0) {
            searchDiv.classList.add("d-none");
            results.classList.remove("d-none");
            userInput.value = "";
            for (i of historyData) {
                gamesDiv.appendChild(displayGame(i));
            }
        } else {
            errorMsg.innerHTML = "No History Found With User: " + userInput.value;
            console.log("Something went wrong! :(");
        }
    }
}

/**
 * returns a formatted div the given game history data
 */
function displayGame(game) {
    outerDiv = document.createElement("div");
    outerDiv.classList.add("bg-light", "p-4", "shadow", "mt-3", "container", "row", "rounded");

    imgSrc = decodeURIComponent(game.imgsrc);
    time = game.gametime;
    word = game.word;

    time = game.gametime;
    hr = Math.floor(time / 3600);
    min = Math.floor((time % 3600) / 60);
    sec = Math.floor((time % 3600) % 60);

    function convertVisual(val) {
        if (val < 10) {
            return "0" + val;
        } else {
            return val;
        }
    }

    img = document.createElement("img");
    img.src = imgSrc.substring(1, imgSrc.length - 1);
    img.classList.add("col-md-3");
    outerDiv.appendChild(img);

    text = document.createElement("div");
    text.classList.add("col-md-7", "mt-3");
    timeVis = document.createElement("h2");
    timeVis.innerHTML = "Your Time Was: " + convertVisual(hr) + " hr " + convertVisual(min) + " min " + convertVisual(sec) + " sec";
    wordVis = document.createElement("h1");
    wordVis.innerHTML = "Your Word Was: " + word;

    text.appendChild(timeVis);
    text.appendChild(document.createElement("br"));
    text.appendChild(wordVis);

    outerDiv.appendChild(text);

    return outerDiv
}