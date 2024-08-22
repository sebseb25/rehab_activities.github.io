// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdMQVAcHMJC6fTd5Q05hCsDvi9FFaDW-M",
    authDomain: "rehab-activities.firebaseapp.com",
    projectId: "rehab-activities",
    storageBucket: "rehab-activities.appspot.com",
    messagingSenderId: "96878771621",
    appId: "1:96878771621:web:931c27bf1eb4f9ca1dfc4c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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

        database.ref('rooms').on('value', (snapshot) => {
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

        // Check if room already exists in Firebase
        database.ref('rooms/' + roomName).once('value', (snapshot) => {
            if (snapshot.exists()) {
                alert('Room already exists. Choose a different name.');
                return;
            }

            // Create room in Firebase
            database.ref('rooms/' + roomName).set({ players: [] });
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

        // Add player to the room in Firebase
        database.ref('rooms/' + roomName + '/players').push(playerName).then(() => {
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
        database.ref('rooms/' + roomName + '/messages').on('child_added', (snapshot) => {
            const messageData = snapshot.val();
            displayMessage(messageData.player, messageData.message);
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
        database.ref('rooms/' + currentRoomName + '/messages').push({
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
