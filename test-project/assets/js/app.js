fetch('../images/logo.png')  // ❌ Absolut sökväg
    .then(response => response.blob())
    .then(data => console.log("Image loaded", data));
