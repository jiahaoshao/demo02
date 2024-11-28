<template>
  <div>
    <h2>欢迎{{user.username}}!您的id为{{user.id}}</h2>
      <el-button @click="logout">登出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        id: null
      }
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem('userInfo')
      this.$router.push('/login')
    }
  },
  mounted () {
    if (sessionStorage.getItem('userInfo')) {
      this.user = JSON.parse(sessionStorage.getItem('userInfo'))
    }
  }
}
</script>

<style scoped>
</style>
