import { ref, computed, onMounted } from 'vue'

export const screen = {
    setup() {
        const width = ref(0)

        const checkScreen = computed(() => {
            if (width.value >= 900) {
                return true
            } else {
                return false
            }
        })

        const getCountSlider = computed(() => {
            if (width.value <= 1200) {
                return 3.5
            } else if (width.value <= 1280) {
                return 7
            } else {
                return 10
            }
        })

        const getCountSimilarPlaces = computed(() => {
            if (width.value <= 1200) {
                return 1.5
            } else {
                return 5
            }
        })

        onMounted(() => {
            if (process.client) {
                width.value = window.innerWidth
                window.addEventListener('resize', () => {
                    width.value = window.innerWidth
                })
            }
        })

        return {
            checkScreen,
            width,
            getCountSlider,
            getCountSimilarPlaces
        }
    }
}