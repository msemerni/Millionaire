import bcrypt from "bcryptjs";
import { User } from "../user/user-model";
import { IUser } from "../../types/project-types";
import UserService from "../user/user-service";
const {sign, verify} = require('jsonwebtoken');
import jwt_decode from "jwt-decode";
require('dotenv').config();

const { URL, PORT, APP_NAME, SALT } = process.env;

const startGame = async (): Promise<string> => {
  const gameStatus = "GAME STARTED";
  console.log(gameStatus);
  
  return gameStatus;
}

const generateGameLink = async (initiatorUserID: string, opponentUserID: string): Promise<string> => {
  const initiatorUser: IUser | null = await UserService.getUserById(initiatorUserID);
  const opponentUser: IUser | null = await UserService.getUserById(opponentUserID);

  if (!opponentUser || !initiatorUser) {
      throw new Error("User not found");
  }

  const gameLink = `${URL}:${PORT}/game/${initiatorUser._id}`;

  const token = sign({initiatorUser, opponentUser, gameLink}, SALT)
  console.log("TOKEN: ", token);
  

  return token;
}

export = { startGame, generateGameLink };


// алиса и сервер по сокету
// кодировать а не хешировать инфу. Токен
// боб присоединяется по http и алисе приходит сообщение