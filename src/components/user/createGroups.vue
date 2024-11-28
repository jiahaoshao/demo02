<template>
  <div class="channel-creation-form">
    <div class="form-header">
      <h2>填写你的兴趣小组信息</h2>
    </div>
    <div class="form-body">

      <div class="avatar-upload">
        <!-- 隐藏的文件输入框 -->
        <input type="file" id="avatar-input" accept="image/*" @change="onFileChange" style="display: none;" ref="fileInput"/>

        <!-- 用于触发文件输入框的label -->
        <label for="avatar-input" class="avatar-upload-label" @click="triggerFileInput">
          <!-- 这里使用图片，并设置为可点击的样式 -->
          <img :src="avatarSrc" alt="上传头像" class="clickable-avatar-icon" />
        </label>

        <!-- 显示选择的图片预览 -->
<!--        <div v-if="imageUrl">-->
<!--          <h3>Image Preview:</h3>-->
<!--          <img :src="imageUrl" alt="Preview" class="preview-image" />-->
<!--        </div>-->

      </div>

      <div class="form-group">
        <label for="channelName">小组名称</label>
        <input type="text" v-model="channelName" placeholder="为你的小组取个名字" maxlength="12" />
      </div>

      <div class="form-group">
        <label for="channelDescription">小组简介</label>
        <textarea v-model="channelDescription" placeholder="描述一下你的小组主题和特色内容" maxlength="600"></textarea>
      </div>

      <div class="form-group">
        <label for="categoriesInput">输入类别（每个类别两个字，以空格分隔）</label>
        <input type="text" id="categoriesInput" v-model="categoriesInput" placeholder="例如：编程 开发 科研" />
        <p v-if="invalidCategories.length" class="error">{{ invalidCategoriesMessage }}</p>
      </div>

    </div>
    <div class="form-footer">
      <button @click="createChannel" type="button" >立即创建</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import { enterGroups } from '@/router/user'

export default {
  data () {
    return {
      avatarSrc: require('@/assets/img.png'), // 初始化为占位图片的URL
      defaultAvatarSrc: require('@/assets/img.png'), // 保存占位图片的URL以便恢复
      agreed: false,
      selectedFile: null,
      imageUrl: null,
      categoriesInput: '', // 用户输入的类别字符串
      categories: [], // 解析后的类别数组
      invalidCategories: [], // 无效的类别数组
      invalidCategoriesMessage: '请确保每个类别都是两个字，并以逗号正确分隔。', // 错误消息
      channelName: '', // 新增：存储小组名称
      channelDescription: '', // 新增：存储小组简介
      uploadedImageUrl: null // 新增：存储上传后头像的URL（可选，如果你需要立即显示给用户）
    }
  },
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    }
  },
  methods: {
    parseAndValidateCategories () {
      this.invalidCategories = []
      // 使用正则表达式分割字符串，按一个或多个空格分割，并去除前后的空格
      const rawCategories = this.categoriesInput.trim().split(/\s+/)
      const validCategories = rawCategories.filter(category => {
        // 去除类别前后的空格，并检查是否为两个中文字符
        const trimmedCategory = category.trim()
        const isValid = /^[\u4E00-\u9FFF]{2}$/.test(trimmedCategory)
        if (!isValid) {
          this.invalidCategories.push(trimmedCategory)
        }
        return isValid
      })

      // 由于我们已经去除了每个有效类别前后的空格，所以不需要再次映射来trim
      this.categories = validCategories
      this.invalidCategoriesMessage = this.invalidCategories.length
        ? '以下类别无效（不是两个字或包含非法字符）：' + this.invalidCategories.map(cat => `"${cat}"`).join(', ')
        : ''
    },
    triggerFileInput () {
      // this.$refs.fileInput.click() // 触发文件输入框的点击事件
    },
    onFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file // 保存文件引用以便稍后上传
        const reader = new FileReader()
        reader.onload = (e) => {
          this.avatarSrc = e.target.result // 更新图片预览
        }
        reader.readAsDataURL(file)
      }
    },
    createChannel () {
      // 验证表单
      if (!this.validateForm()) {
        return
      }
      // 准备要发送到服务器的数据
      const formData = new FormData()
      formData.append('createName', this.displayedUsername)
      formData.append('name', this.channelName)
      formData.append('description', this.channelDescription)
      formData.append('categories', this.categories.join(',')) // 将类别数组转换为逗号分隔的字符串

      // 如果选择了头像，则添加到表单数据中
      if (this.selectedFile) {
        formData.append('image', this.selectedFile)
      }
      // 假设你有一个API端点可以处理频道创建请求
      const createChannelUrl = '/api/user/upload'

      fetch(createChannelUrl, {
        method: 'POST',
        body: formData
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText)
          }
          // 读取响应体为文本
          return response.text()
        })
        .then(text => {
          // 将文本解析为整数
          const intValue = parseInt(text, 10) // 第二个参数10表示十进制
          enterGroups(this.displayedUsername, intValue)
          Swal.fire('小组创建成功！')
          this.$router.go(-1)
        })
        .catch((error) => {
          console.error('创建小组时出错：', error)
          alert('创建小组失败，请稍后再试。')
        })
    },
    validateForm () {
      // 检查小组名称和简介是否为空
      if (!this.channelName || !this.channelDescription) {
        alert('请填写小组名称和简介。')
        return false
      }

      // 触发类别的验证
      this.parseAndValidateCategories()

      // 检查是否有无效类别
      if (this.invalidCategories.length) {
        alert(this.invalidCategoriesMessage)
        return false
      }

      return true
    },
    uploadImage () {
      if (!this.selectedFile) {
        alert('Please select an image first!')
        return
      }

      const formData = new FormData()
      formData.append('image', this.selectedFile)

      // 假设你有一个 API 端点可以处理文件上传
      const uploadUrl = '/api/user/upload'

      fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Upload success:', data)
          // 在这里处理上传成功后的逻辑
        })
        .catch((error) => {
          console.error('Upload error:', error)
          // 在这里处理上传失败后的逻辑
        })
    }
  },
  watch: {
    categoriesInput () {
      this.parseAndValidateCategories()
    }
  }
}
</script>

<style scoped>
.channel-creation-form {
  background-color: #e0f7fa; /* 调整为与截图相似的背景色，或根据需要自定义 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.form-header {
  margin-bottom: 20px;
}
.form-body {
  margin-bottom: 20px;
}
.avatar-upload {
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-footer {
  text-align: center;
}
button {
  padding: 10px 20px;
  background-color: #42b983; /* 调整为与截图相似的按钮颜色，或根据需要自定义 */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc; /* 禁用按钮时的颜色 */
  cursor: not-allowed;
}
.avatar-upload {
  position: relative;
  display: inline-block;
}
.clickable-avatar-icon {
  width: 100px; /* 设定你想要的宽度 */
  height: 100px; /* 设定你想要的高度 */
  opacity: 1; /* 鼠标悬停时增加透明度 */
}

.avatar-upload-label {
  /* 这个label本身不需要特殊的样式，因为它只是用来触发input的 */
  cursor: pointer; /* 确保label也是可点击的 */
  /* 注意：由于我们使用了图片作为label的内容，所以这里的样式主要影响label的点击区域 */
  /* 在这个例子中，由于图片已经覆盖了整个头像预览区域，所以label的样式对布局没有直接影响 */
}

/* 可选的：显示选择的文件名 */
.filename {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

</style>
