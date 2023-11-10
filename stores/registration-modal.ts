import {ref, Ref, computed, watch} from 'vue'
import { defineStore } from 'pinia'
import { authInfo } from "~/stores/auth"
import { profileData } from "~/stores/profile"

export const registrationModal = defineStore('registrationModal', () => {
    const selectedTask: Ref<string> = ref('')
    const userName: Ref<string> = ref('')
    const eventName: Ref<string> = ref('')
    const userNameError: Ref<boolean> = ref(false)
    const eventNameError: Ref<boolean> = ref(false)
    const selectedTaskError: Ref<boolean> = ref(false)
    const profileCreated: Ref<boolean> = ref(false)
    const selectedUser: Ref<boolean> = ref(true)
    const selectedCompany: Ref<boolean> = ref(false)
    const enterSMS: Ref<boolean> = ref(true)
    const showCalendar: Ref<boolean> = ref(false)
    const date = ref(new Date())
    const auth = authInfo()
    const profile = profileData()
    const disabledDates = ref([{ start: null, end: new Date() }])

    watch(() => date.value, (newOpen) => {
        if (newOpen) {
            showCalendar.value = false
        }
    })
    async function createProfile() {
        !userName.value ? userNameError.value = true : userNameError.value = false
        !eventName.value ? eventNameError.value = true : eventNameError.value = false
        if (userName.value && eventName.value) {
            profileCreated.value = true
            try {
                await $fetch('https://api.talklif.uz/v1/event/', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + auth.token
                    },
                    body: {
                        name: eventName.value,
                        date: date.value
                    }
                })
            } catch (e) {
                console.log(e)
            }
            try {
                await $fetch( 'https://api.talklif.uz/v1/account/user/update_profile/', {
                    method: 'PUT',
                    headers: {
                        Authorization: "Bearer " + auth.token,
                    },
                    body: {
                        full_name: userName.value
                    }
                })
                await profile.getProfileInfo()
            } catch (e) {
                console.log(e)
            }
        }
    }

    const getDate = computed(() => {
        const inputDate = new Date(date.value)

        const day = String(inputDate.getDate()).padStart(2, '0')
        const month = String(inputDate.getMonth() + 1).padStart(2, '0')
        const year = inputDate.getFullYear()

        const formattedDate = `${day}.${month}.${year}`
        return formattedDate
    })

    async function createBusiness() {
        try {
            await $fetch( 'https://api.talklif.uz/v1/account/user/update_profile/', {
                method: 'PUT',
                headers: {
                    Authorization: "Bearer " + auth.token,
                },
                body: {
                    full_name: userName.value
                }
            })
            await profile.getProfileInfo()
            try {
                await $fetch( 'https://api.talklif.uz/v1/business/', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + auth.token
                    },
                    body: {
                        name: eventName.value,
                        category: selectedTask.value.id
                    }
                })
            } catch (e) {
                console.log(e)
            }
            profileCreated.value = true
        } catch (e) {
            console.log(e)
        }
    }

    return {
        selectedTask,
        userName,
        eventName,
        userNameError,
        eventNameError,
        selectedTaskError,
        showCalendar,
        profileCreated,
        selectedUser,
        date,
        disabledDates,
        selectedCompany,
        enterSMS,
        createProfile,
        createBusiness,
        getDate
    }
})