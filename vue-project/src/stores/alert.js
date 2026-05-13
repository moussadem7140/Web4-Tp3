import { ref } from 'vue'
import { defineStore } from 'pinia'
const useAlertStore = defineStore('alert', () => {
  const hasError = ref(false)
  const Message = ref('')
  return {
    hasError,
    Message,
  }
})
export default useAlertStore
