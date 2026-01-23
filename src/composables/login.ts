import { ref } from "vue"

const loggedUser = ref(localStorage.getItem('userName'))
export default function useLogin() {
    const closeSesion = () => {
        loggedUser.value = null
        localStorage.removeItem('userName')
        localStorage.removeItem('token')
        localStorage.removeItem('userType')
    }
    const initSesion = (value:string) => {
        loggedUser.value = value
    }
    const validateLogin = () => {
        const loggedPerson = localStorage.getItem('personName')
        const loggedUser = localStorage.getItem('userName')
        if (!loggedPerson || !loggedUser) {
            window.location.assign("/");
        }
    }
    return {
        loggedUser,
        closeSesion,
        initSesion,
        validateLogin
    }
}