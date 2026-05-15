<template>
  <main class="details-page">
    <section class="details-hero">
      <div class="container">
        <RouterLink :to="{ name: 'Campsites' }" class="back-link">
          ← Retour aux emplacements
        </RouterLink>

        <span class="type-badge">{{ campsite?.type }}</span>
        <h1>{{ campsite?.name }}</h1>
        <p>{{ campsite?.description }}</p>
      </div>
    </section>

    <section class="container details-content">
      <div class="row g-4">
        <div class="col-12 col-lg-7">
          <div class="info-card">
            <h2>Informations sur le site</h2>

            <div class="info-grid">
              <div class="info-item">
                <span>📍</span>
                <div>
                  <strong>Lieu</strong>
                  <p>{{ campsite?.location }}</p>
                </div>
              </div>

              <div class="info-item">
                <span>💵</span>
                <div>
                  <strong>Prix par nuit</strong>
                  <p>{{ campsite?.pricePerNight }} $ / nuit</p>
                </div>
              </div>

              <div class="info-item">
                <span>👥</span>
                <div>
                  <strong>Capacité maximale</strong>
                  <p>{{ campsite?.capacity }} personnes</p>
                </div>
              </div>

              <div class="info-item" v-if="campsite?.type === 'vr'">
                <span>🚐</span>
                <div>
                  <strong>Longueur véhicule</strong>
                  <p>{{ campsite?.maxVehicleLength }} pieds max.</p>
                </div>
              </div>
            </div>

            <h3>Équipements</h3>

            <div class="amenities">
              <span v-for="amenity in campsite?.amenities" :key="amenity" class="amenity-badge">
                {{ amenityIcon(amenity) }} {{ amenity }}
              </span>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <div class="reservation-card">
            <h2>Réserver ce site</h2>

            <RouterLink
              v-if="!authStore.isAuthenticated"
              :to="{ name: 'connexion' }"
              class="btn login-reserve-btn w-100"
            >
              Se connecter pour réserver
            </RouterLink>

            <form v-else @submit.prevent="submitReservation" novalidate>
              <div class="mb-3">
                <label class="form-label" for="dateArrivee">Date d’arrivée</label>
                <input
                  id="dateArrivee"
                  type="date"
                  class="form-control custom-input"
                  v-model="dateArrivee"
                  :aria-invalid="!!errors.dateArrivee"
                  aria-describedby="dateArriveeError"
                />
                <span id="dateArriveeError" class="text-danger" v-if="errors.dateArrivee">
                  {{ errors.dateArrivee }}
                </span>
              </div>

              <div class="mb-3">
                <label class="form-label" for="dateDepart">Date de départ</label>
                <input
                  id="dateDepart"
                  type="date"
                  class="form-control custom-input"
                  v-model="dateDepart"
                  :aria-invalid="!!errors.dateDepart"
                  aria-describedby="dateDepartError"
                />
                <span id="dateDepartError" class="text-danger" v-if="errors.dateDepart">
                  {{ errors.dateDepart }}
                </span>
              </div>

              <div class="mb-3">
                <label class="form-label" for="nbPersonnes">Nombre de personnes</label>
                <input
                  id="nbPersonnes"
                  type="number"
                  min="1"
                  class="form-control custom-input"
                  placeholder="Ex: 4"
                  v-model.number="nbPersonnes"
                  :aria-invalid="!!errors.nbPersonnes"
                  aria-describedby="nbPersonnesError"
                />
                <span id="nbPersonnesError" class="text-danger" v-if="errors.nbPersonnes">
                  {{ errors.nbPersonnes }}
                </span>
              </div>

              <div class="mb-3" v-if="campsite?.type === 'vr'">
                <label class="form-label" for="vehicleLength">Longueur du véhicule</label>
                <input
                  id="vehicleLength"
                  type="number"
                  min="1"
                  class="form-control custom-input"
                  placeholder="Ex: 20"
                  v-model.number="vehicleLength"
                  :aria-invalid="!!errors.vehicleLength"
                  aria-describedby="vehicleLengthError"
                />
                <span id="vehicleLengthError" class="text-danger" v-if="errors.vehicleLength">
                  {{ errors.vehicleLength }}
                </span>
              </div>

              <div class="price-preview">
                <span>Total estimé: </span>
                <span>{{ totalPrice }} $</span>
              </div>

              <button type="submit" class="btn reserve-btn w-100">Confirmer la réservation</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import auth from '../stores/auth'
import { ref, computed, reactive, onMounted } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
import { useRoute } from 'vue-router'
import router from '../router'
const route = useRoute()
let campsiteId = route.params.id
let campsite = ref(null)
const authStore = auth()
const dateArrivee = ref('')
const dateDepart = ref('')
const nbPersonnes = ref(0)
const vehicleLength = ref()
const errors = reactive({})

