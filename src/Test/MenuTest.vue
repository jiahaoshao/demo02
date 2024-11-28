<template>
  <div class="home">
    <el-container style="height: 100% ;border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu router>
          <TreeMenu :tree-data ='treeData'/>
        </el-menu>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import TreeMenu from '@/components/user/createGroups.vue'
// import { defineComponent } from 'vue'
import treeData from '@/router/index.json'

export default ({
  components: { TreeMenu },
  data () {
    return {
      treeData
    }
  }
})
</script>
