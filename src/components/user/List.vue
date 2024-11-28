<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <!--      <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
      <el-breadcrumb-item>好友列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20"><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="7">
          <el-descriptions class="margin-top" title="好友列表" :column="2" border >
          </el-descriptions>
        </el-col>
      </el-row>
      <el-table :data="userListSearch" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber"></el-table-column>
        <!--        <el-table-column label="状态" prop="status"></el-table-column>-->
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <template>
              <PersonalDiaOnlyLook v-if="scope.row.dialogVisible"
                                   :dialogVisible.sync="scope.row.dialogVisible"
                                   :Username="scope.row.username"
                                   @flesh="closeDialog(scope.row.id)"></PersonalDiaOnlyLook>
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="DetailInformation(scope.row.id)">查看</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="Refuse(displayedUsername,scope.row.username)">删除</el-button>
              <el-button type="info" icon="el-icon-message" size="mini" @click="talkInformation(scope.row.id)">聊天</el-button>
              <TalkDia :talkdialog.sync="scope.row.talkdialog"
                         v-if="scope.row.talkdialog"
                         :Username="scope.row.username"
                         :FatherName="displayedUsername"></TalkDia>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-descriptions class="margin-top" title="推荐好友列表" :column="2" border >
          </el-descriptions>
        </el-col>
      </el-row>
      <el-table :data="userTogether" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <template>
              <PersonalDiaOnlyLook v-if="scope.row.dialogVisible"
                                   :dialogVisible.sync="scope.row.dialogVisible"
                                   :Username="scope.row.username"
                                   @flesh="DetailInformationRecommedclose(scope.row.id)"></PersonalDiaOnlyLook>
              <el-button type="primary"
                         icon="el-icon-edit"
                         size="mini"
                         @click="DetailInformationRecommed(scope.row.id)">查看</el-button>
              <el-button type="success" icon="el-icon-share" size="mini" @click="Send(scope.row.username)">发送申请</el-button>
            </template>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { userInfo, change, SuccessSearch, apply, searchTogether } from '@/router/user'
import PersonalDiaOnlyLook from '@/components/user/PersonalDiaOnlyLook.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import TalkDia from '@/components/user/talkDia.vue'
import Swal from 'sweetalert2'

export default {
  mounted () {
    this.load()
    this.init()
  },
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    }
  },
  components: { TalkDia, PersonalDiaOnlyLook },
  data () {
    return {
      queryInfo: {
        query: ''
      },
      userList: [], // 添加用户列表数组
      username: '',
      userListSearch: [],
      userRecommed: [],
      dialogVisible: false,
      talkdialog: false,
      userDialogVisibility: {},
      userTogether: []
    }
  },
  methods: {
    init () {
      searchTogether(this.displayedUsername)
        .then((res) => {
          const thidBox = res.data.filter(Boolean).map(user => ({
            ...user, // 复制用户对象的所有属性
            dialogVisible: false,
            talkdialog: false
          }))
          this.userTogether = thidBox
          this.userRecommed = thidBox
          console.log(this.userTogether)
        })
    },
    load () {
      SuccessSearch(this.displayedUsername)
        .then((res) => {
          // console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            // 创建一个空数组来存储所有userInfo请求的响应数据
            const userDetailsPromises = res.data.map((user) => {
              // 对每个user对象执行userInfo函数，并返回promise
              if (user.requester === this.displayedUsername) {
                user.requester = user.receiver
              }
              return userInfo(user.requester)
                .then((res2) => {
                  // console.log(res2)
                  if (Array.isArray(res2.data) && res2.data.length > 0) {
                    // 假设每个userInfo请求只返回一个用户详情，我们直接返回这个详情对象
                    // 如果返回的是数组且您只需要第一个元素，可以返回res2.data[0]
                    // 但如果可能返回多个详情，您可能需要进一步处理这个数组
                    return res2.data[0] // 或者根据需求处理整个res2.data数组
                  }
                  // 如果没有找到详情，可以返回null或undefined，或者根据需要处理
                  return null
                })
                .catch((err) => {
                  console.log(err)
                  // 在出错时返回一个表示错误的对象或null，以便后续处理
                  return null
                })
            })

            // 使用Promise.all来等待所有userInfo请求的完成，并将结果存储在this.userListSearch中
            Promise.all(userDetailsPromises)
              .then((userDetailsArray) => {
                // userDetailsArray将包含所有userInfo请求的响应数据（或null）
                // 您可以根据需要过滤掉null值或处理这个数组
                this.userLists = userDetailsArray.filter(detail => detail !== null)

                const userListWithDialogVisible = this.userLists.map(user => ({
                  ...user, // 复制用户对象的所有属性
                  dialogVisible: false,
                  talkdialog: false
                }))
                this.userListSearch = userListWithDialogVisible
              })
          }
        })
        .catch((err) => {
          console.log(err)
          // 处理userInfoSearch请求失败的情况
        })
    },
    DetailInformation (id) {
      const user = this.userListSearch.find(user => user.id === id)
      if (user) {
        // 设置对应行的 dialogVisible 属性为 true
        // 由于您已经使用了 .sync 修饰符，这实际上会触发一个更新事件
        // 但为了清晰起见，我们直接修改属性（在实际应用中，您可能希望有一个更解耦的方式来处理这个）
        Vue.set(user, 'dialogVisible', true)

        // 这里可以添加其他逻辑，比如根据用户 ID 加载更多详情数据等
        // 但由于您已经有一个组件来显示详情，并且它似乎是基于 dialogVisible 来控制的
        // 因此这些逻辑可能已经包含在了 <PersonalDiaOnlyLook> 组件内部
      } else {
        console.error(`User with ID ${id} not found in userListSearch.`)
      }
    },
    closeDialog (id) {
      const user = this.userListSearch.find(user => user.id === id)
      if (user) {
        Vue.set(user, 'dialogVisible', false)
      } else {
        console.error(`User with ID ${id} not found in userListSearch.`)
      }
    },
    DetailInformationRecommed (id) {
      const user = this.userRecommed.find(user => user.id === id)
      if (user) {
        Vue.set(user, 'dialogVisible', true)
      } else {
        console.error(`User with ID ${id} not found in userRecommed.`)
      }
    },
    DetailInformationRecommedclose (id) {
      const user = this.userRecommed.find(user => user.id === id)
      if (user) {
        Vue.set(user, 'dialogVisible', false)
      } else {
        console.error(`User with ID ${id} not found in userRecommed.`)
      }
    },
    Refuse (receiver, requester) {
      // console.log(111)
      change(receiver, requester)
      Swal.fire('已删除该好友！')
    },
    Send (username) {
      apply(this.displayedUsername, username)
      Swal.fire('已发送发送好友申请！')
    },
    talkInformation (id) {
      // console.log(111)
      // console.log(id)
      const user = this.userListSearch.find(user => user.id === id)
      if (user) {
        Vue.set(user, 'talkdialog', true)
      } else {
        console.error(`User with ID ${id} not found in userListSearch.`)
      }
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
</style>
