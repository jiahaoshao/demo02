// store.js
import Vue from 'vue'
import Vuex from 'vuex'
import { getUsername } from '@/router/getters'

Vue.use(Vuex)
const state = {
  username: localStorage.getItem('username') || '' // 获取本地存储的用户名，如果没有则为空字符串
}

const mutations = {
  SET_USERNAME (state, username) {
    state.username = username
    localStorage.setItem('username', username) // 更新localStorage中的用户名
  }
}
export default new Vuex.Store({
  state,
  mutations,
  getters: {
    getUsername
  }
})
