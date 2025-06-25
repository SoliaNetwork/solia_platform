<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once "config.php";

$email = trim($_POST['email'] ?? '');
$code = trim($_POST['code'] ?? '');
$referralCode = trim($_POST['referral_code'] ?? '');

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

    function generateReferralCode($length = 6) {
      $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      $code = '';
      for ($i = 0; $i < $length; $i++) {
        $code .= $chars[random_int(0, strlen($chars) - 1)];
      }
      return $code;
    }

    do {
      $refCode = generateReferralCode();
      $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM waitlist WHERE invite_link = ?");
      $checkStmt->execute([$refCode]);
      $exists = $checkStmt->fetchColumn() > 0;
    } while ($exists);

    $updateRef = $pdo->prepare("UPDATE waitlist SET invite_link = ? WHERE email = ?");
    $updateRef->execute([$refCode, $email]);

    if (!empty($referralCode)) {
      $refStmt = $pdo->prepare("SELECT email FROM waitlist WHERE invite_link = ?");
      $refStmt->execute([$referralCode]);
      $referrer = $refStmt->fetch(PDO::FETCH_ASSOC);

      if ($referrer) {
        $referrerEmail = $referrer['email'];

 $checkReferredBy = $pdo->prepare("SELECT referred_by FROM waitlist WHERE email = ?");
$checkReferredBy->execute([$email]);
$current = $checkReferredBy->fetch(PDO::FETCH_ASSOC);

if (empty($current['referred_by'])) {
  $pdo->prepare("UPDATE waitlist SET referred_by = ? WHERE email = ?")->execute([$referrerEmail, $email]);
  $pdo->prepare("UPDATE waitlist SET invite_count = invite_count + 1 WHERE email = ?")->execute([$referrerEmail]);
}
     }
    }

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$fullReferralLink = $protocol . "://" . $host . "/?refcode=" . $refCode;
    echo json_encode(["success" => true, "referral_link" => $fullReferralLink]);

  } else {
    http_response_code(401);
    echo json_encode(["error" => "Invalid or expired code"]);
  }

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["error" => "Server error"]);
}
