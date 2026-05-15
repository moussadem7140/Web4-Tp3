<template>
  <main class="profile-page">
    <div class="container py-5">
      <div class="profile-card">
        <h1 class="mb-4">Mon profil</h1>

        <!-- Informations personnelles -->
        <section class="mb-5">
          <h2 class="section-title">Informations personnelles</h2>

          <form @submit.prevent="updateProfile" novalidate>
            <div class="mb-3">
              <label class="form-label" for="email">Courriel</label>
              <input
                id="email"
                type="email"
                class="form-control custom-input"
                :value="user.email"
                readonly
              />
            </div>

            <div class="mb-3">
              <label class="form-label" for="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                class="form-control custom-input"
                v-model="user.firstName"
                :aria-invalid="!!errors.firstName"
                aria-describedby="firstNameError"
              />

              <span id="firstNameError" class="text-danger" v-if="errors.firstName">
                {{ errors.firstName }}
              </span>
            </div>

            <div class="mb-3">
              <label class="form-label" for="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                class="form-control custom-input"
                v-model="user.lastName"
                :aria-invalid="!!errors.lastName"
                aria-describedby="lastNameError"
              />

              <span id="lastNameError" class="text-danger" v-if="errors.lastName">
                {{ errors.lastName }}
              </span>
            </div>

            <div class="mb-4">
              <label class="form-label" for="phone">Téléphone</label>
              <input
                id="phone"
                type="text"
                class="form-control custom-input"
                v-model="user.phone"
                :aria-invalid="!!errors.phone"
                aria-describedby="phoneError"
              />

              <span id="phoneError" class="text-danger" v-if="errors.phone">
                {{ errors.phone }}
              </span>
            </div>

            <button type="submit" class="btn save-btn">Enregistrer</button>
          </form>
        </section>

        <!-- Mot de passe -->
        <section>
          <h2 class="section-title">Changer le mot de passe</h2>

          <form @submit.prevent="changePassword" novalidate>
            <div class="mb-3">
              <label class="form-label" for="currentPassword"> Mot de passe actuel </label>

              <input
                id="currentPassword"
                type="password"
                class="form-control custom-input"
                v-model="currentPassword"
                :aria-invalid="!!errors.currentPassword"
                aria-describedby="currentPasswordError"
              />

              <span id="currentPasswordError" class="text-danger" v-if="errors.currentPassword">
                {{ errors.currentPassword }}
              </span>
            </div>

            <div class="mb-3">
              <label class="form-label" for="newPassword"> Nouveau mot de passe </label>

              <input
                id="newPassword"
                type="password"
                class="form-control custom-input"
                v-model="newPassword"
                :aria-invalid="!!errors.newPassword"
                aria-describedby="newPasswordError"
              />

              <span id="newPasswordError" class="text-danger" v-if="errors.newPassword">
                {{ errors.newPassword }}
              </span>
            </div>

            <div class="mb-4">
              <label class="form-label" for="confirmPassword"> Confirmation </label>

              <input
                id="confirmPassword"
                type="password"
                class="form-control custom-input"
                v-model="confirmPassword"
                :class="{ 'is-invalid': errors.confirmPassword }"
                :aria-invalid="!!errors.confirmPassword"
                aria-describedby="confirmPasswordError"
              />

              <span id="confirmPasswordError" class="text-danger" v-if="errors.confirmPassword">
                {{ errors.confirmPassword }}
              </span>
            </div>

            <button type="submit" class="btn save-btn">Modifier</button>
          </form>
        </section>
      </div>
    </div>
  </main>
</template>
<script setup>
import useUserStore from '../stores/auth'
import { reactive, ref } from 'vue'
import { apiFetch } from '../utils/apiFetch'
import alert from '../stores/alert'
const UserStore = useUserStore()
const AlertStore = alert()
const user = UserStore.UserInfos
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errors = reactive({})
async function updateProfile() {
  if (!validateUpdate()) {
    return
  }
  try {
    const response = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: 'user',
      }),
    })
    UserStore.EnregistrerInfos(response) // Mettre à jour les infos utilisateur dans le store après la modification
    AlertStore.hasError = false
    AlertStore.Message = 'Profil mis à jour avec succès.'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message =
      error.message || 'Une erreur est survenue lors de la mise à jour du profil.'
  }
}
async function changePassword() {
  if (!validatePasswordChange()) {
    return
  }
  try {
    await apiFetch('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    })
    AlertStore.hasError = false
    AlertStore.Message = 'Mot de passe changé avec succès.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message =
      error.message || 'Une erreur est survenue lors du changement de mot de passe.'
  }
}
function validateUpdate() {
  let isValid = true
  errors.firstName = ''
  errors.lastName = ''
  errors.phone = ''

  if (!user.firstName) {
    errors.firstName = 'Le prénom est requis.'
    isValid = false
  }
  if (!user.lastName) {
    errors.lastName = 'Le nom est requis.'
    isValid = false
  }
  if (!user.phone) {
    errors.phone = 'Le téléphone est requis.'
    isValid = false
  } else if (!/^\d{10}$/.test(user.phone)) {
    errors.phone = 'Le téléphone doit être composé de 10 chiffres.'
    isValid = false
  }
  return isValid
}
function validatePasswordChange() {
  let isValid = true
  errors.currentPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  if (!currentPassword.value) {
    errors.currentPassword = 'Le mot de passe actuel est requis.'
    isValid = false
  }
  if (!newPassword.value) {
    errors.newPassword = 'Le nouveau mot de passe est requis.'
    isValid = false
  }
  if (confirmPassword.value !== newPassword.value) {
    errors.confirmPassword = 'La confirmation du mot de passe ne correspond pas.'
    isValid = false
  }
  return isValid
}
</script>
<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f7f5ef;
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.section-title {
  color: #23462d;
  font-weight: 900;
  margin-bottom: 25px;
}

.custom-input {
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #d8dfd7;
}

.custom-input:focus {
  border-color: #6ba368;
  box-shadow: 0 0 0 0.2rem rgba(107, 163, 104, 0.2);
}

.form-label {
  font-weight: 700;
  color: #23462d;
}

.save-btn {
  background: #23462d;
  color: white;
  border-radius: 14px;
  padding: 12px 24px;
  font-weight: 800;
}

.save-btn:hover {
  background: #183321;
  color: white;
}
</style>
