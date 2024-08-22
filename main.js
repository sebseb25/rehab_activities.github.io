import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdMQVAcHMJC6fTd5Q05hCsDvi9FFaDW-M",
    authDomain: "rehab-activities.firebaseapp.com",
    projectId: "rehab-activities",
    storageBucket: "rehab-activities.appspot.com",
    messagingSenderId: "96878771621",
    appId: "1:96878771621:web:931c27bf1eb4f9ca1dfc4c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User Authentication
signInAnonymously(auth).catch((error) => {
    console.error("Error signing in anonymously: ", error);
});

// Function to generate a random room code
function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Room creation
document.getElementById('createRoomBtn').addEventListener('click', () => {
    const roomCode = generateRoomCode();
    const userId = auth.currentUser.uid;

    setDoc(doc(db, 'rooms', roomCode), {
        creator: userId,
        participants: [{ userId: userId, name: "Room Creator" }],
        spyAssigned: false
    }).then(() => {
        document.getElementById('roomCode').textContent = `Room Code: ${roomCode}`;
        document.getElementById('startGame').style.display = 'block';
    });
});

// Join room with name input
document.getElementById('joinRoomBtn').addEventListener('click', () => {
    const roomCode = document.getElementById('roomInput').value.toUpperCase();
    const userName = document.getElementById('nameInput').value;
    const userId = auth.currentUser.uid;

    if (userName.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    getDoc(doc(db, 'rooms', roomCode)).then((doc) => {
        if (doc.exists()) {
            const roomData = doc.data();
            const newParticipant = { userId: userId, name: userName };

            if (!roomData.participants.some(participant => participant.userId === userId)) {
                roomData.participants.push(newParticipant);
                updateDoc(doc(db, 'rooms', roomCode), {
                    participants: roomData.participants
                });
            }

            document.getElementById('sendMessage').style.display = 'block';
            displayParticipants(roomData.participants);
        } else {
            alert("Room does not exist!");
        }
    });
});

// Function to display participants in the room
function displayParticipants(participants) {
    const participantList = document.createElement('ul');
    participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant.name;
        participantList.appendChild(listItem);
    });

    document.body.appendChild(participantList);
}

// Start the game and assign the spy
document.getElementById('startGameBtn').addEventListener('click', () => {
    const roomCode = document.getElementById('roomCode').textContent.split(': ')[1];
    const userId = auth.currentUser.uid;

    getDoc(doc(db, 'rooms', roomCode)).then((doc) => {
        if (doc.exists() && doc.data().creator === userId && !doc.data().spyAssigned) {
            const participants = doc.data().participants;
            const spyIndex = Math.floor(Math.random() * participants.length);
            const spyId = participants[spyIndex].userId;

            updateDoc(doc(db, 'rooms', roomCode), {
                spyId: spyId,
                spyAssigned: true
            });
        }
    });
});

// Send a message
document.getElementById('sendMessageBtn').addEventListener('click', () => {
    const roomCode = document.getElementById('roomInput').value.toUpperCase();
    const message = document.getElementById('messageInput').value;
    const userId = auth.currentUser.uid;

    getDoc(doc(db, 'rooms', roomCode)).then((doc) => {
        if (doc.exists()) {
            const roomData = doc.data();
            const spyId = roomData.spyId;
            const sender = roomData.participants.find(participant => participant.userId === userId);

            roomData.participants.forEach(participant => {
                if (participant.userId !== spyId) {
                    setDoc(collection(db, 'messages'), {
                        roomCode: roomCode,
                        userId: participant.userId,
                        senderName: sender.name,
                        message: message,
                        timestamp: serverTimestamp()
                    });
                }
            });
        }
    });
});

// Listen for and display messages
onSnapshot(collection(db, 'messages'), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            const messageData = change.doc.data();
            console.log(`${messageData.senderName}: ${messageData.message}`);
            // Display the message on the UI
        }
    });
});
