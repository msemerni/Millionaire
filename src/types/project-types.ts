import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
    _id: ObjectId,
    login: string,
    password: string,
    nick?: string,
}

export interface IDBUser extends Document {
    _id: ObjectId,
    login: string,
    nick?: string,
}

export interface IGameLinkObject {
    gameUUID: string,
    gameName: string,
    initiatorUser: IDBUser,
    opponentUser: IDBUser,
    linkCreationTime: number
}
