<script setup lang="ts">
  import { onMounted } from 'vue'
  import { homePageData } from '~/stores/home-page'
  import { TResults } from '~/types'
  import TopPlace from '~/components/home-page-parts/parts/TopPlace.vue'
  import { screen } from '~/mixins/check-screen'

  const { checkScreen } = screen.setup()
  const homeData = homePageData()
  const places: TResults[] = reactive(toRaw(homeData.topPlaces))

  onMounted(async () => {
    await homeData.getBusiness()
  })
</script>

<template>
  <div class="places-container">
    <h2>{{ $t('top_for_month') }}</h2>
    <div class="flex flex-wrap gap-4" :class="{ 'places': !checkScreen }">
      <TopPlace v-for="(place, index) in places" :key="index" :place="place" />
    </div>
  </div>
</template>

<style scoped>
  .places-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 64px 106px;
  }
  h2 {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .places {
    overflow-x: scroll;
    gap: 20px;
    flex-wrap: nowrap;
  }
  .places::-webkit-scrollbar {
    width: 0;
  }
  @media (max-width: 900px) {
    .places-container {
      padding: 0 20px;
    }
  }
</style>