<?php include 'includes/header.php'; ?> <!-- ❌ Absolut sökväg -->

<main>
    <h1>Contact Us</h1>
    <p>Fill out the form below to reach us.</p>
    <form action="./form-handler.php" method="POST"> <!-- ❌ Absolut sökväg -->
        <label for="message">Message:</label>
        <textarea id="message" name="message"></textarea>
        <button type="submit">Send</button>
    </form>
</main>

<?php include 'includes/footer.php'; ?> <!-- ❌ Absolut sökväg -->