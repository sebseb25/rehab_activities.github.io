let rooms = {};
let currentPlayer = null;
let currentRoomCode = null;

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for "Create Room" button on home screen
    document.getElementById('create-room-option').addEventListener('click', function() {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('create-room-screen').classList.remove('hidden');
    });

    // Event listener for "Join Room" button on home screen
    document.getElementById('join-room-option').addEventListener('click', function() {
        document.getElementById('home-screen').classList.add('hidden');
        document.getElementById('join-room-screen').classList.remove('hidden');
    });

    // Event listener for creating a room
    document.getElementById('create-room-btn').addEventListener('click', function() {
        const roomName = document.getElementById('room-name').value.trim();
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
        const roomCode = document.getElementById('join-room-code').value.trim().toUpperCase();
        const playerName = document.getElementById('player-name').value.trim();

        if (!roomCode || !playerName) {
            alert('Please enter both the room code and your name');
            return;
        }

        // Confirm joining the room
        const confirmation = confirm(`Are you sure you want to join the room with code ${roomCode} as ${playerName}?`);
        if (!confirmation) return;

        // Validate room code
        if (!rooms[roomCode]) {
            alert('Invalid room code');
            return;
        }

        // Add player to the room
        rooms[roomCode].players.push(playerName);
        currentPlayer = playerName;
        currentRoomCode = roomCode;

        document.getElementById('join-room-screen').classList.add('hidden');
        document.getElementById('game-room').classList.remove('hidden');
        document.getElementById('room-title').textContent = `Room: ${rooms[roomCode].name}`;
    });

    // Event listener for sending a message
    document.getElementById('send-message-btn').addEventListener('click', function() {
        const message = document.getElementById('message').value.trim();
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

        document.getElementById('message').value = ''; // Clear message input
    });

    function displayMessage(player, message) {
        const messageDiv = document.getElementById('messages');
        const p = document.createElement('p');
        p.textContent = `${player}: ${message}`;
        messageDiv.appendChild(p);
    }
});
