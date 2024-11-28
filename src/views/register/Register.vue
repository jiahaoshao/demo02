<template>
  <div id="building">
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="80px"
        class="demo-ruleForm"
        >
        <el-form-item label="用户" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" @click="submitForm('ruleForm')"
                   >提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        uname: '',
        pass: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true, message: '用户名不能为空！', trigger: 'blur'
          }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password: [{
          required: true, validator: validatePass2, trigger: 'blur'
        }]
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
            url: '/api/user/register',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              username: _this.ruleForm.username,
              password: _this.ruleForm.password
            }
          }).then((res) => {
            if (res.data.code === '200') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              // eslint-disable-next-line no-empty
            } else {
              this.$message({
                message: res.data.msg,
                type: 'false'
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
    },
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.box-card{
  width: 400px;
  margin-left: 600px;
  margin-top: 220px;
  background: rgba(255, 255, 255, 0.5);
}
.login-from {
  margin: auto auto;
}
#building {
  background: url("@/assets/desktop.jpg");
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}
</style>
