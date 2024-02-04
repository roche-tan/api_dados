export const playGame = async (playerId) => {
  try {
    const response = await fetch(`http://localhost:3000/games/${playerId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al jugar el juego");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al jugar el juego:", error);
    throw error;
  }
};
