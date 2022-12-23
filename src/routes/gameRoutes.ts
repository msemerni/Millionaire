import { Router } from "express";
import { JoinGame, StartGame, GenerateGameLink } from "../api/game/game-controller";

const protectAccess = require("../middleware/auth.js");

const router: Router = Router();

router.get("/game/:id", protectAccess, StartGame);

router.get("/game/:token", protectAccess, JoinGame);

router.get("/game/new/:id", protectAccess, GenerateGameLink);


export { router };
