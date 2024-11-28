<template>
  <div>
    <!-- 图片生成部分 -->
    <input type="text" v-model="description" placeholder="请描述你要生成的图片信息">
    <button @click="loadImage">生成</button>
    <img :src="imageSrc" alt="Generated Image" v-if="imageSrc" class="pic"/>
    <p v-else>Loading image...</p>

    <!-- 聊天模块 -->
    <div class="chat-container">
      <input type="text" v-model="chatMessage" placeholder="输入聊天消息">
      <button @click="sendChatMessage">发送</button>
      <div class="chat-logs">
        <p v-for="(message, index) in chatLogs" :key="index">{{ message }}</p>
      </div>
    </div>

    <!-- 音乐生成模块（简单示例）-->
    <div class="music-container">
      <input type="text" v-model="musicDescription" placeholder="描述你想要的音乐特征">
      <button @click="generateMusic">生成音乐</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      description: '',
      imageSrc: null,
      chatMessage: '', // 新增：用于存储聊天消息
      chatLogs: [], // 新增：用于存储聊天日志
      musicDescription: '' // 新增：用于存储音乐的描述
    }
  },
  methods: {
    async loadImage () {
      try {
        const response = await fetch('/AI', {
          method: 'POST', // 或者 'GET'，取决于您的后端路由设置
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ // 将数据对象序列化为 JSON 字符串
            prompt: this.description // 将 prompt 作为数据对象的一个属性
          })
        })

        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText)
        }

        // 解析 JSON 响应
        const data = await response.json()

        // 检查响应是否成功，并提取图像数据
        if (data.success && data.image_data) {
          // 创建 Base64 数据 URL
          this.imageSrc = 'data:image/png;base64,' + data.image_data
        } else {
          // 处理错误情况，例如显示错误消息
          alert('Failed to load image data.')
        }
      } catch (error) {
        console.error('Error loading image:', error)
        // 处理网络错误或解析错误
        alert('Failed to load image: ' + error.message)
      }
    },
    async sendChatMessage () {
      try {
        const response = await fetch('/AI/chat', { // 假设后端有一个/chat路径来处理聊天消息
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ // 这里假设您需要发送一个包含聊天消息的对象到后端
            // 假设后端期望接收一个名为"message"的字段
            message: this.chatMessage
          })
        })

        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText)
        }

        const data = await response.json()

        // 根据后端返回的数据结构处理响应
        if (data.status === 'success') {
          const formattedContent = data.content.replace(/\n/g, '')
          // 后端返回了成功状态和内容
          this.chatLogs.push({
            // type: 'server', // 可以添加一个类型字段来区分是用户消息还是服务器消息
            message: formattedContent // 将服务器返回的内容添加到聊天日志中
          })
        } else if (data.status === 'error') {
          // 后端返回了错误状态和信息
          alert('Server error: ' + data.message) // 显示服务器错误信息
        }

        // 清空输入框
        this.chatMessage = ''
      } catch (error) {
        console.error('Error sending chat message:', error)
        alert('Failed to send chat message: ' + error.message)
      }
    },
    async generateMusic () {
      try {
        const response = await fetch('/MUSIC', { // 假设后端有一个/music路径来处理音乐生成
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            description: this.musicDescription
          })
        })

        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText)
        }

        // 这里可以处理音乐生成的响应，比如显示一个成功消息或者下载链接等
        alert('Music generation requested successfully!')

        // 清空输入框（如果需要）
        this.musicDescription = ''
      } catch (error) {
        console.error('Error generating music:', error)
        alert('Failed to generate music: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.pic {
  width: 500px;
  height: 500px;
}

.chat-container {
  margin-top: 20px;
}

.chat-logs {
  margin-top: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  height: 200px;
  overflow-y: auto;
}

.music-container {
  margin-top: 20px;
}
</style>
