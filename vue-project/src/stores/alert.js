import { ref } from 'vue'
import { defineStore } from 'pinia'
const useAlertStore = defineStore('alert', () => {
  const hasError = ref(false)
  let timer = null
  const Message = ref('')
  function Effacer() {
    clearTimeout(timer)
    setTimeout(() => {
      hasError.value = false
      Message.value = ''
    }, 5000) // Efface le message après 5 secondes  c'est mieux que le afterEach que j'avais mis
  }
  return {
    hasError,
    Message,
    Effacer,
  }
})
export default useAlertStore
