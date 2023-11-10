<script setup lang="ts">
  import { getImage } from "~/mixins/get-icon"

  const swiper = useSwiper()
  const { getIcon } = getImage.setup()
</script>

<template>
  <div class="flex gap-6 justify-end">
    <img alt="next-arrow" :src="getIcon + 'arrow-slider.png'" class="next-swipe swiper-arrows" @click="swiper.slidePrev()" />
    <img alt="prev-swipe" :src="getIcon + 'arrow-prev.png'" class="prev-swipe swiper-arrows" @click="swiper.slideNext()" />
  </div>
</template>

<style scoped>
  .swiper-arrows {
    max-width: 24px;
    max-height: 24px;
    cursor: pointer;
  }
</style>
