<template>
  <div>
    <el-dialog class="tanchuang"
               title="修改个人信息"
               :visible.sync="localdialogVisible"
               width="60%"
               :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <div class="updateinfo">
          <div class="left">
            <el-form-item label="头像" prop="avatar">
              <img style="width:150px;height:110px" :src="form.avatar">
            </el-form-item>
            <el-form-item label="账号密码" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-switch
                v-model="form.sex"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="男"
                inactive-text="女"
                :active-value= "1"
                :inactive-value= "0"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>

          </div>
          <div class="right">
            <el-form-item label="用户编号" prop="id">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="area">
              <el-input v-model="form.area"></el-input>
            </el-form-item>
            <el-form-item label="兴趣爱好" prop="hobby">
              <el-input v-model="form.hobby"></el-input>
            </el-form-item>
            <el-form-item label="职业" prop="work">
              <el-input v-model="form.work"></el-input>
            </el-form-item>
            <el-form-item label="个性签名" prop="design">
              <el-input v-model="form.design"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobilePhoneNumber">
              <el-input v-model="form.mobilePhoneNumber"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">关 闭</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { userInfo } from '@/router/user'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    // eslint-disable-next-line vue/require-prop-type-constructor
    Username: ''
  },
  data () {
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      localdialogVisible: this.dialogVisible,
      displayedUsername: this.Username,
      form: {
        avatar: '',
        password: '',
        nickname: '',
        age: '',
        email: '',
        mobilePhoneNumber: '',
        sex: '',
        id: '',
        account: '',
        area: '',
        hobby: '',
        work: '',
        design: ''
      },
      rules: {
        nickname: [
          {
            required: true,
            message: '昵称不能为空',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '账号密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      userInfo(this.displayedUsername)
        .then((res) => {
          console.log(res)
          Object.assign(this.form, res.data[0])
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleClose () {
      // eslint-disable-next-line vue/no-mutating-props
      this.localdialogVisible = false
      this.$emit('flesh')
    }
  }
}
</script>

<style scoped>
.updateinfo {
  height: 350px;
  overflow: auto;
}

.left {
  /* width: 330px; */
  float: left;
}

.right {
  overflow: hidden;
}
.tanchuang {
  z-index: 9999;
}
</style>