onMounted(async () => {
  try {
    const response = await apiFetch(`/campsites/${campsiteId}`, { method: 'GET' })
    campsite.value = response.data
    AlertStore.hasError = false
    AlertStore.Message = 'Détails du site chargés avec succès.'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.errorMessage = 'Impossible de charger les détails du site.'
  }
})
const totalPrice = computed(() => {
  if (campsite.value && dateArrivee.value && dateDepart.value) {
    const start = new Date(dateArrivee.value)
    const end = new Date(dateDepart.value)
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights * campsite.value.pricePerNight : 0
  }
  return 0
})
async function submitReservation() {
  if (validateReservation()) {
    try {
      await apiFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({
          campsite: campsite.value._id,
          startDate: dateArrivee.value,
          endDate: dateDepart.value,
          guests: nbPersonnes.value,
          vehicleLength: campsite.value.type === 'vr' ? vehicleLength.value : undefined,
        }),
      })
      AlertStore.hasError = false
      AlertStore.Message = 'Réservation réussie !'
      router.push({ name: 'Reservations' })
    } catch (error) {
      AlertStore.hasError = true
      AlertStore.Message =
        error.message || 'Une erreur est survenue lors de la réservation. Veuillez réessayer.'
    }
  }
}
function validateReservation() {
  errors.dateArrivee = ''
  errors.dateDepart = ''
  errors.nbPersonnes = ''
  errors.vehicleLength = ''

  let isValid = true
  if (!dateArrivee.value) {
    errors.dateArrivee = 'La date d’arrivée est requise.'
    isValid = false
  }
  if (!dateDepart.value) {
    errors.dateDepart = 'La date de départ est requise.'
    isValid = false
  }
  if (
    dateArrivee.value &&
    dateDepart.value &&
    dateArrivee.value < new Date().toISOString().split('T')[0]
  ) {
    errors.dateArrivee = 'La date d’arrivée doit être aujourd’hui ou dans le futur'
    isValid = false
  }
  if (dateArrivee.value && dateDepart.value && dateDepart.value <= dateArrivee.value) {
    errors.dateDepart = 'La date de départ doit être après la date d’arrivée.'
    isValid = false
  }
  if (campsite.value?.type === 'vr' && vehicleLength.value && vehicleLength.value <= 0) {
    errors.vehicleLength =
      'La longueur du véhicule doit être précisée pour les sites VR et positif.'
    isValid = false
  }
  if (nbPersonnes.value <= 0) {
    errors.nbPersonnes = 'Le nombre de personnes doit être au moins 1.'
    isValid = false
  }
  if (!vehicleLength.value) {
    errors.vehicleLength = `La longueur du véhicule est requise pour les sites VR `
    isValid = false
  }

  return isValid
}

const amenityIcon = (amenity) => {
  const icons = {
    électricité: '⚡',
    eau: '🚿',
    wifi: '📶',
    douche: '🚿',
    toilettes: '🚻',
    'feu de camp': '🔥',
    'table de pique-nique': '🧺',
    égout: '🛠️',
  }

  return icons[amenity?.toLowerCase()] || '🏕️'
}
</script>

<style scoped>
.details-page {
  min-height: 100vh;
  background: #f7f5ef;
}

.details-hero {
  background:
    linear-gradient(rgba(21, 44, 28, 0.68), rgba(21, 44, 28, 0.82)),
    url('https://images.unsplash.com/photo-1506744038136-46273834b3fb');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 85px 0;
}

.back-link {
  display: inline-block;
  color: #e8f6e9;
  text-decoration: none;
  font-weight: 700;
  margin-bottom: 20px;
}

.back-link:hover {
  text-decoration: underline;
}

.type-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 9px 16px;
  border-radius: 999px;
  font-weight: 800;
  margin-bottom: 18px;
}

.details-hero h1 {
  font-size: clamp(2.3rem, 5vw, 4.4rem);
  font-weight: 900;
}

.details-hero p {
  max-width: 650px;
  color: #eef5ee;
  font-size: 1.15rem;
}

.details-content {
  padding: 55px 0;
}

.info-card,
.reservation-card {
  background: white;
  border-radius: 26px;
  padding: 30px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.info-card h2,
.reservation-card h2 {
  color: #23462d;
  font-weight: 900;
  margin-bottom: 24px;
}

.info-card h3 {
  color: #23462d;
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.info-item {
  background: #f0f7f1;
  border-radius: 18px;
  padding: 18px;
  display: flex;
  gap: 14px;
}

.info-item span {
  font-size: 1.6rem;
}

.info-item strong {
  color: #23462d;
}

.info-item p {
  margin: 4px 0 0;
  color: #637268;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amenity-badge {
  background: #e8f6e9;
  color: #23462d;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
}

.description {
  color: #5f6f65;
  line-height: 1.7;
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

.login-reserve-btn {
  background: #e8f6e9;
  color: #23462d;
  border-radius: 15px;
  padding: 13px;
  font-weight: 800;
}

.reserve-btn {
  background: #23462d;
  color: white;
  border-radius: 15px;
  padding: 13px;
  font-weight: 800;
}

.reserve-btn:hover {
  background: #183321;
  color: white;
}

.price-preview {
  background: #f0f7f1;
  border-radius: 20px;
  padding: 18px;
  margin: 22px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-preview span {
  color: #637268;
}

.price-preview strong {
  color: #23462d;
  font-size: 2rem;
}

.price-preview small {
  color: #6d7c70;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
