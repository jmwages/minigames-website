<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);

if (isset($_GET["mode"]) && (isset($_GET["opponent"]))) {
    $opponent = $_GET["opponent"];

    if ($_GET["mode"] == "load-drawing") {
        $query = "SELECT link FROM `drawingdata` WHERE username = '$opponent'";

        $result = $mysqli->query($query);

        $correctLink = $result->fetch_assoc();

        header("Content-Type: text/plain");
        print($correctLink['link']);

    } else if ($_GET["mode"] == "get-time") {
        $query = "SELECT gametime FROM `drawingdata` WHERE username = '$opponent'";
        $result = $mysqli->query($query); 

        $correctTime = $result->fetch_assoc();

        print($correctTime['gametime']);
        
    } else {
        http_response_code(400);
        print("Error. No Opponent Provided");
    }
} else if ($_GET['mode'] = "clearData" && isSet($_GET['username'])) {
    $user = $_GET['username'];
    $query = "DELETE FROM guessingdata WHERE username = '$user'"; // makes sure no past data is stored

    $mysqli->query($query);
    print("Data Cleared");

} else if (isset($_GET["mode"]) && isset($_POST["user"]) && isset($_POST["guess"])){
    $user = $_POST["user"];
    $guess = $_POST["guess"];
    $query = "SELECT EXISTS (SELECT * FROM guessingdata WHERE username = '$user')";
    $result = $mysqli->query($query); 

    if ($result->fetch_row()[0] == 0) {
        $query = "INSERT INTO guessingdata VALUES ('$user', '$guess')";
    } else {
            $query = "UPDATE guessingdata SET guess = '$guess' WHERE username = '$user'";
    }

    $mysqli->query($query);

} else {
    http_response_code(400);
    print("Error. Not Enough Information Provided");
}
