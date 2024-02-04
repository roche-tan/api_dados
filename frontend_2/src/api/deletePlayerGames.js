export const deletePlayerGames = async (playerId) => {
  try {
    const response = await fetch(`http://localhost:3000/games/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("No se pudo eliminar las jugadas del jugador");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar las jugadas:", error);
    throw error;
  }
};
