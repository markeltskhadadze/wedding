<script setup lang="ts">
import {onMounted, reactive, ref, Ref, toRaw} from 'vue'
  import { blogInfo } from "~/stores/blog"
  import { getImage } from "~/mixins/get-icon"
  import { screen } from "~/mixins/check-screen"
  import { homePageData } from "~/stores/home-page"
  import Header from "~/components/home-page-parts/Header.vue"
  import BlogItem from "~/components/home-page-parts/parts/BlogItem.vue"
  import {TBlogsResult} from "~/types";
import MobileNavbar from "~/components/home-page-parts/MobileNavbar.vue";
import Footer from "~/components/home-page-parts/Footer.vue";
import DownloadApp from "~/components/home-page-parts/DownloadApp.vue";
import BlogTags from "~/components/blog/BlogTags.vue";

  const route = useRoute()
  const router = useRouter()
  const homePage = homePageData()
  const blog = blogInfo()
  const id: Ref<string> = ref('')
  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const blogs: TBlogsResult[] = reactive(toRaw(homePage.blogs))

  function getBlogDate(date: string) {
    const originalDate = new Date(date)
    const day = originalDate.getDate().toString().padStart(2, '0')
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
    const year = originalDate.getFullYear()

    return `${day}.${month}.${year}`
  }

  onMounted(async() => {
    id.value = Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id
    await blog.getCurrentBlog(id.value)
    await homePage.getBlogs()
  })
</script>

<template>
  <Header v-if="checkScreen"/>
  <p v-if="checkScreen" class="blog-title">{{ blog.currentBlog.name }}</p>
  <div v-if="checkScreen" class="tags-wrapper">
    <BlogTags />
  </div>
  <div class="blog-contents">
    <div class="flex gap-8 items-center" :class="{ 'mobile-header': !checkScreen }">
      <img @click="router.push({ path: '/' })" :src="getIcon + 'back.png'" />
      <p class="blog-name">{{ blog.currentBlog.name }}</p>
    </div>
    <img :src="blog.currentBlog.images?.[0]" class="article-image" />
    <div class="blog-text">
      <p class="article-text" v-html="blog.currentBlog.body"></p>
      <div class="flex gap-4">
        <p class="blog-tags" v-for="(tag, index) in blog.currentBlog.tags" :key="index">{{ tag.name }}</p>
        <p class="blog-date">{{ getBlogDate(blog.currentBlog.created_at) }}</p>
      </div>
    </div>
  </div>
  <div class="flex gap-8 px-20 all-blogs">
    <BlogItem v-for="(blog, index) in blogs" :key="index" :blog="blog" />
  </div>
  <DownloadApp />
  <Footer />
  <MobileNavbar v-if="!checkScreen" />
</template>

<style scoped>
  * {
    background: #F9F9F9;
  }
  .blog-date {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .tags-wrapper {
    padding: 0 80px 32px 80px;
  }
  .blog-tags {
    color: rgba(73, 81, 111, 0.50);
    text-align: right;
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .all-blogs {
    overflow-y: scroll;
  }
  .mobile-header {
    padding: 24px 130px 24px 20px;
  }
  .article-image {
    width: 1128px;
    height: 618px;
    object-fit: cover;
    border-radius: 20px;
  }
  .article-text {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .blog-contents {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 300px 60px 300px;
    gap: 32px;
  }
  .blog-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .blog-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    padding: 32px 80px;
  }
  .blog-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
  }

  @media (max-width: 600px) {
    .blog-contents {
      padding: 0;
    }
    .blog-name {
      font-size: 16px;
    }
    .all-blogs {
      padding: 60px 0 0 20px;
    }
    .blog-text {
      padding: 0 20px;
    }
  }
</style>