import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import session from "express-session";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as gameRoutes } from "./routes/gameRoutes.js";
import { createClient } from "redis";
require('dotenv').config();

import {encrypt, decrypt} from "./utils/cryptojs";

/////////////////////////////////////
//// Login:
//// w@com.ua
//// Password:
//// www
/////////////////////////////////////

const {
  APP_NAME,
  PORT,
  DB_CONNECTION,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  REDIS_NAME,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_SECRET,
} = process.env;

const dbOptions = {
  useNewUrlParser: true,
};

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const port = PORT || 3000;
const dbConnectionUrl = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

mongoose.connect(dbConnectionUrl, dbOptions);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("🟢 Mongo connected"));

const RedisGameStore = require("connect-redis")(session);

const redisClient = createClient({
  legacyMode: true,
  url: `${REDIS_NAME}://${REDIS_HOST}:${REDIS_PORT}`
});

redisClient.connect().then(() => console.log("🟢 Redis connected"));

redisClient.on("error", console.error.bind(console, "Error connection to Redis:"));


const app = require('express')();
const http = require('http').Server(app);

app.use(
  session({
    store: new RedisGameStore({ client: redisClient }),
    resave: false,
    rolling: true,
    saveUninitialized: false,
    secret: SESSION_SECRET!,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    }
  }));

app.use(function (req: Request, res: Response, next: NextFunction) {
  if (!req.session) {
    return next(new Error("oh no"));
  }
  next();
})

app.use(bodyParser.json());

app.use(express.static("public"));

app.use(userRoutes, gameRoutes);

app.set("redisClient", redisClient);




const io = require('socket.io')(http);

io.on('connection', (socket: any) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', function () {
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('create game', (gameLink: any) => {
    const token = gameLink.slice(gameLink.lastIndexOf('/') + 1);
    const [string, iv ] = token.split(":");
    const decodedToken = JSON.parse(decrypt(string, iv));
    const roomGameID = decodedToken.gameUUID;

    socket.join(roomGameID);
    io.to(roomGameID).emit('game created', decodedToken.initiatorUser.login, roomGameID);
  })
});

export {io};

http.listen(port, () => console.log(`🟢 ${APP_NAME} app listening on port ${port}`));
