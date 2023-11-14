<script setup lang="ts">
  import { onMounted, reactive, toRaw, ref, Ref, onBeforeUnmount } from 'vue'
  import Header from "~/components/home-page-parts/Header.vue"
  import MobileNavbar from "~/components/home-page-parts/MobileNavbar.vue"
  import SimilarPlaces from '~/components/vendor-page-parts/SimilarPlaces.vue'
  import DownloadApp from "~/components/home-page-parts/DownloadApp.vue"
  import Footer from "~/components/home-page-parts/Footer.vue"
  import SwiperSimilarControls from '~/components/swiper/SwiperSimilarControls.vue'
  import { screen } from "~/mixins/check-screen"
  import { getImage } from "~/mixins/get-icon"
  import { favoriteBusiness } from '~/stores/favorite'
  import { placeData } from '~/stores/place-info'
  import { homePageData } from '~/stores/home-page'
  import { authInfo } from "~/stores/auth"
  import { TBusinessReview, TResults } from '~/types'
  import ReviewModal from '~/components/vendor-page-parts/ReviewModal.vue'
  import ApplyBusinessModal from "~/components/home-page-parts/parts/ApplyBusinessModal.vue"

  const place = placeData()
  const id: Ref<string> = ref('')
  const homeData = homePageData()
  const auth = authInfo()
  const showMore: Ref<boolean> = ref(false)
  const favorite = favoriteBusiness()
  const places: TResults[] = reactive(toRaw(homeData.topPlaces))
  const review: TBusinessReview[] = reactive(toRaw(place.placeInfo))
  const { checkScreen } = screen.setup()
  const { getCountSimilarPlaces } = screen.setup()
  const { getIcon } = getImage.setup()
  const route = useRoute()
  const router = useRouter()

  function getDate(date: string) {
    const originalDate = new Date(date)
    const day = originalDate.getDate().toString().padStart(2, '0')
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0')
    const year = originalDate.getFullYear()

    return `${day}.${month}.${year}`
  }

  const showMoreReview = computed(() => {
    return showMore.value ? place.getAllReviews : place.getAllReviews.slice(0, 4)
  })

  onMounted(async () => {
    place.placeInfo.length = 0
    id.value = Array.isArray(route.params.id) ? route.params.id.join(',') : route.params.id
    await homeData.getBusinessInfo(id.value)
    await homeData.getBusiness()
    await place.getReview(id.value)
  })

  onBeforeUnmount(() => {
    place.placeInfo.length = 0
  })
</script>

<template>
  <Header v-if="checkScreen"/>
  <div class="place-wrapper">
    <div class="header-info">
      <div class="flex items-center gap-4">
        <img @click="router.push({ path: '/' })" :src="getIcon + 'back.png'" />
        <p class="business-name">{{ homeData.businessInfo.name }}</p>
        <div class="flex items-center gap-2">
          <img :src="getIcon + 'star-icon.png'" />
          <p class="business-rate">{{ homeData.businessInfo.rate }}</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4">
          <img :src="getIcon + 'share-icon.png'" />
          <p v-if="checkScreen">Поделиться</p>
        </div>
        <div class="flex items-center gap-4">
          <img v-if="!favorite.getSelectedFavorite.includes(homeData.businessInfo._id)" @click="favorite.makeFavorite(homeData.businessInfo._id)" :src="getIcon + 'icon-save.png'" class="like-img" />
          <img v-if="favorite.getSelectedFavorite.includes(homeData.businessInfo._id)" @click="favorite.deleteFavorite(homeData.businessInfo._id)" :src="getIcon + 'favorite-icon.png'" class="like-img" />
          <p @click="favorite.makeFavorite( homeData.businessInfo._id)" v-if="checkScreen">Сохранить</p>
        </div>
      </div>
    </div>
    <div class="place-content-image">
      <div v-if="!checkScreen">
        <Swiper
            :height="300"
            :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
            :slides-per-view="1"
            :pagination="{ clickable: true }"
            :loop="true"
        >
          <SwiperSlide
              v-for="(image, index) in homeData.businessInfo?.images"
              :key="index"
          >
            <img :src="image.image.file" class="mobile-image" />
          </SwiperSlide>
        </Swiper>
      </div>
