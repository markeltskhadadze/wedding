import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { authInfo } from '~/stores/auth'
import { homePageData } from "~/stores/home-page"
import { TFavoriteResults, TFavorites } from '~/types'

export const favoriteBusiness = defineStore('favoriteBusiness', () => {
    const auth = authInfo()
    const home = homePageData()
    let selectedFavorite: number[] = reactive([])
    const showFavorites: Ref<boolean> = ref(false)
    let favoritesPlace = reactive<TFavoriteResults[]>([])
    async function makeFavorite(id: number) {
        try {
            await $fetch( 'https://api.talklif.uz/v1/favorite/', {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + auth.token
                },
                body: {
                    business: id
                }
            })
            selectedFavorite.push(id)
        } catch (e) {
            console.log(e)
        }
    }

    async function deleteFavorite(id: number) {
        try {
            await $fetch( `https://api.talklif.uz/v1/favorite/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: "Bearer " + auth.token
                }
            })
            home.showNotification = true
            window.location.reload()
            const index = selectedFavorite.findIndex(selectedId => id)
            selectedFavorite.splice(index, 1)
        } catch (e) {
            console.log(e)
        }
    }

    async function getFavorites() {
        try {
            const response = await $fetch<TFavorites>( 'https://api.talklif.uz/v1/favorite/', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + auth.token,
                    'Accept-Language': home.currentLang
                }
            })
            if(!favoritesPlace.length) favoritesPlace.push(...response.results as TFavoriteResults[])
            let favorites = favoritesPlace.map(place => place.business.id)
            // @ts-ignore
            if(!selectedFavorite.length) selectedFavorite.push(...favorites)
        } catch (e) {
            console.log(e)
        }
    }

    const getSelectedFavorite = computed(() => {
        return selectedFavorite
    })

    return {
        makeFavorite,
        getFavorites,
        deleteFavorite,
        selectedFavorite,
        getSelectedFavorite,
        favoritesPlace,
        showFavorites
    }
})