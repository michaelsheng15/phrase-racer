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


io.on('connection', (socket)=>{
    console.log('new websocket connection');

    socket.emit('welcome', 'Welcome to game room')

})

server.listen(port, ()=>{
    console.log('Server is up on port ' + port);
})