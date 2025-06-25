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
require_once'../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

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

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USER'];
    $mail->Password = $_ENV['SMTP_PASS'];
    $mail->SMTPSecure = 'tls';
    $mail->Port = $_ENV['SMTP_PORT'];

    $mail->setFrom($_ENV['SMTP_FROM'], $_ENV['SMTP_FROM_NAME']);
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "Your Solia Verification Code";
    $mail->Body = "
    <div style='max-width:500px;margin:auto;padding:20px;font-family:Arial,sans-serif;border:1px solid #e0e0e0;border-radius:10px;'>
        <h2 style='color:#5A218E;'>Welcome to Solia!</h2>
        <p>Thanks for signing up. Your verification code is:</p>
        <p style='font-size:24px;font-weight:bold;letter-spacing:3px;color:#333;'>$code</p>
        <p style='color:#888;'>This code will expire in 60 seconds.</p>
        <hr style='margin:20px 0;border:0;border-top:1px solid #eee;'/>
        <p style='font-size:12px;color:#aaa;'>If you did not request this, please ignore this message.</p>
    </div>
    ";
    $mail->AltBody = "Your verification code is: $code. It expires in 60 seconds.";


    $mail->send();

    echo json_encode(["message" => "Verification code sent"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send verification code"]);
}
