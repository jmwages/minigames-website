if (sessionStorage.getItem("username") != null) {
    username = sessionStorage.getItem("username");
} else {
    alert("You Must Be Signed In To Use This Page!")
    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/sign-in.html');
}

window.addEventListener("DOMContentLoaded", function () {
    sessionStorage.removeItem("opponent");
    menu = document.getElementById("menu-form");
    guessSel = document.getElementById("guess");
    drawSel = document.getElementById("draw");
    form = document.getElementById("menu-form");
    opponentInput = document.getElementById("opponent");

    getHighScore();
    renderHighScore();

    guessSel.addEventListener("click", function () {
        menu.action = "guessing.html";
    });

    drawSel.addEventListener("click", function () {
        menu.action = "drawing.html";
    });

    form.addEventListener("submit", function (event) {
        if (opponentInput.value.trim() != "") {
        sessionStorage.setItem("opponent", opponentInput.value.trim());
        } else {
            event.preventDefault();
        }
    });
}
);

function getHighScore() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/highscore-service.php", true);

    // Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
        // Call a function when the state changes.
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            sessionStorage.setItem("highscore", xhr.response);
        }
    };


    xhr.send("user=" + username);
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