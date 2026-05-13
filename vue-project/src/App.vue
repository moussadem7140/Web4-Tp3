<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import AlertMessage from './components/AlertMessage.vue'
</script>

<template>
  <div>
    <NavBar />
    <AlertMessage />
    <RouterView />
  </div>
</template>

<style scoped></style>
