<template>
  <div class="generic-card">
    <img :src="imageSrc" alt="Card Image">
    <h2>{{ groupName }}</h2>
    <p>{{ description }}</p>
    <!-- 这里可以添加更多的自定义内容，比如按钮、链接等 -->
  </div>
</template>

<script>
export default {
  name: 'GenericCard',
  props: {
    groupName: {
      type: String,
      required: true,
      default: ''
    },
    description: {
      type: String,
      required: false,
      default: ''
    },
    imageSrc: {
      type: String,
      required: false,
      default: ''
    }
    // 可以继续添加更多的 props 来满足不同的需求
  }
}
</script>

<style scoped>
.generic-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  max-width: 300px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.generic-card img {
  max-width: 100%;
  height: auto;
  border-radius: 4px 4px 0 0;
}

.generic-card h2 {
  margin-top: 16px;
  font-size: 1.5em;
}

.generic-card p {
  margin-top: 8px;
  color: #555;
}
</style>