<!--      <div v-if="checkScreen" class="flex-[0_1_45%]">-->
<!--        <img :src="getIcon + 'blog-img.png'" class="rounded-3xl main-img" />-->
<!--      </div>-->
<!--      <div v-if="checkScreen" class="flex flex-wrap gap-8 flex-[0_1_50%] img-tile">-->
<!--        <img :src="getIcon + 'blog-img.png'" class="rounded-3xl flex-[0_1_20%]" />-->
<!--        <img :src="getIcon + 'blog-img.png'" class="rounded-3xl flex-[0_1_20%]" />-->
<!--        <img :src="getIcon + 'blog-img.png'" class="rounded-3xl flex-[0_1_20%]" />-->
<!--        <img :src="getIcon + 'blog-img.png'" class="rounded-3xl flex-[0_1_20%]" />-->
<!--      </div>-->
      <div v-if="checkScreen">
        <Swiper
            :height="600"
            :modules="[SwiperAutoplay, SwiperEffectCreative, SwiperPagination]"
            :slides-per-view="1"
            :pagination="{ clickable: true }"
            :loop="true"
        >
          <SwiperSlide
              v-for="(image, index) in homeData.businessInfo?.images"
              :key="index"
          >
            <img :src="image.image.file" class="desktop-image" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    <div class="place-content">
      <div class="flex gap-8 flex-wrap-reverse justify-between">
        <div class="flex flex-col gap-4" :class="{ 'flex-[0_1_59%]': checkScreen, 'flex-[0_1_100%]': !checkScreen }">
          <div class="block-content">
            <p class="description-title">Описание</p>
            <p class="description">
              {{ homeData.businessInfo.description }}
            </p>
          </div>
          <div class="block-content">
            <div class="flex justify-between">
              <p class="description-title">Отзывы({{ place.getAllReviews.length }})</p>
              <div @click="place.showReviewModal()" class="add-review">
                <p>+ Оставить отзыв</p>
              </div>
            </div>
            <div class="flex flex-col gap-8">
              <div v-for="(userInfo, index) in showMoreReview" :key="index" class="flex gap-8">
                <img v-if="!userInfo.user.profile_image?.file" :src="getIcon + 'default-avatar.png'" class="user-imgs" />
                <img v-if="userInfo.user.profile_image?.file" :src="userInfo.user.profile_image.file" class="user-imgs" />
                <div class="flex flex-col gap-2 flex-[0_1_100%]">
                  <div class="flex gap-4">
                    <p class="user-name">{{ userInfo.user.full_name }}</p>
                    <p class="review-date">{{ getDate(userInfo.created_at) }}</p>
                  </div>
                  <div class="flex">
                    <img v-for="index in 5" :key="index"
                         :src="index <= userInfo.assigned_rating ? getIcon + 'star.png' : getIcon + 'none-star.png'"
                         class="place-icon"
                    />
                  </div>
                  <p class="review-text">{{ userInfo.text }}</p>
                  <hr style="margin-top: 16px;" />
                </div>
              </div>
              <div class="flex justify-center">
                <p @click="showMore = !showMore" class="see-more" v-if="place.getAllReviews.length > 4 && !showMore">Показать еще</p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-8" :class="{ 'flex-col-reverse': !checkScreen }">
          <div class="block-content">
            <div class="flex flex-col justify-start gap-2">
              <p class="lable-name">Цена:</p>
              <p>От: {{ homeData.businessInfo.price }} UZS</p>
            </div>
            <div class="flex" :class="{ 'gap-8': checkScreen, 'gap-5': !checkScreen }">
              <button v-if="!auth.isAuthenticated" class="business-btn" @click="homeData.showApplyBusiness = !homeData.showApplyBusiness">Это Ваш бизнес?</button>
              <button class="checkout-btn">Добавить к задачу</button>
            </div>
          </div>
          <div class="block-content">
            <div class="flex flex-col gap-2">
              <p class="lable-name">Номер телефона</p>
              <div class="flex justify-between">
                <p v-if="homeData.businessInfo.phone_number1" class="business-btn">{{ homeData.businessInfo.phone_number1 }}</p>
                <p v-if="homeData.businessInfo.phone_number2" class="business-btn">{{ homeData.businessInfo.phone_number2 }}</p>
              </div>
            </div>
            <div class="flex flex-col justify-start gap-2">
              <p class="lable-name">Социальные сети</p>
              <div class="flex gap-3">
                <a v-if="homeData.businessInfo.telegram" :href="homeData.businessInfo.telegram">
                  <img :src="getIcon + 'telegram.png'" />
                </a>
                <a v-if="homeData.businessInfo.facebook" :href="homeData.businessInfo.facebook">
                  <img :src="getIcon + 'facebook.png'" />
                </a>
                <a v-if="homeData.businessInfo.instagram" :href="homeData.businessInfo.instagram">
                  <img :src="getIcon + 'instagram.png'" />
                </a>
              </div>
            </div>
          </div>
          <div class="location">
            <p class="location-place">Местоположение</p>
            <div class="flex justify-between gap-8 address-wrapper">
              <p>{{ homeData.businessInfo.address }}</p>
              <div class="input-google"></div>
            </div>
          </div>
          <div v-if="auth.isAuthenticated" class="my-business">
            <div class="left-content">
              <p class="title-content">Это Ваш бизнес?</p>
              <p class="contact-us" @click="homeData.showApplyBusiness = !homeData.showApplyBusiness">Связаться с нами</p>
            </div>
            <p class="description-content">Вы являетесь владелцем этого бизнеса? Связитесь с нами</p>
          </div>
        </div>
      </div>
    </div>
    <div class="category-swiper">
      <Swiper
          :height="300"
          :modules="[SwiperAutoplay, SwiperEffectCreative]"
          :slides-per-view="getCountSimilarPlaces"
          :loop="true"
          :spaceBetween="0"
      >
        <div class="flex justify-between">
          <p class="description-title">Похожие объявления</p>
          <SwiperSimilarControls />
        </div>
        <SwiperSlide
            v-for="(currentPlace, index) in places"
            :key="index"
        >
          <SimilarPlaces :place="currentPlace" />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
  <DownloadApp />
  <Footer />
  <MobileNavbar v-if="!checkScreen" />
  <ReviewModal :id="id" />
  <ApplyBusinessModal />
