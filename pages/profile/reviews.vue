<script setup lang="ts">
  import Header from '~/components/home-page-parts/Header.vue'
  import ExitModal from '~/components/profile/ExitModal.vue'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import Review from '~/components/profile/Review.vue'
  import { getImage } from '~/mixins/get-icon'
  import { profileData } from '~/stores/profile'
  import { getPath } from '~/mixins/current-url'
  import { screen } from '~/mixins/check-screen'
  import { onMounted, toRaw } from 'vue'
  import {authInfo} from "~/stores/auth"
  import EditReviewModal from "~/components/profile/EditReviewModal.vue"

  const localePath = useLocalePath()
  const auth = authInfo()
  const router = useRouter()
  const { getIcon } = getImage.setup()
  const profile = profileData()
  const { checkScreen } = screen.setup()
  const { isReviews, isSettingsActive } = getPath.setup()

  onMounted(async() => {
    auth.setToken(null)
    if (!auth.isAuthenticated) router.push({ path: '/' })
    await profile.getReviews()
  })
</script>

<template>
  <Header />
  <div class="profile-settings">
    <div v-if="checkScreen" class="user-left-side">
      <div class="flex flex-col items-center">
        <img v-if="profile.profileInfo.profile_image" :src="profile.profileInfo.profile_image.file" class="user-img" />
        <img v-if="!profile.profileInfo.profile_image" :src="getIcon + 'default-avatar.png'" class="user-img" />
        <p class="user-name">{{ profile.profileInfo.full_name }}</p>
      </div>
      <hr style="width: 100%"/>
      <div class="options">
        <img v-if="!isSettingsActive" :src="getIcon + 'setting.png'" />
        <img v-if="isSettingsActive" :src="getIcon + 'selected-settings.png'" />
        <NuxtLink :to="localePath('/profile/settings')">
          <p :style="{ 'color': isSettingsActive ? '#FF385C' : '' }">Настройки</p>
        </NuxtLink>
      </div>
      <div class="options">
        <img v-if="!isReviews" :src="getIcon + 'reviews-icon.png'" />
        <img v-if="isReviews" :src="getIcon + 'selected-reviews.png'" />
        <p :style="{ 'color': isReviews ? '#FF385C' : '' }">Мои отзывы</p>
      </div>
      <div class="options">
        <img :src="getIcon + 'save-icon.png'" />
        <NuxtLink :to="localePath('/favorites')">
          <p>Избранное</p>
        </NuxtLink>
      </div>
      <div class="options">
        <img :src="getIcon + 'sign-out-icon.png'" />
        <p @click="profile.openExitModal = !profile.openExitModal">Выход</p>
      </div>
    </div>
    <div class="flex flex-col flex-[0_1_50%]">
      <p class="setting-title">Настройки</p>
      <Breadcrumbs :currentCategory.sync="profile.currentCategory" />
      <div class="reviews-data" v-if="profile.reviews.length">
        <Review v-for="(review, index) in profile.reviews" :key="index"  :review="review" />
      </div>
      <div class="reviews-data" v-if="!profile.reviews.length">
        <div class="flex flex-col items-center gap-8">
          <img :src="getIcon + 'empty-field.png'" />
          <div class="flex flex-col items-center gap-3">
            <p class="empty-title">{{ $t('business.is_empty') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ExitModal />
  <EditReviewModal />
</template>

<style scoped>
  .reviews-data {
    display: flex;
    padding: 32px;
    flex-direction: column;
    gap: 32px;
    border-radius: 16px;
    background: #FFF;
    max-width: 1200px;
    margin-top: 32px;
  }
  .setting-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .user-img {
    display: flex;
    justify-content: center;
    max-width: 90px;
    min-height: 90px;
    border-radius: 50%;
    object-fit: cover;
  }
  .user-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    margin-top: 10px;
  }
  .profile-settings {
    display: flex;
    justify-content: center;
    padding-top: 32px;
    gap: 32px;
    background: #F9F9F9;
    min-height: 100vh;
  }
  .user-left-side {
    display: flex;
    min-width: 258px;
    max-height: 400px;
    padding: 32px 32px 64px 32px;
    flex-direction: column;
    gap: 16px;
    border-radius: 24px;
    background: #FFF;
  }
  .personal-data img {
    min-width: 90px;
    min-height: 90px;
  }
  .options {
    display: flex;
    width: 144px;
    align-items: flex-start;
    gap: 16px;
  }
  .options p {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    cursor: pointer;
  }
  .options img {
    max-width: 24px;
    max-height: 24px;
  }
</style>