<script setup lang="ts">
  import { onBeforeUnmount } from 'vue'
  import { homePageData } from '~/stores/home-page'
  import { TCategoties } from '~/types'

  const homeData = homePageData()
  const localePath = useLocalePath()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))

  function sendCategoryName(name: string) {
    homeData.categoryName = name
  }
  onBeforeUnmount(() => {
    homeData.showVendorList = false
  })
</script>

<template>
  <div class="flex flex-col gap-6 vendor-container">
    <p class="category-title">{{ $t('header.vendor_nav') }}</p>
    <div class="pils-container">
      <p
          v-for="(category, index) in categories"
          :key="index"
          @click="sendCategoryName(category.name)"
          class="categories-pils">
        <NuxtLink :to="localePath('/vendor')">{{ category.name }}</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .category-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .pils-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 403px;
  }
  .categories-pils {
    padding: 8px 16px;
    border-radius: 30px;
    background: #F1F1F1;
    cursor: pointer;
  }
  .categories-pils:hover {
    background: #FF385C;
    color: #FFF;
  }
  .vendor-container {
    margin: 20px;
    padding: 16px;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0 13px 23px 0 rgba(0, 0, 0, 0.06);
  }
  @media (max-width: 600px) {
    .pils-container {
      min-width: min-content;
    }
  }
</style>