<template>
  <div
    v-if="AlertStore.Message"
    class="alert-box"
    :class="!AlertStore.hasError ? 'success-box' : 'error-box'"
  >
    <p class="alert-message" :class="!AlertStore.hasError ? 'success-text' : 'error-text'">
      {{ AlertStore.Message }}
    </p>
  </div>
</template>

<script setup>
import Alert from '../stores/alert'
const AlertStore = Alert() // on doit l'instancier pour accéder à ses propriétés réactives
</script>

<style scoped>
.alert-box {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  margin: 10px 0;
  border-left: 6px solid;
  animation: fadeIn 0.25s ease;
}
.alert-message {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
}
.success-box {
  background-color: #e8f8ec;
  border-color: #2e9e50;
}
.success-text {
  color: #1f6f38;
}
.error-box {
  background-color: #fdeaea;
  border-color: #d93025;
}
.error-text {
  color: #a1261d;
}
/* je vais faire une petite animation progressive pour que le message */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
