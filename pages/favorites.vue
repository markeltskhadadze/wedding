<script setup lang="ts">
  import { onMounted } from 'vue'
  import DownloadApp from '~/components/home-page-parts/DownloadApp.vue'
  import Footer from '~/components/home-page-parts/Footer.vue'
  import MobileNavbar from '~/components/home-page-parts/MobileNavbar.vue'
  import Header from "~/components/home-page-parts/Header.vue"
  import Favorites from '~/components/home-page-parts/parts/Favorites.vue'
  import { homePageData } from '~/stores/home-page'
  import { TFavoriteResults } from '~/types'
  const { getIcon } = getImage.setup()
  import { favoriteBusiness } from '~/stores/favorite'
  import { screen } from '~/mixins/check-screen'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import {getImage} from "~/mixins/get-icon";

  const { checkScreen } = screen.setup()
  const homeData = homePageData()
  const favorite = favoriteBusiness()
  const places: TFavoriteResults[] = reactive(toRaw(favorite.favoritesPlace))

  onMounted(async () => {
    await favorite.getFavorites()
  })
</script>

<template>
  <Header />
  <div class="selected-places">
    <div class="flex flex-col gap-4 flex-[0_1_100%] content-wrapper">
      <div class="category-header">
        <h1>Избранное</h1>
      </div>
      <div v-if="places.length" class="flex gap-4 flex-wrap">
        <Favorites
            v-for="(place, index) in places"
            :key="index"
            :place="place"
        />
      </div>
      <div v-if="!places.length" class="flex gap-4 flex-wrap justify-center flex-col items-center">
        <img :src="getIcon + 'empty-field.png'" />
        <p class="empty-title">Пусто</p>
      </div>
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
  .selected-places {
    display: flex;
    flex-wrap: wrap;
    padding: 64px 106px 80px 106px;
    justify-content: center;
    align-items: flex-start;
  }
  h1 {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .content-wrapper {
    max-width: 1100px;
  }
  @media (max-width: 900px) {
    .selected-places {
      padding: 20px;
      display: block;
    }
    .category-header {
      margin: 48px 0;
    }
  }
</style>