<script setup lang="ts">
  import Header from '~/components/home-page-parts/Header.vue'
  import MobileNavbar from '~/components/home-page-parts/MobileNavbar.vue'
  import BlogItem from '~/components/home-page-parts/parts/BlogItem.vue'
  import DownloadApp from '~/components/home-page-parts/DownloadApp.vue'
  import Footer from '~/components/home-page-parts/Footer.vue'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import BlogTags from '~/components/blog/BlogTags.vue'
  import { screen } from '~/mixins/check-screen'
  import { getImage } from '~/mixins/get-icon'
  import { homePageData } from '~/stores/home-page'
  import { blogInfo } from '~/stores/blog'
  import { reactive, toRaw, onMounted } from 'vue'
  import {TBlogs, TBlogsResult} from '~/types'

  const { checkScreen } = screen.setup()
  const { getIcon } = getImage.setup()
  const blog = blogInfo()
  const homePage = homePageData()
  const blogsList: TBlogsResult[] = reactive(toRaw(homePage.blogs))

  onMounted(async () => {
    await homePage.getBlogs()
    const allTags = homePage.filteredBlogList.map(blog => blog.tags).flat()
    blog.uniqueTags = [...new Set(allTags.map(tag => tag.name))]
  })
</script>

<template>
  <Header />
  <div class="blog-container">
    <p class="blog-title">{{ blog.currentCategory }}</p>
    <Breadcrumbs :currentCategory.sync="blog.currentCategory" />
    <BlogTags :uniqueTags="blog.uniqueTags" />
    <div class="flex flex-wrap gap-8 py-8">
      <BlogItem
          v-for="(blog, index) in homePage.filteredBlogList"
          :key="index"
          :blog="blog"
      />
    </div>
  </div>
  <DownloadApp />
  <Footer />
  <MobileNavbar v-if="!checkScreen" />
</template>

<style scoped>
  * {
    background: #F9F9F9;
  }
  .blog-container {
    padding: 30px 106px 60px 106px;
  }
  .blog-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
</style>