export const getHeader = {
    setup() {
        function headersConfig() {
            const token: string | null = localStorage.getItem('token')
            if (token) return token
        }

        return {
            headersConfig
        }
    }
}