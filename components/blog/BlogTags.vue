<script setup lang="ts">
  import { blogInfo } from '~/stores/blog'

  const blog = blogInfo()

  const props = defineProps({
    uniqueTags: {
      type: Array<string[]>,
      required: true
    }
  })
</script>

<template>
  <div class="tags-container">
    <p
        class="tags"
        :class="{ selected: blog.selectedAll }"
        @click="blog.filterByTags(null)">#Все</p>
    <p
        class="tags"
        v-for="(tag, index) in uniqueTags"
        :key="index"
        @click="blog.filterByTags(tag)"
        :class="{ selected: tag === blog.currentCategory }"
    >
      {{ tag }}
    </p>
  </div>
</template>

<style scoped>
  .tags-container {
    display: flex;
    padding: 32px;
    align-items: flex-start;
    align-content: flex-start;
    gap: 8px;
    flex-wrap: wrap;
    border-radius: 18px;
    background: #FFF;
  }
  .tags {
    display: flex;
    padding: 8px 16px;
    align-items: flex-start;
    gap: 10px;
    border-radius: 30px;
    background: #F1F1F1;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    cursor: pointer;
  }
  .selected {
    background: #FF385C;
    color: #FFF;
  }
</style>