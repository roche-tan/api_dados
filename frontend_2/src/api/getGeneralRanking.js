export const getGeneralRanking = async () => {
  try {
    const response = await fetch("http://localhost:3000/ranking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener el ranking general");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener el ranking general:", error);
    throw error;
  }
};
