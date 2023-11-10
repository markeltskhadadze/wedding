import { defineStore } from 'pinia'
import { ref, Ref, reactive, toRaw } from 'vue'
import { authInfo } from '~/stores/auth'
import { profileData } from '~/stores/profile'
import { homePageData } from "~/stores/home-page"
import {TResponseBusinessReview, TBusinessReview, TReviewsResult, TEditReviewResponse, TEditReview} from '~/types'

export const placeData = defineStore('placeData', () => {
    const showModal: Ref<boolean> = ref(false)
    const home = homePageData()
    const profile = profileData()
    const comment: Ref<string> = ref('')
    const newRating: Ref<number> = ref(0)
    const openDeleModal: Ref<boolean> = ref(false)
    const openEditModal: Ref<boolean> = ref(false)
    let review = ref<TReviewsResult>({
        assigned_rating: 0,
        created_at: '',
        text: '',
        user: 0,
        id: 0,
        business: {
            id: 0,
            rate: 0,
            name: '',
            min_value: 0,
            max_value: 0,
            price: 0,
            district: ''
        }
    })
    const reviewId: Ref<number> = ref(0)
    const auth = authInfo()
    let placeInfo = reactive<TBusinessReview[]>([])

    function showReviewModal() {
        showModal.value = !showModal.value
    }

    function showDeleteModal(id: number) {
        reviewId.value = id
        openDeleModal.value = !openDeleModal.value
    }

     function showEditModal(currentReview: TReviewsResult) {
        review.value = {
            assigned_rating: currentReview.assigned_rating,
            created_at: currentReview.created_at,
            text: currentReview.text,
            user: currentReview.user,
            id: currentReview.id,
            business: {
                id: currentReview.business.id,
                rate: currentReview.business.rate,
                name: currentReview.business.name,
                min_value: currentReview.business.min_value,
                max_value: currentReview.business.max_value,
                price: currentReview.business.price,
                district: currentReview.business.district
            }
        }
        openEditModal.value = !openEditModal.value
     }

    async function sendReview(id: string) {
        try {
            const response = await $fetch<TBusinessReview>( 'https://api.talklif.uz/v1/rate/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
                body: {
                    business: id,
                    assigned_rating: newRating.value,
                    text: comment.value
                }
            })
            comment.value = ''
            const newReview = {
                id: response.id,
                assigned_rating: response.assigned_rating,
                user: {
                    full_name: response.user.full_name
                },
                text: response.text,
                created_at: response.created_at
            }
            placeInfo.push(newReview as TBusinessReview)
            showModal.value = false
        } catch (e) {
            console.log(e)
        }
    }

    async function getReview(id: string) {
        try {
            const response = await $fetch<TResponseBusinessReview>( `https://api.talklif.uz/v1/public/rate/?business=${id}`, {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                },
            })
            if(!placeInfo.length) placeInfo.push(...response.results as TBusinessReview[])
        } catch (e) {
            console.log(e)
        }
    }

    const getAllReviews = computed(() => {
        return placeInfo
    })

    async function deleteReview(id: number) {
        try {
             await $fetch( `https://api.talklif.uz/v1/rate/${reviewId.value}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
            })
            const index = profile.reviews.findIndex((review) => review.id === reviewId.value)
            profile.reviews.splice(index, 1)
        } catch (e) {
            console.log(e)
        }
    }

    async function editReview(review: TReviewsResult) {
        try {
            const response = await $fetch<TEditReviewResponse>( `https://api.talklif.uz/v1/rate/${review.id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
                body: {
                    assigned_rating: newRating.value,
                    text: review.text,
                    business: review.business.id
                }
            })
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    return {
        placeInfo,
        showModal,
        comment,
        openDeleModal,
        openEditModal,
        review,
        newRating,
        showReviewModal,
        showEditModal,
        sendReview,
        getReview,
        deleteReview,
        showDeleteModal,
        editReview,
        getAllReviews
    }
})