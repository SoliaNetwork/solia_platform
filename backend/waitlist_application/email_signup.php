<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

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
    $pdo->prepare("
        DELETE FROM waitlist 
        WHERE verified = 'pending' 
        AND submitted_at < (NOW() - INTERVAL 2 HOUR)
    ")->execute();

    $stmt = $pdo->prepare("SELECT verified FROM waitlist WHERE email = ?");
    $stmt->execute([$email]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        if ($row['verified'] === 'yes') {
            http_response_code(409);
            echo json_encode(["error" => "Email already registered"]);
        } else {
            echo json_encode(["message" => "Email already submitted, awaiting verification"]);
        }
        exit;
    }

    $insert = $pdo->prepare("INSERT INTO waitlist (email, verified) VALUES (?, ?)");
    $insert->execute([$email, 'pending']);

    echo json_encode(["message" => "Email saved successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error"]);
}
