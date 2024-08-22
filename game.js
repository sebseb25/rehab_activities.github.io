// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDdMQVAcHMJC6fTd5Q05hCsDvi9FFaDW-M",
    authDomain: "rehab-activities.firebaseapp.com",
    projectId: "rehab-activities",
    storageBucket: "rehab-activities.appspot.com",
    messagingSenderId: "96878771621",
    appId: "1:96878771621:web:931c27bf1eb4f9ca1dfc4"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let roomId;
let isGameStarted = false; // Flag to check if the game has started
let spy = ''; // Variable to hold the spy's identity
let currentUser; // Variable to hold the current user's name

// Create Room
document.getElementById('create-room').addEventListener('click', async () => {
    const roomName = document.getElementById('room-name').value;
    currentUser = prompt("Enter your name:");

    const roomRef = await db.collection('rooms').add({
        name: roomName,
        players: [currentUser], // Add the creator to players
        message: '',
        spy: ''
    });
    roomId = roomRef.id;
    document.getElementById('room-display').innerText = roomName;
    document.getElementById('room-setup').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');

    // Show the "Start Game" button only for the creator
    document.getElementById('start-game').classList.remove('hidden');

    // Listen for updates after room creation
    listenForUpdates(roomId);
});

// Join Room
document.getElementById('join-room').addEventListener('click', async () => {
    const roomName = document.getElementById('room-name').value;
    const roomSnapshot = await db.collection('rooms').where('name', '==', roomName).get();
    if (!roomSnapshot.empty) {
        roomId = roomSnapshot.docs[0].id;
        currentUser = prompt("Enter your name:");
        const roomRef = db.collection('rooms').doc(roomId);
        await roomRef.update({
            players: firebase.firestore.FieldValue.arrayUnion(currentUser) // Add the player to the array
        });
        document.getElementById('room-display').innerText = roomName;
        document.getElementById('room-setup').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');

        // Hide the "Start Game" button for players who did not create the room
        document.getElementById('start-game').classList.add('hidden');

        // Listen for updates after joining the room
        listenForUpdates(roomId);
    } else {
        alert('Room not found!');
    }
});

// Start Game
document.getElementById('start-game').addEventListener('click', async () => {
    const roomRef = db.collection('rooms').doc(roomId);
    const playersSnapshot = await roomRef.get();
    const players = playersSnapshot.data().players;

    // Filter out the game creator from the list of possible spies
    const possibleSpies = players.filter(player => player !== currentUser);
    const spyIndex = Math.floor(Math.random() * possibleSpies.length);
    spy = possibleSpies[spyIndex];

    await roomRef.update({
        spy: spy,
        message: ''
    });

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

    // Update the message in Firestore
    await roomRef.update({
        message: message
    });

    // Clear the message input after sending
    document.getElementById('message').value = '';

    // Notify all players except the spy and the sender
    const playersSnapshot = await roomRef.get();
    const players = playersSnapshot.data().players;

    // Loop through players to simulate sending messages
    players.forEach(player => {
        // Only notify non-spy players and not the sender
        if (player !== spy && player !== currentUser) {
            alert(`Message to ${player}: ${message}`); // Simulate sending message to non-spy players
        }
    });
});

// Listen for updates function
function listenForUpdates(roomId) {
    db.collection('rooms').doc(roomId).onSnapshot((doc) => {
        if (doc.exists) {  // Check if the document exists
            const data = doc.data();
            // Safely check if 'message' exists before accessing it
            if (data && typeof data.message !== 'undefined') {
                // Only show message if the user is not the spy and not the sender
                if (currentUser !== spy) {
                    alert(`New message: ${data.message}`);
                }
            } else {
                console.warn("Message data is undefined.");
            }
        } else {
            console.error("No such document!");
        }
    });
}
