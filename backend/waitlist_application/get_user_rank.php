<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once "config.php";

$email = trim($_POST['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid email"]);
  exit;
}

try {
  $stmt = $pdo->prepare("
    SELECT email, invite_count,
      RANK() OVER (ORDER BY invite_count DESC) AS rank
    FROM waitlist
  ");
  $stmt->execute();
  $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $user = array_filter($users, fn($u) => $u['email'] === $email);
  $user = array_values($user)[0] ?? null;

  if ($user) {
    echo json_encode([
      "success" => true,
      "email" => $user['email'],
      "invite_count" => (int)$user['invite_count'],
      "rank" => (int)$user['rank']
    ]);
  } else {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "Server error"]);
}
