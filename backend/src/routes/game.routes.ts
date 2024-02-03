import { Router } from "express";
import gameController from "../controllers/game.controllers";
const router = Router();

router.post("/:id", gameController.playGame);
router.delete("/:id", gameController.deletePlayerGames);
router.get("/:id", gameController.getPlayerGames);

export default router;
