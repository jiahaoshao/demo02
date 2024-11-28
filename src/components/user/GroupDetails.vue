<template>
  <div>
    <GenericCard
      :groupName="groupName"
      :description="groupDescription"
      :imageSrc="groupImage"
    />
  </div>
</template>

<script>
import axios from 'axios'
import GenericCard from '@/components/user/GenericCard.vue'

export default {
  components: {
    GenericCard
  },
  data () {
    return {
      group: null // 用于存储从服务器获取的群组信息
    }
  },
  computed: {
    groupId () {
      return this.$route.params.id
    },
    groupName () {
      return this.group ? this.group.name : 'Loading Group Name...'
    },
    groupDescription () {
      return this.group ? this.group.description : 'Loading Group Description...'
    },
    groupImage () {
      return this.group ? this.group.image : '\\img\\favicon.ico'
    }
  },
  created () {
    this.fetchGroupData()
  },
  methods: {
    async fetchGroupData () {
      try {
        const response = await axios.get(`/api/user/groups/${this.groupId}`)
        this.group = response.data[0]
      } catch (error) {
        console.error('Error fetching group data:', error)
        // 可以设置一个错误状态或显示错误信息
      }
    }
  }
  // ...其他选项
}
</script>
