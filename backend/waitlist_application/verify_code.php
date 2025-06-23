<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once "config.php";

$email = trim($_POST['email'] ?? '');
$code = trim($_POST['code'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^\d{6}$/', $code)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid request"]);
  exit;
}

try {
  $pdo->prepare("DELETE FROM email_verifications WHERE expires_at < NOW()")->execute();

  $stmt = $pdo->prepare("
    SELECT * FROM email_verifications 
    WHERE email = ? AND code = ? AND expires_at >= NOW() AND is_verified = 0
  ");
  $stmt->execute([$email, $code]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($row) {
    $pdo->prepare("UPDATE email_verifications SET is_verified = 1 WHERE email = ?")->execute([$email]);
    $pdo->prepare("UPDATE waitlist SET verified = 'yes' WHERE email = ?")->execute([$email]);
    echo json_encode(["success" => true]);
  } else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid or expired code"]);
  }

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "Server error"]);
}
