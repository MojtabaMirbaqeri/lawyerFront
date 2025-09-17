import './bootstrap';
import Echo from 'laravel-echo';
import io from 'socket.io-client';

window.io = io;

let echoInstance = null;
let authToken = null;
let currentRoomId = null;

const els = {
  userId: document.getElementById('userId'),
  loginBtn: document.getElementById('loginBtn'),
  authStatus: document.getElementById('authStatus'),
  roomId: document.getElementById('roomId'),
  joinBtn: document.getElementById('joinBtn'),
  joinStatus: document.getElementById('joinStatus'),
  messages: document.getElementById('messages'),
  messageInput: document.getElementById('messageInput'),
  sendBtn: document.getElementById('sendBtn'),
  sendStatus: document.getElementById('sendStatus'),
};

function initEcho() {
  if (!authToken) return;
  if (echoInstance) {
    try { echoInstance.disconnect(); } catch (_) {}
    echoInstance = null;
  }

  echoInstance = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname,
    auth: {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
        'Authorization': `Bearer ${authToken}`,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      }
    },
    transports: ['ws', 'wss', 'websocket', 'polling', 'flashsocket']
  });

  // Listen for chat messages
  echoInstance.connector.socket.on('chat.message', (channel, data) => {
    if (data && data.message) {
      appendMessage(data.message, false);
    }
  });
}

function appendMessage({ user, message, created_at }, mine = false) {
  const div = document.createElement('div');
  div.className = `msg ${mine ? 'me' : 'other'}`;
  const name = user?.name || '';
  const family = user?.family || '';
  div.textContent = `${name} ${family}: ${message}`;
  els.messages.appendChild(div);
  els.messages.scrollTop = els.messages.scrollHeight;
}

els.loginBtn.addEventListener('click', async () => {
  els.authStatus.textContent = '...';
  els.authStatus.className = 'status info';
  const id = els.userId.value;
  try {
    const res = await fetch(`/api/test-login/${id}`);
    const data = await res.json();
    authToken = data.token;
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    els.authStatus.textContent = `✅ Logged in as ${data.user.name || ''} ${data.user.family || ''}`;
    els.authStatus.className = 'status success';
    initEcho();
  } catch (e) {
    console.error(e);
    els.authStatus.textContent = '❌ Login failed';
    els.authStatus.className = 'status error';
  }
});

els.joinBtn.addEventListener('click', async () => {
  if (!authToken) return alert('Login first');
  if (!echoInstance) return alert('Echo not initialized');
  
  els.joinStatus.textContent = '...';
  els.joinStatus.className = 'status info';
  currentRoomId = Number(els.roomId.value);
  
  try {
    // Join the chat room
    await window.axios.post(`/api/chat/rooms/${currentRoomId}/join`);
    els.joinStatus.textContent = '✅ Joined';
    els.joinStatus.className = 'status success';

    // Load last messages
    const res = await window.axios.get(`/api/chat/rooms/${currentRoomId}/messages`);
    els.messages.innerHTML = '';
    res.data.forEach(m => appendMessage({
      user: m.user,
      message: m.message,
      created_at: m.created_at,
    }, m.user?.id === undefined));

  } catch (e) {
    console.error(e);
    els.joinStatus.textContent = '❌ Join failed';
    els.joinStatus.className = 'status error';
  }
});

els.sendBtn.addEventListener('click', async () => {
  if (!authToken) return alert('Login first');
  if (!currentRoomId) return alert('Join a room first');
  const message = els.messageInput.value.trim();
  if (!message) return;
  
  els.sendStatus.textContent = '...';
  els.sendStatus.className = 'status info';
  
  try {
    const res = await window.axios.post(`/api/chat/rooms/${currentRoomId}/messages`, { message });
    appendMessage({ user: res.data.user, message: res.data.message, created_at: res.data.created_at }, true);
    els.messageInput.value = '';
    els.sendStatus.textContent = '✅ Sent';
    els.sendStatus.className = 'status success';
  } catch (e) {
    console.error(e);
    els.sendStatus.textContent = '❌ Send failed';
    els.sendStatus.className = 'status error';
  }
});


