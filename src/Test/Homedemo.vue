<template>
  <el-container class="home-container">
    <el-header><!-- 头部区 -->
      <div>
        <img src="../assets/p1.jpg" alt="" height="50px" />
        <span>智能社交平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true" :router="true" :default-active="$route.path">

          <el-submenu :index="menu.path" v-for="menu in processedMenuList">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span>{{menu.title}}</span>
            </template>
            <template v-for="item in menu.children">
              <el-submenu v-if="item.type === 'submenu'" :index="item.path + '-sub'">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item
                  v-for="third in item.children"
                  :index="third.path"
                  :route="{path: third.path}"
                >
                  <template slot="title">
                    <i :class="third.icon"></i>
                    <span>{{third.title}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="item.path" :route="{path: item.path}">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
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
      menuList
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  computed: {
    processedMenuList () {
      return this.menuList.map(menu => ({
        ...menu,
        children: menu.children.map(item => {
          if (item.children && item.children.length > 0) {
            return {
              ...item,
              type: 'submenu', // 用于区分是submenu还是menuitem
              children: item.children // 三级菜单
            }
          } else {
            return {
              ...item,
              type: 'menuitem' // 用于区分是submenu还是menuitem
            }
          }
        })
      }))
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
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
