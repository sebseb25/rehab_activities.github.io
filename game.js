let rooms = {};
let currentPlayer = null;
let currentRoomName = null;

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
        showAvailableRooms();
    });

    // Function to display available rooms
    function showAvailableRooms() {
        const roomListDiv = document.getElementById('rooms');
        roomListDiv.innerHTML = ''; // Clear previous rooms
        for (const roomName in rooms) {
            const roomButton = document.createElement('button');
            roomButton.textContent = roomName;
            roomButton.classList.add('room');
            roomButton.addEventListener('click', function() {
                joinRoom(roomName);
            });
            roomListDiv.appendChild(roomButton);
        }

        if (Object.keys(rooms).length === 0) {
            roomListDiv.innerHTML = '<p>No rooms available.</p>';
        }
    }

    // Event listener for creating a room
    document.getElementById('create-room-btn').addEventListener('click', function() {
        const roomName = document.getElementById('room-name').value.trim();
        if (!roomName) {
            alert('Please enter a room name');
            return;
        }
        rooms[roomName] = { players: [] };
        document.getElementById('room-name').value = ''; // Clear input
        alert(`Room "${roomName}" created!`);
    });

    // Function to join a room
    function joinRoom(roomName) {
        const playerName = prompt('Enter your name:');
        if (!playerName) {
            alert('You must enter a name to join the room');
            return;
        }

        rooms[roomName].players.push(playerName);
        currentPlayer = playerName;
        currentRoomName = roomName;

        document.getElementById('join-room-screen').classList.add('hidden');
        document.getElementById('game-room').classList.remove('hidden');
        document.getElementById('room-title').textContent = `Room: ${roomName}`;
    }

    // Event listener for sending a message
    document.getElementById('send-message-btn').addEventListener('click', function() {
        const message = document.getElementById('message').value.trim();
        if (!message) {
            alert('Please enter a message');
            return;
        }

        displayMessage(currentPlayer, message);
        document.getElementById('message').value = ''; // Clear message input
    });

    function displayMessage(player, message) {
        const messageDiv = document.getElementById('messages');
        const p = document.createElement('p');
        p.textContent = `${player}: ${message}`;
        messageDiv.appendChild(p);
    }

    // Event listener for back button
    document.getElementById('back-to-home-btn').addEventListener('click', function() {
        document.getElementById('create-room-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
    });
});
