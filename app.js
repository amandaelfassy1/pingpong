const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/'));

let players = [];

io.on('connection', (socket) => {
  console.log('Nouvelle connexion');

  // Gérer l'ajout d'un nouveau joueur
  socket.on('newPlayer', () => {
    players.push(socket.id);
    // Émettre un événement pour informer les clients qu'un nouveau joueur a rejoint
    io.emit('playerJoined', players);
  });

  // Gérer les mouvements de la raquette
  socket.on('paddleMovement', (y) => {
    // Émettre un événement pour mettre à jour les mouvements des raquettes
    socket.broadcast.emit('opponentPaddle', { id: socket.id, y });
  });

  // Gérer la déconnexion d'un joueur
  socket.on('disconnect', () => {
    players = players.filter(playerId => playerId !== socket.id);
    // Émettre un événement pour informer les clients qu'un joueur s'est déconnecté
    io.emit('playerDisconnected', players);
  });
});

server.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});
