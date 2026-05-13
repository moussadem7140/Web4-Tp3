import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { ref, computed } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from './alert'
import { useRouter } from 'vue-router'
const useAuthStore = defineStore('auth', () => {
  const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
  const token = ref(localStorage.getItem('token') ? localStorage.getItem('token') : null) //moi je le rendre persistant dans le localStorage
  const UserInfos = ref(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  )
  // ou récupérer le token depuis localStorage si on l'utilise
  // const token = ref(localStorage.getItem('token') || null);
  // ou depuis un Cookie sécurisé
  // const token = ref(document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null);

  // isAuthenticated est une propriété calculée qui retourne true si le token est valide
  // On pourra l'utiliser dans les composants pour savoir si l'utilisateur est connecté
  const isAuthenticated = computed(() => {
    if (token.value) {
      const decoded = jwtDecode(token.value)
      const now = Date.now() / 1000
      return decoded.exp >= now
    }
    return false
  })
  const isAdmin = computed(() => {
    return UserInfos.value?.role === 'admin' || false
  })
  async function login(username, password) {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      UserInfos.value = data.user // Stocker les infos utilisateur dans le store
      localStorage.setItem('user', JSON.stringify(data.user)) // Stocker les infos utilisateur dans localStorage
      token.value = data.token
      localStorage.setItem('token', data.token) // Stocker le token dans localStorage

      // Enregistrer le token dans localStorage si on veut le conserver après un rechargement de la page
      //   localStorage.setItem("token", data.token); // Stocker le token dans localStorage
      // Ou utiliser un Cookie (HttpOnly est côté serveur)
      // document.cookie = `token=${data.token}; Secure; SameSite=Strict; Max-Age=3600`
    } catch (error) {
      AlertStore.hasError = true
      AlertStore.Message = error.message || 'Erreur lors de la connexion'
    }
  }

  function logout() {
    token.value = null
    UserInfos.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    const router = useRouter()
    router.push('/login') // Rediriger vers la page de connexion après la déconnexion
    // Supprimer le token de localStorage
    // localStorage.removeItem('token'); // Supprimer le token de localStorage
    // ou suppression du Cookie
    // document.cookie = 'token=; Max-Age=0; Secure; SameSite=Strict'
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    UserInfos,
    isAdmin,
  }
})
export default useAuthStore
