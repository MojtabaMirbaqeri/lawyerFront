/* eslint-disable nuxt/prefer-import-meta */
import Echo from 'laravel-echo'
import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.io = io

    // Disconnect if exists
    if (window.Echo) {
      window.Echo.disconnect()
    }


    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: 'https://api.vakilvakil.com',
      auth: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Authorization': `Bearer ${useCookie('jwtToken').value || ''}`,
          'X-CSRF-TOKEN': `${useCookie('csrf_token').value || ''}`,
        }
      },
      transports: ['polling', 'websocket'], // فعال کردن websocket
      timeout: 20000,
      forceNew: true,
      upgrade: true, // فعال کردن upgrade
      rememberUpgrade: false,
      autoConnect: true, // فعال کردن اتصال خودکار
      reconnection: true, // فعال کردن reconnection
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    console.log('Echo instance created:', window.Echo)

    // Connection listeners
    window.Echo.connector.socket.on('connect', () => {
      console.log('✅ Connected to Echo Server')
    })

    window.Echo.connector.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from Echo Server:', reason)
    })

    window.Echo.connector.socket.on('connect_error', (error) => {
      console.error('🚨 Echo connection error:', error)
      if (error.message && error.message.includes('401')) {
        console.warn('Authentication failed - check JWT token')
      }
    })

    window.Echo.connector.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`)
    })

    window.Echo.connector.socket.on('reconnect_error', (error) => {
      console.error('🚨 Reconnection failed:', error)
    })

    window.Echo.connector.socket.on('reconnect_failed', () => {
      console.error('🚨 All reconnection attempts failed')
    })
  }
})