// Import the Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-firestore.js";

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

// Create Room
document.getElementById('create-room').addEventListener('click', async () => {
    const roomName = document.getElementById('room-name').value;
    const playerName = prompt("Enter your name:");

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
    const roomName = document.getElementById('room-name').value;
    const roomSnapshot = await getDocs(collection(db, 'rooms')).where('name', '==', roomName);
    if (!roomSnapshot.empty) {
        roomId = roomSnapshot.docs[0].id;
        const playerName = prompt("Enter your name:");
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
    const spy = players[spyIndex];

    await updateDoc(roomRef, {
        spy: spy,
        message: ''
    });

    // Notify all players
    alert(`Spy is ${spy}`);
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
    if (data.message && data.spy) {
        alert(`New message: ${data.message}`);
    }
});
