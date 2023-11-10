<script setup lang="ts">
  import { onMounted, toRaw, onBeforeUnmount, reactive, watch, Ref, ref } from 'vue'
  import Header from '~/components/home-page-parts/Header.vue'
  import ExitModal from '~/components/profile/ExitModal.vue'
  import Breadcrumbs from '~/components/vendor-page-parts/Breadcrumbs.vue'
  import { getImage } from '~/mixins/get-icon'
  import { screen } from '~/mixins/check-screen'
  import { getPath } from '~/mixins/current-url'
  import { profileData } from '~/stores/profile'
  import { businessInfo } from '~/stores/business'
  import { homePageData } from '~/stores/home-page'
  import { authInfo } from "~/stores/auth"
  import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/vue"
  import {ChevronUpDownIcon} from "@heroicons/vue/20/solid"
  import UserBusiness from '~/components/business-page/UserBusiness.vue'

  const { getIcon } = getImage.setup()
  const localePath = useLocalePath()
  const { checkScreen } = screen.setup()
  const { isBusinessActive, isSettingsActive } = getPath.setup()
  const profile = profileData()
  const business = businessInfo()
  const home = homePageData()
  const auth = authInfo()
  const router = useRouter()
  const categories = toRaw(home.categories)
  const region = toRaw(business.region)
  const userBusiness = toRaw(business.userBusiness)
  const readyBusiness = reactive(toRaw(business.readyBusiness))
  const waitBusiness = reactive(toRaw(business.waitBusiness))

  function handleAddBusinessClick() {
    const input = document.querySelector('.upload-image') as HTMLInputElement
    if (input) {
      input.click()
    }
  }

  function getMainImage (imgId: number) {
    return business.imgIdIsMain.some(id => id === imgId)
  }

  function hideBusiness() {
    router.push({ path: '/profile/settings' })
    profile.showMobileSettings = false
  }

  onMounted (async() => {
    auth.setToken(null)
    if (!auth.isAuthenticated) router.push({ path: '/' })
    await home.getCategories()
    await business.getRegion()
    await business.getUserBusiness()
  })

  onBeforeUnmount(() => {
    business.businessAvatar = []
    business.showAddBusiness = false
    business.businessName = ''
  })
</script>

