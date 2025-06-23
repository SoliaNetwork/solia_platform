<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

date_default_timezone_set('Africa/Lagos');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

require_once "config.php";

$email = trim($_POST['email'] ?? '');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid email"]);
    exit;
}

try {
    $pdo->prepare("DELETE FROM email_verifications WHERE expires_at < NOW()")->execute();

    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + 60);

    $stmt = $pdo->prepare("
        INSERT INTO email_verifications (email, code, expires_at)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE code = VALUES(code), expires_at = VALUES(expires_at), is_verified = 0
    ");
    $stmt->execute([$email, $code, $expiresAt]);

    $subject = "Your Solia Verification Code";
    $message = "Your 6-digit verification code is: $code\nIt will expire in 60 seconds.";
    $headers = "From: noreply@solia.com\r\n";

    mail($email, $subject, $message, $headers);

    echo json_encode(["message" => "Verification code sent"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
