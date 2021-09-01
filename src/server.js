const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server) 

const port = process.env.PORT || 3006;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let roomName = ""
let playerName = ""


io.on('connection', (socket)=>{

    socket.on('join', ({username, room})=>{
        socket.join(room)
        roomName = room
        playerName = username
    })

    console.log(roomName);

    console.log('new websocket connection');

    socket.to(roomName).emit('welcome', 'Welcome to game room')


    socket.on("scoreUpdate", (score)=>{
        socket.broadcast.to(roomName).emit("updateOpponentScore", score)
    })

   socket.on("startGame" , (text) => {
       io.to(roomName).emit('init', text)
   })


   socket.on("sendMessage", (message, callback) => {
    io.to(roomName).emit("message", message, playerName);
    callback();
  });

})

server.listen(port, ()=>{
    console.log('Server is up on port ' + port);
})