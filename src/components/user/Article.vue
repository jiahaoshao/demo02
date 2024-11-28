<template>
  <div class="container">
    <aside class="sidebar">
      <!-- 侧边栏内容 -->
      <nav>
        <ul>
          <li>
            <img src="@/assets/p3.jpg"
                 :class="{'highlighted': currentHighlightedAvatarId === 'personal'}"
                 class="group-avatar"
                 alt="Null"
                 @click="showPersonalContent('personal')">
          </li>
          <li>
            <img src="@/assets/p2.jpg"
                 :class="{'highlighted': currentHighlightedAvatarId === 'main'}"
                 class="group-avatar"
                 alt="Null"
                 @click="showMainContent( 'main')">
          </li>
          <li v-for="group in groupsSelected" :key="group.groupId" >
            <img :class="{'highlighted': currentHighlightedAvatarId === group.groupId}"
                 @click="showGroupDetails(group.groupId)"
                 :src="group.image"
                 alt="Group Avatar"
                 class="group-avatar" />
          </li>
        </ul>
      </nav>
    </aside>

    <div class="mock-screen" v-if="personalVisible">

      <!-- 信息展示区 -->
      <div class="info-section">
        <img src="@/assets/p2.jpg" class="picture">
        <div class="user-info">
          <span>3岁克罗地亚</span>
          <span>|加入兴趣小组720天</span>
        </div>
        <div class="buttons">
          <button>我的帖子</button>
          <router-link to="/sys/newGroup">
          <button style="font-size: 16px">
            创建兴趣小组<br>
            <span style="font-size: 12px">成为组主，打造独一无二的小组。</span>
          </button>
          </router-link>
        </div>
      </div>

    </div>

    <!-- 显示选中小组的详细信息 -->
    <section v-if="selectedGroupId" class="group-details">
      <Demo :group="selectedGroup"></Demo>
  </section>

    <main class="main-content" v-if="mainVue">
      <header class="header">
        <div class="header-left">
          <h1>兴趣小组</h1>
        </div>
        <div class="header-right">
          <input type="text" v-model="searchTerm" placeholder="搜索小组..." class="search-input" />
          <button @click="toggleFilter" class="filter-button">{{ isFilterActive ? '取消筛选' : '筛选小组' }}</button>
        </div>
      </header>

      <!-- 筛选模态 -->
      <div v-if="isFilterActive" class="filter-modal">
        <div class="filter-modal-content">
          <h2>选择类别</h2>
          <div class="category-checkboxes">
            <label v-for="category in groupCategoriesAll" :key="category" class="checkbox-label">
              <input type="checkbox" :value="category" v-model="selectedCategories" /> {{ category }}
            </label>
          </div>
          <button @click="applyFilter" class="filter-button">应用筛选</button>
          <button @click="toggleFiltersc" class="filter-button">取消</button>
        </div>
      </div>

      <section class="group-list">
        <div class="group-item" v-for="group in filteredGroups" :key="group.groupId">
          <div class="group-card">
            <h2>{{ group.name }}</h2>
            <div class="group-image">
              <img :src="group.image" alt="小组图片" /> <!-- 假设每个小组都有一个image属性 -->
            </div>
            <p class="group-description">{{ group.description }}</p>
            <div class="category-tags">
              <span v-for="category in group.categories" :key="category" class="category-tag">{{ category+' ' }}</span>
            </div>

            <div class="action-buttons">

              <el-button type="success" icon="el-icon-share" size="mini" @click="enter(group.groupId)">加入</el-button>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import GenericCard from '@/components/user/GenericCard.vue'
