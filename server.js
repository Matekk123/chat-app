const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
    
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
    });

    socket.on('privat-uzenet', (adat) => {
        // Csak abba a szobába küldjük, ahova szánták
        io.to(adat.roomId).emit('uj-uzenet', adat);
    });

    // WebRTC jelzések (szintén szobához köthetők majd)
    socket.on('hivas-ajanlat', (data) => socket.broadcast.emit('hivas-ajanlat', data));
    socket.on('hivas-valasz', (data) => socket.broadcast.emit('hivas-valasz', data));
    socket.on('ice-candidate', (data) => socket.broadcast.emit('ice-candidate', data));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Szerver fut...'));
