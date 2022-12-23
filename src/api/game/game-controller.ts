import { Request, Response, Router } from "express";
import RedisService from "./game-redis-service";
import GameService from "./game-service";
import { createClient } from "redis";
import { IMyUser, IUser } from "../../types/project-types";
const {sign, verify} = require('jsonwebtoken');
import jwt_decode from "jwt-decode";
import { IGameToken } from "../../types/project-types";
import { ObjectId } from "mongodb";
require('dotenv').config();

const { URL, PORT, APP_NAME, SALT } = process.env;

const StartGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameLink = await GameService.startGame();
    // sess.id === params.hash
    res.status(200).send(`${gameLink}`);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

const JoinGame = async (req: Request, res: Response): Promise<void> => {
  try {

    const sessionUser: IUser = req.session.user;
    console.log("sessionUser:", sessionUser);

    const token: string = req.params.token;
    console.log("Request(token):", token);

    const decodedToken: IGameToken = jwt_decode(token);
    console.log("Decoded(token):", decodedToken);

    const initiatorID: ObjectId = decodedToken.initiatorUser._id;
    const opponentID: ObjectId = decodedToken.opponentUser._id;

    if (!initiatorID || !initiatorID) {
      throw new Error("User ID not found");
    }
   // Сообщение Мише тут - /game/khgkdhgiubhcvonkej85
   // нужен ли редирект ?
   // res.redirect(301, `/game/${opponentID}`); // opponent /game/khgkdhgiubhcvonkej85


    res.status(200).send(`${sessionUser.login} joined ${APP_NAME} VS  ${sessionUser.login}`);

  } catch (error: any) {
        res.status(500).send({ error: error.message });
    }
}

const GenerateGameLink = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (!req.session.user || req.session.user._id || !req.params.id) {
    //   throw new Error("User ID not found");
    // }

    const initiatorUserID: any = req.session.user._id;
    const opponentUserID: string = req.params.id;

    console.log("initiatorUserID: ", initiatorUserID);
    console.log("opponentUserID: ", opponentUserID);
    const gameLink = await GameService.generateGameLink(initiatorUserID, opponentUserID);

    res.status(200).send({ "token from server: ": gameLink });

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

export { JoinGame, StartGame, GenerateGameLink };