import { allGroups, enterGroups, personalGroups } from '@/router/user'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import Demo from '@/Test/DEMM.vue'
export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { GenericCard, Demo },
  mounted () {
    // eslint-disable-next-line no-undef
    this.load()
  },
  data () {
    return {
      currentHighlightedAvatarId: 'main', // 用于存储当前高亮头像的 ID
      groupCategoriesAll: ['编程', '开发', '科研', '音乐', '摇滚', '运动', '跑步'],
      isFilterModalActive: false,
      selectedGroupId: null, // 当前选中的小组ID
      mainVue: true,
      searchTerm: '',
      isFilterActive: false,
      personalVisible: false,
      selectedCategories: [],
      groups: [],
      groupsSelected: [],
      newGroupName: '',
      newGroupDescription: '',
      selectedNewGroupCategories: [],
      isAddGroupModalActive: false,
      jilu: []
    }
  },
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    },
    selectedGroup () {
      // 根据selectedGroupId返回对应的小组对象
      return this.groups.find(group => group.groupId === this.selectedGroupId)
    },
    filteredGroups () {
      // 确保 searchTerm 和 selectedCategories 是数组或字符串等有效类型
      const searchTerm = this.searchTerm || ''
      const selectedCategories = Array.isArray(this.selectedCategories) ? this.selectedCategories : []
      if (searchTerm) {
        return this.groups
          // .filter(group => Array.isArray(group.categories)) // 确保 group.categories 是数组
          .filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            this.hasMatchingCategory(group.categories, selectedCategories)
          )
      } else if (selectedCategories.length > 0) {
        return this.groups
          .filter(group => Array.isArray(group.categories)) // 确保 group.categories 是数组
          // .filter(group => this.hasMatchingCategory(group.categories, selectedCategories))
          .filter(group => selectedCategories.every(selectedCategory => group.categories.includes(selectedCategory)))
      }

      return this.groups
    }
  },
  methods: {
    enter (name) {
      enterGroups(this.displayedUsername, name)
        .then((res) => {
          // console.log(res)
          if (res.data === 'success!') { Swal.fire('加入成功！') } else { Swal.fire('您已加入该小组！') }
        })
    },
    load () {
      personalGroups(this.displayedUsername)
        .then((ending) => {
          this.jilu = ending.data
          // console.log(this.jilu)
        })
      allGroups()
        .then((res) => {
          // console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((group) => {
              this.groups.push({
                name: group.name,
                description: group.description,
                image: group.image,
                groupId: group.groupId,
                categories: group.categories.split(',')
              })

              if (group.createName === this.displayedUsername) {
                this.groupsSelected.push(group)
              } else if (this.jilu.includes(group.groupId)) {
                this.groupsSelected.push(group)
              }
            })
          }
        })
    },
    showPersonalContent (avatarId) {
      this.personalVisible = true
      this.mainVue = false
      this.selectedGroupId = null
      if (avatarId === 'personal' || avatarId === 'main') {
        // 清除当前高亮的小组头像
        this.currentHighlightedAvatarId = null
        this.currentHighlightedAvatarId = avatarId
        // 可以设置一个额外的属性来追踪当前高亮的是个人还是主要头像（如果需要的话）
      } else {
        // 设置当前高亮的小组头像 ID
        this.currentHighlightedAvatarId = avatarId
      }
    },
    showMainContent (avatarId) {
      this.mainVue = true
      this.personalVisible = false
      this.selectedGroupId = null
      if (avatarId === 'personal' || avatarId === 'main') {
        // 清除当前高亮的小组头像
        this.currentHighlightedAvatarId = null
        this.currentHighlightedAvatarId = avatarId
        // 可以设置一个额外的属性来追踪当前高亮的是个人还是主要头像（如果需要的话）
      } else {
        // 设置当前高亮的小组头像 ID
        this.currentHighlightedAvatarId = avatarId
      }
    },
    showGroupDetails (groupId) {
      // 更新selectedGroupId以显示对应小组的详细信息
      this.selectedGroupId = groupId
      this.personalVisible = false
      this.mainVue = false
      // 如果需要根据选中的小组更新filteredGroups，可以在这里添加逻辑
      if (groupId === 'personal' || groupId === 'main') {
        // 清除当前高亮的小组头像
        this.currentHighlightedAvatarId = null
        // 可以设置一个额外的属性来追踪当前高亮的是个人还是主要头像（如果需要的话）
      } else {
        // 设置当前高亮的小组头像 ID
        this.currentHighlightedAvatarId = groupId
      }
    },
    toggleFiltersc () {
      this.isFilterActive = !this.isFilterActive
    },
    applyFilter () {
      // 应用筛选后关闭模态
      this.toggleFilter()
    },
    hasMatchingCategory (groupCategories, selectedCategories) {
      // 确保 groupCategories 是数组
      if (!Array.isArray(groupCategories)) {
        console.error('groupCategories should be an array')
        return false
      }
      return groupCategories.some(category => selectedCategories.includes(category))
    },
    toggleFilter () {
      this.isFilterActive = !this.isFilterActive
    },
    closeAddGroupModal () {
      this.isAddGroupModalActive = false
      this.newGroupName = ''
      this.newGroupDescription = ''
      this.selectedNewGroupCategories = []
    }
  }
}
</script>

