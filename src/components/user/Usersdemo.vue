<template>
  <div>
    <el-card>
      <el-descriptions class="margin-top" title="简介" :column="2" border >
        <template slot="extra">
<!--          <span>name={{displayedUsername}}</span>-->
          <el-button type="primary" size="small" @click="openDialog">修改个人信息</el-button>
          <PersonalDia v-if="dialogVisible" :dialogVisible="dialogVisible" @flesh="closeDialog"></PersonalDia>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-picture-outline"></i>
            头像
          </template>
          <img :src="avatar" alt="" height="50px"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            账户名
          </template>
          {{ username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
          <i class="el-icon-s-custom"></i>
          昵称
         </template>
         {{ nickname }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-odometer"></i>
            年龄
          </template>
          {{ age }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{ sex }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            邮箱Email
          </template>
          {{ email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号码
          </template>
          {{ mobilePhoneNumber }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            地区
          </template>
          {{ area }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            职业
          </template>
          {{ work }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-basketball"></i>
            兴趣爱好
          </template>
          {{ hobby }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-magic-stick"></i>
            个性签名
          </template>
          {{ design }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-date"></i>
            注册日期
          </template>
          {{ createDate | formatDate }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
import { userInfo } from '@/router/user'
// import modelist from '@/router/Userdemo.json'
import PersonalDia from '@/components/user/PersonalDia.vue'
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    }
  },
  filters: {
    formatDate (value, formatString = 'yyyy-MM-dd') {
      return format(new Date(value), formatString)
    }
  },
  name: 'Info',
  components: { PersonalDia },
  data () {
    return {
      avatar: '',
      username: '',
      age: 0,
      email: '',
      mobilePhoneNumber: '',
      area: '',
      createDate: 0,
      nickname: '',
      sex: '',
      work: '',
      hobby: '',
      design: '',
      dialogVisible: false
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      userInfo(this.displayedUsername)
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const userData = res.data[0]
            this.avatar = userData.avatar
            this.username = userData.username// 注意：这里不再需要 .data
            this.age = userData.age
            this.email = userData.email
            this.mobilePhoneNumber = userData.mobilePhoneNumber // 注意：这里不再需要 .data
            this.area = userData.area // 注意：这里不再需要 .data
            this.createDate = userData.createDate // 注意：这里不再需要 .data
            this.nickname = userData.nickname // 注意：这里不再需要 .data
            this.sex = userData.sex === 1 ? '男' : '女' // 注意：这里不再需要 .data
            this.work = userData.work // 注意：这里不再需要 .data
            this.design = userData.design // 注意：这里不再需要 .data
            this.hobby = userData.hobby // 注意：这里不再需要 .data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    openDialog () {
      this.dialogVisible = true
    },
    closeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.img {
  width: 50px;
  height: 50px;
}
</style>
