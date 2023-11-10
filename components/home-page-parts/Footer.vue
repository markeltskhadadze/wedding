<script setup lang="ts">
  import { homePageData } from '~/stores/home-page'
  import { TCategoties } from '~/types'
  import { getImage } from "~/mixins/get-icon"
  import { screen } from '~/mixins/check-screen'
  import { urlName } from '~/mixins/get-url-name'
  import { profileData } from '~/stores/profile'
  import ApplyBusinessModal from '~/components/home-page-parts/parts/ApplyBusinessModal.vue'
  import CategoryList from "~/components/home-page-parts/parts/CategoryList.vue"
  import {ref, Ref} from "vue"

  const { getURLName } = urlName.setup()
  const { checkScreen } = screen.setup()
  const { getIcon } = getImage.setup()
  const headerVisible: Ref<boolean> = ref(true)
  const homeData = homePageData()
  const localePath = useLocalePath()
  const profile = profileData()
  const categories: TCategoties[] = reactive(toRaw(homeData.categories))

  async function sendCategoryName(id: string) {
    localStorage.setItem('categoryId', id)
    homeData.businessId = id
    await homeData.getSearchBusiness(id)
  }
</script>

<template>
  <div class="footer">
    <div class="mb-14 flex justify-start items-center gap-20">
      <img :src="getIcon + 'logo.png'">
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
    </div>
    <div class="flex justify-between flex-wrap">
      <div class="flex flex-col gap-4" :class="{ 'flex-[0_1_45%]': checkScreen, 'flex-[0_1_100%]': !checkScreen  }">
        <p class="footer-title">{{ $t('footer.why_we') }}</p>
        <p>Lorem ipsum dolor sit amet consectetur. Eu faucibus et facilisis mauris nam ut magna sit.
          Risus in sit aliquam in. Facilisi orci nec faucibus eu. Massa eros urna ullamcorper sit eu
          pellentesque nam mattis. Libero praesent risus viverra aliquam nec. A mi nisl neque blandit
          porttitor platea aliquam accumsan id. Massa orci nibh nam scelerisque a tempor nunc augue.
          Interdum mattis ac sed fringilla pharetra ut platea sagittis. Nunc nisl pulvinar in in semper
          nisi.
        </p>
        <p>Lorem ipsum dolor sit amet consectetur. Eu faucibus et facilisis mauris nam ut magna sit.
        Risus in sit aliquam in. Facilisi orci nec faucibus eu. Massa eros urna ullamcorper sit eu
        pellentesque nam mattis. Libero praesent risus viverra aliquam nec. A mi nisl neque blandit
        porttitor platea aliquam accumsan id. Massa orci nibh nam scelerisque a tempor nunc augue.
        Interdum mattis ac sed fringilla pharetra ut platea sagittis. Nunc nisl pulvinar in in semper
        nisi.
        </p>
      </div>
      <div class="flex flex-col gap-4" :class="{ 'flex-[0_1_45%]': checkScreen, 'flex-[0_1_100%]': !checkScreen  }">
        <p class="footer-title">{{ $t('search.category') }}</p>
        <div class="pils-container">
          <p v-for="(category, index) in categories"
             :key="index"
             class="categories-pils"
             @click="sendCategoryName(category.id)"
          >
            <NuxtLink :to="localePath('/vendor')">{{ category.name }}</NuxtLink>
          </p>
        </div>
        <p class="footer-title">{{ $t('footer.social') }}</p>
        <div class="flex gap-3">
          <a href="#" ><img :src="getIcon + 'telegram.png'" /></a>
          <a href="#" ><img :src="getIcon + 'facebook.png'" /></a>
          <a href="#" ><img :src="getIcon + 'instagram.png'" /></a>
          <a href="#" ><img :src="getIcon + 'twitter.png'" /></a>
          <a href="#" ><img :src="getIcon + 'whatsup.png'" /></a>
          <a href="#" ><img :src="getIcon + 'youtube.png'" /></a>
        </div>
      </div>
    </div>
  </div>
  <ApplyBusinessModal />
</template>

<style scoped>
  .header-menu {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .footer-link {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 243%;
    text-decoration-line: underline;
  }
  .footer {
    background: #F1F1F1;
    padding: 32px 106px;
  }
  .footer-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .pils-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-width: 693px;
  }
  .categories-pils {
    padding: 8px 16px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.50);
  }
  .page-selected {
    border-bottom: 2px solid #FF385C;
  }
  @media (max-width: 900px) {
    .footer {
      padding: 30px 20px 65px 20px;
    }
  }
</style>