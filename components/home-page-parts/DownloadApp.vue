<script setup lang="ts">
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'

  const { checkScreen, width } = screen.setup()
  const { getIcon } = getImage.setup()
</script>

<template>
  <div class="banner-container">
    <div
        class="flex justify-center items-center gap-14 banner-background"
        :class="{ 'flex-nowrap': width === 1280, 'flex-wrap-reverse': width !== 1280  }">
      <div class="flex flex-col gap-8 p-4">
        <p class="download-banner-title">{{ $t('download_app.title') }}</p>
        <div class="flex flex-col gap-2">
          <p class="choose-download">{{ $t('download_app.download_text') }}</p>
          <div v-if="checkScreen" class="flex gap-8">
            <img :src="getIcon + 'google-downl.png'" />
            <img :src="getIcon + 'apple-downl.png'" />
          </div>
          <div v-if="!checkScreen" class="flex gap-1.5">
            <img :src="getIcon + 'save-add-mobile.png'" />
            <img :src="getIcon + 'save-apple-mobile.png'" />
          </div>
        </div>
      </div>
      <div>
        <img v-if="checkScreen" :src="getIcon + 'download-app.png'" class="main-banner-image" />
        <img v-if="!checkScreen" :src="getIcon + 'mobile-banner.png'" class="main-banner-image" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .download-banner-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    max-width: 418px;
  }
  .choose-download {
    color: #545360;
    font-family: 'Geologica';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: -0.078px;
    max-width: 498px;
  }
  .main-banner-image {
    max-width: 971px;
    max-height: 729px;
  }
  .banner-container {
    padding: 70px 106px;
  }
  .banner-background {
    border-radius: 32px;
    background: #FFF;
  }
  @media (max-width: 1280px) {
    .main-banner-image {
      max-width: 600px;
    }
    .banner-background {
      padding: 0 0 0 50px;
    }
    .download-banner-title {
      font-size: 28px;
    }
  }
  @media (max-width: 900px) {
    .main-banner-image {
      max-width: 330px;
      max-height: 351px;
    }
    .banner-container {
      padding: 64px 20px;
    }
  }
</style>