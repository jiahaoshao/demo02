<template>
  <div class="social-media-app">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <!-- 导航项，可以是图标、文字或链接 -->
      <div class="navbar-item" >
        <img :src=group.image class="pic">
      </div>
      <h2 class="section-title">{{group.name}}一{{group.description}}</h2>
      <input type="text" class="search-bar" placeholder="搜索帖子..." v-model="searchQuery">
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 用户信息区域 -->
      <aside class="user-info">
        <section v-for="(user, index) in users" :key="user.id" class="user-info-item">
          <div class="user-info-wrapper">
            <img :src="user.avatar" alt="用户头像" class="user-avatar">
            <p v-if="index === 0">创建者： {{user.username}}</p>
            <p v-else>用户: {{ user.username }}</p>
            <p>简介: {{ user.design }}</p>
            <!-- 关注按钮 -->
            <button @click="toggleFollow(user.id)" :class="{ 'followed': user.isFollowed }">
              {{ user.isFollowed ? '已关注' : '关注' }}
            </button>
          </div>
          <!-- 可选的分隔线，使用hr标签或者border-bottom样式 -->
          <hr v-if="index < users.length - 1" class="user-separator">
        </section>
      </aside>

      <!-- 帖子列表 -->
      <section class="post-list-container">
        <div class="post-composer">
          <div class="header">
            <h2>有什么新鲜事想分享给大家？</h2>
          </div>
          <textarea
            v-model="inputText"
            placeholder="分享你的想法、故事或图片链接..."
            rows="4"
            cols="50"
          ></textarea>
          <div class="attachment-buttons-wrapper">
            <div class="attachment-buttons">
              <button @click="showImageUploader = true">图片</button>
              <button @click="showVideoUploader = true">视频</button>
            </div>
            <button class="send-button" @click="sendMessage">发送</button>
          </div>
          <div class="emoji-picker" v-if="showEmojiPicker">
            <!-- 这里可以放置一个实际的表情选择器组件 -->
            <p>选择一个表情...</p>
            <button @click="showEmojiPicker = false">关闭</button>
          </div>
          <div class="image-uploader" v-if="showImageUploader">
            <!-- 这里可以放置一个文件上传组件 -->
            <p>上传一张图片...</p>
            <input type="file" accept="image/*" @change="handleImageUpload">
            <button @click="showImageUploader = false">关闭</button>
          </div>
          <div class="video-uploader" v-if="showVideoUploader">
            <!-- 这里可以放置一个视频上传组件 -->
            <p>上传一个视频...</p>
            <input type="file" accept="video/*" @change="handleVideoUpload">
            <button @click="showVideoUploader = false">关闭</button>
          </div>
          <div class="more-options" v-if="showMoreOptions">
            <!-- 这里可以放置更多的选项 -->
            <p>更多选项...</p>
            <button @click="showMoreOptions = false">关闭</button>
          </div>
        </div>

        <div class="post-list">
          <div class="post-item" v-for="(post, index) in filteredPosts" :key="post.id">
            <div class="post-metadata">
              <span>作者: {{ post.author }}</span>
              <span>发布时间: {{ post.date }}</span>
            </div>
            <div class="post-body">

              <!-- 截断后的内容显示 -->
              <p v-if="needsTruncation(post.content, 10) && !post.isContentExpanded" class="truncated-content">
                {{ truncateText(post.content, 10) }}
                <button type="button" class="expand-button" @click="toggleContent(post.id)">展开</button>
              </p>
              <p v-else class="full-content">
                {{ post.content }}
                <button v-if="needsTruncation(post.content, 10) && post.isContentExpanded" type="button" class="collapse-button" @click="toggleContent(post.id)">收起</button>
              </p>

            </div>
            <div class="post-actions">
              <button @click="commentPost(post.id)">发表评论 ({{ post.pinglun }})</button>
              <button @click="sharePost(post.id)">分享到朋友圈 ({{ post.fenxiang }})</button>
              <button @click="likePost(post.id)"
                      :style="{color:post.isLiked ?'red' : 'white'}">赞 ({{ post.likeCount }})</button>
            </div>
            <!---输入框--->
            <div v-if="post.isCommentVisible" class="comment-input-container">
              <textarea v-model="commentContent" placeholder="在这里输入你的评论..."></textarea>
              <button @click="submitComment(post.id)">提交评论</button>
              <button @click="hideCommentInput(post.id)">取消</button>

              <!-- 用户评论列表 -->
              <div v-if="post.id && post.comments.length > 0" class="comment-list">
                <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                  <p><strong>{{ comment.author }}</strong>: {{ comment.content }}</p>
                  <p><small>时间: {{ comment.time | formatDate }}</small></p> <!-- 假设您有一个 formatDate 过滤器来格式化日期 -->
                  <p><small>点赞数: {{ comment.likeCount }}</small></p>
                  <p><small>分享数: {{ comment.fenxiang }}</small></p>
                  <p><small>转发数: {{ comment.zhuanfa }}</small></p>
                  <!-- 您可以根据需要添加更多属性 -->
                </div>
              </div>
              <div v-else>
                <p>没有评论</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 帖子热度排行 -->
      <section class="post-hot-rank clearfix">
        <h2 class="section-title">帖子热度排行</h2>
        <ul>
          <li v-for="(post, index) in sortedPosts" :key="post.id">
            {{ index + 1 }}. {{ post.title }} (热度: {{ post.likeCount }})
          </li>
        </ul>
      </section>

    </main>

  </div>
