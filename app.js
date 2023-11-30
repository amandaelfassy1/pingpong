const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let players = [];
let playerCount = 0;

wss.on('connection', (ws) => {
  console.log('Nouvelle connexion');

  // Attribuer un ID unique au joueur
  const playerId = ++playerCount;
  players.push({ id: playerId, socket: ws });

  // Envoyer les informations des autres joueurs au nouveau joueur
  players
    .filter(player => player.id !== playerId)
    .forEach(player => {
      ws.send(JSON.stringify({ type: 'existingPlayer', id: player.id }));
    });

  // Gestion des messages
  ws.on('message', (message) => {
    const receivedData = JSON.parse(message);
    switch (receivedData.type) {
      case 'newPlayer':
        // Gérer l'ajout d'un nouveau joueur (pas nécessaire ici)
        break;
      case 'paddle':
        // Gérer les mouvements de la raquette pour le joueur 2
        players.forEach((player) => {
          if (player.socket !== ws) {
            player.socket.send(message);
          }
        });
        break;
      // Ajouter d'autres cas au besoin
      default:
        break;
    }
  });

  // Gestion de la déconnexion
  ws.on('close', () => {
    console.log('Connexion fermée');
    // Supprimer le joueur déconnecté de la liste
    players = players.filter((player) => player.socket !== ws);
  });
});

console.log('Serveur WebSocket en écoute sur le port 3000');
