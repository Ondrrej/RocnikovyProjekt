<?php
// Připojení k databázi
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "notes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// hodnoty z JSON
$content = trim(file_get_contents("php://input"));
$decoded = json_decode($content, true);

// Kontrola
if (is_array($decoded)) {
    $login = $decoded['login'];
    $password = $decoded['password'];

    // Dotaz na databázi
    $sql = "SELECT id_user FROM login0 WHERE login = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $login, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id_user = $row['id_user'];
        echo json_encode(['id_user' => $id_user]); // Vrátit ID uživatele ve formátu JSON
    } else {

        echo json_encode(['error' => 'Nesprávné přihlašovací údaje.']);
    }
} else {
    echo json_encode(['error' => 'Data nebyla přijata.']);
}

$conn->close();
?>
