import { authInfo } from '~/stores/auth'
import { profileData } from '~/stores/profile'

export const getToken = {
    setup() {
        const auth = authInfo()
        const profile = profileData()
        async function checkAuth() {
            let token :string | null = localStorage.getItem('token')
            if (token) {
                auth.setToken(token)
                await profile.getProfileInfo()
            }
        }

        return {
            checkAuth
        }
    }
}