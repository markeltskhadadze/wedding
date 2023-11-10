<script setup lang="ts">
  import { onMounted } from 'vue'
  import { Menu, MenuButton, MenuItems } from '@headlessui/vue'
  import { homePageData } from '~/stores/home-page'
  import { TCategoties } from '~/types'
  import { favoriteBusiness } from "~/stores/favorite"
  import { urlName } from '~/mixins/get-url-name'
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'

  const { getURLName } = urlName.setup()
  const homeData = homePageData()
  const favorite = favoriteBusiness()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))
  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const localePath = useLocalePath()

  const props = defineProps({
    headerVisible: {
      type: Boolean
    }
  })
  const { headerVisible } = props
  async function sendCategoryName(id: string) {
    localStorage.setItem('categoryId', id)
    homeData.businessId = id
  }

  onMounted(async() => {
    await homeData.getCategories()
    await favorite.getFavorites()
  })
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div v-if="headerVisible">
      <MenuButton class="custom-class" :class="{ 'custom-class-selected': getURLName === 'Вендоры' }" >
        {{ $t('search.vendors_category') }}
      </MenuButton>
    </div>
    <div v-if="!headerVisible">
      <MenuButton class="custom-class-search">
        <div v-if="checkScreen" class="categories-btn">
          {{ $t('search.category') }}
          <img :src="getIcon + 'Arrow.png'">
          <img :src="getIcon + 'line-search.png'">
        </div>
        <div v-if="!checkScreen" class="categories-btn">
          <img :src="getIcon + 'mobile-menu.png'">
          <img :src="getIcon + 'line-search.png'">
        </div>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="absolute left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="pills-container">
          <p
              v-for="(category, index) in categories"
              :key="index"
              @click="sendCategoryName(category.id)"
              class="categories-pills">
            <NuxtLink :to="localePath('/vendor')">{{ category.name }}</NuxtLink>
          </p>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style scoped>
  .categories-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    position: absolute;
    left: 6px;
    bottom: 2px;
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
  .custom-class {
    background: transparent;
    border-radius: 0;
    border: none;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
    cursor: pointer;
  }
  .custom-class-search {
    background: transparent;
    border-radius: 0;
    border: none;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
    cursor: pointer;
  }
  .custom-class:hover {
    border-bottom: 2px solid #FF385C;
  }
  .custom-class-selected {
    border-bottom: 2px solid #FF385C;
  }
  .pills-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 535px;
    padding: 32px;
  }
  .categories-pills {
    padding: 8px 16px;
    border-radius: 30px;
    background: #F1F1F1;
    cursor: pointer;
  }
  .categories-pills:hover {
    background: #FF385C;
    color: #FFF;
  }
  @media (max-width: 900px) {
    .custom-class {
      color: #B9BDCA;
      text-align: center;
      font-family: 'Geologica';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
    }
    .pills-container {
      min-width: 340px;
      padding: 20px;
      max-height: 200px;
      overflow: scroll;
    }
  }
</style>