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
    }, 10000) // Efface le message après 10 secondes  c'est mieux que le afterEach que j'avais mis
  }
  return {
    hasError,
    Message,
    Effacer,
  }
})
export default useAlertStore
