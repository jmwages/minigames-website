
window.addEventListener("DOMContentLoaded", function() {
    signinForm = document.getElementById("signin-form")
    signinUsername = document.getElementById("signin-username");
    signinPassword = document.getElementById("signin-password");

    createForm = document.getElementById("create-form")
    createUsername = document.getElementById("c-username");
    createPassword = document.getElementById("c-password");
    createPasswordConf = document.getElementById("c-password-confirm");
    
    

    errorMsg = document.getElementById("error-msg");
    signinErrorMsg = document.getElementById("signin-error-msg");

    username = ""
    password = ""

    createForm.addEventListener("submit", function(event) {
        usernameError = false;
        passwordLenError = false;
        passwordMatchError = false;
        errorMsg.innerHTML = "";
        errorString = ""

        username = createUsername.value.trim().toLowerCase();
        password = createPassword.value.trim();

        if (username.length < 5 || username.length > 25) {
            usernameError = true;
        }

        if (password.length < 8) {
            passwordLenError = true;
        }

        if (password != createPasswordConf.value.trim()) {
            passwordMatchError = true;
        }

        if (usernameError) {
            errorString += "Username Must be at Between 5 And 25 Characters <br>";
            event.preventDefault();
        }
        if (passwordLenError) {
            errorString += "Password Must be at Least 8 Characters <br>";
            event.preventDefault();
        }
        if (passwordMatchError) {
            errorString += "Passwords Do Not Match <br>";
            event.preventDefault();
        } else {
            uploadNewUser(event);
        }

        errorMsg.innerHTML = errorString;
    });

    signinForm.addEventListener("submit", function(event) {
        un = signinUsername.value.trim().toLowerCase();
        pw = signinPassword.value.trim();

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/account-service.php", true);

        // Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = () => {
            // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                if(xhr.responseText == "") {
                    console.log("yipee"); 
                    sessionStorage.setItem("username", un);
                    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/home.html?');
                } else {
                    signinErrorMsg.innerHTML = xhr.responseText;
                    signinPassword.value = "";
                    event.preventDefault();
                } 
            }
        };

        event.preventDefault();
        xhr.send("mode=login&username="+un+"&password="+pw);
    });

    signinUsername.addEventListener("input", function(event) {
        signinErrorMsg.innerHTML = "";
    });

    signinPassword.addEventListener("input", function(event) {
        signinErrorMsg.innerHTML = "";
    });
});

function uploadNewUser(event) {
    let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://10.16.14.104/~jeanmarc/cp4-sql/data-service/account-service.php", true);

        // Send the proper header information along with the request
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = () => {
            // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                if(xhr.responseText == "") {
                    console.log("yipee");
                    sessionStorage.setItem("username", un);
                    window.location.assign('http://10.16.14.104/~jeanmarc/cp4-sql/home.html?');
                } else {
                    errorMsg.innerHTML = xhr.responseText
                    event.preventDefault();
                }
            }
        };

        event.preventDefault();
        xhr.send("mode=newUser&username="+username+"&password="+password);
}

