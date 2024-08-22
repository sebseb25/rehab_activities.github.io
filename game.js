// Import the Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, updateDoc, arrayUnion, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdMQVAcHMJC6fTd5Q05hCsDvi9FFaDW-M",
    authDomain: "rehab-activities.firebaseapp.com",
    projectId: "rehab-activities",
    storageBucket: "rehab-activities.appspot.com",
    messagingSenderId: "96878771621",
    appId: "1:96878771621:web:931c27bf1eb4f9ca1dfc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let roomId;
let isGameStarted = false; // Flag to check if the game has started
let playerName; // Store the player's name
let spyName; // Store the spy's name

// Create Room
document.getElementById('create-room').addEventListener('click', async () => {
    playerName = prompt("Enter your name:");
    const roomName = document.getElementById('room-name').value;

    const roomRef = await addDoc(collection(db, 'rooms'), {
        name: roomName,
        players: [playerName], // Add the creator to players
        message: '',
        spy: ''
    });
    roomId = roomRef.id;
    document.getElementById('room-display').innerText = roomName;
    document.getElementById('room-setup').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
});

// Join Room
document.getElementById('join-room').addEventListener('click', async () => {
    playerName = prompt("Enter your name:");
    const roomName = document.getElementById('room-name').value;
    const roomSnapshot = await getDocs(collection(db, 'rooms')).where('name', '==', roomName);
    if (!roomSnapshot.empty) {
        roomId = roomSnapshot.docs[0].id;
        const roomRef = db.collection('rooms').doc(roomId);
        await updateDoc(roomRef, {
            players: arrayUnion(playerName) // Add the player to the array
        });
        document.getElementById('room-display').innerText = roomName;
        document.getElementById('room-setup').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
    } else {
        alert('Room not found!');
    }
});

// Start Game
document.getElementById('start-game').addEventListener('click', async () => {
    const roomRef = db.collection('rooms').doc(roomId);
    const playersSnapshot = await getDoc(roomRef);
    const players = playersSnapshot.data().players;
    const spyIndex = Math.floor(Math.random() * players.length);
    spyName = players[spyIndex]; // Set the spy's name

    await updateDoc(roomRef, {
        spy: spyName,
        message: ''
    });

    // Notify all players
    alert(`Spy is selected. Start sending messages.`);
    isGameStarted = true; // Set the flag to true when the game starts
    document.getElementById('message-container').classList.remove('hidden');
});

// Send Message
document.getElementById('send-message').addEventListener('click', async () => {
    if (!isGameStarted) {
        alert("The game hasn't started yet!");
        return;
    }

    const message = document.getElementById('message').value;
    const roomRef = db.collection('rooms').doc(roomId);
    await updateDoc(roomRef, {
        message: message
    });
});

// Listen for updates
const roomRef = db.collection('rooms').doc(roomId);
onSnapshot(roomRef, (doc) => {
    const data = doc.data();
    if (data.message) {
        // Notify players
        if (playerName !== spyName) {
            console.log(`New message: ${data.message}`); // Log the message for non-spies
        }
    }
});
