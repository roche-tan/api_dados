import { createPlayer } from "../api/createPlayer";

// Función que maneja el envío del formulario para crear un jugador
const handleSubmit = (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  createPlayer(name)
    .then((response) => response.json())
    .then((data) => {
      console.log("Jugador creado:", data);
      // Manejar la respuesta
    })
    .catch((error) => console.error("Error:", error));
};

document
  .getElementById("createPlayerForm")
  .addEventListener("submit", handleSubmit);
