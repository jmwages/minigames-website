<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);

if (isset($_GET["user"]) && isset($_GET["opponent"])) {
    $user = $_GET['user'];
    $opp = $_GET['opponent'];

    $query = "SELECT * FROM historydata WHERE (user1 = '$user' AND user2 = '$opp') OR (user1 = '$opp' AND user2 = '$user')";

    $result = $mysqli->query($query);

    $objs = array();
    // Loop through all the rows returned by the query
    while ($row = $result->fetch_assoc()) {
        $objs[] = $row;
    }

    print(json_encode($objs));
} else {
    http_response_code(400);
    print("Error. Not enough information");
}
