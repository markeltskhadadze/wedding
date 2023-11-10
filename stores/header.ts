import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import { TUser } from '~/types'

export const headerData = defineStore('headerData', () => {
    let open: Ref<boolean> = ref(false)
    let phoneNumber: Ref<string> = ref('')
    let enterSMSCode: Ref<boolean> = ref(false)
    let registration: Ref<boolean> = ref(false)
    let userProfile: Ref<boolean> = ref(false)
    let companyProfile: Ref<boolean> = ref(false)
    const userAuth: Ref<boolean> = ref(false)
    const showUserPopUp: Ref<boolean> = ref(false)
    function showAuthModal() {
        open.value = true
    }
    function backToAuth() {
        enterSMSCode.value ? enterSMSCode.value = false : registration.value = true
        phoneNumber.value = ''
    }
    function backToChose() {
        registration.value = true
        userProfile.value = false
        companyProfile.value = false
        phoneNumber.value = ''

    }
    function selectedUserProfile(selectedUser: boolean) {
        userProfile.value = selectedUser
        registration.value = false
    }
    function selectedCompanyProfile(selectedCompany: boolean) {
        companyProfile.value = selectedCompany
        registration.value = false
    }
    function enterCode(enterSMS: boolean) {
        enterSMSCode.value = enterSMS
        registration.value = false
    }

    return {
        open,
        phoneNumber,
        enterSMSCode,
        registration,
        userProfile,
        companyProfile,
        userAuth,
        showUserPopUp,
        showAuthModal,
        backToAuth,
        backToChose,
        selectedUserProfile,
        selectedCompanyProfile,
        enterCode
    }
})