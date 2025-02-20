document.querySelector("form").addEventListener("submit", function(event) {
    let name = document.getElementById("name");
    if (name.value.trim() === "") {
        alert("Name cannot be empty!");
        event.preventDefault();
    }
});
