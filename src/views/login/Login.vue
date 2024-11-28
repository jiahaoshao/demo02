<template>
  <div id="building">
  <div id>
    <el-card class="box-card" >
      <h2>登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="70px"
        class="login-from"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')"
        >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <router-link to="/register">
          <el-button style="margin-left:10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
 </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        this.loading = true
        if (valid) {
          const _this = this
          this.axios({
            url: '/api/user/login',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            params: {
              username: _this.ruleForm.username,
              password: _this.ruleForm.password
            }
          }).then((res) => {
            if (res.data.code === '200') {
              this.$store.commit('SET_USERNAME', this.ruleForm.username)

              sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
              this.$router.push('/home')
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
            _this.loading = false
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          this.loading = false
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.box-card{
  //margin: auto auto;
  width: 400px;
  margin-left: 600px;
  margin-top: 220px;
  background: rgba(255, 255, 255, 0.5);
}
.login-from{
  margin: auto auto;
}
#building{
  background: url("@/assets/desktop.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
