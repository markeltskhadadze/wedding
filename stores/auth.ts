import { defineStore } from 'pinia'
import {Ref, ref, watch} from 'vue'
import { headerData } from '~/stores/header'
import { TNumberAuth, TAuthWithSMSCode, TAccessData, TRegistrationUser } from '~/types'
import { profileData } from '~/stores/profile'
import { eventsInfo } from "~/stores/events"
import { homePageData } from "~/stores/home-page"

export const authInfo = defineStore('authInfo', () => {
    const header = headerData()
    const profile = profileData()
    const event = eventsInfo()
    const home = homePageData()
    const token: Ref<string> = ref('')
    const isAuthenticated: Ref<boolean> = ref(false)

    watch(isAuthenticated, (newOpen) => {
        if (newOpen) {
            home.showNotification = true
        }
    })

    function setToken (tokenData: string | null | undefined) {
        if (tokenData) {
            token.value = tokenData
            localStorage.setItem('token', tokenData)
            isAuthenticated.value = true
        }
    }
    async function sendNumber(data: TNumberAuth) {
        if (header.phoneNumber) {
            try {
                await $fetch( 'https://api.talklif.uz/v1/account/auth/phone/', {
                    method: 'POST',
                    body: data
                })
                header.enterSMSCode = true
            } catch (e) {
                console.log(e)
            }
        }
    }
    async function checkSMS(data: TAuthWithSMSCode) {
        header.registration = true
        try {
            const response = await $fetch<TAccessData>( 'https://api.talklif.uz/v1/account/auth/phone_verify/', {
                method: 'POST',
                body: data
            })
            setToken(response.access)
            await profile.getProfileInfo()
            await event.getInvitation()
            header.open = false
        } catch (e) {
            console.log(e)
        }
    }
    async function signOut() {
        token.value = ''
        isAuthenticated.value = false
        profile.openExitModal = false
        localStorage.removeItem('token')
        window.location.reload()
    }

    async function registrationNumber(data: TRegistrationUser) {
        try {
            const response = await $fetch<TRegistrationUser>( 'https://api.talklif.uz/v1/account/register/phone/', {
                method: 'POST',
                body: data
            })
            header.enterSMSCode = true
        } catch (e) {
            console.log(e)
        }
    }

    async function registrationCheckSMS(data: TAuthWithSMSCode) {
        try {
            const response = await $fetch<TAccessData>( 'https://api.talklif.uz/v1/account/register/phone_verify/', {
                method: 'POST',
                body: data
            })
            setToken(response.access)
            header.registration = true
        } catch (e) {
            console.log(e)
        }
    }

    return {
        isAuthenticated,
        token,
        sendNumber,
        checkSMS,
        setToken,
        signOut,
        registrationNumber,
        registrationCheckSMS
    }
})