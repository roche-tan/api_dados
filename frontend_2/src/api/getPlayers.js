export const getPlayers = async () => {
  try {
    const response = await fetch("http://localhost:3000/players", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de jugadores");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    throw error;
  }
};
