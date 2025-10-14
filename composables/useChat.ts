import { ref, computed } from 'vue'
import { useWebSocket } from './useWebSocket'

export interface ChatMessage {
  id: string
  sender_id: number
  sender_name: string
  receiver_id: number
  content: string
  timestamp: string
  is_read: boolean
  message_type: 'text' | 'file' | 'image'
}

export interface ChatRoom {
  id: string
  participants: number[]
  last_message?: ChatMessage
  unread_count: number
}

export const useChat = () => {
  const { socket, isConnected, sendMessage, subscribeToChannel, unsubscribeFromChannel } = useWebSocket()
  
  const messages = ref<ChatMessage[]>([])
  const activeRoom = ref<ChatRoom | null>(null)
  const typingUsers = ref<Set<number>>(new Set())

  // ارسال پیام
  const sendChatMessage = (content: string, receiverId: number) => {
    if (!isConnected.value) {
      throw new Error('اتصال وب‌سوکت برقرار نیست')
    }

    const message: Omit<ChatMessage, 'id' | 'timestamp' | 'is_read'> = {
      sender_id: getCurrentUserId(), // باید از auth store گرفته شود
      sender_name: getCurrentUserName(), // باید از auth store گرفته شود
      receiver_id: receiverId,
      content,
      message_type: 'text'
    }

    sendMessage('chat', 'send_message', message)
  }

  // گوش دادن به پیام‌های جدید
  const listenToMessages = () => {
    subscribeToChannel('chat_message', (data) => {
      const message: ChatMessage = data.message
      messages.value.push(message)
      
      // به‌روزرسانی آخرین پیام در room
      if (activeRoom.value && 
          activeRoom.value.participants.includes(message.sender_id)) {
        activeRoom.value.last_message = message
        activeRoom.value.unread_count++
      }
    })

    // گوش دادن به وضعیت تایپ
    subscribeToChannel('user_typing', (data) => {
      if (data.user_id !== getCurrentUserId()) {
        typingUsers.value.add(data.user_id)
        
        // حذف بعد از 3 ثانیه
        setTimeout(() => {
          typingUsers.value.delete(data.user_id)
        }, 3000)
      }
    })

    // گوش دادن به خوانده شدن پیام
    subscribeToChannel('message_read', (data) => {
      const messageIndex = messages.value.findIndex(m => m.id === data.message_id)
      if (messageIndex !== -1) {
        messages.value[messageIndex].is_read = true
      }
    })
  }

  // ارسال وضعیت تایپ
  const sendTypingStatus = (receiverId: number, isTyping: boolean) => {
    sendMessage('chat', 'typing_status', {
      user_id: getCurrentUserId(),
      receiver_id: receiverId,
      is_typing: isTyping
    })
  }

  // علامت‌گذاری پیام به عنوان خوانده شده
  const markMessageAsRead = (messageId: string) => {
    sendMessage('chat', 'mark_read', { message_id: messageId })
  }

  // تغییر اتاق چت فعال
  const setActiveRoom = (room: ChatRoom) => {
    activeRoom.value = room
    // بارگذاری پیام‌های قبلی
    loadRoomMessages(room.id)
  }

  // بارگذاری پیام‌های اتاق
  const loadRoomMessages = async (roomId: string) => {
    try {
      // درخواست به API برای دریافت پیام‌های قبلی
      const response = await $fetch(`/api/chat/rooms/${roomId}/messages`)
      messages.value = response.data
    } catch (error) {
      console.error('خطا در بارگذاری پیام‌ها:', error)
    }
  }

  // پاک‌سازی
  const cleanup = () => {
    unsubscribeFromChannel('chat_message')
    unsubscribeFromChannel('user_typing')
    unsubscribeFromChannel('message_read')
  }

  return {
    messages: computed(() => messages.value),
    activeRoom: computed(() => activeRoom.value),
    typingUsers: computed(() => Array.from(typingUsers.value)),
    sendChatMessage,
    sendTypingStatus,
    markMessageAsRead,
    setActiveRoom,
    listenToMessages,
    cleanup
  }
}

// توابع کمکی (باید با سیستم auth شما تطبیق داده شود)
function getCurrentUserId(): number {
  // از auth store یا composable بگیرید
  return 1
}

function getCurrentUserName(): string {
  // از auth store یا composable بگیرید
  return 'کاربر'
}