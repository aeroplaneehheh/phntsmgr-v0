const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
;    res.sendFile(path.join(__dirname, '/index.html'));
});
io.on('connection', (socket) => {
    console.log("A user has connected.");
    socket.on('chat message', (msg) => {
        console.log('Message received: ', msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log("A user has disconnected.");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})