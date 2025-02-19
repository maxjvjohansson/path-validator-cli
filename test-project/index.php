<?php
include 'includes/header.php'; // ✅ Rätt - Relativ path
include 'includes/footer.php'; // ✅ Rätt - Fixat felet
include 'missing-file.php'; // ❌ Fel - Men vi vill testa att den flaggas

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Test Landing Page</title>
    <link rel="stylesheet" href="styles/main.css"> <!-- ✅ Rätt -->
    <link rel="stylesheet" href="styles/theme.css"> <!-- ✅ Rätt -->
</head>

<body>

    <h1>Welcome to Our Test Page</h1>

    <img sr="assets/images/logo.png" alt="Logo"> <!-- ✅ Rätt -->
    <img src="assets/images/hero.jpg" alt="Hero"> <!-- ✅ Rätt -->

    <script src="scripts/app.js"></script> <!-- ✅ Rätt -->
</body>

</html>