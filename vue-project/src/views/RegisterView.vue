<template>
  <main class="register-page">
    <section class="register-card">
      <div class="register-header">
        <span class="register-badge">🌲 Rejoindre CampXplore</span>

        <h1>Créer un compte</h1>

        <p>Inscrivez-vous pour réserver vos emplacements et gérer vos aventures.</p>
      </div>

      <form class="register-form" @submit.prevent="creerCompte" novalidate>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label" for="firstName">Prénom</label>
            <input
              id="firstName"
              type="text"
              class="form-control custom-input"
              v-model="Prenom"
              :aria-invalid="!!errors.Prenom"
              :aria-describedby="PrenomError"
            />
          </div>
          <span class="text-danger" v-show="errors.Prenom" id="PrenomError">{{
            errors.Prenom
          }}</span>
          <div class="col-12 col-md-6">
            <label class="form-label" for="lastName">Nom</label>
            <input
              id="lastName"
              type="text"
              class="form-control custom-input"
              v-model="Nom"
              :aria-invalid="!!errors.Nom"
              :aria-describedby="NomError"
            />
            <span class="text-danger" v-show="errors.Nom" id="NomError">{{ errors.Nom }}</span>
          </div>

          <div class="col-12">
            <label class="form-label" for="email">Courriel</label>
            <input
              id="email"
              type="email"
              class="form-control custom-input"
              v-model="Courriel"
              :aria-invalid="!!errors.Courriel"
              :aria-describedby="CourrielError"
            />
            <span class="text-danger" v-show="errors.Courriel" id="CourrielError">{{
              errors.Courriel
            }}</span>
          </div>

          <div class="col-12">
            <label class="form-label" for="phone">Téléphone</label>
            <input
              id="phone"
              type="tel"
              class="form-control custom-input"
              placeholder="Ex: 5141234567"
              v-model="Telephone"
              :aria-invalid="!!errors.Telephone"
              :aria-describedby="TelephoneError"
            />
            <span class="text-danger" v-show="errors.Telephone" id="TelephoneError">{{
              errors.Telephone
            }}</span>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label" for="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              class="form-control custom-input"
              v-model="MotDePasse"
              :aria-invalid="!!errors.MotDePasse"
              :aria-describedby="MotDePasseError"
            />
            <span class="text-danger" v-show="errors.MotDePasse" id="MotDePasseError">{{
              errors.MotDePasse
            }}</span>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label" for="confirmPassword">Confirmation</label>
            <input
              id="confirmPassword"
              type="password"
              class="form-control custom-input"
              v-model="ConfirmationMotDePasse"
              :aria-invalid="!!errors.ConfirmationMotDePasse"
              :aria-describedby="ConfirmationMotDePasseError"
            />
            <span
              class="text-danger"
              v-show="errors.ConfirmationMotDePasse"
              id="ConfirmationMotDePasseError"
              >{{ errors.ConfirmationMotDePasse }}</span
            >
          </div>
        </div>

        <button type="submit" class="btn register-btn w-100 mt-4">Créer mon compte</button>
      </form>

      <p class="login-link">
        Vous avez déjà un compte ?
        <RouterLink to="/connexion">Se connecter</RouterLink>
      </p>
    </section>
  </main>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
import { useRouter } from 'vue-router'
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés ré
const router = useRouter()
let Prenom = ref('')
let Nom = ref('')
let Courriel = ref('')
let Telephone = ref('')
let MotDePasse = ref('')
let ConfirmationMotDePasse = ref('')
let errors = reactive({})

async function creerCompte() {
  if (validateForm()) {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName: Prenom.value,
          lastName: Nom.value,
          email: Courriel.value,
          phone: Telephone.value,
          password: MotDePasse.value,
          role: 'user',
        }),
      })
      AlertStore.hasError = false
      AlertStore.Message = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
      AlertStore.hasError = false
      AlertStore.Message = 'Compte créé avec succès !'

      // pause de 2 secondes
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push('/connexion')
    } catch (error) {
      AlertStore.hasError = true
      AlertStore.Message =
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue lors de la création du compte.'
    }
  }
}
function validateForm() {
  errors.Prenom = ''
  errors.Nom = ''
  errors.Courriel = ''
  errors.Telephone = ''
  errors.MotDePasse = ''
  errors.ConfirmationMotDePasse = ''
  let isValid = true
  if (!Prenom.value.trim()) {
    errors.Prenom = 'Le prénom est requis.'
    isValid = false
  }

  if (!Nom.value.trim()) {
    errors.Nom = 'Le nom est requis.'
    isValid = false
  }

  if (!Courriel.value.trim()) {
    errors.Courriel = 'Le courriel est requis.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(Courriel.value)) {
    errors.Courriel = "Le courriel n'est pas valide."
    isValid = false
  }

  if (!Telephone.value.trim()) {
    errors.Telephone = 'Le téléphone est requis.'
    isValid = false
  } else if (!/^\d{10}$/.test(Telephone.value)) {
    errors.Telephone = 'Le téléphone doit contenir 10 chiffres.'
    isValid = false
  }
  // "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
  // ","path":"/api/auth/register","timestamp":"2026-05-13T23:31:08.159Z"}
  if (!MotDePasse.value) {
    errors.MotDePasse = 'Le mot de passe est requis.'
    isValid = false
  } else if (
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(MotDePasse.value)
  ) {
    errors.MotDePasse =
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.'
    isValid = false
  }

  if (ConfirmationMotDePasse.value !== MotDePasse.value) {
    errors.ConfirmationMotDePasse = 'Les mots de passe ne correspondent pas.'
    isValid = false
  }

  return isValid
}
</script>
<style scoped>
.register-page {
  min-height: calc(100vh - 80px);
  background:
    linear-gradient(rgba(247, 245, 239, 0.9), rgba(247, 245, 239, 0.95)),
    url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 55px 18px;
}

.register-card {
  width: 100%;
  max-width: 760px;
  background: white;
  border-radius: 28px;
  padding: 38px;
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.14);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-badge {
  display: inline-block;
  background: #e8f6e9;
  color: #24522d;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 15px;
}

.register-header h1 {
  color: #23462d;
  font-weight: 800;
  font-size: 2.2rem;
}

.register-header p {
  color: #6d7c70;
  margin: 0 auto;
  max-width: 520px;
}

.form-label {
  color: #2f4f38;
  font-weight: 700;
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

.register-btn {
  background: #23462d;
  color: white;
  border-radius: 16px;
  padding: 13px;
  font-weight: 800;
}

.register-btn:hover {
  background: #183321;
  color: white;
}

.login-link {
  text-align: center;
  margin-top: 22px;
  color: #637268;
}

.login-link a {
  color: #23462d;
  font-weight: 800;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .register-card {
    padding: 26px;
  }
}
</style>