<template>
  <Header />
  <div class="profile-settings">
    <div class="user-left-side" v-if="checkScreen">
      <div class="flex flex-col items-center">
        <img v-if="profile.profileInfo.profile_image" :src="profile.profileInfo.profile_image.file" class="user-img" />
        <img v-if="!profile.profileInfo.profile_image" :src="getIcon + 'default-avatar.png'" class="user-img" />
        <p class="user-name">{{ profile.profileInfo.full_name }}</p>
      </div>
      <hr style="width: 100%"/>
      <div class="options">
        <img v-if="!isBusinessActive" :src="getIcon + 'business-icon.png'" />
        <img v-if="isBusinessActive" :src="getIcon + 'selected-business.png'" />
        <NuxtLink :to="localePath('/profile/business-settings')">
          <p :style="{ 'color': isBusinessActive ? '#FF385C' : '' }">{{ $t('profile_user.business') }}</p>
        </NuxtLink>
      </div>
      <div class="options">
        <img v-if="!isSettingsActive" :src="getIcon + 'setting.png'" />
        <img v-if="isSettingsActive" :src="getIcon + 'selected-settings.png'" />
        <NuxtLink :to="localePath('/profile/settings')">
          <p :style="{ 'color': isSettingsActive ? '#FF385C' : '' }">{{ $t('profile_user.settings_menu') }}</p>
        </NuxtLink>
      </div>
      <div class="options">
        <img :src="getIcon + 'sign-out-icon.png'" />
        <p @click="profile.openExitModal = !profile.openExitModal">{{ $t('profile_user.exit_menu') }}</p>
      </div>
    </div>
    <div v-if="!checkScreen" class="flex justify-around w-full">
      <div class="flex gap-4 items-center">
        <img @click="hideBusiness" :src="getIcon + 'back.png'" />
        <p>Бизнесс</p>
      </div>
      <p v-if="!business.showAddBusiness" class="add-business-btn" @click="business.addBusiness">+ {{ $t('profile_user.add_business') }}</p>
    </div>
    <div v-if="business.isLoading" class="flex flex-col gap-8" :class="{ 'flex-[0_0_60%]': checkScreen, 'flex-[0_0_100%]': !checkScreen }">
      <div class="flex justify-between items-center">
        <div v-if="checkScreen">
          <p class="setting-title">{{ !userBusiness.length ? 'Создание бизнеса' : 'Бизнес' }}</p>
          <Breadcrumbs :currentCategory.sync="profile.currentCategory" />
        </div>
        <p v-if="!business.showAddBusiness && checkScreen" class="add-business-btn" @click="business.addBusiness">+ {{ $t('profile_user.add_business') }}</p>
      </div>
      <div v-if="!userBusiness.length || business.showAddBusiness" class="flex flex-col gap-8 flex-[0_1_60%] pb-32">
        <div class="flex items-center gap-8" :class="{ 'mobile-scroll': !checkScreen }">
          <div v-if="!business.editEventMode" class="flex gap-8">
            <div v-if="business.avatarSrc" class="business-images relative" v-for="(image, index) in business.avatarSrc.slice(0, 5)" :key="index" >
              <img :src="image.image?.file" />
              <img
                  @click="business.selectedMainImage(image.image.id)"
                  :src="getIcon + (getMainImage(image.image.id) ? 'main-image.png' : 'main-icon.png')"
                  class="main-image"
              />
            </div>
          </div>
          <div v-if="business.editEventMode" class="flex gap-8">
            <div v-if="business.businessAvatarSrc" class="business-images relative" v-for="(images, index) in business.businessAvatarSrc.slice(0, 5)" :key="index" >
              <img :src="images.image?.file" />
              <img
                  @click="business.selectedMainImage(images.id)"
                  :src="getIcon + (getMainImage(images.id) || images.is_main ? 'main-image.png' : 'main-icon.png')"
                  class="main-image"
              />
            </div>
          </div>
          <div class="add-business relative" @click="handleAddBusinessClick">
            <img :src="getIcon + 'add-business.png'" />
            <p class="upload-file">{{ $t('business.add_image') }}</p>
            <p class="upload-info">{{ $t('business.size_image') }}</p>
            <p class="upload-info">{{ $t('business.size_video') }}</p>
            <input v-if="!business.editEventMode" type="file" hidden @change="business.addBusinessImages" class="upload-image" />
            <input v-if="business.editEventMode" type="file" hidden @change="business.businessImages" class="upload-image" />
          </div>
        </div>
        <div class="flex gap-8" :class="{ 'flex-wrap': !checkScreen }">
          <div class="business-info">
            <div class="flex flex-col gap-2 w-full">
              <p class="business-info-title">{{ $t('business.business_info') }}</p>
              <hr/>
            </div>
            <div class="business-form">
              <div class="flex flex-col gap-2">
                <p class="field-name">{{ $t('business.business_name') }}</p>
                <input class="form-field" v-model="business.businessName" placeholder="Название бизнеса" />
                <p class="error-text" v-if="business.businessNameError">{{ $t('business.required_field') }}</p>
              </div>
              <div class="flex flex-col gap-2">
                <p class="field-name">{{ $t('business.type') }}</p>
                <Listbox as="div" v-model="business.selectedCategory">
                  <div class="relative pills-content">
                    <ListboxButton class="flex gap-4">
                      <div class="flex items-center">
                        <span class="block truncate">{{ business.selectedCategory.name || 'Название бизнеса' }}</span>
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
                        <ListboxOption as="template" v-for="(type, index) in categories" :key="index" :value="type" v-slot="{ active, selected }">
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
                <p class="error-text" v-if="business.selectedCategoryError">{{ $t('business.required_field') }}</p>
              </div>
              <div v-if="business.selectedCategory.name === 'Ресторан'" class="flex flex-col gap-2">
                <p class="field-name">Количество человек*</p>
                <div class="flex gap-8">
                  <input class="form-field" type="number" v-model="business.minValue" placeholder="От" />
                  <input class="form-field" type="number" v-model="business.maxValue" placeholder="До" />
                </div>
              </div>
              <div v-if="business.selectedCategory.name === 'Ресторан'" class="flex flex-col gap-2">
                <p class="field-name">Цена на человека*</p>
                <input class="form-field" type="number" v-model="business.price"/>
              </div>
              <div class="flex flex-col gap-2">
                <p class="field-name">{{ $t('business.description') }}</p>
                <input class="form-field" v-model="business.description" placeholder="Категория бизнеса" />
              </div>
            </div>
            <div class="number-fields">
              <div class="flex flex-col gap-2">
                <p class="field-name">{{ $t('business.phone_number') }}</p>
                <div class="flex gap-8 items-center">
                  <input class="form-field" type="text" v-model="business.phoneNumber1" placeholder="+998" v-maska data-maska="+998 ###-###-###" />
                  <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <div v-if="profile.addNumber" class="flex flex-col gap-2">
                <div class="flex gap-8 items-center">
                  <input class="form-field" type="text" v-model="business.phoneNumber2" placeholder="+998" v-maska data-maska="+998 ###-###-###" />
                  <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
              <div v-if="!profile.addNumber" class="flex justify-start">
                <button class="add-phone" @click="profile.addNumber = !profile.addNumber">+ {{ $t('business.add_number') }}</button>
              </div>
            </div>
          </div>
          <div class="contact-info">
            <div class="flex flex-col gap-2">
              <p class="business-info-title">{{ $t('business.contact_info') }}</p>
              <hr />
            </div>
            <div class="flex flex-col gap-2">
              <p class="field-name">{{ $t('business.region') }}</p>
              <Listbox as="div" v-model="business.selectedRegion">
                <div class="relative pills-content">
                  <ListboxButton class="flex gap-4">
                    <div class="flex items-center">
                      <span class="block truncate">{{ business.selectedRegion.name || 'Выберете регион' }}</span>
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
                      <ListboxOption as="template" v-for="(type, index) in region" :key="index" :value="type" v-slot="{ active, selected }">
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
              <p class="error-text" v-if="business.selectedRegionError">{{ $t('business.required_field') }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <p class="field-name">{{ $t('business.city') }}</p>
              <Listbox as="div" v-model="business.selectedCity">
                <div class="relative pills-content">
                  <ListboxButton class="flex gap-4">
                    <div class="flex items-center">
                      <span class="block truncate">{{ business.selectedCity.name || 'Выберете город' }}</span>
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
                      <ListboxOption as="template" v-for="(type, index) in business.selectedRegion.districts" :key="index" :value="type" v-slot="{ active, selected }">
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
              <p class="field-name">{{ $t('business.address') }}</p>
              <input class="form-field" v-model="business.address" placeholder="" />
              <p class="field-name">{{ $t('business.location') }}</p>
              <div class="input-google"></div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <p class="business-info-title">{{ $t('business.social_media') }}</p>
                <label class="switch">
                  <input v-model="profile.showSocialLinks" type="checkbox">
                  <span class="slider round"></span>
                </label>
              </div>
              <hr />
              <div v-if="profile.showSocialLinks">
                <div class="flex flex-col gap-2">
                  <p class="field-name">Instagram</p>
                  <input class="form-field" v-model="business.instagram" placeholder="https://www.instagram.com/" />
                </div>
                <div class="flex flex-col gap-2">
                  <p class="field-name">Telegram</p>
                  <input class="form-field" v-model="business.telegram" placeholder="https://www.telegram.com/" />
                </div>
                <div class="flex flex-col gap-2">
                  <p class="field-name">Facebook</p>
                  <input class="form-field" v-model="business.facebook" placeholder="https://www.facebook.com/" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!business.editEventMode" class="btn-container justify-end" :class="{ 'justify-evenly': !checkScreen }">
          <button class="cancel-btn" @click="business.addBusiness">{{ $t('business.cancel') }}</button>
          <button class="create-btn" @click="business.addNewBusiness()">{{ $t('business.create') }}</button>
        </div>
        <div v-if="business.editEventMode" class="btn-container justify-between">
          <div class="flex gap-3">
            <img :src="getIcon + 'delete-icon.png'" />
            <p>Удалить</p>
          </div>
          <button class="create-btn" @click="business.changeBusiness()">{{ $t('business.save') }}</button>
        </div>
      </div>
      <div v-if="userBusiness.length && !business.showAddBusiness">
        <div class="flex" :class="{ 'justify-center': !checkScreen }">
          <div @click="business.toggleTabsApproved" :class="{ 'tabs': business.approvedBusiness, 'selected-business': !business.approvedBusiness }">
            <p>{{ $t('business.in_site') }} ({{ readyBusiness.length }})</p>
          </div>
          <div @click="business.toggleTabsWaiting" :class="{ 'tabs': business.waitingBusiness, 'selected-business': !business.waitingBusiness }">
            <p>{{ $t('business.waiting') }} ({{ waitBusiness.length }})</p>
          </div>
        </div>
        <div v-if="business.approvedBusiness" class="business-contaner" :class="{ 'empty-container': !readyBusiness.length }">
          <div v-if="readyBusiness.length" class="flex flex-wrap gap-8">
            <UserBusiness v-for="(place, index) in readyBusiness" :key="index" :place="place" />
          </div>
          <div v-if="!readyBusiness.length" class="flex flex-col items-center gap-8">
            <img :src="getIcon + 'empty-field.png'" />
            <div class="flex flex-col items-center gap-3">
              <p class="empty-title">{{ $t('business.is_empty') }}</p>
              <p class="empty-text">{{ $t('business.empty_container') }}</p>
            </div>
          </div>
        </div>
        <div v-if="business.waitingBusiness" class="business-contaner" :class="{ 'empty-container': !waitBusiness.length  }">
          <div v-if="waitBusiness.length" class="flex flex-wrap gap-8">
            <UserBusiness v-for="(place, index) in waitBusiness" :key="index" :place="place" />
          </div>
          <div v-if="!waitBusiness" class="business-contaner" :class="{ 'empty-container': waitBusiness.length }">
            <div class="flex flex-col items-center gap-8">
              <img :src="getIcon + 'empty-field.png'" />
              <div class="flex flex-col items-center gap-3">
                <p class="empty-title">{{ $t('business.is_empty') }}</p>
                <p class="empty-text">{{ $t('business.empty_container') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ExitModal />
</template>

<style scoped>
  .input-google {
    min-width: 483px;
    min-height: 153px;
    border-radius: 25px;
  }
  .error-text {
    font-size: 12px;
    color: #ff385c;
    font-weight: 800;
  }
  .mobile-scroll {
    overflow-y: scroll;
    max-width: 380px;
    padding: 0 10px;
  }
  .empty-title {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    text-transform: uppercase;
  }
  .empty-text {
    color: rgba(73, 81, 111, 0.50);
    text-align: center;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .empty-container {
    justify-content: center;
    align-items: center;
  }
  .main-image {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .add-business-btn {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
    cursor: pointer;
  }
  .selected-business p {
    color: rgba(73, 81, 111, 0.70);
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
  }
  .selected-business {
    border-radius: 14px 14px 0px 0px;
    cursor: pointer;
    padding: 8px 32px;
  }
  .tabs {
    display: flex;
    padding: 8px 32px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 14px 14px 0 0;
    background: #FFF;
    cursor: pointer;
  }
  .tabs p {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
  }
  .business-contaner {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    padding: 64px 32px;
    border-radius: 0 24px 24px 24px;
    background: #FFF;
    min-width: 900px;
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
  .upload-image {
    position: absolute;
    min-width: 150px;
    min-height: 160px;
    cursor: pointer;
  }
  .business-images {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .business-images img {
    max-width: 165px;
    max-height: 165px;
    border-radius: 16px;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
  }
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  input:checked + .slider {
    background-color: #FF385C;
  }
  input:focus + .slider {
    box-shadow: 0 0 1px #FF385C;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(12px);
    -ms-transform: translateX(12px);
    transform: translateX(12px);
  }
  .slider.round {
    border-radius: 34px;
  }
  .slider.round:before {
    border-radius: 50%;
  }
  .number-fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  .add-phone {
    padding: 8px 32px 8px 24px;
    border-radius: 12px;
    background: #F9F9F9;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 136%;
  }
  .btn-container {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .cancel-btn {
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
  .create-btn {
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
  .upload-file {
    color: #49516F;
    text-align: center;
    font-family: 'Geologica';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .upload-info {
    color: rgba(73, 81, 111, 0.50);
    text-align: center;
    font-family: 'Geologica';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .add-business {
    display: flex;
    flex-direction: column;
    min-width: 160px;
    max-height: 160px;
    padding: 37px 14px 37px 13px;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    background: #FFF;
    cursor: pointer;
  }
  .contact-info {
    display: flex;
    padding: 32px;
    flex-direction: column;
    gap: 32px;
    border-radius: 16px;
    background: #FFF;
    flex: 0 1 50%;
  }
  .business-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  .form-field {
    padding: 16px 24px;
    border-radius: 14px;
    background: #F7F7F7;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    width: 100%;
  }
  .field-name {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .business-info-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
  }
  .business-info {
    display: flex;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    border-radius: 16px;
    background: #FFF;
    flex: 0 1 50%;
  }
  .setting-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .user-img {
    display: flex;
    justify-content: center;
    max-width: 90px;
    min-height: 90px;
    border-radius: 50%;
    object-fit: cover;
  }
  .user-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 136%;
    margin-top: 10px;
  }
  .profile-settings {
    display: flex;
    justify-content: center;
    padding-top: 32px;
    gap: 32px;
    background: #F9F9F9;
    min-height: 100vh;
    flex-wrap: wrap;
  }
  .user-left-side {
    display: flex;
    min-width: 258px;
    max-height: 400px;
    padding: 32px 32px 64px 32px;
    flex-direction: column;
    gap: 16px;
    border-radius: 24px;
    background: #FFF;
  }
  .personal-data img {
    min-width: 90px;
    min-height: 90px;
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
    cursor: pointer;
  }
  .options img {
    max-width: 24px;
    max-height: 24px;
  }

  @media (max-width: 600px) {
    .business-contaner {
      min-width: auto;
      background: transparent;
      padding: 20px;
    }
    .tabs {
      background: transparent;
      border-bottom: 2px solid #FF385C;
    }
    .selected-business {
      border-bottom: 2px solid #f9f9f9;
    }
    .tabs p {
      color: #49516F;
    }
    .selected-business p {
      color: rgba(73, 81, 111, 0.70);
    }
    .profile-settings {
      min-height: auto;
    }
    .business-info {
      flex: 0 1 100%;
    }
    .contact-info {
      flex: 0 1 100%;
    }
    .btn-container {
      flex-direction: column-reverse;
      padding: 0 10px;
    }
    .create-btn {
      width: 100%;
    }
    .input-google {
      min-width: max-content;
    }
  }
</style>