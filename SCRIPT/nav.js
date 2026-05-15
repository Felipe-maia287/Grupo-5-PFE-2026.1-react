// Pega os elementos do HTML pelo ID
var menuButton = document.getElementById("menu-button");
var menu = document.getElementById("menu");

// Garante que os elementos existem na página antes de adicionar o clique
if (menuButton && menu) {
    menuButton.addEventListener("click", function() {
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    });
} else {
    console.log("Aviso: Botão ou menu não encontrados nesta página.");
}