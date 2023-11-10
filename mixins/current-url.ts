import { useRoute } from 'vue-router'

export const getPath = {
    setup() {
        const route = useRoute()
        const isBusinessActive = route.path === '/profile/business-settings'
        const isSettingsActive = route.path === '/profile/settings'
        const isFavorites = route.path === '/favorites'
        const isReviews = route.path === '/profile/reviews'

        return {
            isBusinessActive,
            isSettingsActive,
            isFavorites,
            isReviews
        }
    }
}