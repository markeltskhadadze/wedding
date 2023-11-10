<script setup lang="ts">
  import { onMounted } from 'vue'
  import Header from '~/components/home-page-parts/Header.vue'
  import ExitModal from '~/components/profile/ExitModal.vue'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import { getImage } from '~/mixins/get-icon'
  import { homePageData } from "~/stores/home-page"
  import { profileData } from '~/stores/profile'
  import { getPath } from '~/mixins/current-url'
  import { screen } from '~/mixins/check-screen'
  import Notification from "~/components/home-page-parts/parts/Notification.vue"
  import { authInfo } from "~/stores/auth"

  const localePath = useLocalePath()
  const { getIcon } = getImage.setup()
  const profile = profileData()
  const home = homePageData()
  const auth = authInfo()
  const router = useRouter()
  const { checkScreen } = screen.setup()
  const { isBusinessActive, isSettingsActive } = getPath.setup()

  function handleAddBusinessClick() {
    const input = document.querySelector('.photoUpload') as HTMLInputElement
    if (input) {
      input.click()
    }
  }

  function showSettings(checkScreen: boolean) {
    if (!checkScreen) profile.showMobileSettings = true
  }

  onMounted(() => {
    auth.setToken(null)
    if (!auth.isAuthenticated) router.push({ path: '/' })
  })
</script>

<template>
  <Header />
  <div class="profile-settings relative">
    <div class="user-left-side" v-if="profile.profileInfo.user_type === 'customer'">
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
        <img :src="getIcon + 'reviews-icon.png'" />
        <NuxtLink :to="localePath('/profile/reviews')">
          <p>Мои отзывы</p>
        </NuxtLink>
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
    <div class="user-left-side" v-if="profile.profileInfo.user_type === 'vendor'">
      <div class="flex flex-col items-center">
        <img v-if="profile.profileInfo.profile_image" :src="profile.profileInfo.profile_image.file" class="user-img" />
        <img v-if="!profile.profileInfo.profile_image" :src="getIcon + 'default-avatar.png'" class="user-img" />
        <p class="user-name">{{ profile.profileInfo.full_name }}</p>
      </div>
      <hr style="width: 100%"/>
      <div class="options">
        <img v-if="!isBusinessActive" :src="getIcon + 'business-icon.png'" />
        <img v-if="isBusinessActive" :src="getIcon + 'selected-business.png'" />
        <NuxtLink :to="localePath('/profile/business-settings')">
          <p @click="showSettings" :style="{ 'color': isBusinessActive ? '#FF385C' : '' }">Бизнесы</p>
        </NuxtLink>
      </div>
      <div class="options">
        <img v-if="!isSettingsActive" :src="getIcon + 'setting.png'" />
        <img v-if="isSettingsActive" :src="getIcon + 'selected-settings.png'" />
        <p @click="showSettings(checkScreen)" :style="{ 'color': isSettingsActive ? '#FF385C' : '' }">Настройки</p>
      </div>
      <div class="options">
        <img :src="getIcon + 'sign-out-icon.png'" />
        <p @click="profile.openExitModal = !profile.openExitModal">Выход</p>
      </div>
    </div>
    <div class="flex flex-col">
      <p v-if="checkScreen" class="setting-title">Настройки</p>
      <Breadcrumbs v-if="checkScreen" :currentCategory.sync="profile.currentCategory" />
      <div class="personal-data" v-if="checkScreen || profile.showMobileSettings">
        <div class="add-user-image" @click="handleAddBusinessClick">
          <img v-if="profile.profileInfo.profile_image && !profile.avatarSrc.length" :src="profile.profileInfo.profile_image.file" class="user-img" />
          <img v-if="profile.profileInfo.profile_image && profile.avatarSrc.length" :src="profile.avatarSrc" class="user-img" />
          <img :src="getIcon + 'add-image.png'" class="add-image" />
          <div v-if=!profile.profileInfo.profile_image>
            <img v-if="!profile.avatarSrc.length" :src="getIcon + 'default-avatar.png'" />
            <img v-if="profile.avatarSrc.length" :src="profile.avatarSrc" />
            <img :src="getIcon + 'add-image.png'" class="add-image" />
          </div>
          <input
              type="file"
              class="photoUpload"
              hidden
              @change="profile.selectFile"
          />
        </div>
        <div class="flex flex-col items-start gap-8">
          <p>Личные данные</p>
        </div>
        <hr style="width: 100%"/>
        <div class="flex justify-start gap-8" :class="{ 'flex-col': !checkScreen, 'flex-wrap': checkScreen }">
          <div class="flex flex-col items-start gap-2 flex-[0_1_45%]">
            <p class="lable-name">Имя Фамилия</p>
            <input v-model="profile.profileInfo.full_name" class="profile-input" type="text" />
          </div>
          <div class="flex flex-col items-start gap-2 flex-[0_1_45%]">
            <p class="lable-name">Номер телефона</p>
            <input class="profile-input" v-maska data-maska="+998 ##-###-##-##" v-model="profile.profileInfo.phone_number" />
          </div>
        </div>
        <div class="flex" :class="{ 'justify-end': checkScreen, 'justify-start': !checkScreen }">
          <button class="save-btn" @click="profile.saveUserData(profile.profileInfo.full_name)">Сохранить</button>
        </div>
      </div>
    </div>
    <Notification v-if="home.showNotification" />
  </div>
  <ExitModal />
</template>

<style scoped>
  .add-user-image {
    position: relative;
    cursor: pointer;
  }
  .add-image {
    border-radius: 20px;
    background: #FF385C;
    max-width: 26px;
    max-height: 26px;
    position: absolute;
    left: 65px;
    bottom: 0;
  }
  .setting-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .save-btn {
    color: #FFF;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 16px 32px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    margin-top: 32px;
  }
  .profile-input {
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    width: 100%;
  }
  .lable-name {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
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
  .personal-data {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 1126px;
    padding: 32px;
    margin-top: 32px;
    border-radius: 16px;
    background: #FFF;
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
  @media (max-width: 600px) {
    .personal-data {
      min-width: auto;
    }
    .profile-settings {
      display: inherit;
    }
  }
</style>