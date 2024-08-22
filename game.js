<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Who is the Spy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .hidden {
            display: none;
        }
        .room {
            margin: 10px;
        }
    </style>
</head>
<body>
    <h1>Who is the Spy</h1>

    <div id="home-screen">
        <button id="create-room-option">Create Room</button>
        <button id="join-room-option">Join Room</button>
    </div>

    <div id="create-room-screen" class="hidden">
        <h2>Create Room</h2>
        <input type="text" id="room-name" placeholder="Room Name" required>
        <button id="create-room-btn">Create Room</button>
        <button id="back-to-home-btn-create">Back</button>
    </div>

    <div id="join-room-screen" class="hidden">
        <h2>Available Rooms</h2>
        <div id="rooms"></div>
        <button id="back-to-home-btn-join">Back</button>
    </div>

    <div id="game-room" class="hidden">
        <h2 id="room-title"></h2>
        <textarea id="message" placeholder="Enter your message"></textarea>
        <button id="send-message-btn">Send Message</button>
        <div id="message-board">
            <h3>Messages:</h3>
            <div id="messages"></div>
        </div>
    </div>

    <script type="module">
        // Your web app's Firebase configuration
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId:
