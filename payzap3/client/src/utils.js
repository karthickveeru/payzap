const getSessionUser = () => sessionStorage.getItem("payzapUser")

const setSessionUser = (username) => window.sessionStorage.setItem("payzapUser", username);

const logoutSession = () => window.sessionStorage.clear()

export {
    getSessionUser,
    setSessionUser,
    logoutSession
}