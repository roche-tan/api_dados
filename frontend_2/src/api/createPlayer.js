export const createPlayer = async (name) => {
   const isAnonymous = name.toLowerCase() === "anónimo" || name === "";
  return fetch("http://localhost:3000/players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: isAnonymous ? "{}" : JSON.stringify({ name }),
  });
};
