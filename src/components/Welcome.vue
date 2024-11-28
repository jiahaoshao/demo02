<template>
  <div>
    <h3>Welcome!{{displayedUsername}}</h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getUsername']), // 如果你定义了getter也可以使用
    displayedUsername: {
      get () {
        return this.getUsername // 或者 this.username;
      }
    }
  }
}
</script>
