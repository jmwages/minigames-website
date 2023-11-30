<?php
$hostname = "localhost";
$username = "jeanmarc";
$password = "533919";
$database = "jeanmarc";

$mysqli = new mysqli($hostname, $username, $password, $database);

$query = "SELECT image, title, description, link FROM gamelist";

$result = $mysqli->query($query);


$objs = Array();
// Loop through all the rows returned by the query
while ($row = $result->fetch_assoc()) {
   $objs[] = $row;
 }

 print(json_encode($objs));
