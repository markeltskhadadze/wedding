<script setup lang="ts">
  import { reactive, toRaw, onMounted, computed } from 'vue'
  import Search from '~/components/home-page-parts/Search.vue'
  import Places from '~/components/event-page-parts/Places.vue'
  import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
  } from '@headlessui/vue'
  import { homePageData } from '~/stores/home-page'
  import {TFavoriteResults, TResults} from '~/types'
  import { favoriteBusiness } from "~/stores/favorite"
  import { eventsInfo } from '~/stores/events'
  import { getImage } from '~/mixins/get-icon'
  import { screen } from '~/mixins/check-screen'

  const { getIcon } = getImage.setup()
  const { checkScreen } = screen.setup()
  const event = eventsInfo()
  const favorites = favoriteBusiness()
  const homeData = homePageData()
  const places: TResults[] = reactive(toRaw(homeData.topPlaces))
  const favoriteBusinessPlace: TFavoriteResults[] = reactive(toRaw(favorites.favoritesPlace))

  const getFilterBySearchValue = computed(() => {
    return places
  })

  onMounted(async() => {
    await homeData.getBusiness()
    await favorites.getFavorites()
  })
</script>

<template>
  <TransitionRoot as="template" :show="event.chooseVendor">
    <Dialog as="div" class="relative z-10" @close="event.chooseVendor = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                :class="{ 'w-7/12': checkScreen }"
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8"
            >
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ready-tasks-modal">
                <div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-8">
                    <div class="flex justify-between">
                      <p class="modal-title">{{ $t('add_events.select_vendors') }}</p>
                      <img @click="event.chooseVendor = !event.chooseVendor" :src="getIcon + 'close-btn.png'" class="close-btn" />
                    </div>
                    <hr />
                    <div class="flex justify-between flex-wrap">
                      <Search />
                      <div class="favorites">
                        <img :src="getIcon + 'icon-save.png'" />
                        <p @click="favorites.showFavorites = !favorites.showFavorites">{{ $t('header.favorites_nav') }}</p>
                      </div>
                    </div>
                    <div v-if="!favorites.showFavorites" class="places">
                      <Places v-for="(place, index) in getFilterBySearchValue" :key="index" :place="place" />
                    </div>
                    <div v-if="favorites.showFavorites" class="places">
                      <Places v-for="(place, index) in favoriteBusinessPlace" :key="index" :place="place" />
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
  .close-btn {
    max-width: 24px;
    max-height: 24px;
    cursor: pointer;
  }
  .places {
    max-height: 500px;
    overflow-y: scroll;
    border-radius: 14px;
    border: 1px solid #F1F1F1;
    background: #F7F7F7;
    padding: 35px;
  }
  .favorites {
    display: flex;
    padding: 16px 24px 16px 20px;
    justify-content: center;
    align-items: center;
    gap: 14px;
    border-radius: 12px;
    background: #F7F7F7;
  }
  .favorites p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    cursor: pointer;
  }
  .ready-tasks-modal {
    display: inline-flex;
    padding: 64px;
    flex-direction: column;
    gap: 32px;
    border-radius: 24px;
    background: #FFF;
    width: 100%;
  }
  .modal-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
  @media (max-width: 900px) {
    .ready-tasks-modal {
      flex-wrap: wrap;
      padding: 32px 16px;
      gap: 24px;
    }
    .places {
      border: 0;
      padding: 0;
      background: transparent;
    }
  }
</style>