<style scoped>
.highlighted {
  /* 高亮样式，比如边框颜色、阴影等 */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.7);
  border: 2px solid rgba(0, 123, 255, 0.7);
}
.group-avatar {
  width: 40px; /* 根据需要调整头像大小 */
  height: 40px;
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
  margin-bottom: 10px; /* 每个头像之间的间距 */
}

.group-details {
  margin-top: 20px; /* 与其他内容之间的间距 */
}

.group-detail-card {
  /* ...小组详细信息的样式... */
}
.container {
  display: flex; /* 使用flex布局来创建侧边栏和主内容区域 */
  max-width: 1400px; /* 根据需要调整容器宽度 */
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  border-radius: 8px;
}

.sidebar {
  flex: 0 0 100px; /* 侧边栏宽度固定为200px */
  background-color: #f8f9fa; /* 侧边栏背景色 */
  padding: 20px;
  box-sizing: border-box; /* 确保内边距不会增加宽度 */
}

.sidebar nav ul {
  list-style: none; /* 移除列表项默认样式 */
  padding: 0;
  margin: 0;
}

.sidebar nav ul li {
  margin-bottom: 10px; /* 每个列表项之间的间距 */
}

.sidebar nav ul li a {
  text-decoration: none; /* 移除链接默认下划线 */
  color: #343a40; /* 链接文字颜色 */
}

.sidebar nav ul li a:hover {
  color: #007bff; /* 链接悬停效果 */
}

.main-content {
  flex: 1; /* 主内容区域占据剩余空间 */
  padding-left: 20px; /* 与侧边栏保持间距 */
  box-sizing: border-box; /* 确保内边距不会增加宽度 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  flex: 0 0 auto; /* 使标题部分占据固定空间 */
}

.header-right {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  margin-right: 10px; /* 与筛选按钮保持间距 */
}

.filter-button {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.filter-button:hover {
  background: #0056b3;
}

/* 省略了其他未修改的样式 */

.group-item {
  display: flex;
  margin-bottom: 20px;
}

.group-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 使内容靠左对齐 */
  flex: 1;
  min-width: 0; /* 防止内容溢出时撑大容器 */
}

.group-image img {
  width: 100%;
  height: auto;
  border-radius: 8px 8px 0 0; /* 图片圆角与卡片圆角协调 */
}

.group-description {
  margin-top: 10px;
  color: #555;
}

.action-buttons {
  margin-top: auto; /* 如果你想让按钮在垂直方向上靠近底部，可以添加这个属性；否则可以移除 */
  margin-left: auto; /* 这将把按钮推向其父容器的右侧 */
}

.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.category-checkboxes {
  max-height: 200px;
  overflow-y: auto;
}

/* 筛选模态样式 */
.filter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 确保模态在最上层 */
}

.filter-modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80%; /* 根据需要调整宽度 */
  max-width: 600px; /* 最大宽度 */
  text-align: center;
}

.filter-modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px; /* 标题字体大小 */
}

/* 类别复选框样式 */
.category-checkboxes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.checkbox-label {
  flex: 0 0 calc(33.333% - 20px); /* 每个选项占据一行宽度的1/3，减去左右margin */
  margin: 10px; /* 每个选项周围的间距 */
  box-sizing: border-box; /* 确保内边距和边框不会增加元素的宽度 */
  text-align: left; /* 文本左对齐，如果需要的话 */
  font-size: 18px; /* 增大字体，与之前保持一致 */
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 10px; /* 复选框和标签之间的间距 */
}

/* 按钮样式 */
.filter-button {
  padding: 10px 20px;
  font-size: 16px; /* 按钮字体大小 */
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 20px;
}

.filter-button:hover {
  background-color: #0056b3; /* 按钮悬停效果 */
}

.mock-screen {
  flex: 1; /* 主内容区域占据剩余空间 */
  padding-left: 20px; /* 与侧边栏保持间距 */
  box-sizing: border-box; /* 确保内边距不会增加宽度 */
}

.status-bar .time {
  font-size: 14px;
  color: #333;
}

.signal-and-battery {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.search-bar input {
  flex: 1;
  padding: 4px;
  font-size: 14px;
  border: none;
  outline: none;
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

.message-section {
  margin-bottom: 16px;
}

.message-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.message-item .message-type {
  font-size: 14px;
  color: #333;
}

.message-item .message-content {
  font-size: 12px;
  color: #666;
}

.picture {
  width: 100px;
  height: 100px;
  border-radius: 50%; /* 圆形头像 */
}
</style>
