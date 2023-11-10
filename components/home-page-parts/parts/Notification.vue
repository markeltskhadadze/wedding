<script setup lang="ts">
  import { homePageData } from "~/stores/home-page"
  import { getImage } from '~/mixins/get-icon'

  const { getIcon } = getImage.setup()
  const home = homePageData()
</script>

<template>
  <div class="notification-container">
    <img :src="getIcon + 'list-event.png'" class="close-image" />
    <p class="invite-text">
      Успех!
    </p>
  </div>
</template>
<style scoped>
  .invite-text {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .notification-container {
    position: fixed;
    top: 10%;
    right: 6%;
    z-index: 99;
    display: inline-flex;
    padding: 32px;
    align-items: flex-start;
    gap: 16px;
    border-radius: 14px;
    background: #FFF;
    box-shadow: 0 13px 23px 0  rgba(0, 0, 0, 0.06);
    max-width: 420px;
  }

  @media (max-width: 600px) {
    .notification-container {
      right: 2%;
    }
  }
</style>