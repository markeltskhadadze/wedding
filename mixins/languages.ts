import { computed } from 'vue'
import { homePageData } from "~/stores/home-page"

export const getCurrentLang = {
    setup() {
        const home = homePageData()
        const route = useRoute()
        function getLangHeader()  {
            let currentURL = route.name
            if (typeof currentURL === "string") {
                let URLArray = currentURL.split('___')
                return home.currentLang = URLArray[1]
            }
        }

        return {
            getLangHeader
        }
    }
}