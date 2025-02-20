<?php include 'includes/header.php'; ?> <!-- ❌ Absolut sökväg -->

<main>

    <style>
        body {
            background-image: url('assets/images/bg.jpg');
            /* ❌ Felaktig absolut sökväg */
        }
    </style>

    <h1>Welcome to Our Test Landing Page</h1>
    <img src="assets/images/banner.jpg" alt="Banner Image"> <!-- ❌ Absolut sökväg -->
    <p>This page is designed to test broken paths in our validator tool.</p>

    <form action="./form-handler.php" method="POST"> <!-- ❌ Absolut sökväg -->
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">

        <label for="email">Email:</label>
        <input type="email" id="email" name="email">

        <button type="submit">Submit</button>
    </form>

    <script>
        fetch('assets/images/logo.png') // ❌ Absolut sökväg
            .then(response => response.blob())
            .then(data => console.log("Image loaded", data));
    </script>
</main>

<?php include 'includes/footer.php'; ?> <!-- ❌ Absolut sökväg -->