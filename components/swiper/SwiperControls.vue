<script setup lang="ts">
  import { getImage } from "~/mixins/get-icon"

  const swiper = useSwiper()
  const { getIcon } = getImage.setup()
</script>

<template>
  <img alt="next-arrow" :src="getIcon + 'arrow-slider.png'" class="next-swipe" @click="swiper.slideNext()" />
  <img alt="prev-swipe" :src="getIcon + 'arrow-prev.png'" class="prev-swipe" @click="swiper.slidePrev()" />
</template>

<style scoped>
  .next-swipe {
    position: absolute;
    top: 120px;
    left: 70px;
    padding: 16px;
    border-radius: 30px;
    background: #FFF;
  }
  .prev-swipe {
    position: absolute;
    top: 120px;
    right: 70px;
    padding: 16px;
    border-radius: 30px;
    background: #FFF;
  }
</style>
