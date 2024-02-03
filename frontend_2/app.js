let currentPlayerId = null;

document.addEventListener("DOMContentLoaded", () => {
  const playerTypeRadios = document.querySelectorAll(
    'input[name="playerType"]'
  );
  const personalNameDiv = document.getElementById("personalName");
  const startGameButton = document.getElementById("startGame");
  const playGameButton = document.getElementById("playGame");
  const logoutButton = document.getElementById("logoutButton"); // Botón para cerrar sesión

  const showPlayersListBtn = document.getElementById("showPlayersList");

  playerTypeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "personal") {
        personalNameDiv.style.display = "block";
      } else {
        personalNameDiv.style.display = "none";
      }
    });
  });

  startGameButton.addEventListener("click", () => {
    const selectedType = document.querySelector(
      'input[name="playerType"]:checked'
    ).value;
    if (selectedType === "personal") {
      const name = document.getElementById("name").value.trim();
      createPlayer(name || "Anónimo"); // Se envía el nombre introducido o 'Anónimo' si está vacío
    } else {
      createPlayer(""); // Se envía una cadena vacía para indicar un jugador anónimo
    }
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";

    logoutButton.addEventListener("click", () => {
      // Ocultar la sección del juego y mostrar la de inicio de sesión
      document.getElementById("gameSection").style.display = "none";
      document.getElementById("loginSection").style.display = "block";

      // Opcional: Restablecer cualquier estado o UI específica del juego
      resetGameState();
    });
  });

  playGameButton.addEventListener("click", () => {
    playGame();
  });

  showPlayersListBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/players", {
      // Asegúrate de que la URL sea correcta
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de jugadores");
        }
        return response.json();
      })
      .then((players) => {
        const listContainer = document.getElementById("playersList");
        listContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar los nuevos resultados

        // Crear y añadir los elementos al contenedor para cada jugador
        players.forEach((player) => {
          const playerElement = document.createElement("div");
          // Formatear el porcentaje de victorias para asegurar que tenga máximo dos decimales
          const winPercentageFormatted = parseFloat(
            player.winPercentage
          ).toFixed(2);
          playerElement.textContent = `Nombre: ${player.name}, Porcentaje de Victorias: ${winPercentageFormatted}%`;
          listContainer.appendChild(playerElement);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        // Considera mostrar este error en la interfaz de usuario para una mejor experiencia de usuario
      });
  });
  document
    .getElementById("showGames")
    .addEventListener("click", fetchPlayerGames);
});

