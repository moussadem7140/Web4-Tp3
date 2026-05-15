import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { ref, computed } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from './alert'
import { useRouter } from 'vue-router'

const useAuthStore = defineStore('auth', () => {
  const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
  const router = useRouter()
  let savedUser = localStorage.getItem('user')
  let savedToken = localStorage.getItem('token')
  const token = ref(savedToken && savedToken !== 'undefined' ? savedToken : null) //moi je le rend persistant dans le localStorage
  const UserInfos = ref(savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null)
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
  async function login(emails, passwords) {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: emails, password: passwords }),
      })
      console.log(data)
      UserInfos.value = data.data.user // Stocker les infos utilisateur dans le store
      localStorage.setItem('user', JSON.stringify(data.data.user)) // Stocker les infos utilisateur dans localStorage
      token.value = data.data.token
      localStorage.setItem('token', data.data.token) // Stocker le token dans localStorage
      // Enregistrer le token dans localStorage si on veut le conserver après un rechargement de la page
      //   localStorage.setItem("token", data.token); // Stocker le token dans localStorage
      // Ou utiliser un Cookie (HttpOnly est côté serveur)
      // document.cookie = `token=${data.token}; Secure; SameSite=Strict; Max-Age=3600`
    } catch (error) {
      // AlertStore.hasError = true
      // AlertStore.Message = error.message || 'Erreur lors de la connexion'
      console.error('Login error:', error.message)
      throw error // Propager l'erreur pour que le composant puisse la gérer et afficher un message approprié
    }
  }

  function EnregistrerInfos(infos) {
    console.log('EnregistrerInfos called with:', infos.data)
    UserInfos.value = infos.data
    localStorage.setItem('user', JSON.stringify(infos.data)) // Mettre à jour les infos utilisateur dans localStorage après la modification du profil
  }

  function logout() {
    token.value = null
    UserInfos.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
    AlertStore.hasError = false
    AlertStore.Message = 'Déconnexion réussie'
    router.push({ name: 'connexion' }) // Rediriger vers la page de connexion après la déconnexion
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
    EnregistrerInfos,
  }
})
export default useAuthStore
