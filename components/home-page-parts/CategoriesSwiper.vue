<script setup lang="ts">
  import { onMounted } from 'vue'
  import { homePageData } from '~/stores/home-page'
  // import SwiperControls from '~/components/home-page-parts/swiper/SwiperControls.vue'
  import { TCategoties } from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'

  const { getCountSlider } = screen.setup()
  const { getIcon } = getImage.setup()
  const localePath = useLocalePath()
  const homeData = homePageData()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))


  async function sendCategoryName(id: string) {
    localStorage.setItem('categoryId', id)
    homeData.businessId = id
    await homeData.getSearchBusiness(id)
  }

  onMounted(async () => {
    await homeData.getCategories()
  })
</script>

<template>
  <div class="category-swiper">
    <Swiper
        :height="300"
        :modules="[SwiperAutoplay, SwiperEffectCreative]"
        :slides-per-view="getCountSlider"
        :loop="true"
        :spaceBetween="10"
    >
      <SwiperSlide
          v-for="(category, idx) in categories"
          :key="idx"
      >
        <div class="category-info">
          <div class="category-image">
            <NuxtLink :to="localePath('/vendor')">
              <img @click="sendCategoryName(category.id)" v-if="category.icon" :src="category.icon.file" />
            </NuxtLink>
            <NuxtLink :to="localePath('/vendor')">
              <img @click="sendCategoryName(category.id)" v-if="!category.icon" :src="getIcon + category.img">
            </NuxtLink>
          </div>
          <p @click="sendCategoryName(category.id)"><NuxtLink :to="localePath('/vendor')">{{ category.name }}</NuxtLink></p>
        </div>
      </SwiperSlide>
<!--      <SwiperControls />-->
    </Swiper>
  </div>
</template>

<style>
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    font-weight: bold;
  }
  .swiper-wrapper {
    min-width: 100vh;
    width: 100vh;
  }
  .swiper-cards {
    width: 240px;
    height: 240px;
  }
  .swiper-cards .swiper-slide {
    border-radius: 6px;
    border: 1px solid black;
  }
  @media (max-width: 900px) {
    .swiper-wrapper {
      min-height: 150px;
    }
  }
</style>

<style scoped>
  .category-swiper {
    padding: 64px 186px;
  }
  .category-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .category-info p {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .category-image {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 72px;
    background: #FFF;
    box-shadow: 0 14px 30px 0 rgba(149, 38, 58, 0.10);
  }
  .category-image img {
    display: flex;
    min-width: 80px;
    min-height: 81px;
    padding: 16px;
    justify-content: center;
    align-items: center;
    object-fit: cover;
  }
  @media (max-width: 900px) {
    .category-swiper {
      padding: 40px 20px;
    }
    .category-image img {
      max-width: 48px;
      max-height: 48px;
      padding: 9px 12px;
    }
  }
</style>