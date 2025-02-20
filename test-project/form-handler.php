<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? 'Unknown';
    $email = $_POST['email'] ?? 'No Email';
    $message = $_POST['message'] ?? 'No Message';

    // Simulate file writing (not actually saving anything)
    echo "Received data: Name - $name, Email - $email, Message - $message";
}