function createPlayer(name) {
  // Determinar si se debería enviar un cuerpo vacío para un jugador anónimo
  const isAnonymous = name.toLowerCase() === "anónimo" || name === "";

  fetch("http://localhost:3000/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Enviar un cuerpo vacío si el jugador es anónimo; de lo contrario, enviar el nombre
    body: isAnonymous ? "{}" : JSON.stringify({ name }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Jugador creado:", data);
      currentPlayerId = data.playerId;
      // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito.
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function playGame() {
  if (!currentPlayerId) {
    alert("No hay un jugador activo.");
    return;
  }

  fetch(`http://localhost:3000/games/${currentPlayerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Asumiendo que data contiene los resultados de los dados y el resultado del juego
      console.log("Resultado del juego:", data);
      updateDiceImages(data.dice1, data.dice2); // Actualiza las imágenes de los dados según el resultado
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateDiceImages(dice1, dice2) {
  document.getElementById("dice1").src = `img/${dice1}.svg`;
  document.getElementById("dice2").src = `img/${dice2}.svg`;
}

function resetGameState() {
  // Restablece el estado del juego a su estado inicial
  // Por ejemplo, restablecer las imágenes de los dados a placeholders, limpiar variables, etc.
  document.getElementById("dice1").src = "img/1.svg";
  document.getElementById("dice2").src = "img/1.svg";
  currentPlayerId = null; // Restablecer el ID del jugador actual
}

function fetchAndDisplayPlayers() {
  fetch("http://localhost:3000/players") // Ajusta la URL según tu configuración
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener la lista de jugadores");
      }
      return response.json();
    })
    .then((players) => {
      displayPlayersList(players);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayPlayersList(players) {
  const container = document.getElementById("playersList");
  container.innerHTML = ""; // Limpiar el contenedor antes de mostrar nuevos resultados

  // Crear y añadir los elementos al contenedor para cada jugador
  players.forEach((player) => {
    const playerElement = document.createElement("div");
    playerElement.textContent = `ID: ${player.id}, Nombre: ${player.name}`;
    container.appendChild(playerElement);
  });
}

function displayPlayerGames(games) {
  const gamesContainer = document.getElementById("gamesList"); // Asegúrate de tener este contenedor en tu HTML
  gamesContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar los nuevos resultados

  games.forEach((game) => {
    const gameElement = document.createElement("div");
    // Mostrar solo los números de los dados y si ha ganado o no
    const resultText = game.result ? "Ganado" : "Perdido";
    gameElement.textContent = `Dados: ${game.dice1}, ${game.dice2} - ${resultText}`;
    gamesContainer.appendChild(gameElement);
  });
}

function fetchPlayerGames() {
  if (!currentPlayerId) {
    console.log("No hay un ID de jugador disponible");
    return;
  }

  fetch(`http://localhost:3000/games/${currentPlayerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((games) => {
      console.log("Juegos del jugador:", games);
      displayPlayerGames(games);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.getElementById("showRankings").addEventListener("click", () => {
  fetchGeneralRanking();
  fetchBestPlayer();
  fetchWorstPlayer();
});

function fetchGeneralRanking() {
  fetch("http://localhost:3000/ranking")
    .then((response) => response.json())
    .then((data) => displayRanking(data, "generalRanking"))
    .catch((error) => console.error("Error:", error));
}

function fetchBestPlayer() {
  fetch("http://localhost:3000/ranking/winner")
    .then((response) => response.json())
    .then((data) => displayRanking([data], "bestPlayer")) // Ajustado para usar la misma función de visualización
    .catch((error) => console.error("Error:", error));
}

function fetchWorstPlayer() {
  fetch("http://localhost:3000/ranking/loser")
    .then((response) => response.json())
    .then((data) => displayRanking([data], "worstPlayer")) // Ajustado para usar la misma función de visualización
    .catch((error) => console.error("Error:", error));
}

document.getElementById("showRankings").addEventListener("click", () => {
  fetchGeneralRanking();
  fetchBestPlayer();
  fetchWorstPlayer();
});

function displayRanking(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Limpiar el contenedor antes de mostrar los nuevos resultados

  // Para el ranking general, incluyendo la lista de jugadores y el promedio
  if (containerId === "generalRanking") {
    const players = data.sortPlayersWithWinPercentage;
    const averageSuccessRate = data.averageSuccessRate;

    players.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.textContent = `Nombre: ${
        player.name
      }, Porcentaje de Éxito: ${player.winPercentage.toFixed(2)}%`;
      container.appendChild(playerElement);
    });

    // Mostrar el porcentaje de éxito medio del conjunto
    const averageElement = document.createElement("div");
    averageElement.textContent = `Porcentaje de Éxito Medio del Conjunto: ${averageSuccessRate.toFixed(
      2
    )}%`;
    averageElement.style.fontWeight = "bold"; // Opcional: estilizar el texto para destacarlo
    container.appendChild(averageElement);
  } else {
    // Para un jugador individual (winner/loser)
    const player = data;
    const playerElement = document.createElement("div");
    playerElement.textContent = `Nombre: ${
      player.name
    }, Porcentaje de Éxito: ${player.winPercentage.toFixed(2)}%`;
    container.appendChild(playerElement);
  }
}

function fetchWorstPlayer() {
  fetch("http://localhost:3000/ranking/loser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo obtener la información del perdedor");
      }
      return response.json();
    })
    .then((data) => {
      displayLoserInfo(data.loser); // Asume que la respuesta incluye un objeto 'loser'
    })
    .catch((error) => {
      console.error("Error:", error);
      // Considera mostrar este error en la interfaz de usuario
    });
}

document
  .getElementById("showRankings")
  .addEventListener("click", fetchWorstPlayer);

  document
  .getElementById("showRankings")
  .addEventListener("click", fetchWinner);

function displayLoserInfo(loser) {
  const container = document.getElementById("loserInfo");
  container.innerHTML = ""; // Limpia el contenedor antes de mostrar nueva información

  if (loser) {
    const info = `Nombre: ${
      loser.name
    }, Porcentaje de Éxito: ${loser.winPercentage.toFixed(2)}%`;
    container.textContent = info;
  } else {
    container.textContent = "Información no disponible";
  }
}

function fetchWinner() {
  fetch('http://localhost:3000/ranking/winner', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo obtener la información del ganador');
    }
    return response.json();
  })
  .then(data => {
    displayWinnerInfo(data.winner); // Asume que la respuesta incluye un objeto 'winner'
  })
  .catch(error => {
    console.error('Error:', error);
    // Considera mostrar este error en la interfaz de usuario
  });
}
function displayWinnerInfo(winner) {
  const container = document.getElementById('winnerInfo');
  container.innerHTML = ''; // Limpia el contenedor antes de mostrar nueva información

  if (winner) {
    const info = `Nombre: ${winner.name}, Porcentaje de Éxito: ${winner.winPercentage.toFixed(2)}%`;
    container.textContent = info;
  } else {
    container.textContent = 'Información no disponible';
  }
}
