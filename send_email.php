<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

// Memuat file .env untuk mengamankan kredensial email
require_once 'PHPMailer-master/src/Exception.php';
require_once 'PHPMailer-master/src/PHPMailer.php';
require_once 'PHPMailer-master/src/SMTP.php';
require_once 'vendor/autoload.php'; // untuk autoload Dotenv

// Memuat file .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Fungsi untuk mengirim pesan
function sendAnonymousMessage($recipientEmail, $messageContent) {
    $mail = new PHPMailer(true);

    try {
        // Konfigurasi SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Server SMTP Gmail
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USERNAME']; // Email pengirim dari .env
        $mail->Password = $_ENV['MAIL_PASSWORD']; // Password dari .env
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587; // Port SMTP Gmail (587 untuk STARTTLS)

        // Pengaturan email pengirim dan penerima
        $mail->setFrom($_ENV['MAIL_USERNAME'], 'SendMe');
        $mail->addAddress($recipientEmail); // Alamat email penerima

        // Validasi email penerima
        if (!filter_var($recipientEmail, FILTER_VALIDATE_EMAIL)) {
            echo "Alamat email tidak valid.";
            return;
        }

        // Konten email
        $mail->isHTML(true);
        $mail->Subject = 'Pesan Rahasia untuk Anda!';
        $mail->Body = "
            <p>Hallo, {$recipientEmail}</p>
            <p>Kami dari <strong>SendMe</strong> ingin menyampaikan bahwa ada seseorang yang telah mengirimkan pesan rahasia untuk Anda!</p>
            <p><strong>Isi Pesan:</strong> {$messageContent}</p>
            <p>Salam Hangat,<br>Tim SendMe</p>
        ";

        // Mengirim email
        $mail->send();
        echo "Pesan berhasil dikirim ke {$recipientEmail}!";
    } catch (Exception $e) {
        echo "Pesan gagal dikirim. Error: {$mail->ErrorInfo}";
    }
}
