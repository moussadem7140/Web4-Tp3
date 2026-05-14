<template>
  <section class="login-page">
    <div class="login-overlay"></div>

    <div class="container py-5 position-relative">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-10 col-lg-5">
          <div class="login-card">
            <div class="text-center mb-4">
              <div class="login-icon">🔐</div>

              <h1 class="login-title">Connectez-vous à CampXplore</h1>

              <p class="login-subtitle">
                Connectez-vous pour gérer vos réservations et explorer CampXplore.
              </p>
            </div>

            <form @submit.prevent="Connexion" novalidate="">
              <!-- EMAIL -->
              <div class="mb-4">
                <label for="Courriel" class="form-label"> Courriel </label>

                <input
                  id="Courriel"
                  type="email"
                  class="form-control custom-input"
                  placeholder="exemple@email.com"
                  v-model="Courriel"
                  :aria-invalid="!!errors.Courriel"
                  :aria-describedby="CourrielError"
                />

                <span id="CourrielError" class="text-danger" v-show="errors.Courriel">
                  {{ errors.Courriel }}
                </span>
              </div>

              <!-- MOT DE PASSE -->
              <div class="mb-4">
                <label for="MotDePasse" class="form-label"> Mot de passe </label>

                <input
                  id="MotDePasse"
                  type="password"
                  class="form-control custom-input"
                  placeholder="********"
                  v-model="MotDePasse"
                  :aria-invalid="!!errors.MotDePasse"
                  :aria-describedby="MotDePasseError"
                />

                <span :id="MotDePasseError" class="text-danger" v-show="errors.MotDePasse">
                  {{ errors.MotDePasse }}
                </span>
              </div>

              <button type="submit" class="btn login-btn w-100">Se connecter</button>
            </form>

            <!-- LIEN INSCRIPTION -->
            <div class="text-center mt-4">
              <p class="register-text">
                Pas encore de compte ?

                <RouterLink :to="{ name: 'Register' }" class="register-link">
                  Créer un compte
                </RouterLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import auth from '../stores/auth'
import alert from '../stores/alert'
const router = useRouter()
const AuthStore = auth()
const AlertStore = alert()
const Courriel = ref('')
const MotDePasse = ref('')
const errors = reactive({})

async function Connexion() {
  if (validateForm()) {
    try {
      await AuthStore.login(Courriel.value, MotDePasse.value)
      AlertStore.hasError = false
      AlertStore.Message = 'Connexion réussie !'
      router.push('/')
    } catch (error) {
      AlertStore.hasError = true
      AlertStore.Message = error.status + ': ' + error.message || 'Erreur lors de la connexion'
    }
  }
}
function validateForm() {
  errors.Courriel = ''
  errors.MotDePasse = ''
  let isValid = true

  if (!Courriel.value.trim()) {
    errors.Courriel = 'Le courriel est requis.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Courriel.value)) {
    errors.Courriel = 'Le courriel doit être au format email.'
    isValid = false
  }

  if (!MotDePasse.value.trim()) {
    errors.MotDePasse = 'Le mot de passe est requis.'
    isValid = false
  } else if (MotDePasse.value.length < 8) {
    errors.MotDePasse = 'Le mot de passe doit contenir au moins 8 caractères.'
    isValid = false
  }

  return isValid
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-image:
    linear-gradient(rgba(12, 33, 18, 0.78), rgba(12, 33, 18, 0.78)),
    url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.login-overlay {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(2px);
}

.login-card {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  border-radius: 28px;
  padding: 42px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.login-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.login-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: #23452d;
  margin-bottom: 10px;
}

.login-subtitle {
  color: #5f6f65;
  font-size: 1rem;
  line-height: 1.6;
}

.form-label {
  font-weight: 700;
  color: #23452d;
  margin-bottom: 8px;
}

.custom-input {
  height: 56px;
  border-radius: 16px;
  border: 2px solid #d8e2da;
  padding: 0 18px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #2f6b45;
  box-shadow: 0 0 0 0.2rem rgba(47, 107, 69, 0.15);
}

.login-btn {
  background: linear-gradient(135deg, #2f6b45, #23452d);
  color: white;
  border: none;
  height: 58px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.25s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(35, 69, 45, 0.25);
}

.register-text {
  color: #5f6f65;
}

.register-link {
  color: #2f6b45;
  text-decoration: none;
  font-weight: 700;
  margin-left: 6px;
}

.register-link:hover {
  text-decoration: underline;
}

.text-danger {
  display: block;
  margin-top: 8px;
  font-size: 0.92rem;
}
</style>
