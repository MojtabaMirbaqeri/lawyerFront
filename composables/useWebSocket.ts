/* eslint-disable @typescript-eslint/consistent-type-imports */
import { io, Socket } from 'socket.io-client'
import { ref, onMounted, onUnmounted } from 'vue'

export const useWebSocket = () => {
  const config = useRuntimeConfig()
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  console.log(config.public.host);
  

  // اتصال به سرور وب‌سوکت
  const connect = () => {
    try {
      const wsUrl = `${config.public.scheme}://${config.public.host}`

      console.log(wsUrl);
      
      
      socket.value = io(wsUrl, {
        auth: {
          app_id: config.public.appId,
          app_key: config.public.appKey,
          app_secret: config.public.appSecret
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      // رویدادهای اتصال
      socket.value.on('connect', () => {
        console.log('متصل به سرور وب‌سوکت')
        isConnected.value = true
        connectionError.value = null
      })

      socket.value.on('disconnect', (reason) => {
        console.log('قطع اتصال از سرور:', reason)
        isConnected.value = false
      })

      socket.value.on('connect_error', (error) => {
        console.error('خطا در اتصال:', error)
        connectionError.value = error.message
        isConnected.value = false
      })

      socket.value.on('reconnect', (attemptNumber) => {
        console.log('اتصال مجدد موفق:', attemptNumber)
        isConnected.value = true
        connectionError.value = null
      })

      socket.value.on('reconnect_error', (error) => {
        console.error('خطا در اتصال مجدد:', error)
        connectionError.value = error.message
      })

    } catch (error) {
      console.error('خطا در ایجاد اتصال:', error)
      connectionError.value = 'خطا در ایجاد اتصال'
    }
  }

  // قطع اتصال
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  // ارسال پیام
  const sendMessage = (channel: string, event: string, data: any) => {
    if (socket.value && isConnected.value) {
      socket.value.emit(event, {
        channel,
        data,
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error('اتصال وب‌سوکت برقرار نیست')
    }
  }

  // گوش دادن به کانال
  const subscribeToChannel = (channel: string, callback: (data: any) => void) => {
    if (socket.value) {
      socket.value.on(channel, callback)
    }
  }

  // لغو اشتراک از کانال
  const unsubscribeFromChannel = (channel: string) => {
    if (socket.value) {
      socket.value.off(channel)
    }
  }

  // پاک‌سازی در زمان unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage,
    subscribeToChannel,
    unsubscribeFromChannel
  }
}