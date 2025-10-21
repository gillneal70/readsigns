<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $motherName = $_POST['motherName'] ?? '';
    $email = $_POST['email'] ?? '';
    $service = $_POST['service'] ?? '';
    $message = $_POST['message'] ?? '';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'your_smtp_username';
        $mail->Password = 'your_smtp_password';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('no-reply@example.com', 'Consultation Site');
        $mail->addAddress('your_email@example.com', 'Site Admin');

        if (isset($_FILES['cardPhoto']) && $_FILES['cardPhoto']['error'] === UPLOAD_ERR_OK) {
            $mail->addAttachment($_FILES['cardPhoto']['tmp_name'], $_FILES['cardPhoto']['name']);
        }

        $mail->isHTML(true);
        $mail->Subject = 'New Consultation Request';
        $mail->Body    = "
        <h3>New Consultation Request</h3>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Mother's Name:</strong> {$motherName}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Service:</strong> {$service}</p>
        <p><strong>Message:</strong> {$message}</p>
        ";
        $mail->AltBody = strip_tags($mail->Body);

        $mail->send();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $mail->ErrorInfo]);
    }
}
?>