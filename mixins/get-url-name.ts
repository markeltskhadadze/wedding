import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const urlName = {
    setup() {
        const route = useRoute()
        const getURLName = computed(() => {
            const { t } = useI18n()
            let currentURL = route.name
            if (typeof currentURL === "string") {
               let URLArray = currentURL.split('___')
                if (URLArray[0] === 'vendor') {
                    return t('header.vendor_nav')
                } else if (URLArray[0] === 'events') {
                    return t('header.event_nav')
                } else if (URLArray[0] === 'blog') {
                    return t('header.blog_nav')
                } else if (URLArray[0] === 'profile') {
                    return t('header.profile')
                } else {
                    return ''
                }
            }
        })

        return {
            getURLName
        }
    }
}