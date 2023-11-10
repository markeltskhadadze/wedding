<script setup lang="ts">
  import { onMounted, reactive, toRaw } from 'vue'
  import { homePageData } from '~/stores/home-page'
  import {TBlogs, TBlogsResult} from '~/types'
  import BlogItem from '~/components/home-page-parts/parts/BlogItem.vue'
  import { screen } from '~/mixins/check-screen'

  const { checkScreen } = screen.setup()
  const homeData = homePageData()
  const localePath = useLocalePath()
  const blogs: TBlogsResult[] = reactive(toRaw(homeData.blogs))

  onMounted(async () => {
    await homeData.getBlogs()
  })
</script>

<template>
  <div class="blog-container">
    <div class="flex justify-between items-center mb-12">
      <h2>Блог</h2>
      <button v-if="checkScreen" class="see-all-btn">
        <NuxtLink :to="localePath('/blog')">{{ $t('blog.see_more') }}</NuxtLink>
      </button>
      <p v-if="!checkScreen" class="see-all-btn-modile">{{ $t('blog.see_more_mobile') }}</p>
    </div>
    <div class="flex flex-wrap gap-8">
      <BlogItem v-for="(blog, index) in blogs" :key="index" :blog="blog" />
    </div>
  </div>
</template>

<style scoped>
  .blog-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 64px 106px;
    background: #F1F1F1;
  }
  h2 {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .see-all-btn {
    padding: 16px 32px;
    border-radius: 12px;
    background: #FFF;
    box-shadow: 0 4px 32px 0 rgba(255, 56, 92, 0.05);
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .see-all-btn-modile {
    color: #FF385C;
    text-align: right;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 136%;
    text-decoration-line: underline;
  }
  @media (max-width: 900px) {
    .blog-container {
      padding: 40px 20px;
    }
  }
</style>