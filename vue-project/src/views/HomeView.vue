<template>
  <main class="home-page">
    <section class="hero-section">
      <div class="hero-overlay"></div>

      <div class="container hero-content">
        <span class="hero-badge">🏕️ Bienvenue à CampXplore</span>

        <h1>
          Explorez le plein air,
          <br />
          réservez votre aventure.
        </h1>

        <p>
          Trouvez l’emplacement parfait pour votre prochaine escapade : tente, VR, chalet, glamping
          ou arrière-pays.
        </p>
      </div>
    </section>

    <section class="search-section">
      <div class="container">
        <div class="search-card">
          <h2>Rechercher une disponibilité</h2>
          <p class="search-subtitle">
            Entrez vos critères pour trouver les emplacements disponibles.
          </p>

          <form class="row g-3" novalidate @submit.prevent="Rechercher">
            <!-- /* Les deux !! me permettent de convertir la valeur en booléen pour l'attribut
            aria-invalid, comme j'utilise une string -->
            <div class="col-12 col-md-6 col-lg-3">
              <label class="form-label" for="DateArrivee">Date d’arrivée</label>
              <input
                id="DateArrivee"
                type="date"
                class="form-control custom-input"
                v-model="DateArrivee"
                :aria-invalid="!!errors.DateArrivee"
                :aria-describedby="DateArriveeError"
              />
              <span class="text-danger" v-show="errors.DateArrivee" id="DateArriveeError">{{
                errors.DateArrivee
              }}</span>
            </div>

            <div class="col-12 col-md-6 col-lg-3">
              <label class="form-label" for="dateDepart">Date de départ</label>

              <input
                type="date"
                class="form-control custom-input"
                id="dateDepart"
                v-model="DateDepart"
                :aria-invalid="!!errors.DateDepart"
                :aria-describedby="DateDepartError"
              />
              <span class="text-danger" v-show="errors.DateDepart" id="DateDepartError">{{
                errors.DateDepart
              }}</span>
            </div>

            <div class="col-12 col-md-6 col-lg-3">
              <label class="form-label" for="NbPerson">Nombre de personnes</label>
              <input
                id="NbPerson"
                type="number"
                class="form-control custom-input"
                placeholder="Ex: 4"
                v-model.number="NombrePersonnes"
                :aria-invalid="!!errors.NombrePersonnes"
                :aria-describedby="NombrePersonnesError"
              />
              <span class="text-danger" v-show="errors.NombrePersonnes" id="NombrePersonnesError">{{
                errors.NombrePersonnes
              }}</span>
            </div>

            <div class="col-12 col-md-6 col-lg-3">
              <label class="form-label" for="TypeEmplacement">Type d’emplacement</label>
              <select
                class="form-select custom-input"
                id="TypeEmplacement"
                v-model="TypeEmplacement"
              >
                <option value="">Tous les types</option>
                <option value="tente">Tente</option>
                <option value="vr">VR</option>
                <option value="chalet">Chalet</option>
                <option value="glamping">Glamping</option>
                <option value="arrière-pays">Arrière-pays</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div class="col-12 d-flex justify-content-end mt-4">
              <button class="btn search-btn" type="submit">Rechercher</button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <section class="results-section">
      <div class="container">
        <div class="results-header">
          <div>
            <h2>Emplacements disponibles</h2>
          </div>
          <span class="results-count">{{ NbEmplacement }}</span>
        </div>
        <div v-if="NbEmplacement !== 0" class="row g-4">
          <div
            v-for="emplacement in Emplacements"
            :key="emplacement.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <EmplacementCard :campsite="emplacement" />
          </div>
        </div>
        <div v-else class="empty-state">
          <div class="empty-icon">🌲</div>
          <p>Aucun emplacement trouvé pour les critères sélectionnés.</p>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup>
import EmplacementCard from '../components/CampsiteCard.vue'
import { reactive, ref } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
const DateArrivee = ref('')
const DateDepart = ref('')
const NombrePersonnes = ref('')
const TypeEmplacement = ref('')
const Emplacements = ref([])
const NbEmplacement = ref(0)
const errors = reactive({})
async function Rechercher() {
  if (validateSearch()) {
    let url = `/campsites/available?startDate=${DateArrivee.value}&endDate=${DateDepart.value}`
    if (NombrePersonnes.value) {
      url += `&guests=${NombrePersonnes.value}`
    }
    if (TypeEmplacement.value) {
      url += `&type=${TypeEmplacement.value}`
    }
    let response
    try {
      console.log('URL finale:', url)
      response = await apiFetch(url, { method: 'GET' })
      Emplacements.value = response.data
      NbEmplacement.value = response.data.length
      AlertStore.hasError = false
      AlertStore.Message = 'Emplacements trouvés avec succès'
    } catch (error) {
      AlertStore.hasError = true
      AlertStore.Message =
        error.message || 'Une erreur est survenue lors de la recherche des emplacements.'
    }
  }
}
// ecouter l'url et relancer la recherche si les paramètres changent, pour que les résultats soient partageables via l'url

function validateSearch() {
  let isValid = true
  errors.DateArrivee = ''
  errors.DateDepart = ''

  if (!DateArrivee.value) {
    errors.DateArrivee = 'La date d’arrivée est requise.'
    isValid = false
  } else if (DateArrivee.value < new Date().toISOString().split('T')[0]) {
    errors.DateArrivee = 'La date d’arrivée doit être aujourd’hui ou dans le futur.'
    isValid = false
  }
  if (!DateDepart.value) {
    errors.DateDepart = 'La date de départ est requise.'
    isValid = false
  } else if (DateArrivee.value && DateDepart.value && DateDepart.value <= DateArrivee.value) {
    errors.DateDepart = 'La date de départ doit être après la date d’arrivée.'
    isValid = false
  }
  return isValid
}
</script>
<style scoped>
.home-page {
  background: #f7f5ef;
  min-height: 100vh;
}

.hero-section {
  position: relative;
  min-height: 430px;
  display: flex;
  align-items: center;
  background:
    linear-gradient(rgba(21, 44, 28, 0.55), rgba(21, 44, 28, 0.75)),
    url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee');
  background-size: cover;
  background-position: center;
  color: white;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 70px 15px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: clamp(2.4rem, 5vw, 4.6rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero-content p {
  max-width: 650px;
  font-size: 1.15rem;
  color: #edf4ed;
}

.search-section {
  margin-top: -70px;
  position: relative;
  z-index: 3;
}

.search-card {
  background: white;
  border-radius: 26px;
  padding: 32px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.14);
}

.search-card h2,
.results-header h2 {
  color: #23462d;
  font-weight: 800;
}

.search-subtitle,
.results-header p {
  color: #6d7c70;
}

.form-label {
  font-weight: 700;
  color: #2f4f38;
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

.search-btn {
  background: #23462d;
  color: white;
  border-radius: 14px;
  padding: 12px 28px;
  font-weight: 700;
}

.search-btn:hover {
  background: #183321;
  color: white;
}

.results-section {
  padding: 60px 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}

.results-count {
  background: #e8f6e9;
  color: #24522d;
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
}

.empty-state {
  background: white;
  border: 2px dashed #cddccc;
  border-radius: 24px;
  text-align: center;
  padding: 55px 25px;
  color: #526b58;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-state h3 {
  color: #23462d;
  font-weight: 800;
}

@media (max-width: 768px) {
  .search-card {
    padding: 24px;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
