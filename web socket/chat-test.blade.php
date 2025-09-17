<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Chat Test - Laravel Echo Server</title>
    @vite(['resources/js/chat-test.js'])
    <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 20px; }
        #messages { border: 1px solid #ddd; height: 300px; overflow-y: auto; padding: 10px; margin-top: 10px; }
        .msg { margin: 6px 0; }
        .me { color: #2563eb; }
        .other { color: #111827; }
        .status { margin-left: 10px; font-weight: bold; }
        .success { color: #059669; }
        .error { color: #dc2626; }
        .info { color: #2563eb; }
    </style>
</head>
<body>
<h2>Realtime Chat Test (Laravel Echo Server + Socket.IO)</h2>
<p><strong>Channel:</strong> <code>chat.room.{roomId}</code> | <strong>Event:</strong> <code>chat.message</code></p>

<div>
    <label>User ID: <input id="userId" type="number" value="1" /></label>
    <button id="loginBtn">Get Token</button>
    <span id="authStatus" class="status"></span>
</div>

<div style="margin-top: 10px;">
    <label>Room ID: <input id="roomId" type="number" value="1" /></label>
    <button id="joinBtn">Join Room</button>
    <span id="joinStatus" class="status"></span>
</div>

<div id="messages"></div>

<div style="margin-top: 10px;">
    <input id="messageInput" placeholder="Type message..." style="width: 80%;" />
    <button id="sendBtn">Send</button>
    <span id="sendStatus" class="status"></span>
</div>

</body>
</html>


