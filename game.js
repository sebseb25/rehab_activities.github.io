let room = null;
let players = [];
let currentPlayer = null;

function createRoom() {
    const roomName = document.getElementById('room-name').value;
    if (!roomName) {
        alert('Please enter a room name');
        return;
    }
    room = { name: roomName, players: [] };
    document.getElementById('room-title').textContent = `Room: ${room.name}`;
    document.getElementById('game-setup').classList.add('hidden');
    document.getElementById('game-room').classList.remove('hidden');
}

function joinRoom() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    currentPlayer = playerName;
    room.players.push(playerName);
    document.getElementById('players').classList.add('hidden');
    document.getElementById('game-controls').classList.remove('hidden');
}

function startGame() {
    const message = document.getElementById('message').value;
    if (!message) {
        alert('Please enter a message');
        return;
    }

    const spyIndex = Math.floor(Math.random() * room.players.length);
    room.players.forEach((player, index) => {
        if (index !== spyIndex) {
            displayMessage(player, message);
        } else {
            displayMessage(player, "You are the spy! Don't reveal it.");
        }
    });

    document.getElementById('game-controls').classList.add('hidden');
    document.getElementById('message-board').classList.remove('hidden');
}

function displayMessage(player, message) {
    const messageDiv = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = `${player}: ${message}`;
    messageDiv.appendChild(p);
}
