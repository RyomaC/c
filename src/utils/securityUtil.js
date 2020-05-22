export default {
    checkGranted(action) {
        let username
        if (localStorage.tokenInfo)  {
            username = JSON.parse(localStorage.tokenInfo).username
        }
        if (username === 'admin') {
            return true
        }
        let grantedActions = []
        if (localStorage.grantedActions) {
            grantedActions = JSON.parse(localStorage.grantedActions)
            if (grantedActions.includes(action)) {
                return true
            }
        }
        return false
    }
}