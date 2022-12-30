import { Router } from "express";
import { JoinGame, StartQuiz, GenerateGameLink } from "../api/game/game-controller";

const protectAccess = require("../middleware/auth.js");
const router: Router = Router();

router.get("/quiz/:id", protectAccess, StartQuiz);

router.get("/game/:token", protectAccess, JoinGame);

router.get("/game/new/:gamename/:id", protectAccess, GenerateGameLink);


export { router };
