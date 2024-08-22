import { getDatabase, ref, onValue, set, push, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

const database = getDatabase(); // Ensure the database instance is correctly initialized

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

        const roomsRef = ref(database, 'rooms');
        onValue(roomsRef, (snapshot) => {
            const roomsData = snapshot.val();
            if (roomsData) {
                for (const roomName in roomsData) {
                    const roomButton = document.createElement('button');
                    roomButton.textContent = roomName;
                    roomButton.classList.add('room');
                    roomButton.addEventListener('click', function() {
                        joinRoom(roomName);
                    });
                    roomListDiv.appendChild(roomButton);
                }
            } else {
                roomListDiv.innerHTML = '<p>No rooms available.</p>';
            }
        });
    }

    // Event listener for creating a room
    document.getElementById('create-room-btn').addEventListener('click', function() {
        const roomName = document.getElementById('room-name').value.trim();
        if (!roomName) {
            alert('Please enter a room name');
            return;
        }

        const roomRef = ref(database, 'rooms/' + roomName);
        get(roomRef).then((snapshot) => {
            if (snapshot.exists()) {
                alert('Room already exists. Choose a different name.');
                return;
            }

            // Create room in Firebase
            set(roomRef, { players: [] });
            alert(`Room "${roomName}" created!`);
            document.getElementById('room-name').value = ''; // Clear input
            document.getElementById('create-room-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden'); // Return to home screen
        });
    });

    // Function to join a room
    function joinRoom(roomName) {
        const playerName = prompt('Enter your name:');
        if (!playerName) {
            alert('You must enter a name to join the room');
            return;
        }

        const playersRef = ref(database, 'rooms/' + roomName + '/players');
        push(playersRef, playerName).then(() => {
            currentPlayer = playerName;
            currentRoomName = roomName;

            document.getElementById('join-room-screen').classList.add('hidden');
            document.getElementById('game-room').classList.remove('hidden');
            document.getElementById('room-title').textContent = `Room: ${roomName}`;

            // Listen for messages in the room
            listenForMessages(roomName);
        });
    }

    // Listen for messages in the room
    function listenForMessages(roomName) {
        const messagesRef = ref(database, 'rooms/' + roomName + '/messages');
        onValue(messagesRef, (snapshot) => {
            const messagesData = snapshot.val();
            if (messagesData) {
                const messageDiv = document.getElementById('messages');
                messageDiv.innerHTML = ''; // Clear previous messages
                for (const messageKey in messagesData) {
                    const messageData = messagesData[messageKey];
                    displayMessage(messageData.player, messageData.message);
                }
            }
        });
    }

    // Event listener for sending a message
    document.getElementById('send-message-btn').addEventListener('click', function() {
        const message = document.getElementById('message').value.trim();
        if (!message) {
            alert('Please enter a message');
            return;
        }

        // Send message to Firebase
        const messageRef = ref(database, 'rooms/' + currentRoomName + '/messages');
        push(messageRef, {
            player: currentPlayer,
            message: message
        });

        document.getElementById('message').value = ''; // Clear message input
    });

    function displayMessage(player, message) {
        const messageDiv = document.getElementById('messages');
        const p = document.createElement('p');
        p.textContent = `${player}: ${message}`;
        messageDiv.appendChild(p);
    }

    // Event listener for back button in create room screen
    document.getElementById('back-to-home-btn-create').addEventListener('click', function() {
        document.getElementById('create-room-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
    });

    // Back button for join room screen
    document.getElementById('back-to-home-btn-join').addEventListener('click', function() {
        document.getElementById('join-room-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
    });
});

