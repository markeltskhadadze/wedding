<script setup lang="ts">
  import { onBeforeUnmount, reactive, toRaw, onMounted, computed } from 'vue'
  import DownloadApp from '~/components/home-page-parts/DownloadApp.vue'
  import Footer from '~/components/home-page-parts/Footer.vue'
  import MobileNavbar from '~/components/home-page-parts/MobileNavbar.vue'
  import Header from "~/components/home-page-parts/Header.vue"
  import TopPlace from '~/components/home-page-parts/parts/TopPlace.vue'
  import Filter from '~/components/vendor-page-parts/Filter.vue'
  import { homePageData } from '~/stores/home-page'
  import { TResults } from '~/types'
  import { eventsInfo } from "~/stores/events"
  import { screen } from '~/mixins/check-screen'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import { getImage } from "~/mixins/get-icon"

  const { checkScreen } = screen.setup()
  const homeData = homePageData()
  const { getIcon } = getImage.setup()
  const event = eventsInfo()
  const places: TResults[] = reactive(toRaw(homeData.topPlaces))
  const business: TResults[] = reactive(toRaw(homeData.topPlaces))

  const getFilterBusiness = computed(() => {
    return business
  })

  onBeforeUnmount(() => {
    homeData.categoryName = ''
    localStorage.removeItem('categoryId')
    event.searchValue = ''
    homeData.businessId = ''
  })

  onMounted(async () => {
    const categoryId = localStorage.getItem('categoryId')
    await homeData.getBusiness()
  })
</script>

<template>
  <Header />
  <div class="selected-places">
    <Filter :currentCategory="homeData.categoryName"  />
    <div class="flex flex-col gap-4 flex-[0_1_70%]">
      <div class="category-header">
        <h1>{{ homeData.categoryName }}</h1>
        <Breadcrumbs :currentCategory.sync="homeData.categoryName" />
      </div>
      <div class="flex gap-4 flex-wrap" v-if="getFilterBusiness.length">
        <TopPlace
            v-for="(place, index) in getFilterBusiness"
            :key="index"
            :place="place"
        />
      </div>
      <div class="flex gap-4 flex-col items-center h-screen justify-center" v-if="!getFilterBusiness.length">
        <img :src="getIcon + 'empty-field.png'" />
        <div class="flex flex-col items-center gap-3">
          <p class="empty-title">{{ $t('business.is_empty') }}</p>
        </div>
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
    justify-content: space-between;
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