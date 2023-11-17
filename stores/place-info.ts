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
    const newRating: Ref<string> = ref('')
    const openDeleModal: Ref<boolean> = ref(false)
    const openEditModal: Ref<boolean> = ref(false)
    let review = ref<TReviewsResult>({
        assigned_rating: '',
        created_at: '',
        text: '',
        user: {
            name: ''
        },
        _id: '',
        business: {
            _id: '',
            name: '',
            min_value: 0,
            max_value: 0,
            price: 0,
            district: ''
        }
    })
    const reviewId: Ref<string> = ref('')
    const auth = authInfo()
    let placeInfo = reactive<TReviewsResult[]>([])

    function showReviewModal() {
        showModal.value = !showModal.value
    }

    function showDeleteModal(id: string) {
        reviewId.value = id
        openDeleModal.value = !openDeleModal.value
    }

     function showEditModal(currentReview: TReviewsResult) {
        review.value = {
            assigned_rating: currentReview.assigned_rating,
            created_at: currentReview.created_at,
            text: currentReview.text,
            user: currentReview.user,
            _id: currentReview._id,
            business: {
                _id: currentReview.business._id,
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
            const response = await $fetch<TReviewsResult>( 'https://node-and-mongo-project.herokuapp.com/api/add-reviews', {
                method: 'POST',
                headers: {
                    Authorization: auth.token,
                },
                body: {
                    businessId: id,
                    created_at: new Date().toLocaleDateString(),
                    assigned_rating: newRating.value,
                    text: comment.value
                }
            })
            comment.value = ''
            const newReview = {
                assigned_rating: response.assigned_rating,
                user: {
                    name: response.user.name
                },
                text: response.text,
                created_at: response.created_at
            }
            placeInfo.push(newReview as TReviewsResult)
            showModal.value = false
        } catch (e) {
            console.log(e)
        }
    }

    async function getReview(id: string) {
        try {
            const response = await $fetch<TReviewsResult[]>( `https://node-and-mongo-project.herokuapp.com/api/reviews/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: auth.token
                },
            })
            if(!placeInfo.length) placeInfo.push(...response as TReviewsResult[])
        } catch (e) {
            console.log(e)
        }
    }

    const getAllReviews = computed(() => {
        return placeInfo
    })

    async function deleteReview(id: string) {
        try {
             await $fetch( `https://node-and-mongo-project.herokuapp.com/api/review/${reviewId.value}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: auth.token,
                },
            })
            const index = profile.reviews.findIndex((review) => review._id === reviewId.value)
            console.log(index)
            profile.reviews.splice(index, 1)
        } catch (e) {
            console.log(e)
        }
    }

    async function editReview(review: TReviewsResult) {
        try {
            await $fetch<TEditReviewResponse>( `https://node-and-mongo-project.herokuapp.com/api/review/${review._id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: auth.token,
                },
                body: {
                    assigned_rating: newRating.value,
                    text: review.text,
                    business: review.business._id
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