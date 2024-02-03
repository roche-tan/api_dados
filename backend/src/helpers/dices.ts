// Función para simular el lanzamiento de dos dados y determinar si la suma es un ganador (7)
export const rollDices = () => {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  const totalScore = dice1 + dice2;
  const gameResult = totalScore === 7; // true si la suma es 7, false en caso contrario

  return {
    dice1,
    dice2,
    rollScore: totalScore,
    gameResult // Valor booleano que indica si el juego se ganó o no
  };
};
