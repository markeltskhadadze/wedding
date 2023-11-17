<script setup lang="ts">
  import { getImage } from '~/mixins/get-icon'
  import { profileData } from '~/stores/profile'
  import { ref, Ref } from 'vue'
  import { placeData } from '~/stores/place-info'
  import DeleteReview from "~/components/profile/DeleteReview.vue"

  const { getIcon } = getImage.setup()
  const profile = profileData()
  const place = placeData()
  const showEditMenu: Ref<boolean> = ref(false)
  const props = defineProps({
    review: {
      type: Object,
      required: true
    }
  })
</script>

<template>
  <div class="flex-wrap justify-between">
    <div class="flex items-center gap-8">
      <div class="flex gap-4 flex-[0_1_45%]">
        <img v-if="!props.review.business?.images" :src="getIcon + 'place-img.png'" class="review-img" />
        <img v-if="props.review.business?.images" :src="props.review.business.images[0].image.file" class="review-img" />
        <div class="flex flex-col gap-2 justify-center">
          <div class="flex justify-between">
            <p class="place-name">{{ props.review.business.name }}</p>
            <div class="flex gap-1 items-center">
              <img :src="getIcon + 'star.png'" class="place-icon" />
              <p class="rating-value">{{ props.review.assigned_rating }}</p>
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <img :src="getIcon + 'location.png'" class="place-icon" />
            <p class="location">г. Ташкента Чиланзарский р. </p>
          </div>
        </div>
      </div>
      <div class="flex flex-[0_1_55%] flex-col gap-2">
        <div class="flex gap-4 items-center">
          <div class="flex">
            <img v-for="index in 5" :key="index"
                 :src="index <= props.review.assigned_rating ? getIcon + 'star.png' : getIcon + 'none-star.png'"
                 class="place-icon"
            />
          </div>
          <p class="date-review">{{ props.review.created_at }}</p>
        </div>
        <div>
          <p>{{ props.review.text }}
          </p>
        </div>
      </div>
      <div class="edit-content relative">
        <img @click="showEditMenu = !showEditMenu" :src="getIcon + 'menu-for-review.png'" />
        <div v-if="showEditMenu" class="edit-menu">
          <p @click="place.showEditModal(props.review)">Редактировать</p>
          <p @click="place.showDeleteModal(props.review._id)">Удалить</p>
        </div>
      </div>
    </div>
    <hr style="margin-top: 32px" />
    <DeleteReview />
  </div>
</template>

<style scoped>
  .rating-value {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 14px;
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
  .date-review {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .edit-content img {
    cursor: pointer;
  }
  .edit-content {
    margin-bottom: auto;
  }
  .edit-menu {
    display: flex;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    border-radius: 14px;
    background: #FFF;
    box-shadow: 0 13px 23px 0 rgba(0, 0, 0, 0.06);
    position: absolute;
    right: 10px;
    top: 20px;
  }
  .edit-menu p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    cursor: pointer;
  }
  .review-img {
    max-width: 100px;
    max-height: 100px;
    border-radius: 16px;
  }
  .place-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .place-icon {
    max-width: 16px;
    max-height: 16px;
  }
</style>