<script setup lang="ts">
  import { type PropType } from 'vue'
  import { TPlaces } from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { urlName } from '~/mixins/get-url-name'
  import { screen } from '~/mixins/check-screen'

  const { getIcon } = getImage.setup()
  const { getURLName } = urlName.setup()
  const { checkScreen } = screen.setup()
  const localePath = useLocalePath()
  const props = defineProps({
    place: {
      type: Object as PropType<TPlaces>,
      required: true
    }
  })
</script>

<template>
  <div class="place-content" :class="{ 'flex-[0_1_45%]': getURLName && !checkScreen }">
    <div class="relative">
      <img :src="getIcon + 'place-img.png'" class="place-img" />
      <img :src="getIcon + 'like.png'" class="like-img" />
    </div>
    <div class="place-info">
      <div class="flex justify-between">
        <NuxtLink :to="localePath`/${ place.id }`" class="place-name">{{ place.name }}</NuxtLink>
        <div class="flex gap-1">
          <img :src="getIcon + 'star.png'" class="place-icon" />
          <p class="rating-value">{{ place.rating }}</p>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <img :src="getIcon + 'location.png'" class="place-icon" />
        <p class="location">{{ place.location }}</p>
      </div>
      <p class="price">От {{ place.price }} UZS</p>
    </div>
  </div>
</template>

<style scoped>
  .place-img {
    max-width: 258px;
    max-height: 258px;
    border-radius: 25px;
  }
  .place-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
  }
  .place-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  .place-icon {
    max-width: 16px;
    max-height: 16px;
  }
  .rating-value {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .location {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .price {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 800;
    line-height: 136%;
  }
  .like-img {
    position: absolute;
    top: 12px;
    right: 16px;
    cursor: pointer;
  }
  .place-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
</style>