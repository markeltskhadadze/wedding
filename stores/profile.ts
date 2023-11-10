import {Ref, ref, reactive, toRaw} from 'vue'
import { defineStore } from 'pinia'
import { getHeader } from '~/mixins/header'
import {TImageId, TReviews, TReviewsResult, TProfile, TUserUpdateData} from '~/types'
import { authInfo } from '~/stores/auth'
import { homePageData } from "~/stores/home-page"

export const profileData = defineStore('profileData', () => {
    const auth = authInfo()
    const home = homePageData()
    const openExitModal: Ref<boolean> = ref(false)
    const showMobileSettings: Ref<boolean> = ref(false)
    const mode: Ref<string> = ref('profile')
    const avatar = ref([])
    const profileAvatarId: Ref<number> = ref(0)
    let reviews = reactive<TReviewsResult[]>([])
    const currentCategory: Ref<string> = ref('Настройки')
    const { headersConfig } = getHeader.setup()
    let profileInfo = ref<TProfile>({
            _id: '',
            name: '',
            user_type: ''
        }
    )
    let businessPhoneNumber: Ref<string> = ref('')
    let showSocialLinks: Ref<boolean> = ref(false)
    let addNumber: Ref<boolean> = ref(false)
    let showSettings: Ref<boolean> = ref(false)
    let showEditMenu: Ref<boolean> = ref(false)

    async function getProfileInfo() {
        try {
            const response = await $fetch<TProfile>( 'https://node-and-mongo-project.herokuapp.com/api/profile', {
                method: 'GET',
                headers: {
                    Authorization: auth.token
                }
            })
            profileInfo.value = {
                _id: response._id,
                name: response.name,
                user_type: response.user_type
            }
        } catch (e) {
            console.log(e)
        }
    }

    async function saveUserData(userInfo: TProfile) {
        try {
            await $fetch( `https://node-and-mongo-project.herokuapp.com/api/update/${userInfo._id}`, {
                method: 'POST',
                headers: {
                    Authorization: auth.token,
                },
                body: userInfo
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function selectFile(e: any) {
        let uploadedFiles = e.target.files

        for( let i = 0; i < uploadedFiles.length; i++ ){
            avatar.value = []
            // @ts-ignore
            avatar.value.push( uploadedFiles[i] )
        }

        if (avatar.value.length) {
            let formData = new FormData()
            formData.append('file', avatar.value[0])
            try {
                const response = await $fetch<TImageId>('https://api.talklif.uz/v1/document/file/', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + auth.token
                    },
                    body: formData
                })
                profileAvatarId.value = response.id
            } catch (e) {
                console.log(e)
            }
        }
    }

    async function getReviews() {
        try {
            const response = await $fetch<TReviews>( 'https://api.talklif.uz/v1/rate/', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            if (!reviews.length) {
                reviews.push(...response.results as TReviewsResult[])
            }
        } catch (e) {
            console.log(e)
        }
    }

    const avatarSrc = computed(() => {
        if (!avatar.value.length) {
            return []
        } else {
            const userAvatar = toRaw(avatar)
            const imagesArray = Array.from(userAvatar.value)
            return imagesArray.map((image) => URL.createObjectURL(image))
        }
    })

    const getUserReviews = computed(() => {
        return reviews
    })

    return {
        openExitModal,
        mode,
        currentCategory,
        profileInfo,
        businessPhoneNumber,
        showSocialLinks,
        addNumber,
        showEditMenu,
        showSettings,
        showMobileSettings,
        reviews,
        saveUserData,
        getProfileInfo,
        selectFile,
        getReviews,
        getUserReviews,
        avatarSrc
    }
})