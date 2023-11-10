import { defineStore } from 'pinia'
import {Ref, ref, watch} from 'vue'
import { headerData } from '~/stores/header'
import { TUserData, TUserDataResult } from '~/types'
import { profileData } from '~/stores/profile'
import { homePageData } from '~/stores/home-page'

export const authInfo = defineStore('authInfo', () => {
    const header = headerData()
    const profile = profileData()
    const home = homePageData()
    const token: Ref<string> = ref('')
    const isAuthenticated: Ref<boolean> = ref(false)

    watch(isAuthenticated, (newOpen) => {
        if (newOpen) {
            home.showNotification = true
        }
    })

    function setToken (tokenData: string | null | undefined) {
        console.log(tokenData)
        if (tokenData) {
            token.value = tokenData
            localStorage.setItem('token', tokenData)
            isAuthenticated.value = true
        }
    }

    async function login (userData: TUserData) {
        try {
            const result = await $fetch<TUserDataResult>('https://node-and-mongo-project.herokuapp.com/api/login', {
                method: 'POST',
                body: userData
            })
            setToken(result.token)
            await profile.getProfileInfo()
            header.open = false
        } catch (error) {
            console.log(error)
        }
    }
    async function signOut() {
        token.value = ''
        isAuthenticated.value = false
        profile.openExitModal = false
        localStorage.removeItem('token')
        window.location.reload()
    }

    return {
        isAuthenticated,
        token,
        login,
        setToken,
        signOut
    }
})