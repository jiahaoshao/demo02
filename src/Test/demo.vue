<template>
  <div class="chat-app">
    <div v-for="(message, index) in messages" :key="index" class="message">
      <strong>{{ message.sender }}:</strong> {{ message.content }} <small>({{ new Date(message.timestamp).toLocaleTimeString() }})</small>
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      webSocket: null,
      messages: [],
      newMessage: ''
    }
  },
  created () {
    this.connectWebSocket()
  },
  beforeDestroy () {
    this.disconnectWebSocket()
  },
  methods: {
    connectWebSocket () {
      this.webSocket = new WebSocket('ws://localhost:3000')

      this.webSocket.onopen = () => {
        console.log('WebSocket connection opened')
      }

      this.webSocket.onmessage = (event) => {
        // 假设服务器发送的消息格式是 JSON 字符串，包含 sender 和 timestamp 字段
        const messageData = JSON.parse(event.data)
        this.messages.push({
          sender: messageData.sender,
          content: messageData.content,
          timestamp: new Date().getTime() // 如果服务器没有发送时间戳，这里使用当前时间
        })
      }

      // this.webSocket.onmessage = (event) => {
      //   const newMessage = event.data
      //   this.messages.push(newMessage)
      // }

      this.webSocket.onclose = () => {
        console.log('WebSocket connection closed')
        // Optionally, try to reconnect here
      }

      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    },
    disconnectWebSocket () {
      if (this.webSocket) {
        this.webSocket.close()
        this.webSocket = null
      }
    },
    // sendMessage () {
    //   if (this.newMessage.trim() !== '') {
    //     this.webSocket.send(this.newMessage)
    //     this.messages.push(`You: ${this.newMessage}`)
    //     this.newMessage = ''
    //   }
    // }

    sendMessage() {
      if (this.newMessage.trim() !== '') {
        const message = {
          sender: 'You',
          content: this.newMessage,
          timestamp: new Date().getTime() // 添加时间戳
        };
        this.webSocket.send(JSON.stringify(message)) // 发送 JSON 字符串
        this.messages.push(message) // 直接将对象添加到 messages 数组
        this.newMessage = ''
      }
    }
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.message {
  margin: 5px 0;
}

input, button {
  padding: 10px;
  font-size: 16px;
}

button {
  margin-top: 10px;
}
</style>
