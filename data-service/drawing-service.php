<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);


if (isset($_POST["mode"])) {

    if (($_POST["mode"] == "uploadDrawing") && isset($_POST["user"]) && isset($_POST["link"])) {
        $user = $_POST["user"];
        $link = $_POST["link"];
        $query = "SELECT EXISTS (SELECT * FROM drawingdata WHERE username = '$user')";
        $result = $mysqli->query($query); 

        if ($result->fetch_row()[0] == 0) {
            $query = "INSERT INTO drawingdata VALUES ('$user', '$link', 0)";
        } else {
            $query = "UPDATE drawingdata SET link = '$link' WHERE username = '$user'";
        }

       $mysqli->query($query);

    } else if (($_POST["mode"] == "setTime") && isset($_POST["user"]) && isset($_POST["time"])) {
        $user = $_POST["user"];
        $time = $_POST["time"];
        $query = "SELECT EXISTS (SELECT * FROM drawingdata WHERE username = '$user')";
        $result = $mysqli->query($query); 

        if ($result->fetch_row()[0] == 0) {
            $query = "INSERT INTO drawingdata VALUES ('$user', ' ', '$time')";
        } else {
            $query = "UPDATE drawingdata SET gametime = '$time' WHERE username = '$user'";
        }

        $mysqli->query($query);
        
    } else if (($_POST["mode"] == "uploadHistory") && isset($_POST["user"]) && isset($_POST["opponent"]) && isset($_POST["word"])) {
        $user = $_POST["user"];
        $opp = $_POST["opponent"];
        $word = $_POST["word"];
        $query = "SELECT * FROM drawingdata WHERE username = '$user'";
        $result = $mysqli->query($query); 
        $gameData = $result->fetch_assoc();

        $link = $gameData['link'];
        $time = $gameData['gametime'];

        $query = "INSERT INTO historydata VALUES ('$user', '$opp', '$link', $time, '$word')";
        $mysqli->query($query);

        $query = "DELETE FROM drawingdata WHERE username = '$user'"; // deletes the game from the drawing database
        $mysqli->query($query);

        $query = "DELETE FROM guessingdata WHERE username = '$opp'"; // deletes the game from the guessing database
        $mysqli->query($query);
        
    } else {
        http_response_code(400);
        print("Error. Not Enough Information Provided");
    } 

} else if (isset($_GET["mode"]) && ($_GET["mode"] == "getWord")) {
    $wordsList = file_get_contents("pictionary-words.txt");
    $wordsList = explode("\n", $wordsList);

    print $wordsList[array_rand($wordsList, 1)];

} else if (isset($_GET["mode"]) && ($_GET["mode"] == "checkGuess") && isset($_GET["opponent"])) {
    $opponent = $_GET['opponent'];
    $query = "SELECT guess FROM `guessingdata` WHERE username = '$opponent'";
    $result = $mysqli->query($query); 

    $foundWord = $result->fetch_assoc();

    print($foundWord['guess']);

} else if (isset($_GET["mode"]) && ($_GET["mode"] == "clearData") && isset($_GET["username"])) {
    $user = $_GET['username'];
    $query = "DELETE FROM drawingdata WHERE username = '$user'"; // makes sure no past data is stored

    $mysqli->query($query);
    print("Data Cleared");

} else {
    http_response_code(400);
    print("Error. Not Enough Information Provided");
}
