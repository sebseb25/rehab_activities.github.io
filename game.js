import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const db = getFirestore(); // Initialize Firestore

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
    async function showAvailableRooms() {
        const roomListDiv = document.getElementById('rooms');
        roomListDiv.innerHTML = ''; // Clear previous rooms

        const querySnapshot = await getDocs(collection(db, "rooms"));
        if (querySnapshot.empty) {
            roomListDiv.innerHTML = '<p>No rooms available.</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const roomButton = document.createElement('button');
            roomButton.textContent = doc.id;
            roomButton.classList.add('room');
            roomButton.addEventListener('click', function() {
                joinRoom(doc.id);
            });
            roomListDiv.appendChild(roomButton);
        });
    }

    // Event listener for creating a room
    document.getElementById('create-room-btn').addEventListener('click', async function() {
        const roomName = document.getElementById('room-name').value.trim();
        if (!roomName) {
            alert('Please enter a room name');
            return;
        }

        // Create room in Firestore
        try {
            await addDoc(collection(db, "rooms"), { players: [] });
            alert(`Room "${roomName}" created!`);
            document.getElementById('room-name').value = ''; // Clear input
            document.getElementById('create-room-screen').classList.add('hidden');
            document.getElementById('home-screen').classList.remove('hidden'); // Return to home screen
        } catch (e) {
            alert('Error creating room: ' + e.message);
        }
    });

    // Function to join a room
    async function joinRoom(roomName) {
        const playerName = prompt('Enter your name:');
        if (!playerName) {
            alert('You must enter a name to join the room');
            return;
        }

        // Add player to the room in Firestore
        const roomRef = doc(db, "rooms", roomName);
        await updateDoc(roomRef, {
            players: arrayUnion(playerName)
        });

        currentPlayer = playerName;
        currentRoomName = roomName;

        document.getElementById('join-room-screen').classList.add('hidden');
        document.getElementById('game-room').classList.remove('hidden');
        document.getElementById('room-title').textContent = `Room: ${roomName}`;

        // Listen for messages in the room
        listenForMessages(roomName);
    }

    // Listen for messages in the room
    function listenForMessages(roomName) {
        const messagesRef = collection(db, "rooms", roomName, "messages");
        onSnapshot(messagesRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const messageData = change.doc.data();
                    displayMessage(messageData.player, messageData.message);
                }
            });
        });
    }

    // Event listener for sending a message
    document.getElementById('send-message-btn').addEventListener('click', async function() {
        const message = document.getElementById('message').value.trim();
        if (!message) {
            alert('Please enter a message');
            return;
        }

        // Send message to Firestore
        const messagesRef = collection(db, "rooms", currentRoomName, "messages");
        await addDoc(messagesRef, {
            player: currentPlayer,
            message: message
        });

        document.getElementById('message').value = ''; // Clear message input
    });

    // Function to display messages
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
