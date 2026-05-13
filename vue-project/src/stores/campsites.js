import { apiFetch } from '../Utils/ApiFetch'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import Alert from './alert'

const useCampsitesStore = defineStore('campsites', async () => {
  const AlertStore = Alert() // on doit l'instancier pour accéder à ses propriétés réactives
  const type = ref('')
  const campsites = ref([])
  try {
    if (type.value) {
      campsites.value = await apiFetch(`/campsites?type=${type.value}`, {
        method: 'GET',
      })
    } else {
      campsites.value = await apiFetch('/campsites', {
        method: 'GET',
      })
    }
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la récupération des campsites:'
  }

  return {
    campsites,
    type,
  }
})
export default useCampsitesStore
