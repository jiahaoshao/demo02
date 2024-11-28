<template>
  <div>
    <el-dialog class="chat-app"
               :visible.sync="localdialogVisible"
               width="100%"
               :before-close="handleClose">
      <template #title>
        <span class="highlight-username">{{ username }}</span>
      </template>
      <div v-for="(message, index) in messages" :key="index" :class="[
  { 'self-message': message.self && (message.sender === fathername) },
  { 'other-message': !message.self || (message.sender !== fathername) }
]">
        <strong>{{ message.sender }}:</strong> {{ message.content }} <small>({{ message.timestamp }})</small>
      </div>
<!--      <div v-for="(message, index) in messages" :key="index" :class="{'self-message': message.isSelf, 'other-message': !message.isSelf}">-->
<!--        <strong>{{ message.sender }}:</strong> {{ message.content }} <small>({{ message.timestamp }})</small>-->
<!--      </div>-->
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </el-dialog>
  </div>
</template>

<script>
import { SearchMessage, SendMessage } from '@/router/user'

export default {
  props: {
    talkdialog: {
      type: Boolean,
      required: true
    },
    // eslint-disable-next-line vue/require-prop-type-constructor
    Username: '',
    // eslint-disable-next-line vue/require-prop-type-constructor
    FatherName: ''
  },
  data () {
    return {
      webSocket: null,
      messages: [],
      newMessage: '',
      localdialogVisible: this.talkdialog,
      username: this.Username,
      fathername: this.FatherName
    }
  },
  mounted () {
    this.load()
  },
  created () {
    this.connectWebSocket()
  },
  beforeDestroy () {
    this.disconnectWebSocket()
  },
  methods: {
    load () {
      SearchMessage(this.fathername, this.username)
        .then((res9) => {
          console.log(res9)
          if (Array.isArray(res9.data) && res9.data.length > 0) {
            // 直接将 res9.data 赋值给 this.messages
            this.messages = res9.data
          } else {
            // 如果 res9.data 不是数组或为空，可以选择设置 this.messages 为空数组
            this.messages = []
          }
        })
        .catch((err) => {
          console.log(err);
          // 处理 SearchMessage 请求失败的情况
          // 可以选择在这里设置一个错误消息或空数组给 this.messages
          this.messages = []; // 或者设置一个错误状态
        });
    },
    connectWebSocket () {
      this.webSocket = new WebSocket(`ws://localhost:3000?userId=${this.fathername}`)

      this.webSocket.onopen = () => {
        console.log('WebSocket connection opened')
      }

      this.webSocket.onmessage = (event) => {
        // 假设服务器发送的消息格式是 JSON 字符串，包含 sender 和 timestamp 字段
        const messageData = JSON.parse(event.data)
        this.messages.push({
          sender: messageData.senderId,
          content: messageData.content,
          timestamp: messageData.time,
          isSelf: false// 如果服务器没有发送时间戳，这里使用当前时间
        })
      }

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
    sendMessage () {
      if (this.newMessage.trim() !== '') {
        const message = {
          sender: this.fathername,
          content: this.newMessage,
          // timestamp: new Date().getTime() // 添加时间戳
          timestamp: new Date(new Date(new Date().getTime()).toISOString()).toLocaleTimeString(),
          receiver: this.username,
          self: true
        }
        this.webSocket.send(JSON.stringify(message)) // 发送 JSON 字符串
        this.messages.push(message) // 直接将对象添加到 messages 数组
        this.newMessage = ''
        // eslint-disable-next-line new-cap,no-undef
        // console.log(new Date(new Date(new Date().getTime()).toISOString()).toLocaleTimeString())
        SendMessage(this.fathername, this.username, message).then(response => {
          // 处理成功响应
          console.log('Message sent successfully', response)
        }).catch(error => {
          // 处理错误响应
          console.error('Error sending message', error)
        })
      }
    },
    handleClose () {
      // eslint-disable-next-line vue/no-mutating-props
      this.localdialogVisible = false
      this.$emit('flesh')
    }
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  padding: 1px;
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

.highlight-username {
  font-size: 18px; /* 或更大的字体大小 */
  color: #ff0000; /* 醒目的颜色，如红色 */
  font-weight: bold; /* 加粗字体 */
  background-color: #ffffcc; /* 浅黄色背景，与红色文字形成对比 */
  padding: 2px 5px; /* 添加一些内边距，使背景色更明显 */
  border-radius: 3px; /* 圆角边框，使外观更柔和 */
}
.message {
  /* 通用的消息样式 */
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

.self-message {
  background-color: #dcf8c6; /* 浅绿色或其他表示自己的颜色 */
  text-align: right;
  /* 可以添加其他样式，如边框、阴影等 */
}

.other-message {
  background-color: #f2f2f2; /* 浅灰色或其他表示对方的颜色 */
  text-align: left;
  /* 可以添加其他样式，如边框、阴影等 */
}
</style>
