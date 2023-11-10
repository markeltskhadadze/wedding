<script setup lang="ts">
  import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue"
  import { ref, toRaw, reactive } from 'vue'
  import { homePageData } from '~/stores/home-page'
  import { getImage } from "~/mixins/get-icon"
  import { TCategoties } from "~/types"

  const homeData = homePageData()
  const { getIcon } = getImage.setup()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))
  const selectedCategory = ref(categories[0])

  const getFilterID = computed(() => {
    if (selectedCategory.value) {
      return homeData.businessId = selectedCategory.value.id
    } else {
      return homeData.businessId = ''
    }
  })
</script>

<template>
  <Listbox as="div" v-model="selectedCategory">
    <div class="relative pills-content">
      <ListboxButton class="flex gap-4">
        <div class="flex items-center">
          <div class="flex items-center gap-2">
            <p class="hidden">{{ getFilterID }}</p>
            <span class="block truncate category-name-title">{{ selectedCategory ? selectedCategory.name : 'Категория' }}</span>
            <img :src="getIcon + 'Arrow.png'" />
          </div>
        </div>
      </ListboxButton>

      <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <ListboxOptions
            class="list-position absolute left-0 top-12 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption as="template" v-for="type in categories" :key="type.id" :value="type" v-slot="{ active, selected }">
            <li class="category-list-item" :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3']">
              <div class="flex items-center">
                <span class="category-name" :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ type.name }}</span>
              </div>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
<style scoped>
  .category-name-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .category-list-item {
    border-radius: 30px;
    background: #F1F1F1;
    padding: 8px 16px;
    cursor: pointer;
  }
  .category-list-item:hover {
    background: #FF385C;
  }
  .category-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .category-name:hover {
    color: #ffffff;
  }
  .list-position {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 535px;
    padding: 32px;
  }
  @media (max-width: 900px) {
    .list-position {
      min-width: 340px;
      padding: 20px;
      max-height: 200px;
      overflow: scroll;
    }
  }
</style>