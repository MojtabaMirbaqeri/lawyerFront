<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', { 'own': message.user?.id === currentUser?.id }]"
      >
        <strong>{{ message.user?.name || 'Unknown' }}:</strong> {{ message.message }}
      </div>
    </div>
    
    <div class="input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
      />
      <button @click="sendMessage" :disabled="!newMessage.trim()">
        Send
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useEcho } from '~/composables/useEcho'

const props = defineProps({
  roomId: {
    type: Number,
    required: true
  }
})

const { initEcho, joinChannel, leaveChannel } = useEcho()
const messages = ref([])
const newMessage = ref('')
const messagesContainer = ref(null)
const currentUser = ref(null) // برای چک own message

// فرض می‌کنیم currentUser از cookie یا API میاد
onMounted(() => {
  currentUser.value = { id: 1 } // جایگزین با داده واقعی از cookie/store
})

// تابع برای دریافت پیام‌های قبلی
const fetchMessages = async () => {
  try {
    const { data } = await useGet({
      url: `chat/rooms/${props.roomId}/messages`,
      includeAuthHeader: true
    })
    messages.value = data || [] // پیام‌های قبلی را در آرایه قرار می‌دهیم
    scrollToBottom()
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const messageText = newMessage.value
  try {
    const { data } = await usePost({
      url: `chat/rooms/${props.roomId}/messages`,
      body: { message: messageText },
      includeAuthHeader: true
    })
    // اضافه کردن پیام به صورت local برای feedback فوری
    messages.value.push({
      id: data.id || Date.now(),
      message: data.message || messageText,
      user: data.user || currentUser.value,
      created_at: data.created_at || new Date().toISOString()
    })
    newMessage.value = ''
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  initEcho()
  fetchMessages() // دریافت پیام‌های قبلی هنگام بارگذاری کامپوننت
  joinChannel(`chat.room.${props.roomId}`, '.chat.message', (data) => {
    messages.value.push(data)
    scrollToBottom()
  })
})

onUnmounted(() => {
  leaveChannel(`chat.room.${props.roomId}`)
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #ddd;
  overflow: auto;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin: 5px 0;
  padding: 5px;
}

.message.own {
  background-color: #e3f2fd;
  text-align: right;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex: 1;
  margin-right: 10px;
  padding: 5px;
}

.input-area button {
  padding: 5px 15px;
}
</style>