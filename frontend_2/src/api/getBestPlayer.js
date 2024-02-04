export const getBestPlayer = async () => {
  try {
    const response = await fetch("http://localhost:3000/ranking/winner", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener la información del mejor jugador");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener la información del mejor jugador:", error);
    throw error;
  }
};
