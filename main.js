const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const {v4: randomID} = require('uuid');

const app = express();
const server = createServer(app);
const io = new Server(server);

const rooms = []

app.use(express.static('.'));

app.get('/', (req, res) => {
    console.log('hello');
    
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('load room data', (_) => {
        io.emit('load room data', rooms);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('make room', (data) => {
        rooms.push({id: data.roomID, players: [data.userName]});
        console.log('Make room:', rooms);
    });

    socket.on('join room', (data) => {
        const room = rooms.find(room => room.id === data.roomID)
        room.players.push(data.userName);
        console.log('Join room:', rooms);
        
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});