</template>

<style>
  .swiper {
    display: flex;
    flex-direction: column-reverse;
    gap: 44px;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4rem;
    font-weight: bold;
  }
  .swiper-wrapper {
    min-width: 100vh;
    width: 100vh;
  }
  .swiper-cards {
    width: 240px;
    height: 240px;
  }
  .swiper-cards .swiper-slide {
    border-radius: 6px;
    border: 1px solid black;
  }
  .swiper-pagination-bullet-active {
    background: #ffffff;
  }
  @media (max-width: 900px) {
    .swiper-wrapper {
      min-height: 150px;
    }
  }
</style>

<style scoped>
  .see-more {
    padding: 16px 32px;
    border-radius: 12px;
    border: 1px solid #FF385C;
    color: #FF385C;
    font-family: Geologica;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    text-align: center;
  }
  .like-img {
    cursor: pointer;
  }
  .desktop-image {
    object-fit: cover;
    min-width: 100%;
    max-height: 690px;
    border-radius: 20px;
  }
  .mobile-image {
    max-width: 390px;
    max-height: 390px;
    object-fit: cover;
  }
  .address-wrapper {
    max-width: 470px;
  }
  .address-wrapper p {
    max-width: 200px;
  }
  .left-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .contact-us {
    color: #FF385C;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration-line: underline;
    cursor: pointer;
  }
  .description-content {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    max-width: 70%;
  }
  .title-content {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .my-business {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
    gap: 32px;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0 4px 64px 0 rgba(0, 0, 0, 0.04);
  }
  .location-place {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 32px;
  }
  .input-google {
    width: 225px;
    height: 138px;
    border-radius: 20px;
  }
  .location {
    padding: 32px;
    gap: 32px;
    border-radius: 16px;
    background: #FFF;
    box-shadow: 0px 4px 64px 0px rgba(0, 0, 0, 0.04);
  }
  .business-rate {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .business-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .add-review {
    display: flex;
    padding: 16px 32px 16px 24px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 12px;
    background: #F9F9F9;
    cursor: pointer;
  }
  .add-review p {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .category-swiper {
    margin-top: 70px;
  }
  .checkout-btn {
    max-width: 226px;
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
  .business-btn {
    max-width: 226px;
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
  .lable-name {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .place-wrapper {
    background: #F9F9F9;
    padding: 45px 240px;
  }
  .header-info {
    display: flex;
    justify-content: space-between;
  }
  .place-content-image {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin: 48px 0;
  }
  .img-tile img {
    min-width: 330px;
    min-height: 330px;
    object-fit: cover;
  }
  .main-img {
    min-width: 693px;
    min-height: 689px;
    object-fit: cover;
  }
  .description-title {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
  }
  .description {
    max-width: 774px;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
  }
  .block-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
    border-radius: 16px;
    background: #FFF;
  }
  .user-imgs {
    display: flex;
    justify-content: center;
    max-width: 90px;
    max-height: 90px;
    border-radius: 50%;
    object-fit: cover;
  }
  .user-name {
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 150%;
  }
  .review-date {
    color: rgba(73, 81, 111, 0.50);
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  .review-text {
    max-width: 686px;
    color: #49516F;
    font-family: 'Geologica';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  @media (max-width: 900px) {
    .main-img {
      min-width: 390px;
      min-height: 389px;
    }
    .img-tile img {
      min-width: 390px;
      min-height: 389px;
    }
    .place-wrapper {
      padding: 0;
    }
    .business-btn {
      max-width: 165px;
      padding: 16px;
    }
    .checkout-btn {
      min-width: 165px;
    }
    .block-content {
      padding: 20px;
    }
    .header-info {
      padding: 20px;
    }
    .place-content-image {
      display: block;
      margin: 0 0 24px 0;
    }
  }
</style>