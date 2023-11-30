// variables for test values
hsSeconds = 63;
correctWord = "swag";
currentOpponent = sessionStorage.getItem("opponent");

timeElapsed = 0;

if (sessionStorage.getItem("username") != null) {
    username = sessionStorage.getItem("username");
} else {
    alert("You Must Be Signed In To Use This Page!")
    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/sign-in.html');
}

currentOpponent = sessionStorage.getItem("opponent"); // for testing

window.addEventListener("DOMContentLoaded", function () {
    setHighScore();
    grabTime = setInterval(getTime, 1000);

    clearOldData();
    setOpponent();
    renderHighScore();

    loadInterval = setInterval(loadDrawingData, 500);
    loadDrawingData(); // initially load data

    guessForm = document.querySelector("#guess-form");
    guessForm.addEventListener("submit", checkGuess);

    drawingImg = document.getElementById("drawing");
}
);

function setHighScore() {
    scoreVisual = document.getElementById("high-score");
    scoreVisual.innerHTML = Math.floor(hsSeconds / 3600) + " Hr, " + Math.floor((hsSeconds % 3600) / 60) + " Min, " + Math.floor((hsSeconds % 3600) % 60) + " Sec";
}

function getTime() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", renderTimer);
    xhr.responseType = "json";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/guessing-service.php?mode=get-time&opponent=" + currentOpponent);
    xhr.send();
}


function renderTimer() {
    if (this.status == 200) {
        timerVisual = document.querySelector("#timer>h1");
        timeElapsed = this.response;

        hr = Math.floor(timeElapsed / 3600);
        min = Math.floor((timeElapsed % 3600) / 60);
        sec = Math.floor((timeElapsed % 3600) % 60);

        timerVisual.innerHTML = convertVisual(hr) + ":" + convertVisual(min) + ":" + convertVisual(sec);

        function convertVisual(val) {
            if (val < 10) {
                return "0" + val;
            } else {
                return val;
            }
        }
    } else {
        console.log("Something Went Wrong When Trying to Retrieve Time");
    }
}

function setOpponent() {
    opponentVisual = document.getElementById("opponent-txt");

    opponentVisual.innerHTML = currentOpponent;
}

function checkGuess(event) {
    guessInput = document.getElementById("guess-input")
    guessedWord = (guessInput.value).toLowerCase();

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/guessing-service.php", true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
        // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        }
    };

    xhr.send("mode=setTime&user=" + username + "&guess=" + guessedWord);

    setHighScore();
    guessInput.value = "";
    event.preventDefault();
}


function loadDrawingData() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", processDrawingData);
    xhr.responseType = "json";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/guessing-service.php?mode=load-drawing&opponent=" + currentOpponent);
    xhr.send();
}

function processDrawingData() {
    if (this.status == 200) {
        response = this.response;
        drawingImg.src = decodeURIComponent(response);
        console.log("Image Loaded Sucessfully");
    } else {
        console.log("Image Unable to Load, Something Went Wrong");
    }
}

function clearOldData() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {});
    xhr.responseType = "text";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/guessing-service.php?mode=clearData&username=" + username);
    xhr.send();
}

function renderHighScore() {
    time = sessionStorage.getItem("highscore");
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

    document.getElementById("high-score").innerHTML = convertVisual(hr) + " Hr, " + convertVisual(min) + " Min, " + convertVisual(sec) + " Sec"
}







