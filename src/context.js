const context = {
    set token(userId) {
        if (userId) {
            sessionStorage.token = userId

            return
        }

        delete sessionStorage.token
    },

    get token() {
        if (sessionStorage.token) {
            return sessionStorage.token
        }

        return null
    }
}

export default context