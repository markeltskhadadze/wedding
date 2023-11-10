<script setup lang="ts">
  import { onBeforeUnmount } from 'vue'
  import { getImage } from '~/mixins/get-icon'
  import { profileData } from '~/stores/profile'
  import { placeData } from '~/stores/place-info'
  import { homePageData } from "~/stores/home-page"
  import { authInfo } from "~/stores/auth"
  import { screen } from '~/mixins/check-screen'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

  const { getIcon } = getImage.setup()
  const profile = profileData()
  const place = placeData()
  const home = homePageData()
  const auth = authInfo()
  const { checkScreen } = screen.setup()
  const router = useRouter()

  function goHomePage() {
    home.showWarningModal = true
    router.push({ path: '/' })
  }

  onBeforeUnmount(() => {
    home.showApplyBusiness = false
  })
</script>

<template>
  <TransitionRoot as="template" :show="home.showApplyBusiness">
    <Dialog as="div" class="relative z-10" @close="home.showApplyBusiness = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-opacity-75 transition-opacity" style="background: #adadad" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            :class="{ 'items-end': checkScreen, 'items-center': !checkScreen }"
        >
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative rounded-3xl transform overflow-hidden bg-white text-left shadow-xl transition-all sm:my-8"
            >
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 warning-modal">
                <div v-if="!auth.isAuthenticated">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-8">
                    <div class="flex justify-center">
                      <img :src="getIcon + 'warning-icon.png'" class="warning-image" />
                    </div>
                    <div class="flex flex-col gap-3">
                      <p class="modal-title">Регистрация</p>
                      <p class="warning-text">Чтобы просматривать эту страницу, вы должны быть авторизированы!</p>
                    </div>
                    <div class="flex justify-center items-center gap-8">
                      <button class="exit-bth" @click="goHomePage">Зарегистритуйтесь</button>
                    </div>
                  </div>
                </div>
                <div v-if="auth.isAuthenticated">
                  <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex flex-col gap-8">
                    <div class="flex flex-col gap-3">
                      <p class="modal-title">Это Ваш бизнес?</p>
                      <p class="warning-text">Если это ваш бизнес, введите необходимую информацию и свяжитесь с нами!</p>
                    </div>
                    <div class="flex flex-col gap-4">
                      <input class="event-form" type="text" />
                      <input class="event-form" type="text" placeholder="+998" v-maska data-maska="+998 ##-###-##-##" />
                      <input class="event-form" type="text" :placeholder="$t('add_events.note')" />
                    </div>
                    <div class="flex items-center gap-8 w-full">
                      <button class="exit-bth">Отправить</button>
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
  .event-form {
    min-width: 420px;
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
    color:  #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .warning-image {
    max-width: 140px;
    max-height: 140px;
  }
  .exit-bth {
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
    width: 100%;
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
    max-width: 500px;
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