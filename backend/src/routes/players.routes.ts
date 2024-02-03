import { Router } from "express";
import playerController from "../controllers/players.controllers";
const router = Router();

router.post("/", playerController.createPlayer);
router.put("/:id", playerController.updatePlayerName);
router.get("/", playerController.getAllPlayers);

export default router;
