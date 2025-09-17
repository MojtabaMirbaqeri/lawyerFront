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
      host: 'wss://dev.vakilinja.com', // یا از runtimeConfig بگیر
      auth: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Authorization': `Bearer ${useCookie('jwtToken').value || ''}`, // مطمئن شو token موجوده
          'X-CSRF-TOKEN': `${useCookie('csrf_token').value || ''}`,
        }
      },
      transports: ['ws', 'wss', 'websocket', 'polling', 'flashsocket']
    })

    console.log('Echo instance created:', window.Echo)

    // Connection listeners (بدون store)
    window.Echo.connector.socket.on('connect', () => {
      console.log('Connected to Echo Server')
      // اگر نیاز به store داری، از Pinia استفاده کن
    })

    window.Echo.connector.socket.on('disconnect', () => {
      console.log('Disconnected from Echo Server')
    })
  }
})