// 此文件专门负责项目的路由

import VueRouter from 'vue-router'

// 引入组件
import Login from '../views/login/Login.vue'
import Register from '../views/register/Register.vue'
import Home from '@/views/home/HOMEE.vue'
import { Message } from 'element-ui'
import Users from '@/components/user/Usersdemo.vue'
import Welcome from '@/components/Welcome.vue'
import Article from '@/components/user/Article.vue'
import Search from '@/components/user/Search.vue'
import List from '@/components/user/List.vue'
import GroupDetails from '@/components/user/GroupDetails.vue'
import demo from '@/Test/AIDEMO.vue'
import createGroups from '@/components/user/createGroups.vue'

// 创建并暴露一个路由器
const router = new VueRouter({
  mode: 'history', // 路由模式
  routes: [
    {
      path: '/group/:id',
      name: 'GroupDetails',
      component: GroupDetails,
      props: true
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/Article', component: Article },
        { path: '/search', component: Search },
        { path: '/list', component: List },
        { path: '/sys', component: demo },
        { path: '/sys/newGroup', component: createGroups }
      ]
    }
  ]
})

// 导航守卫，前置处理
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('userInfo')
  if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
    next({ path: '/login' })
    Message({
      message: '请先登录！',
      type: 'warning'
    })
  } else next()
})

export default router
