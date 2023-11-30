// timer variable
timeElapsed = 0;
currentScore = 0;

currentColor = '#000000';
currentSize = 8;

if (sessionStorage.getItem("username") != null) {
    username = sessionStorage.getItem("username");
} else {
    alert("You Must Be Signed In To Use This Page!")
    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/sign-in.html');
}

opponent = sessionStorage.getItem("opponent");

// Get a reference to the canvas element and its 2d rendering context
window.addEventListener("DOMContentLoaded", function () {
    tick = setInterval(renderTimer, 1000);
    checkInterval = setInterval(checkGuess, 1000);

    clearOldData();
    loadWord();
    setOpponent();
    renderHighScore();

    const canvas = document.getElementById("drawArea");
    const ctx = canvas.getContext("2d");

    word = "Loading"

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Event listeners for mouse down, mouse up, and mouse move
    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", function () {
        isDrawing = false
        sendImg();
    });
    canvas.addEventListener("mouseout", function () {
        isDrawing = false
        sendImg();
    });

    // Function to draw on the canvas
    function draw(e) {
        if (!isDrawing) return;

        ctx.strokeStyle = currentColor; // Set the stroke color
        ctx.lineWidth = currentSize; // Set the line width
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(lastX, lastY + 12);
        ctx.lineTo(e.offsetX, e.offsetY + 12);
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function sendImg() {
        link = encodeURIComponent(canvas.toDataURL());

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php", true);

        // Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = () => {
            // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log("image sent")
            }
        };


        xhr.send("mode=uploadDrawing&user=" + username + "&link=" + JSON.stringify(link));
    }

    clearBtn = document.getElementById("clearCanvas");
    eraseBtn = document.getElementById("eraseBtn");
    blackBtn = document.getElementById("blackBtn");
    redBtn = document.getElementById("redBtn");
    greenBtn = document.getElementById("greenBtn");
    blueBtn = document.getElementById("blueBtn");

    smallBtn = document.getElementById("smallBtn");
    medBtn = document.getElementById("medBtn");
    lgBtn = document.getElementById("lgBtn");

    clearBtn.addEventListener("click", function() {ctx.clearRect(0, 0, canvas.width, canvas.height);});
    eraseBtn.addEventListener("click", function() {currentColor = '#FFFFFF';});
    blackBtn.addEventListener("click", function() {currentColor = '#000000';});
    redBtn.addEventListener("click", function() {currentColor = '#FF0000';});
    greenBtn.addEventListener("click", function() {currentColor = '#006000';});
    blueBtn.addEventListener("click", function() {currentColor = '#0000FF';});

    smallBtn.addEventListener("click", function() {
        currentSize = 8;
        smallBtn.classList.add("active");
        medBtn.classList.remove("active");
        lgBtn.classList.remove("active");
    });
    medBtn.addEventListener("click", function() {
        currentSize = 16;
        smallBtn.classList.remove("active");
        medBtn.classList.add("active");
        lgBtn.classList.remove("active");
    });
    lgBtn.addEventListener("click", function() {
        currentSize = 32;
        smallBtn.classList.remove("active");
        medBtn.classList.remove("active");
        lgBtn.classList.add("active");
    });

}
);

function setOpponent() {
    opponentVisual = document.getElementById("opponent-txt");

    opponentVisual.innerHTML = opponent;
}

function loadWord() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", renderWord);
    xhr.responseType = "text";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php?mode=getWord");
    xhr.send();
}

function renderWord() {
    if (this.status == 200) {
        word = this.response;
        document.getElementById("subject").innerHTML = word;
    } else {
        console.log("Problem loading word");
    }
}

function checkGuess() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", handleGuessResponse);
    xhr.responseType = "text";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php?mode=checkGuess&opponent=" + opponent);
    xhr.send();
}

function handleGuessResponse() {
    if (this.status == 200) {
        if (word == this.response) {
            console.log("guess '" + this.response + "' correct");
            gameOver();
        } else {
            console.log("guess '" + this.response + "' incorrect")
        }

    } else {
        console.log("Problem loading word");
    }
}

function renderTimer() {
    timerVisual = document.querySelector("#timer>h1");

    timeElapsed++;
    sendTime();

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
}

function sendTime() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php", true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
        // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            //console.log(timeElapsed);
            //console.log("time sent")
        }
    };


    xhr.send("mode=setTime&user=" + username + "&time=" + timeElapsed);
}

function gameOver() {
    clearInterval(tick);
    clearInterval(checkInterval);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php", true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
        // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("History Uploaded Successfully");
        }
    };


    xhr.send("mode=uploadHistory&user=" + username + "&opponent=" + opponent + "&word=" + word);

    document.getElementById("subject").innerHTML = opponent + " Guessed The Word!";
}

function clearOldData() {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {});
    xhr.responseType = "text";
    xhr.open("GET", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/drawing-service.php?mode=clearData&username=" + username);
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



