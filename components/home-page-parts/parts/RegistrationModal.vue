<script setup lang="ts">
  import { computed } from 'vue'
  import { DialogTitle, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'
  import { registrationModal } from '~/stores/registration-modal'
  import { homePageData } from "~/stores/home-page"
  import { headerData } from "~/stores/header"
  import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  import 'v-calendar/style.css'
  const router = useRouter()

  const { checkScreen } = screen.setup()
  const { getIcon } = getImage.setup()
  const home = homePageData()
  const header = headerData()
  const registration  = registrationModal()

  const props = defineProps({
    userInfo: {
      type: Boolean,
      required: true
    },
    companyProfile: {
      type: Boolean,
      required: true
    }
  })
  const { userInfo, companyProfile } = props

  const emit = defineEmits([
      'selectedUserProfile',
      'selectedCompanyProfile',
      'enterCode'
  ])

  const getTitle = computed(() => {
    if (!userInfo && !companyProfile) {
      return 'Зарегистрироваться'
    } else if (registration.profileCreated) {
      return 'Профиль создан'
    } else {
      return 'Личные данные'
    }
  })

  const getDescription = computed(() => {
    if (!userInfo && !companyProfile) {
      return 'Выберите пользователя или владельца бизнеса!'
    } else if (registration.profileCreated) {
      return 'Вы можете легко использовать Talklif спасибо за ваш выбор!'
    } else {
      return 'Пожалуйста, заполните данные полностью!'
    }
  })
  const getPlaceholder = computed(() => {
    if (userInfo) {
      return 'Название мероприятия'
    } else if (companyProfile) {
      return 'Введите название бизнес'
    }
  })
  function toggleSelectedUser() {
    registration.selectedUser = true
    registration.selectedCompany = false
  }
  function toggleSelectedCompany() {
    registration.selectedUser = false
    registration.selectedCompany = true
  }
  function chooseProfile() {
    if (registration.selectedUser) emit('selectedUserProfile', registration.selectedUser)
    if (registration.selectedCompany) emit('selectedCompanyProfile', registration.selectedCompany)
  }
  function backToEnterCode() {
    emit('enterCode', registration.enterSMS)
  }

  function goToProfile() {
    registration.profileCreated = false
    header.registration = false
    header.open = false
    router.push({ path: '/profile/settings' })
  }
</script>

<template>
  <div
      class="flex flex-col gap-16 items-center justify-center flex-[0_1_50%]"
      :class="{ 'mobile-auth': !checkScreen }"
  >
    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
      <div v-if="registration.profileCreated" class="flex justify-center">
        <img :src="getIcon + 'profile-created.png'" class="mb-16" />
      </div>
      <DialogTitle as="h3" class="auth-title">{{ getTitle }}</DialogTitle>
      <div class="mt-2">
        <p class="enter-phone-text">{{ getDescription }}</p>
      </div>
    </div>
    <div v-if="!userInfo && !companyProfile" class="choose-user">
      <img v-if="registration.selectedUser" :src="getIcon + 'selected-user.png'" @click="toggleSelectedUser" />
      <img v-if="!registration.selectedUser" :src="getIcon + 'no-selected-user.png'" @click="toggleSelectedUser" />
      <img v-if="registration.selectedCompany" :src="getIcon + 'selected-company.png'" @click="toggleSelectedCompany" />
      <img v-if="!registration.selectedCompany" :src="getIcon + 'no-selected-company.png'" @click="toggleSelectedCompany" />
    </div>
    <button v-if="!userInfo && !companyProfile" class="submit-btn" @click="chooseProfile">{{ $t('register_modal.select_profile') }}</button>
    <div v-if="(userInfo || companyProfile) && !registration.profileCreated" :class="{ 'mobile-form': !checkScreen }">
      <div class="flex flex-col gap-4">
        <input class="user-form" v-model="registration.userName" type="text" placeholder="Имя Фамилия">
        <p class="error-text" v-if="registration.userNameError">{{ $t('register_modal.enter_name') }}</p>
        <div class="relative">
          <input v-if="userInfo" disabled :value="registration.getDate" class="user-form" type="text" />
          <img :src="getIcon + 'calendar-icon.png'"  class="calendar-icon" @click="registration.showCalendar = !registration.showCalendar" />
        </div>
        <div class="calendar-position">
          <VDatePicker
              :disabled-dates="registration.disabledDates"
              v-model="registration.date"
              title-position="left"
              color="red"
              v-if="registration.showCalendar"
          />
        </div>
        <Listbox v-if="companyProfile" as="div" v-model="registration.selectedTask">
          <div class="relative pills-content">
            <ListboxButton class="flex gap-4">
              <div class="flex items-center">
                <span class="block truncate">{{ registration.selectedTask.name || 'Выберите тип бизнеса' }}</span>
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
                <ListboxOption as="template" v-for="type in home.categories" :key="type.id" :value="type" v-slot="{ active, selected }">
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
        <p class="error-text" v-if="registration.selectedTaskError">{{ $t('register_modal.required_field') }}</p>
        <input class="user-form" v-model="registration.eventName" type="text" :placeholder="getPlaceholder">
        <p class="error-text" v-if="registration.eventNameError">{{ $t('register_modal.enter_title') }}</p>
      </div>
      <button v-if="!companyProfile" class="submit-btn my-8" @click="registration.createProfile">{{ $t('register_modal.make_account') }}</button>
      <button v-if="companyProfile" class="submit-btn my-8" @click="registration.createBusiness">{{ $t('register_modal.make_account') }}</button>
      <div class="flex justify-between auth-footer-link">
        <div class="flex gap-1">
          <img :src="getIcon + 'back.png'" />
          <p class="back-to-auth" @click="backToEnterCode">{{ $t('register_modal.back_modal') }}</p>
        </div>
      </div>
    </div>
    <div v-if="registration.profileCreated">
      <button @click="goToProfile" class="submit-btn my-8">{{ $t('register_modal.sing_in_profile') }}</button>
    </div>
  </div>
</template>

<style scoped>
  .calendar-position {
    position: fixed;
    bottom: 5px;
    left: 65%;
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
  .choose-user {
    display: flex;
    gap: 32px;
  }
  .choose-user img {
    cursor: pointer;
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
  .user-form {
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
  .auth-footer-link {
    min-width: 420px;
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
  .mobile-auth {
    padding: 48px 24px;
  }
  .mobile-form {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  .error-text {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .calendar-icon {
    position: absolute;
    right: 10px;
    top: 15px;
    cursor: pointer;
  }
  @media (max-width: 900px) {
    .choose-user img {
      max-width: 138px;
    }
    .submit-btn {
      min-width: 302px;
    }
    .user-form {
      min-width: 302px;
    }
    .auth-footer-link {
      min-width: 302px;
    }
    .calendar-position {
      bottom: 0;
      left: 20%;
    }
  }
</style>