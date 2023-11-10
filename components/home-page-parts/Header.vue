<script setup lang="ts">
  import { ref, Ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import RegistrationModal from './parts/RegistrationModal.vue'
  import ExitModal from '~/components/profile/ExitModal.vue'
  import { getImage } from "~/mixins/get-icon"
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { screen } from '~/mixins/check-screen'
  import CategoryList from '~/components/home-page-parts/parts/CategoryList.vue'
  import { urlName } from '~/mixins/get-url-name'
  import { headerData } from '~/stores/header'
  import { profileData } from '~/stores/profile'
  import { authInfo } from '~/stores/auth'
  import { eventsInfo } from "~/stores/events"
  import { homePageData } from "~/stores/home-page"
  import VOtpInput from 'vue3-otp-input'
  import { getCurrentLang } from '~/mixins/languages'
  import LangSwitcher from '~/components/home-page-parts/parts/LangSwitcher.vue'
  import { getToken } from '~/mixins/check-auth'
  import { getPath } from '~/mixins/current-url'
  import InvitationNotification from "~/components/event-page-parts/InvitationNotification.vue";
  import Notification from "~/components/home-page-parts/parts/Notification.vue";

  const { getURLName } = urlName.setup()
  const localePath = useLocalePath()
  const home = homePageData()
  const { checkScreen } = screen.setup()
  const { getLangHeader } = getCurrentLang.setup()
  const { getIcon } = getImage.setup()
  const { isBusinessActive, isSettingsActive, isFavorites, isReviews } = getPath.setup()
  const header = headerData()
  const profile = profileData()
  const auth = authInfo()
  const event = eventsInfo()
  const { checkAuth } = getToken.setup()
  const headerVisible: Ref<boolean> = ref(true)
  const otpInput = ref<InstanceType<typeof VOtpInput> | null>(null)
  const bindModal = ref('')
  const initialMinutes = 2
  const initialSeconds = 0
  const minutes = ref(initialMinutes)
  const seconds = ref(initialSeconds)
  let intervalId: ReturnType<typeof setTimeout> | undefined

  const formattedTime = computed(() => {
    const paddedMinutes = String(minutes.value).padStart(2, '0')
    const paddedSeconds = String(seconds.value).padStart(2, '0')
    return `${paddedMinutes}:${paddedSeconds}`
  })
  const startTimer = () => {
    clearInterval(intervalId)
    intervalId = setInterval(() => {
      if (minutes.value === 0 && seconds.value === 0) {
        clearInterval(intervalId)
        return
      } else if (!header.enterSMSCode || !header.open) {
        clearInterval(intervalId)
        return
      }
      if (seconds.value === 0) {
        minutes.value--
        seconds.value = 59
      } else {
        seconds.value--
      }
    }, 1000)
  }
  async function sendNumberForAuth() {
    startTimer()
    const authPhone = {
      phone_number: header.phoneNumber
    }
    const registrationPhone = {
      phone_number: header.phoneNumber,
      user_type: header.userProfile ? 'customer' : 'vendor'
    }
    header.userProfile || header.companyProfile
        ? await auth.registrationNumber(registrationPhone)
        : await auth.sendNumber(authPhone)
  }

  async function backBtn() {
    console.log('asdasd')
    clearInterval(intervalId)
    minutes.value = initialMinutes
    seconds.value = initialSeconds
    // await header.backToChose
    await header.backToAuth()
  }

  async function checkCode() {
    const smsCodeData = {
      phone_number: header.phoneNumber,
      sms_code: bindModal.value
    }
    header.userProfile || header.companyProfile
        ? await auth.registrationCheckSMS(smsCodeData)
        : await auth.checkSMS(smsCodeData)
  }
  watch(() => header.open, (newOpen) => {
    if (!newOpen) {
      header.phoneNumber = ''
      header.enterSMSCode = false
      header.registration = false
      header.userProfile = false
      header.companyProfile = false
    }
  })

  onMounted(async () => {
    home.showNotification = false
    getLangHeader()
    auth.setToken(null)
    await checkAuth()
    if (auth.isAuthenticated) {
      await event.getInvitation()
      await event.getAllInvitation()
    }
  })

  onBeforeUnmount(() => {
    header.showUserPopUp = false
    home.showNotification = false
  })
</script>

<template>
  <div class="header-container relative">
    <NuxtLink :to="localePath('/')">
      <img :src="getIcon + 'logo.png'" />
    </NuxtLink>
    <div v-if="checkScreen" class="header-menu">
      <NuxtLink :to="localePath('/')">
        <p :class="{ 'page-selected': getURLName === '' }">{{ $t('header.home_nav') }}</p>
      </NuxtLink>
      <CategoryList :headerVisible="headerVisible" />
      <NuxtLink :to="localePath('/blog')">
        <p :class="{ 'page-selected': getURLName === 'Блог' }">{{ $t('header.blog_nav') }}</p>
      </NuxtLink>
      <NuxtLink :to="localePath('/events')" v-if="profile.profileInfo.user_type !== 'vendor'">
        <p :class="{ 'page-selected': getURLName === 'Ивент' }">{{ $t('header.event_nav') }}</p>
      </NuxtLink>
    </div>
    <div class="flex items-center gap-8">
      <LangSwitcher />
      <div
          @click="header.showUserPopUp = !header.showUserPopUp"
          v-if="auth.isAuthenticated && checkScreen" class="auth-user"
      >
        <img v-if="profile.profileInfo.profile_image" :src="profile.profileInfo.profile_image.file" class="user-img" />
        <img v-if="!profile.profileInfo.profile_image" :src="getIcon + 'default-avatar.png'" class="user-img" />
        <p>{{ profile.profileInfo.full_name }}</p>
        <div v-if="header.showUserPopUp" class="user-popup">
          <div class="options" v-if="profile.profileInfo.user_type === 'vendor'">
            <img v-if="!isBusinessActive" :src="getIcon + 'business-icon.png'" />
            <img v-if="isBusinessActive" :src="getIcon + 'selected-business.png'" />
            <NuxtLink :to="localePath('/profile/business-settings')">
              <p :style="{ 'color': isBusinessActive ? '#FF385C' : '' }">Бизнесс</p>
            </NuxtLink>
          </div>
          <div class="options">
            <img v-if="!isSettingsActive" :src="getIcon + 'setting.png'" />
            <img v-if="isSettingsActive" :src="getIcon + 'selected-settings.png'" />
            <NuxtLink :to="localePath('/profile/settings')">
              <p :style="{ 'color': isSettingsActive ? '#FF385C' : '' }">{{ $t('profile_user.settings_menu') }}</p>
            </NuxtLink>
          </div>
          <div class="options" v-if="profile.profileInfo.user_type === 'customer'">
            <img v-if="!isReviews" :src="getIcon + 'reviews-icon.png'" />
            <img v-if="isReviews" :src="getIcon + 'selected-reviews.png'" />
            <NuxtLink :to="localePath('/profile/reviews')">
              <p :style="{ 'color': isReviews ? '#FF385C' : '' }">{{ $t('profile_user.reviews_menu') }}</p>
            </NuxtLink>
          </div>
          <div class="options" v-if="profile.profileInfo.user_type === 'customer'">
            <img v-if="!isFavorites" :src="getIcon + 'save-icon.png'" />
            <img v-if="isFavorites" :src="getIcon + 'favorite-icon.png'" />
            <NuxtLink :to="localePath('/favorites')">
            <p :style="{ 'color': isFavorites ? '#FF385C' : '' }">{{ $t('profile_user.favorites_menu') }}</p>
            </NuxtLink>
          </div>
          <div class="options">
            <img :src="getIcon + 'sign-out-icon.png'" />
            <p @click="profile.openExitModal = !profile.openExitModal">{{ $t('profile_user.exit_menu') }}</p>
          </div>
        </div>
      </div>
      <div v-if="auth.isAuthenticated" class="flex items-center gap-4">
        <NuxtLink :to="localePath('/favorites')">
          <img :src="getIcon + 'favorite-icon.png'" class="header-icon" />
        </NuxtLink>
        <div @click="event.showNotification = !event.showNotification" class="relative">
          <img :src="getIcon + 'notification.png'" class="header-icon" />
          <div v-if="event.myInvitation.length || event.allInvitation.length" class="circle"></div>
        </div>
      </div>
      <button v-if="!auth.isAuthenticated" class="log-in-btn" @click="header.showAuthModal">{{ $t('header.sign_in') }}</button>
      <InvitationNotification v-if="event.showNotification" />
    </div>
  </div>
  <TransitionRoot as="template" :show="header.open">
    <Dialog as="div" class="relative z-10" @close="header.open = false">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg modal-content">
              <div class="bg-white" :class="{ 'flex': checkScreen }">
                <div v-if="checkScreen" class="relative">
                  <img :src="getIcon + 'modal-back.png'" class="auth-image"/>
                  <img :src="getIcon + 'Taklif-logo.png'" class="logo"/>
                </div>
                <div
                    class="flex flex-col gap-16 items-center justify-center flex-[0_1_50%]"
                    v-if="!header.registration"
                    :class="{ 'mobile-auth': !checkScreen }"
                >
                  <div v-if="!header.enterSMSCode" class="flex flex-col gap-16 items-center justify-center flex-[0_1_50%]">
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="auth-title">{{ $t('register_modal.modal_welcome') }}</DialogTitle>
                      <div class="mt-2">
                        <p class="enter-phone-text">{{ $t('register_modal.sms_code_welcome') }}</p>
                      </div>
                    </div>
                    <div class="send-form">
                      <input type="text" v-model="header.phoneNumber" placeholder="+998" v-maska data-maska="+998 ##-###-##-##" />
                    </div>
                    <button @click="sendNumberForAuth" class="submit-btn">{{ $t('register_modal.send_btn_welcome') }}</button>
                    <div v-if="!header.userProfile && !header.companyProfile" class="flex justify-between auth-footer-link">
                      <p class="make-account">{{ $t('register_modal.auth_question') }}</p>
                      <p class="register-account" @click="header.registration = !header.registration">{{ $t('register_modal.registration') }}</p>
                    </div>
                    <div v-if="header.userProfile || header.companyProfile" class="flex justify-between auth-footer-link">
                      <div class="flex gap-1">
                        <img :src="getIcon + 'back.png'" />
                        <p @click="header.backToChose" class="back-to-auth">{{ $t('register_modal.back_modal') }}</p>
                      </div>
                    </div>
                  </div>
                  <div
                      v-if="header.enterSMSCode"
                       class="flex flex-col gap-16 items-center justify-center flex-[0_1_50%]"
                  >
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle as="h3" class="auth-title">{{ $t('register_modal.enter_code_modal') }}</DialogTitle>
                      <div class="mt-2">
                        <p class="enter-phone-text">{{ $t('register_modal.send_code') }} {{ header.phoneNumber }}</p>
                        <p class="timeout">{{ formattedTime }}</p>
                      </div>
                    </div>
                    <div class="enter-code">
                      <v-otp-input
                          ref="otpInput"
                          v-model:value="bindModal"
                          input-classes="otp-input"
                          separator=""
                          :num-inputs="4"
                          :should-auto-focus="true"
                          input-type="letter-numeric"
                          :conditionalClass="['one', 'two', 'three', 'four']"
                          :placeholder="['', '', '', '']"
                      />
                    </div>
                    <button class="submit-btn" @click="checkCode">{{ $t('register_modal.check_number') }}</button>
                    <div v-if="header.userProfile || header.enterSMSCode" class="flex justify-between auth-footer-link">
                      <div class="flex gap-1">
                        <img :src="getIcon + 'back.png'" />
                        <p @click="backBtn" class="back-to-auth">{{ $t('register_modal.back_modal') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <RegistrationModal
                    v-if="header.registration"
                    :companyProfile="header.companyProfile"
                    :userInfo="header.userProfile"
                    @selectedUserProfile="header.selectedUserProfile"
                    @selectedCompanyProfile="header.selectedCompanyProfile"
                    @enterCode="header.enterCode"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <Notification v-if="home.showNotification" />
  <ExitModal />
</template>

<style>
  .otp-input {
    max-width: 54px;
    padding: 16px;
    gap: 10px;
    border-radius: 14px;
    background: #F7F7F7;
    text-align: center;
    margin-right: 10px;
  }
  .otp-input.is-complete {
    background-color: #e4e4e4;
  }
</style>

<style scoped>
  .header-icon {
    min-width: 24px;
    min-height: 24px;
  }
  .circle {
    border: 1px solid #ff385c;
    border-radius: 50%;
    width: 5px;
    height: 5px;
    background: #ff385c;
    position: absolute;
    top: 0;
    right: 0;
  }
  .timeout {
    color: #FF385C;
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .options {
    display: flex;
    width: 144px;
    align-items: flex-start;
    gap: 16px;
  }
  .options p {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .options img {
    max-width: 24px;
    max-height: 24px;
  }
  .user-popup {
    display: inline-flex;
    padding: 32px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border-radius: 14px;
    background: #FFF;
    box-shadow: 0 13px 23px 0 rgba(0, 0, 0, 0.06);
    position: absolute;
    top: 60px;
    right: 20px;
    z-index: 50;
  }
  .auth-user {
    display: flex;
    padding: 8px 20px 8px 8px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 272px;
    background: #F9F9F9;
    cursor: pointer;
    position: relative;
  }
  .auth-user p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .auth-user p:hover {
    color: #FF385C;
  }
  .auth-user img {
    max-width: 40px;
    max-height: 40px;
    border-radius: 40px;
  }
  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 106px;
  }
  .log-in-btn {
    padding: 16px 32px;
    border-radius: 12px;
    background: #FF385C;
    box-shadow: 0 16px 32px 0 rgba(255, 56, 92, 0.24);
    color: #FFF;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
  }
  .header-menu {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .header-menu p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
    cursor: pointer;
  }
  .header-menu p:hover {
    border-bottom: 2px solid #FF385C;
  }
  .auth-title {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
  }
  .enter-phone-text {
    color: rgba(73, 81, 111, 0.50);
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .send-form input {
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
  .submit-btn {
    min-width: 420px;
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
  .make-account {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .register-account {
    color: #FF385C;
    text-align: right;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    text-decoration-line: underline;
    cursor: pointer;
  }
  .auth-image {
    object-fit: cover;
  }
  .modal-content {
    max-width: 70rem;
  }
  .auth-footer-link {
    min-width: 420px;
  }
  .enter-code {
    display: flex;
    gap: 8px;
  }
  .enter-code input {
    max-width: 54px;
    padding: 16px;
    gap: 10px;
    border-radius: 14px;
    background: #F7F7F7;
    text-align: center;
  }
  .back-to-auth {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    cursor: pointer;
  }
  .logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .mobile-auth {
    padding: 48px 24px;
  }
  .page-selected {
    border-bottom: 2px solid #FF385C;
  }
  @media (max-width: 900px) {
    .header-container {
      padding: 20px;
      background: #FFF;
    }
    .send-form input {
      min-width: 320px;
    }
    .submit-btn {
      min-width: 320px;
    }
    .auth-footer-link {
      min-width: 320px;
    }
    .modal-content {
      border-radius: 24px;
    }
  }
</style>