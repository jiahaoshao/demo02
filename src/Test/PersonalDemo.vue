<template>
  <div class="social-media-app">
    <nav class="navbar">

    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 用户信息区域 -->
      <aside class="user-info">
        <section v-for="(user, index) in users" :key="user.id" class="user-info-item">
          <div class="user-info-wrapper">
            <img :src="user.avatar" alt="用户头像" class="user-avatar">
            <p>用户名: {{ user.username }}</p>
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

        <div class="mock-screen">

          <!-- 信息展示区 -->
          <div class="info-section">
            <img src="@/assets/p2.jpg" class="picture">
            <div class="user-info">
              <span>3岁克罗地亚</span>
              <span>|加入兴趣小组720天</span>
            </div>
            <div class="buttons">
              <router-link to="/sys/newGroup">
                <button style="font-size: 16px">
                  创建兴趣小组<br>
                  <span style="font-size: 12px">成为组主，打造独一无二的小组。</span>
                </button>
              </router-link>
            </div>
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

import { mapGetters } from 'vuex'
import { searchGroupsUser } from '@/router/user'

export default {
  mounted () {
    this.load()
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
      // users: [
      //   {
      //     id: 1,
      //     avatar: 'img/p1demo.jpg',
      //     username: 'Alice',
      //     design: '喜欢编程和旅行，热衷于探索新技术。'
      //   },
      //   {
      //     id: 2,
      //     avatar: 'img/p2.jpg',
      //     username: 'Bob',
      //     design: '热爱音乐和艺术，喜欢分享自己的创作。'
      //   },
      //   {
      //     id: 3,
      //     avatar: 'img/p3.jpg',
      //     username: 'Charlie',
      //     design: '对科技和运动都充满热情，经常参加马拉松比赛。'
      //   }
      // ],
      posts: [],
      currentCommentId: null,
      isCommentVisible: null
    }
  },
  methods: {
    load () {
      searchGroupsUser('1')
        .then((res) => {
          console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((user) => {
              this.users.push(user[0])
            })
          }
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
    toggleFollow (userId) {
      // 查找并更新用户关注状态
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.isFollowed = !user.isFollowed
        // 这里可以添加处理关注/取消关注的额外逻辑，如发送请求到服务器
      }
    }
  }
}
</script>

<style scoped>

.info-section .user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.comment-item p {
  margin: 0; /* 去除段落默认的上下边距 */
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
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

.main-content {
  margin-top: 16px;
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

.info-section {
  margin-bottom: 16px;
}

.info-section .user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.info-section .buttons {
  flex-direction: column; /* 将按钮垂直排列 */
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.info-section .buttons button {
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.picture {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 圆形头像 */
}
</style>
