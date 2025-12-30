const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// Itt tároljuk el az üzeneteket, amíg a szerver fut
let uzenetElőzmények = [];

io.on('connection', (socket) => {
    console.log('Új csatlakozó: ' + socket.id);

    // Amint valaki belép, azonnal elküldjük neki a régi üzeneteket
    socket.emit('korabbi-uzenetek', uzenetElőzmények);

    socket.on('uzenet', (adat) => {
        // Hozzáadjuk az új üzenetet a listához
        uzenetElőzmények.push(adat);
        
        // Csak az utolsó 50 üzenetet őrizzük meg, hogy ne teljen be a memória
        if (uzenetElőzmények.length > 50) {
            uzenetElőzmények.shift(); 
        }

        // Mindenkinek kiküldjük az új üzenetet
        io.emit('uzenet', adat);
    });

    // WebRTC Hívás jelzések
    socket.on('hivas-ajanlat', (data) => socket.broadcast.emit('hivas-ajanlat', data));
    socket.on('hivas-valasz', (data) => socket.broadcast.emit('hivas-valasz', data));
    socket.on('ice-candidate', (data) => socket.broadcast.emit('ice-candidate', data));
});

const PORT = 3000;
http.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));