</template>

<script>

import { getPosts, searchComments, searchGroupsUser, sendPosts, submitComments, updatePosts } from '@/router/user'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  watch: {
    // 监听 group prop 的变化
    group: {
      handler (newVal, oldVal) {
        // 当 group 发生变化时调用 load 方法
        // eslint-disable-next-line no-unused-expressions
        this.load()
        this.userLoad()
      },
      // 可选：指定深度监听（如果 group 对象内部属性的变化也需要触发）
      deep: true,
      // 可选：指定立即执行（在绑定时立即以当前的 prop 值触发一次回调）
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    },
    sortedPosts () {
      return this.posts.slice().sort((a, b) => b.likeCount - a.likeCount)
    },
    filteredPosts () {
      if (!this.searchQuery) {
        return this.posts
      }
      const searchQueryLowerCase = this.searchQuery.toLowerCase()
      return this.posts.filter(post =>
        post.title.toLowerCase().includes(searchQueryLowerCase) ||
        post.content.toLowerCase().includes(searchQueryLowerCase) ||
        post.author.toLowerCase().includes(searchQueryLowerCase)
      )
    }
  },
  data () {
    return {
      commentContent: '',
      inputText: '',
      searchQuery: '',
      users: [],
      posts: [],
      currentCommentId: null,
      isCommentVisible: null
    }
  },
  methods: {
    userLoad () {
      this.users = []
      searchGroupsUser(this.group.groupId)
        .then((res) => {
          console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((user) => {
              this.users.push(user[0])
            })
          }
        })
    },
    submitComment (id) {
      // 获取当前日期
      const currentDate = new Date()

      // 提取年、月、日
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1，并确保是两位数
      const day = String(currentDate.getDate()).padStart(2, '0') // 确保日期是两位数

      // 格式化日期为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`
      const comments = {
        content: this.commentContent,
        date: formattedDate,
        time: new Date(new Date(new Date().getTime()).toISOString()).toLocaleTimeString(),
        dianzan: 0,
        fenxiang: 0,
        pinglun: 0
      }
      submitComments(id, this.displayedUsername, comments)
        .then((res) => {
          if (res.data === 'Message sent successfully') { Swal.fire('评论成功！') }
        })
    },
    load () {
      this.posts = []
      getPosts(this.group.groupId)
        .then((res) => {
          // console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((posts) => {
              const dateObj = new Date(posts.date)

              // 增加一天
              dateObj.setDate(dateObj.getDate() + 1)

              // 将 Date 对象转换回 "YYYY-MM-DD" 格式的字符串
              const newDateStr = dateObj.toISOString().split('T')[0]

              const postsDateObj = new Date(newDateStr)
              // const postsTimeObj = new Date(posts.time) // 注意：这里我们只需要时间部分，所以日期可以随意设置

              const dateStr = postsDateObj.toISOString().split('T')[0] // "2023-10-05"
              // const timeStr = postsTimeObj.toTimeString().split(' ')[0] // "14:30:00"（注意：这里可能需要根据实际情况调整）

              const newTime = dateStr + ' ' + posts.time

              const isLiked = localStorage.getItem(`post-${posts.id}-isLiked`) === 'true'

              const commentsList = []
              searchComments(posts.id)
                .then((ress) => {
                  if (Array.isArray(ress.data) && ress.data.length > 0) {
                    ress.data.forEach((comments) => {
                      const dateObj = new Date(comments.date)

                      // 增加一天
                      dateObj.setDate(dateObj.getDate() + 1)

                      // 将 Date 对象转换回 "YYYY-MM-DD" 格式的字符串
                      const newDateStr = dateObj.toISOString().split('T')[0]

                      const postsDateObj = new Date(newDateStr)

                      const dateStr = postsDateObj.toISOString().split('T')[0] // "2023-10-05"

                      const newTimes = dateStr + ' ' + comments.time

                      const commentsLists = {
                        id: comments.id,
                        author: comments.username,
                        content: comments.content,
                        time: newTimes,
                        likeCount: comments.dianzan,
                        fenxiang: comments.fenxiang,
                        zhuanfa: comments.zhuanfa
                      }
                      commentsList.push(commentsLists)
                    })
                  }
                })
              this.posts.push({
                id: posts.id,
                title: 'null',
                author: posts.username,
                date: newTime,
                content: posts.content,
                likeCount: posts.dianzan,
                fenxiang: posts.fenxiang,
                zhuanfa: posts.zhuanfa,
                commentContent: '',
                isCommentVisible: false,
                isContentExpanded: false,
                isLiked: isLiked,
                comments: commentsList
              })
            })
          }
        })
    },
    sendMessage () {
      // 获取当前日期
      const currentDate = new Date()

      // 提取年、月、日
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1，并确保是两位数
      const day = String(currentDate.getDate()).padStart(2, '0') // 确保日期是两位数

      // 格式化日期为 "YYYY-MM-DD"
      const formattedDate = `${year}-${month}-${day}`

      // console.log(formattedDate)
      const posts = {
        content: this.inputText,
        groupId: this.group.groupId,
        time: new Date(new Date(new Date().getTime()).toISOString()).toLocaleTimeString(),
        dianzan: 0,
        fenxiang: 0,
        pinglun: 0,
        date: formattedDate
      }
      sendPosts(this.displayedUsername, posts)
        .then((res) => {
          if (res.data === 'Message sent successfully') { Swal.fire('发布成功!') }
        })
    },
    needsTruncation (text, maxLength) {
      return text.length > maxLength
    },
    truncateText (text, maxLength) {
      // 你的截断逻辑，确保这里不会破坏HTML（如果需要的话）
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    },
    toggleContent (postId) {
      // console.log(111)
      // 假设posts是一个响应式数组，并且每个post对象都有一个isContentExpanded属性
      const post = this.posts.find(post => post.id === postId)
      if (post) {
        // 如果找到了post对象，则切换isContentExpanded的值
        post.isContentExpanded = !post.isContentExpanded
      } else {
        // 如果没有找到，可以处理错误情况，比如显示一个消息或者做其他事情
        console.error(`No post found with id: ${postId}`)
      }
    },
    hideCommentInput (postId) {
      // 隐藏对应帖子的评论输入框
      this.$set(this.posts.find(post => post.id === postId), 'isCommentVisible', null)
    },
    toggleFollow (userId) {
      // 查找并更新用户关注状态
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.isFollowed = !user.isFollowed
        // 这里可以添加处理关注/取消关注的额外逻辑，如发送请求到服务器
      }
    },
    createNewPost () {

    },
    commentPost (postId) {
      // 显示对应帖子的评论输入框
      const post = this.posts.find(post => post.id === postId)
      if (post) {
        post.isCommentVisible = true
      }
      // 如果您想同时隐藏其他帖子的评论框，可以添加以下代码（可选）
      this.posts.forEach(p => {
        if (p.id !== postId) {
          p.isCommentVisible = false
        }
      })
      // console.log(`评论帖子 ${postId}`)
    },
    sharePost (postId) {
      // 处理分享到朋友圈的逻辑，可能需要传递 postId 到后端或执行分享操作
      console.log(`分享帖子 ${postId} 到朋友圈`)
    },
    likePost (postId) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        // 切换点赞状态
        post.isLiked = !post.isLiked
        // 更新点赞数
        if (post.isLiked) {
          // eslint-disable-next-line no-unused-expressions
          post.likeCount++
          updatePosts(postId, 'dianzan', 'jia')
          localStorage.setItem(`post-${postId}-isLiked`, 'true') // 保存点赞状态到 localStorage
        } else {
          // eslint-disable-next-line no-unused-expressions
          post.likeCount--
          localStorage.removeItem(`post-${postId}-isLiked`) // 取消点赞时移除 localStorage 项
          updatePosts(postId, 'dianzan', 'jian')
          if (post.likeCount < 0) {
            post.likeCount = 0 // 防止点赞数为负
          }
        }
      }
    }
  }
}
</script>

