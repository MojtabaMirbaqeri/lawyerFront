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
      host: 'https://dev.vakilinja.com', // مطمئن شوید که این آدرس درست است
      auth: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'Authorization': `Bearer ${useCookie('jwtToken').value || ''}`,
          'X-CSRF-TOKEN': `${useCookie('csrf_token').value || ''}`,
        }
      },
      transports: ['ws', 'wss', 'websocket', 'polling', 'flashsocket']
    })

    console.log('Echo instance created:', window.Echo)
  }
})