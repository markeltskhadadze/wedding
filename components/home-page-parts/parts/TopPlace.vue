<script setup lang="ts">
  import { type PropType, computed, onMounted } from 'vue'
  import { TResults } from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { urlName } from '~/mixins/get-url-name'
  import { screen } from '~/mixins/check-screen'
  import { favoriteBusiness } from '~/stores/favorite'
  import { homePageData } from "~/stores/home-page"
  const localePath = useLocalePath()

  const { getIcon } = getImage.setup()
  const { getURLName } = urlName.setup()
  const { checkScreen } = screen.setup()
  const homeData = homePageData()
  const favorite = favoriteBusiness()
  const props = defineProps({
    place: {
      type: Object as PropType<TResults>,
      required: true
    }
  })

  const getMainImage = computed(() => {
    if (props.place.images) {
      return props.place.images.filter(image => image.is_main)
    }
  })
</script>

<template>
  <div class="place-content" :class="{ 'flex-[0_1_45%]': getURLName && !checkScreen }">
    <div class="relative image-container">
<!--      <img v-if="getMainImage.length" :src="getMainImage[0].image?.file" class="place-img" :class="{ 'place-img-mobile': getURLName && !checkScreen }" />-->
      <img :src="getIcon + 'place-img.png'" class="place-img" :class="{ 'place-img-mobile': getURLName && !checkScreen }" />
      <img v-if="!favorite.getSelectedFavorite.includes(place.id)" @click="favorite.makeFavorite(place.id)" :src="getIcon + 'like.png'" class="like-img" />
      <img v-if="favorite.getSelectedFavorite.includes(place.id)" @click="favorite.deleteFavorite(place.id)" :src="getIcon + 'favorite-icon.png'" class="like-img" />
    </div>
    <div class="place-info">
      <div class="flex justify-between">
        <NuxtLink class="place-name" :to="localePath(`/business/${ place.id }`)">{{ place.name }}</NuxtLink>
        <div class="flex gap-1">
          <img :src="getIcon + 'star.png'" class="place-icon" />
          <p class="rating-value">{{ place.rate }}</p>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <img :src="getIcon + 'location.png'" class="place-icon" />
        <p v-if="place.district" class="location">{{ place.district.name }}</p>
      </div>
      <p class="price">От {{ place.price }} UZS</p>
    </div>
  </div>
</template>

<style scoped>
  .image-container {
    min-height: 258px;
  }
  .place-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .place-img {
    min-width: 258px;
    max-height: 258px;
    border-radius: 25px;
    object-fit: cover;
  }
  .place-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
    max-width: 258px;
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
      min-width: 182px;
    }
    .image-container {
      min-height: 165px;
    }
  }
</style>