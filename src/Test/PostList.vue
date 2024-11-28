<template>
  <div class="post-list">
    <div v-for="(post, index) in posts" :key="index" class="post">
      <h4>{{ post.title }}</h4>
      <p>{{ post.content }}</p>
      <div class="actions">
        <button @click="likePost(index)">点赞 ({{ post.likes }})</button>
        <button @click="dislikePost(index)">踩 ({{ post.dislikes }})</button>
      </div>
    </div>
    <button @click="createPost">发帖</button>
  </div>
</template>

<script>
export default {
  props: {
    posts: Array
  },
  methods: {
    likePost(index) {
      this.$emit('update-post', { index, type: 'like' });
    },
    dislikePost(index) {
      this.$emit('update-post', { index, type: 'dislike' });
    },
    createPost() {
      this.$emit('create-post');
    }
  }
}
</script>

<style scoped>
.post-list {
  margin-left: 16px;
}
.post {
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
}
.actions {
  margin-top: 8px;
}
button {
  margin-right: 8px;
}
</style>
