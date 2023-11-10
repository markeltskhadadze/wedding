<script setup lang="ts">
  import { getImage } from '~/mixins/get-icon'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { placeData } from '~/stores/place-info'
  import Rating from "~/components/profile/Rating.vue";

  const { getIcon } = getImage.setup()
  const place = placeData()
</script>

<template>
  <TransitionRoot as="template" :show="place.openEditModal">
    <Dialog as="div" class="relative z-10" @click.stop="place.openEditModal = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative rounded-3xl transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8"
            >
              <img :src="getIcon + 'close-btn.png'" @click.stop="place.openEditModal = false" class="close-img" />
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 warning-modal">
                <div>
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-8">
                    <div class="flex flex-col gap-3">
                      <p class="modal-title">Редактировать</p>
                    </div>
                    <div class="flex gap-4 flex-[0_1_35%]">
                      <img :src="getIcon + 'place-img.png'" class="review-img" />
                      <div class="flex flex-col gap-2 justify-center">
                        <div class="flex justify-between">
                          <p class="place-name">{{ place.review.business.name }}</p>
                          <div class="flex gap-1">
                            <img :src="getIcon + 'star.png'" class="place-icon" />
                            <p class="rating-value">{{ place.review.assigned_rating }}</p>
                          </div>
                        </div>
                        <div class="flex gap-2 items-center">
                          <img :src="getIcon + 'location.png'" class="place-icon" />
                          <p class="location">г. Ташкента Чиланзарский р. </p>
                        </div>
                      </div>
                    </div>
                    <Rating />
                    <div>
                      <textarea class="review-text" v-model="place.review.text"></textarea>
                    </div>
                    <div class="flex justify-center items-center gap-8">
                      <button class="exit-bth" @click="place.editReview(place.review)">Сохранить</button>
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
  .place-icon {
    width: 16px;
    height: 16px;
  }
  .rating-value {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .location {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    max-width: 80%;
  }
  .place-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .review-img {
    max-width: 80px;
    max-height: 80px;
    border-radius: 16px;
  }
  .review-text {
    min-width: 100%;
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
  }
  .close-img {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
  }
  .exit-bth {
    width: 100%;
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
  }
  .no-exit {
    max-width: 161px;
    padding: 16px 32px;
    border-radius: 12px;
    background: #F9F9F9;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .warning-modal {
    display: inline-flex;
    padding: 64px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;
    border-radius: 24px;
    background: #FFF;
  }
  .modal-title {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
  }
  .warning-text {
    color: rgba(73, 81, 111, 0.50);
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
</style>