<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);

if (isSet($_POST["mode"]) && isSet($_POST["username"]) && isSet($_POST["password"])) {
    $mode = $_POST["mode"];
    $un = trim($_POST["username"]);
    $pw = rawurlencode(trim($_POST["password"]));

    if ($mode == "newUser") {
        if (strlen($un) < 5 || strlen($un) > 25) {
            print("Username Must be at Between 5 And 25 Characters");
        } 
        if (strlen($pw) < 8) {
            print("Password Must be at Least 10 Characters");
        }
        if ( (strlen($un) < 5 || strlen($un) > 25) || (strlen($pw) < 10) ) {
            die;
        }

        $query = "SELECT EXISTS (SELECT * FROM accounts WHERE username = '$un')";
        $result = $mysqli->query($query); 

        if ($result->fetch_row()[0] == 0) {
            $pw = password_hash($pw, PASSWORD_BCRYPT);
            $query = "INSERT INTO accounts VALUES ('$un', '$pw')";
            $mysqli->query($query); 
        } else {
            print("Username Already Taken");
            die;
        }   
    } else if ($mode == "login") {
        $query = "SELECT EXISTS (SELECT * FROM accounts WHERE username = '$un')";
        $result = $mysqli->query($query); 

        if ($result->fetch_row()[0] == 0) {
            print("No Account Found");
            die;
        }

        $query = "SELECT pass FROM accounts WHERE username = '$un'";
        $result = $mysqli->query($query); 
        $result = $result->fetch_row()[0];

        if (password_verify($pw, $result)) {
            print("");
        } else {
            print("Username or Password Incorrect");
        }   

    }


}