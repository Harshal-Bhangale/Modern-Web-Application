<?php
header("Access-Control-Allow-Origin: *"); // allow from any origin
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"));

$name = $data->name;
$dob = $data->dob;
$dept = $data->dept;
$salary = $data->salary;

$conn = new mysqli("localhost", "root", "", "employeeDB");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "INSERT INTO employees (name, dob, dept, salary) VALUES ('$name', '$dob', '$dept', '$salary')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Employee data saved successfully!"]);
} else {
    echo json_encode(["message" => "Error: " . $conn->error]);
}

$conn->close();
?>
