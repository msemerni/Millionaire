import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
    login: string,
    password: string,
    nick?: string,
}

export interface IMyUser extends Document {
    _id: ObjectId,
    login: string,
    nick?: string,
}

export interface IGameToken{
    initiatorUser: IMyUser,
    opponentUser: IMyUser,
    gameLink: string
    iat: Date
}
