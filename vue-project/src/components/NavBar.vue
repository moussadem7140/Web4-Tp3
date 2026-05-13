<template>
  <nav class="navbar navbar-expand-lg custom-navbar px-4">
    <div class="container-fluid">
      <a class="navbar-brand brand-title" href="#"> 🏕️ CampXplore </a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink :to="{ name: 'Home' }" class="nav-link custom-link">Accueil</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink :to="{ name: 'Campsites' }" class="nav-link custom-link"
              >Emplacements</RouterLink
            >
          </li>
          <li v-show="authStore.isAuthenticated" class="nav-item">
            <RouterLink :to="{ name: 'Reservations' }" class="nav-link custom-link"
              >Mes Réservations</RouterLink
            >
          </li>
          <li v-show="authStore.isAuthenticated" class="nav-item">
            <RouterLink
              v-show="authStore.isAuthenticated"
              :to="{ name: 'Profile' }"
              class="nav-link custom-link"
              >{{ UserInfos?.lastName }}, {{ UserInfos?.firstName }}</RouterLink
            >
          </li>
          <li v-show="authStore.isAuthenticated" class="nav-item">
            <button class="nav-link custom-link" @click="authStore.logout">Déconnexion</button>
          </li>
          <li v-show="authStore?.isAdmin" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle custom-link"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Admin
            </a>

            <ul class="dropdown-menu">
              <li>
                <RouterLink :to="{ name: 'Campsites' }" class="dropdown-item custom-link">
                  Emplacements</RouterLink
                >
              </li>

              <li>
                <RouterLink :to="{ name: 'Reservations' }" class="dropdown-item custom-link"
                  >Réservations</RouterLink
                >
              </li>
            </ul>
          </li>
          <li v-show="!authStore.isAuthenticated" class="nav-item">
            <RouterLink :to="{ name: 'connexion' }" class="nav-link custom-link"
              >Connexion</RouterLink
            >
          </li>
          <li v-show="!authStore.isAuthenticated" class="nav-item">
            <RouterLink :to="{ name: 'Register' }" class="nav-link custom-link"
              >Inscription</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { RouterLink } from 'vue-router'
import auth from '../stores/auth'
import { storeToRefs } from 'pinia'
const authStore = auth() // on doit l'instancier pour accéder à ses propriétés réactives
const UserInfos = storeToRefs(authStore).UserInfos
</script>
<style scoped>
.custom-navbar {
  background: rgba(25, 55, 35, 0.92);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.brand-title {
  color: #f8f5ee;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 1px;
  text-decoration: none;
}

.custom-link {
  color: #e8f1e8;
  font-weight: 500;
  transition: 0.3s;
}

.custom-link:hover {
  color: #9fe870;
  transform: translateY(-1px);
}

.custom-btn {
  background: #6ba368;
  border: none;
  color: white;
  border-radius: 12px;
  padding: 8px 18px;
  font-weight: 600;
  transition: 0.3s;
}

.custom-btn:hover {
  background: #5a9157;
  transform: translateY(-2px);
}

.custom-btn-outline {
  border: 2px solid #9fe870;
  color: #9fe870;
  border-radius: 12px;
  padding: 8px 18px;
  font-weight: 600;
  transition: 0.3s;
}

.custom-btn-outline:hover {
  background: #9fe870;
  color: #1f3a27;
}
</style>
