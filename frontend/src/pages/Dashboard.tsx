import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "../Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const diceImages = Array.from({ length: 6 }, (_, i) => new URL(`../images/Dice${i + 1}.png`, import.meta.url).href);

  const [dice, setDice] = useState({ image1: diceImages[0], image2: diceImages[0] });
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("");
  const [showWinningGif, setShowWinningGif] = useState(false);

  const getDiceValue = (imageUrl: string): number => {
    const matches = imageUrl.match(/Dice(\d)/);
    return matches ? parseInt(matches[1], 10) : 0;
  };

  useEffect(() => {
    if (!isRolling) {
      const sum = getDiceValue(dice.image1) + getDiceValue(dice.image2);
      if (sum === 7) {
        setMessage("¡Has ganado!");
        setShowWinningGif(true);
      } else {
        setMessage("");
        setShowWinningGif(false);
      }
    }
  }, [dice, isRolling]);

  const rollDice = () => {
    setIsRolling(true);
    setMessage("");
    setShowWinningGif(false);

    const interval = setInterval(() => {
      setDice({
        image1: diceImages[Math.floor(Math.random() * 6)],
        image2: diceImages[Math.floor(Math.random() * 6)]
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
    }, 800);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-24">
      <nav>
        <Button onClick={() => navigate("/")}>Logout</Button>
      </nav>
      <h1> 🎲 Welcome to the Ultimate Dice Roller 🎲 </h1>
      <div className="flex flex-row justify-center ">
        <img className={`h-96 w-96 inline-block align-middle p-4 ${isRolling ? "dice-roll" : ""}`} src={dice.image1} alt="Dice One" />
        <img className={`h-96 w-96 inline-block align-middle p-4 ${isRolling ? "dice-roll" : ""}`} src={dice.image2} alt="Dice Two" />
      </div>
      {showWinningGif && (
        <div className="absolute top-0 left-0 flex flex-row justify-center items-center w-full h-full z-[-1]">
          <div className="bg-opacity-75 rounded ">
            <img src="/yuhu.gif" alt="Winning!" className="h-90 w-90 object-contain" />
          </div>
        </div>
      )}
      <p className="message text-lg text-green-600">{message}</p>
      <Button type="button" onClick={rollDice}>
        Roll Dice
      </Button>
    </main>
  );
}

export default Dashboard;
