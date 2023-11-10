<script setup lang="ts">
  import { getImage } from '~/mixins/get-icon'
  import { urlName } from '~/mixins/get-url-name'
  import { homePageData } from '~/stores/home-page'
  import { authInfo } from "~/stores/auth"
  import { profileData } from '~/stores/profile'

  const { getURLName } = urlName.setup()
  const { getIcon } = getImage.setup()
  const localePath = useLocalePath()
  const auth = authInfo()
  const home = homePageData()
  const profile = profileData()
  const router = useRouter()
</script>

<template>
  <div class="navbar">
    <div class="flex flex-col items-center">
      <img :src="getIcon + 'home-icon.png'" v-if="getURLName === ''" />
      <img :src="getIcon + 'home-page.png'" v-if="getURLName !== ''" />
      <NuxtLink :to="localePath('/')">
        <p class="navbar-list" :class="{ 'page-selected': getURLName === '' }">{{ $t('header.home_nav') }}</p>
      </NuxtLink>
    </div>
    <div class="flex flex-col items-center">
      <img :src="getIcon + 'vendor-icon.png'" v-if="getURLName !== 'Вендоры' && !home.showVendorList" />
      <img :src="getIcon + 'selected-vendor.png'" v-if="getURLName === 'Вендоры' || home.showVendorList" />
      <p
          class="navbar-list"
          v-if="profile.profileInfo.user_type !== 'vendor'"
          :class="{ 'page-selected': getURLName === 'Вендоры' || home.showVendorList }"
          @click="home.showVendorList = !home.showVendorList"
      >{{ $t('header.vendor_nav') }}</p>
    </div>
    <div class="flex flex-col items-center">
      <img :src="getIcon + 'save-icon.png'" />
      <p class="navbar-list">{{ $t('header.favorites_nav') }}</p>
    </div>
    <div class="flex flex-col items-center" v-if="profile.profileInfo.user_type !== 'vendor'">
      <img :src="getIcon + 'event-icon.png'" />
      <NuxtLink :to="localePath('/events')">
        <p class="navbar-list" :class="{ 'page-selected': getURLName === 'Ивент' }">{{ $t('header.event_nav') }}</p>
      </NuxtLink>
    </div>
    <div v-if="!auth.isAuthenticated" class="flex flex-col items-center">
      <img :src="getIcon + 'sign-in.png'" />
      <p class="navbar-list">{{ $t('header.sign_in') }}</p>
    </div>
    <div v-if="auth.isAuthenticated" class="flex flex-col items-center">
      <img :src="getIcon + 'sign-in.png'" />
      <p @click="router.push({ path: '/profile/settings' })" class="navbar-list">Профиль</p>
    </div>
  </div>
</template>

<style scoped>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 24px 24px 0 0;
    background: #FFF;
    position: fixed;
    bottom: 0;
    width: 100%;
    min-height: 61px;
  }
  .navbar-list {
    color: #B9BDCA;
    text-align: center;
    font-family: 'Geologica';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .navbar img {
    max-width: 24px;
    max-height: 24px;
  }
  .page-selected {
    color: #FF385C;
  }
</style>