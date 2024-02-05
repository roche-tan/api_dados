document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM (const)
  const playerTypeRadios = document.querySelectorAll(
    'input[name="playerType"]'
  );
  const personalNameDiv = document.getElementById("personalName");
  const startGameButton = document.getElementById("startGame");
  const playGameButton = document.getElementById("playGame");
  const logoutButton = document.getElementById("logoutButton");
  const showPlayersListBtn = document.getElementById("showPlayersList");

  const showGamesButton = document.getElementById("showGames");
  const deletePlayerGamesButton = document.getElementById("deletePlayerGames");
  const editPlayerButton = document.getElementById("editPlayerButton");
  const savePlayerNameButton = document.getElementById("savePlayerName");
  const generalRankingButton = document.getElementById("showRankings");

  // Inicialización (let)
  let currentPlayerId = null;
  let currentPlayerType = null; // Agrega una variable para el tipo de jugador

  // Event Listeners
  startGameButton.addEventListener("click", () => handleStartGame());
  playGameButton.addEventListener("click", () => handlePlayGame());
  logoutButton.addEventListener("click", () => handleLogout());
  showPlayersListBtn.addEventListener("click", () => handleShowPlayersList());
  showGamesButton.addEventListener("click", () => handleShowGames());
  deletePlayerGamesButton.addEventListener("click", () =>
    handleDeletePlayerGames()
  );
  editPlayerButton.addEventListener("click", () => handleEditPlayer());
  savePlayerNameButton.addEventListener("click", () => handleSavePlayerName());
  generalRankingButton.addEventListener("click", () => handleShowRankings());

  // Funciones de Event Handlers

  const handlePlayerTypeChange = () => {
    const selectedType = document.querySelector(
      'input[name="playerType"]:checked'
    ).value;
    if (selectedType === "personal") {
      personalNameDiv.style.display = "block";
      editPlayerButton.style.display = "block"; // Mostrar el botón "Editar Nombre" si el jugador es de tipo "personal"
    } else {
      personalNameDiv.style.display = "none";
      editPlayerButton.style.display = "none"; // Ocultar el botón para otros tipos de jugador
    }
  };

  // Agregar el evento 'change' a cada radio button de playerTypeRadios
  playerTypeRadios.forEach((radio) => {
    radio.addEventListener("change", handlePlayerTypeChange);
  });

  const handleStartGame = () => {
    const selectedType = document.querySelector(
      'input[name="playerType"]:checked'
    ).value;
    const name =
      selectedType === "personal"
        ? document.getElementById("name").value.trim() || "Anónimo"
        : "";

    // Establecer el tipo de jugador actual
    currentPlayerType = selectedType;

    createPlayer(name);
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";

    // El botón "Editar Nombre" ya se habrá mostrado o ocultado en handlePlayerTypeChange
  };

  const handlePlayGame = () => {
    if (!currentPlayerId) {
      alert("No hay un jugador activo.");
      return;
    }
    playGame();
  };

  const handleLogout = () => {
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    resetGameState();
    // const listContainer = document.getElementById("showPlayersListContainer");
    // listContainer.style.display = "none";
    // const rankingContainer = document.getElementById("showRankingsContainer");
    // rankingContainer.style.display = "none";
    // const gamesContainer = document.getElementById("showGameListContainer");
    // gamesContainer.style.display = "none";
    // resetGameState();
  };

  const handleShowPlayersList = () => {
    const listContainer = document.getElementById("showPlayersListContainer");
    listContainer.style.display = "block";
    fetchPlayersList();
  };

  const handleShowGames = () => {
    fetchPlayerGames();
  };

  const handleDeletePlayerGames = () => {
    deletePlayerGames();
  };

  const handleEditPlayer = () => {
    document.getElementById("editPlayerForm").style.display = "block";
  };

  const handleSavePlayerName = () => {
    const newName = document.getElementById("editPlayerName").value;
    if (!currentPlayerId || newName.trim() === "") {
      alert("Es necesario seleccionar un jugador y escribir un nombre.");
      return;
    }
    updatePlayerName(newName);
  };

  const handleShowRankings = () => {
    fetchGeneralRanking();
    fetchLoserPlayer();
    fetchWinnerPlayer();
  };

  function resetGameState() {
    // Restablece el estado del juego a su estado inicial
    document.getElementById("dice1").src = "src/img/1.svg";
    document.getElementById("dice2").src = "src/img/1.svg";
    currentPlayerId = null; // Restablecer el ID del jugador actual
  }

  // ------------------ displays
  const updateDiceImages = (dice1, dice2) => {
    document.getElementById("dice1").src = `src/img/${dice1}.svg`;
    document.getElementById("dice2").src = `src/img/${dice2}.svg`;
  };

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

  const displayPlayerGames = (games) => {
    const gamesContainer = document.getElementById("gamesList"); // Asegúrate de tener este contenedor en tu HTML
    gamesContainer.innerHTML = ""; // Limpiar el contenedor antes de mostrar los nuevos resultados

    games.forEach((game) => {
      const gameElement = document.createElement("div");
      // Mostrar solo los números de los dados y si ha ganado o no
      const resultText = game.result ? "Ganado" : "Perdido";
      gameElement.textContent = `Dados: ${game.dice1}, ${game.dice2} - ${resultText}`;
      gamesContainer.appendChild(gameElement);
    });
  };

  function displayLoserInfo(loser) {
    const container = document.getElementById("loserInfo");
    container.innerHTML = ""; // Limpia el contenedor antes de mostrar nueva información

    if (loser) {
      const info = `LOSER Nombre: ${
        loser.name
      }, Porcentaje de Éxito: ${loser.winPercentage.toFixed(2)}%`;
      container.textContent = info;
    } else {
      container.textContent = "Información no disponible";
    }
  }

  function displayWinnerInfo(winner) {
    const container = document.getElementById("winnerInfo");
    container.innerHTML = ""; // Limpia el contenedor antes de mostrar nueva información

    if (winner) {
      const info = `WINNER Nombre: ${
        winner.name
      }, Porcentaje de Éxito: ${winner.winPercentage.toFixed(2)}%`;
      container.textContent = info;
    } else {
      container.textContent = "Información no disponible";
    }
  }

  // ------------ Funciones de API
  const createPlayer = (name) => {
    console.log("name en createplayer", name);
    const isAnonymous = name.toLowerCase() === "anónimo" || name === "";
    console.log("name en createplayer2", name);
    fetch("http://localhost:3000/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
  };

  const playGame = () => {
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
  };

  const fetchPlayersList = () => {
    fetch("http://localhost:3000/players", {
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
        listContainer.style.display = "";
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
  };

  const fetchPlayerGames = () => {
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
  };

  const deletePlayerGames = () => {
    if (!currentPlayerId) {
      alert("No hay un jugador activo.");
      return;
    }

    fetch(`http://localhost:3000/games/${currentPlayerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(handleResponse)
      .then(() => {
        alert("Jugadas eliminadas con éxito.");
        // Actualizar la lista de juegos del jugador y la lista de jugadores
        fetchPlayerGames();
        fetchPlayersList();
      })
      .catch(handleError);
  };

  const updatePlayerName = (newName) => {
    fetch(`http://localhost:3000/players/${currentPlayerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then(handleResponse)
      .then(() => {
        alert("Nombre del jugador actualizado con éxito.");
        // Ocultar el formulario de edición
        document.getElementById("editPlayerForm").style.display = "none";
      })
      .catch(handleError);
  };

  const fetchGeneralRanking = () => {
    fetch("http://localhost:3000/ranking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => displayRanking(data, "generalRanking"))
      .catch((error) => console.error("Error:", error));
  };

  const fetchLoserPlayer = () => {
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
  };

  const fetchWinnerPlayer = () => {
    fetch("http://localhost:3000/ranking/winner", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener la información del ganador");
        }
        return response.json();
      })
      .then((data) => {
        displayWinnerInfo(data.winner); // Asume que la respuesta incluye un objeto 'winner'
      })
      .catch((error) => {
        console.error("Error:", error);
        // Considera mostrar este error en la interfaz de usuario
      });
  };
  // Funciones de manejo de respuestas y errores
  const handleResponse = (response) => {
    if (!response.ok) {
      throw new Error("No se pudo completar la solicitud.");
    }
    return response.json();
  };

  const handleError = (error) => {
    console.error("Error:", error);
    alert("Ha ocurrido un error.");
  };
});

