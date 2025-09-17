<template>
  <div class="chat-test-container">
    <h1 class="text-red-500 text-lg font-semibold">RoomId: {{ currentRoomId }}</h1>
    <!-- Messages -->
    <div ref="messagesContainer" id="messages" class="messages-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['msg', msg.mine ? 'me' : 'other']">
        {{ msg.user?.name || "" }} {{ msg.user?.family || "" }}: {{ msg.message }}
      </div>
    </div>

    <!-- Send Message -->
    <div class="section">
      <input
        v-model="messageInput"
        @keyup.enter="handleSendMessage"
        placeholder="Type message..."
        :disabled="!currentRoomId || sendStatus.loading"
        class="message-input bg-blue-300" />
      <button
        class="bg-amber-300"
        @click="handleSendMessage"
        :disabled="!currentRoomId || sendStatus.loading || !messageInput.trim()">
        {{ sendStatus.loading ? "..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();

// Reactive data
const userId = ref(authStore.user?.id);
const roomId = ref(1);
const currentRoomId = ref(null);
const messages = ref([]);
const messageInput = ref("");
const messagesContainer = ref(null);

// Status objects

const sendStatus = ref({
  loading: false,
  message: "",
  type: "",
});

// Join room handler
const handleJoinRoom = async () => {
  if (!window.Echo) {
    alert("Echo not initialized");
    return;
  }

  // Cleanup previous room listeners
  cleanupEchoListeners();
  currentRoomId.value = Number(roomId.value);

  try {
    // Join the chat room via API
    await usePost({
      url: `chat/rooms/${currentRoomId.value}/join`,
      includeAuthHeader: true,
    });

    // Load last messages

    const { data: messagesData } = await useGet({
      url: `chat/rooms/${currentRoomId.value}/messages`,
      includeAuthHeader: true,
    });

    messages.value = [];
    if (messagesData && Array.isArray(messagesData)) {
      messagesData.forEach((m) => {
        appendMessage(
          {
            user: m.user,
            message: m.message,
            created_at: m.created_at,
          },
          false
        ); // همه پیام‌های قدیمی رو به عنوان other نمایش بده
      });
    }

    // Listen for new messages - اینجا مهمه!
    setupEchoListeners();
  } catch (error) {
    console.error("Join room error:", error);
  }
};

// Setup Echo listeners
const setupEchoListeners = () => {
  if (!window.Echo || !currentRoomId.value) return;

  const channelName = `chat.room.${currentRoomId.value}`;
  console.log("Setting up listeners for channel:", channelName);

  // First, leave any existing channels to avoid conflicts
  if (window.Echo.connector.channels[channelName]) {
    window.Echo.leave(channelName);
    console.log("Left existing channel:", channelName);
  }

  // Join the specific room channel
  const channel = window.Echo.private(channelName);
  console.log("📡 Channel created:", channel);

  // فقط این listener که کار میکنه رو نگه میداریم
  channel.listen(".chat.message", (data) => {
    console.log("📨 Received message via Echo:", data);
    if (data && data.message) {
      // چک کنیم پیام از خود کاربر هست یا نه
      const isMyMessage = data.message.user?.id === userId.value;

      appendMessage(
        {
          user: data.message.user,
          message: data.message.message,
          created_at: data.message.created_at,
        },
        isMyMessage
      );
    }
  });

  console.log("✅ Echo listeners setup complete for room:", currentRoomId.value);
};

// Send message handler
const handleSendMessage = async () => {
  const message = messageInput.value.trim();
  if (!message) return;

  sendStatus.value = { loading: true, message: "...", type: "info" };

  try {
    const res = await usePost({
      url: `chat/rooms/${currentRoomId.value}/messages`,
      body: { message },
      includeAuthHeader: true,
    });

    if (res) {
      messageInput.value = "";
      sendStatus.value = {
        loading: false,
        message: "✅ Sent",
        type: "success",
      };
    } else {
      throw new Error("Send failed");
    }
  } catch (error) {
    console.error("Send message error:", error);
    sendStatus.value = {
      loading: false,
      message: "❌ Send failed",
      type: "error",
    };
  }
};

// Append message to list
const appendMessage = (msgData, mine = false) => {
  messages.value.push({
    ...msgData,
    mine,
  });

  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Cleanup Echo listeners
const cleanupEchoListeners = () => {
  if (!window.Echo) return;

  // Leave all channels
  Object.keys(window.Echo.connector.channels).forEach((channelName) => {
    console.log("Leaving channel:", channelName);
    window.Echo.leave(channelName);
  });

  console.log("🧹 Echo listeners cleaned up");
};

// Cleanup on unmount
onUnmounted(() => {
  cleanupEchoListeners();
  if (import.meta.client && window.Echo) {
    try {
      window.Echo.disconnect();
    } catch (e) {
      console.log("Error disconnecting Echo on unmount:", e);
    }
  }
});

onMounted(async () => {
  await nextTick(async () => {
    const authToken = useCookie("jwtToken").value;

    if (window.initEcho) {
      await window.initEcho(authToken);
      handleJoinRoom();
    }
  });
});
</script>

<style scoped>
.chat-test-container {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  margin: 20px;
}

.section {
  margin: 10px 0;
}

.messages-container {
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  margin: 10px 0;
  background-color: #fafafa;
}

.msg {
  margin: 6px 0;
  padding: 4px 8px;
  border-radius: 4px;
}

.msg.me {
  color: #2563eb;
  background-color: #eff6ff;
}

.msg.other {
  color: #111827;
  background-color: #f3f4f6;
}

.status {
  margin-left: 10px;
  font-weight: bold;
}

.status.success {
  color: #059669;
}

.status.error {
  color: #dc2626;
}

.status.info {
  color: #2563eb;
}

.message-input {
  width: 70%;
  padding: 8px;
  margin-right: 10px;
}

input,
button {
  padding: 8px 12px;
  margin: 0 5px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
