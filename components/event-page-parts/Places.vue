<script setup lang="ts">
  import { PropType } from 'vue'
  import { TResults } from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'
  import { homePageData } from "~/stores/home-page"

  const props = defineProps({
    place: {
      type: Object as PropType<TResults>,
      required: true
    }
  })

  const localePath = useLocalePath()
  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const homeData = homePageData()

  function selectPlace(name: string, id: number) {
    if (!homeData.selectedPlacesId.length) {
      homeData.selectedPlacesId.push(id)
    } else {
      homeData.selectedPlacesId.length = 0
      homeData.selectedPlacesId.push(id)
    }
    homeData.selectedPlace(name, id)
  }
</script>

<template>
  <div class="flex justify-between items-center">
    <div class="place-content">
      <div class="relative">
        <img :src="getIcon + 'place-img.png'" class="place-img"  />
        <img :src="getIcon + 'like.png'" class="like-img" />
      </div>
      <div class="place-info">
        <div class="flex justify-between items-center gap-2">
          <NuxtLink :to="localePath`/${ place.id }`" class="place-name">{{ place.name }}</NuxtLink>
          <div class="flex gap-1 items-center">
            <img :src="getIcon + 'star.png'" class="place-icon" />
            <p class="rating-value">{{ place?.rate }}</p>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <img :src="getIcon + 'location.png'" class="place-icon" />
          <p class="location">{{ place.district?.name }}</p>
        </div>
        <p class="price">От {{ place.price }} UZS</p>
      </div>
    </div>
    <div :class="{ 'selected': homeData.selectedPlacesId.includes(place.id) }">
      <img v-if="homeData.selectedPlacesId.includes(place.id)" :src="getIcon + 'selected-Icon.png'" />
      <button
          v-if="checkScreen"
          @click="selectPlace(place.name, place.id)"
          class="select-place">{{ $t('register_modal.select_profile') }}
      </button>
    </div>
  </div>
  <hr style="margin: 8px 0 8px 125px;" />
</template>

<style scoped>
  .place-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .selected {
    display: flex;
    gap: 10px;
    align-items: center;
    background: #FFFFFF;
    padding: 16px 32px 16px 24px;
    border-radius: 12px;
  }
  .selected img {
    max-width: 20px;
    max-height: 20px;
  }
  .selected button {
    background: #FFFFFF;
    padding: 0;
  }
  .place-img {
    max-width: 100px;
    max-height: 100px;
    border-radius: 25px;
  }
  .place-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
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
  .select-place {
    padding: 16px 32px;
    border-radius: 12px;
    background: #F9F9F9;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
  }
  @media (max-width: 900px) {
    .place-info {
      gap: 4px;
    }
    .place-content {
      flex: 0 1 80%;
    }
  }
</style>