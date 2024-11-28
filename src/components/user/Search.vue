<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
<!--      <el-breadcrumb-item>用户管理</el-breadcrumb-item>-->
      <el-breadcrumb-item>添加好友</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20"><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="7">
          <el-descriptions class="margin-top" title="搜索好友" :column="2" border >
          </el-descriptions>
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUsersList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobilePhoneNumber"></el-table-column>
<!--        <el-table-column label="状态" prop="status"></el-table-column>-->
        <el-table-column label="操作" width="200px">
          <template slot-scope="{}">
            <template>
              <div>
                <div v-for="user in userList" :key="user.id">
                    <PersonalDiaOnlyLook v-if="isDialogVisibleForUser(user.id)" :dialogVisible="true" :Username="queryInfo.query" @flesh="closeDialog(user.id)"></PersonalDiaOnlyLook>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDetail(user.id)">查看</el-button>
                  <el-tooltip effect="dark" content="发送好友申请" placement="top">
                    <el-button type="success" icon="el-icon-share" size="mini" @click="Send">发送申请</el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card>
      <el-row :gutter="20"><!-- gutter是指定每个分栏的间隔 -->
        <!-- 分栏一共占24格，给搜索框7格，添加按钮4格 -->
        <el-col :span="7">
          <!-- 搜索与添加区域 -->
          <el-descriptions class="margin-top" title="好友申请" :column="2" border >
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
<!--              <el-tooltip effect="dark" content="查看详细信息" placement="top">-->
                <PersonalDiaOnlyLook v-if="scope.row.dialogVisible"
                                     :dialogVisible.sync="scope.row.dialogVisible"
                                     :Username="scope.row.username"></PersonalDiaOnlyLook>
                <el-button type="primary"
                           icon="el-icon-edit"
                           size="mini"
                           @click="DetailInformation(scope.row.id)">查看</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="Refuse(displayedUsername,scope.row.username)">拒绝</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="accept(displayedUsername,scope.row.username)">接受</el-button>
            </template>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { userInfo, apply, userInfoSearch, change, Success } from '@/router/user'
import PersonalDiaOnlyLook from '@/components/user/PersonalDiaOnlyLook.vue'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import Swal from 'sweetalert2'

export default {
  mounted () {
    this.load()
  },
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    }
  },
  components: { PersonalDiaOnlyLook },
  data () {
    return {
      queryInfo: {
        query: ''
      },
      userList: [], // 添加用户列表数组
      username: '',
      userListSearch: [],
      dialogVisible: false,
      userDialogVisibility: {}
    }
  },
  methods: {
    // eslint-disable-next-line vue/no-dupe-keys
    isDialogVisibleForUser (userId) {
      // 返回指定用户的对话框显示状态
      // eslint-disable-next-line no-prototype-builtins
      return this.userDialogVisibility.hasOwnProperty(userId) ? this.userDialogVisibility[userId] : false
    },
    showDetail (userId) {
      // 显示指定用户的对话框
      this.$set(this.userDialogVisibility, userId, true)
    },
    closeDialog (userId) {
      this.$set(this.userDialogVisibility, userId, false)
    },
    load () {
      userInfoSearch(this.displayedUsername)
        .then((res) => {
          // console.log(res)
          if (Array.isArray(res.data) && res.data.length > 0) {
            // 创建一个空数组来存储所有userInfo请求的响应数据
            const userDetailsPromises = res.data.map((user) => {
              // 对每个user对象执行userInfo函数，并返回promise
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
                  dialogVisible: false // 添加或设置 dialogVisible 属性为 false
                }))
                this.userListSearch = userListWithDialogVisible
              })
              .catch((err) => {
                // 这个catch块实际上不会被触发，因为Promise.all只会在所有promises都失败时才会拒绝
                // 但由于我们已经在每个userInfo请求的catch中处理了错误，所以这里不需要额外处理
                console.log('Unexpected error in Promise.all:', err)
              })
          }
        })
        .catch((err) => {
          console.log(err)
          // 处理userInfoSearch请求失败的情况
        })
    },
    async getUsersList () {
      if (this.displayedUsername !== this.queryInfo.query) {
        userInfo(this.queryInfo.query)
          .then((res) => {
            // console.log(res)
            if (Array.isArray(res.data) && res.data.length > 0) {
              this.userList = res.data
              const userData = res.data[0]
              this.username = userData.username
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
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
    Send () {
      apply(this.displayedUsername, this.queryInfo.query)
      Swal.fire('申请已发送！')
    },
    Refuse (receiver, requester) {
      // console.log(111)
      change(receiver, requester)
      Swal.fire('已拒绝该好友申请！')
    },
    accept (receiver, requester) {
      Success(receiver, requester)
      Swal.fire('已同意该好友申请！')
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
