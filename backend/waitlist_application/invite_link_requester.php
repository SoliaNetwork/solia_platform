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
  $stmt = $pdo->prepare("SELECT invite_link FROM waitlist WHERE email = ?");
  $stmt->execute([$email]);
  $result = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($result && $result['invite_link']) {
$domain = trim($_POST['domain']);
$referralLink = rtrim($domain, '/') . "/?refcode=" . $result['invite_link'];
 echo json_encode(["success" => true, "referral_link" => $referralLink]);
  } else {
    http_response_code(404);
    echo json_encode(["error" => "Referral link not found"]);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "Server error"]);
}
