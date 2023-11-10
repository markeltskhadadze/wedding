<script setup lang="ts">
  import { type PropType } from 'vue'
  import {TBusinessResult, TImageBusiness} from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { urlName } from '~/mixins/get-url-name'
  import { screen } from '~/mixins/check-screen'
  import { homePageData } from "~/stores/home-page"
  import { businessInfo } from "~/stores/business"

  const { getIcon } = getImage.setup()
  const { getURLName } = urlName.setup()
  const { checkScreen } = screen.setup()
  const business = businessInfo()
  const homeData = homePageData()
  const props = defineProps({
    place: {
      type: Object as PropType<TBusinessResult>,
      required: true
    }
  })

  function getMainImage(images: TImageBusiness[]) {
    const mainImage = images.filter(image => image.is_main)
    if (mainImage.length && mainImage[0].image) {
      return mainImage[0].image.file
    }
    return
  }
</script>

<template>
  <div class="place-content" :class="{ 'flex-[0_1_45%]': getURLName && !checkScreen }">
    <div class="relative image-content">
      <img v-if="place.images?.length" :src="getMainImage(place.images)" class="place-img" :class="{ 'place-img-mobile': getURLName && !checkScreen }" />
      <img v-if="!place.images?.length" :src="getIcon + 'place-img.png'" class="place-img" :class="{ 'place-img-mobile': getURLName && !checkScreen }" />
    </div>
    <div class="place-info">
      <div class="flex justify-between">
        <p @click="business.editBusiness(place.id)">{{ place.name }}</p>
        <div class="flex gap-1">
          <img :src="getIcon + 'star.png'" class="place-icon" />
          <p class="rating-value">{{ place.rate }}</p>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <img :src="getIcon + 'location.png'" class="place-icon" />
        <p class="location">{{ place.district }}</p>
      </div>
      <p class="price">От {{ place.price }} UZS</p>
    </div>
  </div>
</template>

<style scoped>
  .image-content {
    display: flex;
    flex: 0 1 80%;
    justify-content: center;
    align-items: center;
  }
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
  .place-img-mobile {
    max-width: 165px;
    max-height: 165px;
  }
  @media (max-width: 600px) {
    .place-img {
      max-width: 155px;
      max-height: 155px;
    }
  }
</style>