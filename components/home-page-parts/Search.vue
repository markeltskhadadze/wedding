<script setup lang="ts">
  import Header from "~/components/home-page-parts/Header.vue"
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'
  import { eventsInfo } from '~/stores/events'
  import { homePageData } from '~/stores/home-page'
  import CategoryListItems from '~/components/home-page-parts/parts/CategoryListItems.vue'

  const event = eventsInfo()
  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const router = useRouter()
  const homeData = homePageData()

  async function getSearchResult() {
    await homeData.getBusiness()
  }
</script>

<template>
  <div :class="{ '': event.chooseVendor, 'search-container': !event.chooseVendor }">
    <Header v-if="!event.chooseVendor" />
    <div
        :class="
        {
          'search-vendor': event.chooseVendor,
          'search-field': !event.chooseVendor
        }"
    >
      <div class="relative">
        <input
            type="text"
            placeholder="Поиск"
            v-model="event.searchValue"
            :class="{
              'search-field-vendor': event.chooseVendor,
              'search-field-input': !event.chooseVendor
            }"
        />
        <div v-if="!event.chooseVendor" @click="router.push({ path: '/vendor' })" class="search-btn">
          <img :src="getIcon + 'search-icon.png'" />
          <p v-if="checkScreen">{{ $t('search.search_btn') }}</p>
        </div>
        <div v-if="event.chooseVendor" @click="getSearchResult" class="search-btn-vendor">
          <img :src="getIcon + 'vendor-search.png'" />
          <p v-if="checkScreen">{{ $t('search.search_btn') }}</p>
        </div>
        <div v-if="checkScreen" class="categories-btn">
          <CategoryListItems />
          <span>|</span>
        </div>
        <div v-if="!checkScreen" class="categories-btn">
          <CategoryListItems />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .search-container {
    background: url("/home-banner-img.png") no-repeat;
    background-size: cover;
    min-height: 460px;
    position: relative;
  }
  .search-field {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 1128px;
    min-height: 68px;
  }
  .search-vendor {
    min-width: 705px;
    min-height: 68px;
  }
  .search-field-input {
    border-radius: 16px;
    background: #F9F9F9;
    min-width: 1128px;
    min-height: 68px;
    padding-left: 170px;
  }
  .search-field-vendor {
    min-width: 705px;
    min-height: 68px;
    padding-left: 185px;
    border-radius: 16px;
    background: #F9F9F9;
  }
  .search-btn {
    display: inline-flex;
    padding: 16px 24px 16px 20px;
    justify-content: center;
    align-items: center;
    gap: 14px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    cursor: pointer;
    position: absolute;
    right: 6px;
    bottom: 6px;
  }
  .search-btn-vendor {
    display: inline-flex;
    padding: 16px 24px 16px 20px;
    justify-content: center;
    align-items: center;
    gap: 14px;
    border-radius: 12px;
    background: #ffffff;
    cursor: pointer;
    position: absolute;
    right: 6px;
    bottom: 6px;
  }
  .search-btn p {
    color: #FFF;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .search-btn img {
    max-width: 24px;
    max-height: 24px;
  }
  .categories-btn {
    display: inline-flex;
    padding: 12px 24px 17px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    position: absolute;
    left: 6px;
    bottom: 6px;
  }
  .categories-btn p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    cursor: pointer;
  }
  .mobile-search-input {
    max-width: 350px;
    max-height: 60px;
    border-radius: 15px;
    background: #F9F9F9;
  }
  @media (max-width: 900px) {
    .search-field-input {
      min-width: 350px;
      padding-left: 75px;
    }
    .search-field {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      min-width: 350px;
      min-height: 68px;
    }
    .search-btn {
      padding: 14px;
      bottom: 8px;
    }
    .search-vendor {
      min-width: 318px;
      min-height: 60px;
    }
    .search-field-vendor {
      min-width: 318px;
      min-height: 60px;
      padding-left: 60px;
    }
  }
</style>