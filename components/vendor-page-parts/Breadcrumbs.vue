<script setup lang="ts">
  import { urlName } from '~/mixins/get-url-name'

  const { getURLName } = urlName.setup()
  const props = defineProps({
    currentCategory: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="flex gap-1">
    <p class="url-name">{{ getURLName }}</p>
    <p class="url-name">/</p>
    <p class="current-category">{{ currentCategory }}</p>
  </div>
</template>

<style scoped>
  .url-name {
    color: #B9BDCA;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .current-category {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
</style>