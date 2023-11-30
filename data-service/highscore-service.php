<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);

if (isset($_POST["user"])) {
    $user = $_POST['user'];

    $query = "SELECT MIN(gametime) from historydata WHERE user1 = '$user' OR user2 = '$user'";

    $result = $mysqli->query($query)->fetch_row();

    print_r($result[0]);
} else {
    http_response_code(400);
    print("Error. Not enough information");
}
