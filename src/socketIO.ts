// import { http } from './server';
// import { encrypt, decrypt } from "./utils/cryptojs";


// const io = require('socket.io')(http);

// io.on('connection', (socket: any) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on('disconnect', function () {
//     console.log(`User disconnected: ${socket.id}`);
//   });

//   socket.on('create game', (gameLink: any) => {
//     const token = gameLink.slice(gameLink.lastIndexOf('/') + 1);
//     const [string, iv ] = token.split(":");
//     const decodedToken = JSON.parse(decrypt(string, iv));
//     const roomGameID = decodedToken.gameUUID;

//     socket.join(roomGameID);
//     io.to(roomGameID).emit('game created', decodedToken.initiatorUser.login, roomGameID);
//   })
// });

// export {io};
