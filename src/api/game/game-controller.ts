import { Request, Response } from "express";
import GameService from "./game-service";
import { IUser } from "../../types/project-types";
import { IGameLinkObject } from "../../types/project-types";
import { ObjectId } from "mongodb";
import { io } from '../../server';
require('dotenv').config();

const { URL, PORT } = process.env;

const GenerateGameLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const initiatorUserID: ObjectId = req.session.user._id;
    const opponentUserID: ObjectId = req.params.id as unknown as ObjectId;
    const gameName: string = req.params.gamename;
    const gameLink: string = await GameService.generateGameLink(gameName, initiatorUserID, opponentUserID);

    res.status(200).send({ gameLink });

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

const JoinGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionUser: IUser = req.session.user;
    const token: string = req.params.token;
    const { gameUUID, gameName, initiatorUser, opponentUser }: IGameLinkObject = await GameService.decodeToken(token);

    if (!(sessionUser._id === initiatorUser._id || sessionUser._id === opponentUser._id)) {
      res.status(403).send({ status: "error", message: "you are not invited to this game" });
      return;
    }

    io.to(gameUUID).emit('user connected', opponentUser.login, gameName, gameUUID);

    res.redirect(`${URL}:${PORT}/${gameName}/${gameUUID}`);

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

const StartQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameID: string = req.params.id;
    const gameStatus: string = await GameService.startGame(gameID);

    res.status(200).send(`${gameStatus}`);

  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
}

export { JoinGame, StartQuiz, GenerateGameLink };
