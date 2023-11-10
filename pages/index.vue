<script setup lang="ts">
  import { onMounted } from 'vue'
  import Search from '../components/home-page-parts/Search.vue'
  import CategoriesSwiper from '~/components/home-page-parts/CategoriesSwiper.vue'
  import TopForMonth from '~/components/home-page-parts/TopForMonth.vue'
  import Blog from '~/components/home-page-parts/Blog.vue'
  import DownloadApp from '~/components/home-page-parts/DownloadApp.vue'
  import Footer from '~/components/home-page-parts/Footer.vue'
  import MobileNavbar from '~/components/home-page-parts/MobileNavbar.vue'
  import Header from "~/components/home-page-parts/Header.vue"
  import { screen } from '~/mixins/check-screen'
  import VendorListMobile from '~/components/vendor-page-parts/VendorListMobile.vue'
  import { homePageData } from '~/stores/home-page'
  import { getToken } from '~/mixins/check-auth'

  const { checkScreen } = screen.setup()
  const { checkAuth } = getToken.setup()
  const home = homePageData()

  onMounted(async () => {
    await checkAuth()
  })
</script>

<template>
  <div v-if="!home.showVendorList" class="relative">
    <Search />
    <CategoriesSwiper />
    <TopForMonth />
    <Blog />
    <DownloadApp />
    <Footer />
  </div>
  <div v-if="home.showVendorList" >
    <Header />
    <VendorListMobile />
  </div>
  <MobileNavbar v-if="!checkScreen" />
</template>

<style scoped>
  * {
    background: #F9F9F9;
  }
</style>