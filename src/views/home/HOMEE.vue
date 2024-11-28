<template>
  <el-container class="home-container">
    <el-header><!-- 头部区 -->
      <div>
        <img src="@/assets/p1.jpg" alt="" height="50px" />
        <span>智能社交平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isMenuCollapsed ? collapsedWidth + 'px' : menuWidth + 'px'">
        <div class="menu-toggle-wrapper">
          <el-button type="text" @click="toggleMenu" class="menu-toggle-button">
            {{ isMenuCollapsed ? '展开' : '收起' }} <i :class="isMenuCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
          </el-button>
        </div>
        <div v-if="!isMenuCollapsed" class="menu-container">
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409BFF"
            :unique-opened="true"
            :router="true"
            :default-active="$route.path"
          >
            <!-- 菜单项 -->
            <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.path">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{ menu.title }}</span>
              </template>
              <el-menu-item
                :index="item.path"
                :route="{ path: item.path }"
                v-for="item in menu.children"
                :key="item.path"
              >
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>

      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import menuList from '@/router/HOMEE.json'
export default {
  // eslint-disable-next-line vue/no-unused-components
  data () {
    return {
      menuList,
      isMenuCollapsed: false,
      menuWidth: 200, // 初始宽度
      collapsedWidth: 50 // 折叠后的宽度（可以调整）
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuCollapsed = !this.isMenuCollapsed
      // this.menuWidth = this.isMenuCollapsed ? this.collapsedWidth : 200;
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex; //设置显示为flex布局
  justify-content: space-between; //设置为flex左右布局
  padding-left: 0; //左内边距为0（Logo贴左边）
  align-items: center; //元素上下居中（防止右边按钮贴上下边）
  color: #fff;
  font-size: 20px;

  > div {
    //内嵌的div样式
    display: flex;
    align-items: center; //Logo和文字上下居中
    span {
      margin-left: 15px; //文字左侧设置间距，防止与Logo紧贴
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.menu-container {
  transition: width 0.3s; /* 添加过渡效果 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.menu-container.collapsed {
  width: 50px; /* 折叠后的宽度 */
}

.menu-container.collapsed .el-menu {
  /* 当菜单折叠时，调整菜单项的样式 */
  /* 注意：这里需要更细致的样式调整来确保图标和文本在折叠时正确显示 */
  .el-submenu__title {
    padding-left: 10px; /* 调整内边距以适应折叠宽度 */
    .el-submenu__icon-arrow {
      display: none; /* 隐藏箭头图标，因为它在折叠时可能不适用 */
    }
    span {
      display: none; /* 隐藏文本，只显示图标 */
    }
  }

  .el-menu-item {
    padding-left: 10px; /* 同样调整内边距 */
    span {
      display: none; /* 隐藏文本 */
    }
  }
}
.el-aside[style*="width: 50px"] .menu-container {
  display: none; /* 隐藏菜单容器 */
}
</style>
