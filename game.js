let rooms = {};
let currentPlayer = null;
let currentRoomCode = null;

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Event listener for "Create Room" button on home screen
    document.getElementById('create-room-option').addEventListener('click', function() {
        console.log("Create Room option clicked");
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('create-room-screen').classList.remove('hidden');
    });

    // Event listener for "Join Room" button on home screen
    document.getElementById('join-room-option').addEventListener('click', function() {
        console.log("Join Room option clicked");
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('join-room-screen').classList.remove('hidden');
    });

    // Event listener for creating a room
    document.getElementById('create-room-btn').addEventListener('click', function() {
        console.log("Create Room button clicked");
        const roomName = document.getElementById('room-name').value;
        if (!roomName) {
            alert('Please enter a room name');
            return;
        }
        const roomCode = generateRoomCode();
        rooms[roomCode] = { name: roomName, players: [] };
        currentRoomCode = roomCode;
        document.getElementById('room-code-display').textContent = roomCode;
        document.getElementById('start-game-btn').classList.remove('hidden');
    });

    // Event listener for joining a room
    document.getElementById('join-room-btn').addEventListener('click', function() {
        console.log("Join Room button clicked");
        const roomCode = document.getElementById('join-room-code').value.toUpperCase();
        const playerName = document.getElementById('player-name').value;
        if (!roomCode || !rooms[roomCode]) {
            alert('Invalid room code');
            return;
        }
        if (!playerName) {
            alert('Please enter your name');
            return;
        }
        rooms[roomCode].players.push(playerName);
        currentPlayer = playerName;
        currentRoomCode = roomCode;

        document.getElementById('join-room-screen').classList.add('hidden');
        document.getElementById('game-room').classList.remove('hidden');
        document.getElementById('room-title').textContent = `Room: ${rooms[roomCode].name}`;
        document.getElementById('game-controls').classList.remove('hidden');
    });

    // Event listener for starting the game
    document.getElementById('start-game-btn').addEventListener('click', function() {
        console.log("Start Game button clicked");
        document.getElementById('create-room-screen').classList.add('hidden');
        document.getElementById('game-room').classList.remove('hidden');
        document.getElementById('room-title').textContent = `Room: ${rooms[currentRoomCode].name}`;
        document.getElementById('game-controls').classList.remove('hidden');
    });

    // Event listener for sending a message
    document.getElementById('send-message-btn').addEventListener('click', function() {
        console.log("Send Message button clicked");
        const message = document.getElementById('message').value;
        if (!message) {
            alert('Please enter a message');
            return;
        }

        const spyIndex = Math.floor(Math.random() * rooms[currentRoomCode].players.length);
        rooms[currentRoomCode].players.forEach((player, index) => {
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
});
