import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import * as Alert from './alert'

const useReservationsStore = defineStore('reservations', () => {
  const AlertStore = Alert() // on doit l'instancier pour accéder à ses propriétés réactives
  const reservations = ref([])
  reservations.value = apiFetch('/reservations', {
    method: 'GET',
  }).catch((error) => {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la récupération des réservations:'
  })
  return {
    reservations,
  }
})
export default useReservationsStore
