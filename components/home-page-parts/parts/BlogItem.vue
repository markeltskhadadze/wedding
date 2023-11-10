<script setup lang="ts">
  import { type PropType } from 'vue'
  import {TBlogs, TBlogsResult} from '~/types'
  import { getImage } from "~/mixins/get-icon"

  const { getIcon } = getImage.setup()
  const localePath = useLocalePath()
  const props = defineProps({
    blog: {
      type: Object as PropType<TBlogsResult>,
      required: true
    }
  })

  function getBlogDate(date: string) {
    const originalDate = new Date(date)
    const day = originalDate.getDate().toString().padStart(2, '0')
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
    const year = originalDate.getFullYear()

    return `${day}.${month}.${year}`
  }
</script>

<template>
  <div class="blog-content">
    <img :src="getIcon + 'blog-img.png'" class="rounded-3xl" />
    <div class="flex flex-col gap-4">
      <NuxtLink class="blog-title" :to="localePath(`/article/${ blog.id }`)">{{ blog.name }}</NuxtLink>
      <p class="blog-description" v-html="blog.body_short"></p>
      <div class="flex gap-4">
        <p class="blog-footer" v-for="(tag, index) in blog.tags" :key="index">{{ tag.name }}</p>
        <p class="blog-footer">{{ getBlogDate(blog.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .blog-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    flex: 30.3%;
    cursor: pointer;
  }
  .blog-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .blog-description {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    max-width: 548px;
  }
  .blog-footer {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  @media (max-width: 900px) {
    .blog-content {
      flex: 0 1 100%;
    }
  }
</style>