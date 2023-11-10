<script setup lang="ts">
  import { homePageData } from '~/stores/home-page'
  import { TCategoties } from '~/types'
  import { getImage } from '~/mixins/get-icon'
  import { ref, Ref } from 'vue'
  import { screen } from '~/mixins/check-screen'
  import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue"
  import {ChevronUpDownIcon} from "@heroicons/vue/20/solid"

  const props = defineProps({
    currentCategory: {
      type: String,
      required: true
    }
  })

  const { checkScreen } = screen.setup()
  const localePath = useLocalePath()
  const homeData = homePageData()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))
  const { getIcon } = getImage.setup()
  let showFilter: Ref<boolean> = ref(true)
  const sortType = [
    {
      id: 1,
      name: 'Самые дешевые'
    },
    {
      id: 2,
      name: 'Самые дорогие'
    },
    {
      id: 3,
      name: 'Самые новые'
    },
    {
      id: 4,
      name: 'Рекомендованное вам'
    }
  ]
  const sortBy: Ref<string> = ref('')

  const emit = defineEmits([
    'sendNewSelectedCategory'
  ])
  async function sendCategoryName(name: string, id: string) {
    homeData.categoryName = name
    homeData.businessId = id
    await homeData.getBusiness()
    emit('sendNewSelectedCategory', homeData.categoryName)
  }
  function toggleFilter() {
    showFilter.value = !showFilter.value
  }
</script>

<template>
  <div class="flex flex-col gap-8 filter-content">
    <p class="filter-title">{{ $t('header.vendor_nav') }}</p>
    <p class="filter-lable">{{ $t('filter.category') }}</p>
    <div class="pils-container">
      <p
          v-for="(category, index) in categories"
          :key="index"
          @click="sendCategoryName(category.name, category.id)"
          class="categories-pils">
        <NuxtLink :to="localePath('/vendor')">{{ category.name }}</NuxtLink>
      </p>
    </div>
    <hr />
    <div class="flex justify-between">
      <p class="filter-title">{{ $t('filter.title') }}</p>
      <transition name="hide-filter">
        <img
            :src="getIcon + 'hide-filter-arrow.png'"
            class="hide-filter"
            @click="toggleFilter"
            :style="{ transform: !showFilter ? 'rotate(180deg)' : 'rotate(0deg)' }"
        />
      </transition>
    </div>
    <transition name="filter-content">
      <div class="flex flex-col gap-8" v-if="showFilter">
      <div class="price-range">
        <p class="filter-lable">{{ $t('filter.price') }}</p>
        <div class="flex gap-8" :class="{ 'gap-5': !checkScreen }">
          <input class="form-control" type="number" v-model="homeData.price" :placeholder="$t('filter.min_price')" />
          <input class="form-control" type="number" :placeholder="$t('filter.max_price')" />
        </div>
      </div>
      <div class="flex gap-8" :class="{ 'gap-5': !checkScreen }">
        <div class="flex flex-col gap-2">
          <p class="filter-lable">{{ $t('filter.people') }}</p>
          <input class="form-control" type="text"/>
        </div>
        <div class="flex flex-col gap-2">
          <p class="filter-lable">{{ $t('filter.rating') }}</p>
          <input class="form-control" type="text"/>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <Listbox as="div" v-model="sortBy">
          <div class="relative pills-content">
            <ListboxButton class="flex gap-4">
              <div class="flex items-center">
                <span class="block truncate">{{ sortBy.name || 'Сортировать по:' }}</span>
              </div>
              <div class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
            </ListboxButton>

            <transition
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
              <ListboxOptions
                  class="absolute left-0 top-12 z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption as="template" v-for="type in sortType" :key="type.id" :value="type" v-slot="{ active, selected }">
                  <li :class="[active ? 'bg-gray-300 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                    <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ type.name }}</span>
                    </div>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
      <div class="flex flex-col gap-2">
        <p class="filter-lable">{{ $t('filter.location_search') }}</p>
        <input class="form-control-sort" type="text"/>
      </div>
      <button class="submit-btn" @click="homeData.filterResultBusiness">{{ $t('filter.update') }}</button>
    </div>
    </transition>
  </div>
</template>

<style scoped>
  .filter-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .filter-lable {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .form-control {
    max-width: 185px;
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .form-control-sort {
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .submit-btn {
    max-width: 402px;
    padding: 16px 32px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    color: #FFF;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-top: 64px;
  }
  .filter-content {
    padding: 32px;
    border-radius: 16px;
    background:  #FFF;
    box-shadow: 0 4px 64px 0 rgba(0, 0, 0, 0.04);
    flex: 0 1 25%;
    margin-right: auto;
  }
  .pils-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 403px;
  }
  .categories-pils {
    padding: 8px 16px;
    border-radius: 30px;
    background: #F1F1F1;
    cursor: pointer;
  }
  .categories-pils:hover {
    background: #FF385C;
    color: #FFF;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .hide-filter {
    max-width: 22px;
    max-height: 22px;
    cursor: pointer;
  }
  .filter-content-enter-active,
  .filter-content-leave-active {
    transition: opacity 0.3s ease-in-out;
  }
  .filter-content-enter, .filter-content-leave-to {
    opacity: 0;
  }
  .pills-content {
    display: flex;
    padding: 16px 16px 16px 24px;
    align-items: flex-start;
    gap: 15px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .pills-content p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .pills-content span {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .pills-content button {
    min-width: 200px;
  }
  @media (max-width: 900px) {
    .form-control-sort {
      max-width: 318px;
    }
    .form-control {
      max-width: 149px;
    }
    .submit-btn {
      max-width: 318px;
    }
    .pils-container {
      min-width: 318px;
    }
    .filter-content {
     padding: 20px 16px;
    }
  }
</style>