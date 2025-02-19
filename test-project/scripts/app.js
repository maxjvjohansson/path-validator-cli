import module from './module.js';  // ❌ Fel - Filen saknas

fetch('../assets/images/logo.png')  // ✅ Rätt
    .then(response => response.blob())
    .then(data => console.log(data));