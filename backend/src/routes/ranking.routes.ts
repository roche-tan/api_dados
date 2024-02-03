import { Router } from "express";
import rankingController from "../controllers/ranking.controllers";
const router = Router();

router.get("/", rankingController.getRanking);
router.get("/loser", rankingController.getLoser);
router.get("/winner", rankingController.getWinner);

export default router;