<style scoped>

.comment-list {
  text-align: left;
  margin-top: 20px; /* 与输入框容器保持一定距离 */
}

.comment-item {
  text-align: left;
  border-bottom: 1px solid #ccc; /* 分隔每个评论 */
  padding: 10px 0; /* 内边距 */
}

.comment-item p {
  margin: 0; /* 去除段落默认的上下边距 */
}
.header {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.attachment-buttons-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.attachment-buttons {
  display: flex;
  gap: 10px;
}

.attachment-buttons button,
.emoji-picker button,
.image-uploader button,
.video-uploader button,
.more-options button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

.send-button {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  background-color: yellow; /* 设置黄色背景 */
  color: black; /* 可以设置文字颜色为黑色以增加对比度 */
  cursor: pointer;
}

.send-button:hover {
  background-color: #ffd700; /* 悬停时改变背景色以增加交互性 */
}

.options label {
  margin-right: 20px;
}

.attachments button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
.expand-button, .collapse-button {
  background: none; /* 去除背景 */
  border: none; /* 去除边框 */
  padding: 0; /* 去除内边距 */
  margin: 0; /* 去除外边距 */
  cursor: pointer; /* 鼠标悬停时显示为手型，表明可点击 */
  text-decoration: underline; /* 可选：添加下划线表示链接，但这里更像按钮的话可以不加 */
  color: #007bff; /* 设置文字颜色，例如蓝色 */
  font-size: inherit; /* 继承父元素的字体大小 */
  font-family: inherit; /* 继承父元素的字体家族 */
}

.expand-button:hover, .collapse-button:hover {
  text-decoration: underline; /* 鼠标悬停时添加下划线，增强交互感 */
  color: #0056b3; /* 鼠标悬停时改变文字颜色，表明可交互 */
}

.comment-input-container {
  margin-top: 10px;
}
textarea {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
}
button {
  margin-right: 5px;
}
.post-hot-rank {
  margin-top: 32px;
  padding: 16px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.post-hot-rank ul {
  list-style-type: none;
  padding: 0;
}

.post-hot-rank li {
  margin-bottom: 8px;
  font-size: 16px;
}

/* 添加clearfix类以清除浮动 */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
.user-info-item {
  .search-bar {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 30%; /* 根据需要调整搜索栏的宽度 */
  }
  /* 如果想要保持边框和阴影，可以这样做： */
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px; /* 添加底部外边距来模拟gap效果（如果不使用gap属性） */
}
.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.user-separator {
  border: 0;
  height: 1px;
  background: #ddd; /* 分隔线的颜色 */
  margin: 0; /* 移除默认的margin */
}
.social-media-app {
  min-width: 1250px;
  font-family: Arial, sans-serif;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex-direction: row;
  margin-top: 16px;
}

.user-info {
  width: 20%; /* 设置用户信息区域的宽度 */
  padding: 16px;
  background-color: #f1f1f1;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.post-list-container {
  min-width: 800px;
  flex-grow: 1; /* 让帖子列表区域占据剩余的空间 */
  margin-left: 25px; /* 与用户信息区域保持一定的间距 */
  margin-right: 25px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 16px;
}

/* 帖子相关的样式保持不变，但注意移除重复的 .post-item 样式定义 */
.post-item {
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  /* 添加最大宽度限制 */
  max-width: calc(100% - 32px); /* 假设左右有16px的间距 */
  /* 使用flexbox确保内容自适应 */
  display: flex;
  flex-direction: column;
  /* 可选：添加overflow处理 */
  overflow: hidden;
}

.social-media-app {
  font-family: Arial, sans-serif;
  padding: 16px;
}

.navbar {
  background-color: #007bff;
  color: white;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-item {
  /* 根据需要设置样式 */
  padding: 8px 16px;
  cursor: pointer;
}

.main-content {
  margin-top: 16px;
}

.post-actions {
  margin-left: 100px;
  margin-top: 16px;
  display: flex;
  gap: 100px;
}

.post-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.post-actions button:hover {
  background-color: #0056b3;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #f1f1f1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
}

.post-item {
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.post-metadata {
  margin-top: 8px;
  font-size: 14px;
  color: #666;
}

.post-body {
  margin-top: 16px;
  overflow-y: auto; /* 如果内容过高，允许垂直滚动 */
  max-width: 900px;
}

.post-list {
  margin-top: 16px;
}

.post-item {
  background-color: #f9f9f9;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.followed {
  /* 为已关注的按钮添加特定样式 */
  background-color: #ddd; /* 示例样式 */
  color: #777; /* 示例样式 */
}
.pic {
  width: 50px;
  height: 50px;
}
</style>
