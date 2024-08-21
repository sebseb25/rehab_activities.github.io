let room = null;
let rooms = {};
let currentPlayer = null;
let currentRoomCode = null;

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

document.getElementById('create-room-btn').addEventListener('click', function() {
    const roomName = document.getElementById('room-name').value;
    if (!roomName) {
        alert('Please enter a room name');
        return;
    }
    const roomCode = generateRoomCode();
    room = { name: roomName, players: [] };
    rooms[roomCode] = room;
    currentRoomCode = roomCode;
    document.getElementById('room-title').textContent = `Room: ${room.name} (Code: ${roomCode})`;
    document.getElementById('game-setup').classList.add('hidden');
    document.getElementById('game-room').classList.remove('hidden');
});

document.getElementById('join-room-btn').addEventListener('click', function() {
    const roomCode = document.getElementById('join-room-code').value.toUpperCase();
    if (!roomCode || !rooms[roomCode]) {
        alert('Invalid room code');
        return;
    }
    room = rooms[roomCode];
    currentRoomCode = roomCode;
    document.getElementById('room-title').textContent = `Room: ${room.name}`;
    document.getElementById('game-setup').classList.add('hidden');
    document.getElementById('game-room').classList.remove('hidden');
});

document.getElementById('join-room-final-btn').addEventListener('click', function() {
    const playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    currentPlayer = playerName;
    room.players.push(playerName);
    document.getElementById('players').classList.add('hidden');
    document.getElementById('game-controls').classList.remove('hidden');
});

document.getElementById('start-game-btn').addEventListener('click', function() {
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
});

function displayMessage(player, message) {
    const messageDiv = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = `${player}: ${message}`;
    messageDiv.appendChild(p);
}

