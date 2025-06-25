<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");

require_once "config.php";

try {
  $stmt = $pdo->query("SELECT COUNT(*) AS total FROM waitlist WHERE verified = 'yes'");
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  echo json_encode([
    "success" => true,
    "total_waitlist" => (int)$result['total']
  ]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "Server error"]);
}
