<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
//uložit do složky htdocs v XAMPP
// Připojení k databázy
$host = "localhost";
$user = "root";
$password = "";
$database = "notes";

// Vytvoření připojení pomocí PDO
try {
  $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Chyba připojení k databázi: " . $e->getMessage());
}

$action = $_GET["action"] ?? "";

switch ($action) {
  case "get_all":
    $id_user = $_GET["id_user"] ?? "";
    $stmt = $pdo->prepare("SELECT * FROM note WHERE id_user = :id_user");
    $stmt->execute(['id_user' => $id_user]);
    $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notes);
    break;

case "create":
  $id = null;
  $title = $_POST["title"] ?? "";
  $content = $_POST["content"] ?? "";
  $id_user = $_POST["iduser"] ?? "";

  if ($title && $content && $id_user) {
    //Tu chyba - OPRAVENO
    $stmt = $pdo->prepare("INSERT INTO note (title, content, id_user) VALUES (:title, :content, :id_user)");
    $stmt->execute(["title" => $title, "content" => $content, "id_user" => $id_user]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
  } else {
    echo json_encode(["success" => false, "error" => "Chybí titulek, obsah nebo id_user"]);
  }
  break;

  case "update":
    $id = $_POST["id"] ?? null;
    $title = $_POST["title"] ?? "";
    $content = $_POST["content"] ?? "";
    if ($id && $title && $content) {
      $stmt = $pdo->prepare("UPDATE note SET title = :title, content = :content WHERE id = :id");
      $stmt->execute(["id" => $id, "title" => $title, "content" => $content]);
      echo json_encode(["success" => true]);
    } else {
      echo json_encode(["success" => false, "error" => "Chybí id, titulek nebo obsah"]);
    }
    break;

  case "delete":
    $id = $_GET["id"] ?? 0;
    if ($id) {
      $stmt = $pdo->prepare("DELETE FROM note WHERE id = :id");
      $stmt->execute(["id" => $id]);
      echo json_encode(["success" => true]);
    } else {
      echo json_encode(["success" => false, "error" => "Chybí id"]);
    }
    break;

  default:
    echo json_encode(["success" => false, "error" => "Neplatná akce"]);
}
