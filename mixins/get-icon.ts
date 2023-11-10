import { computed } from 'vue'

export const getImage = {
    setup() {
        const getIcon = computed(() => {
            return '/'
        })

        return {
            getIcon
        }
    }
}