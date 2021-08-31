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

const roomName = ""


io.on('connection', (socket)=>{

   

    console.log('new websocket connection');

    socket.emit('welcome', 'Welcome to game room')


    socket.on("scoreUpdate", (score)=>{
        socket.broadcast.emit("updateOpponentScore", score)
    })

   socket.on("startGame" , (text) => {
       io.emit('init', text)
   })

})

server.listen(port, ()=>{
    console.log('Server is up on port ' + port);
})