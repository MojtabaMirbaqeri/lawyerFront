/* eslint-disable nuxt/prefer-import-meta */
export const useEcho = () => {
  const echo = ref(null)
  const isConnected = ref(false)

  const initEcho = () => {
    if (process.client && window.Echo) {
      echo.value = window.Echo
      
      // Connection status listeners
      echo.value.connector.socket.on('connect', () => {
        isConnected.value = true
        console.log('Connected to Echo Server')
      })

      echo.value.connector.socket.on('disconnect', () => {
        isConnected.value = false
        console.log('Disconnected from Echo Server')
      })
    }
  }

  const joinChannel = (channelName, eventName, callback) => {
    if (echo.value) {
      echo.value.private(channelName).listen(eventName, callback)
      console.log(`Subscribed to channel: ${channelName}`)
    }
  }

  const leaveChannel = (channelName) => {
    if (echo.value) {
      echo.value.leaveChannel(channelName)
      console.log(`Unsubscribed from channel: ${channelName}`)
    }
  }

  const disconnect = () => {
    if (echo.value) {
      echo.value.disconnect()
    }
  }

  return {
    echo: readonly(echo),
    isConnected: readonly(isConnected),
    initEcho,
    joinChannel,
    leaveChannel,
    disconnect
  }
}