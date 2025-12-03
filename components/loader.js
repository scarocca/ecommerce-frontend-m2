// Cargar NAVBAR
// Cargar NAVBAR
fetch("components/navbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("navbar-container").innerHTML = data;
    });

// Cargar FOOTER
fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
    });
