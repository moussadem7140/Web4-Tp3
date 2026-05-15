<template>
  <main class="campsites-page">
    <section class="page-header">
      <div class="container">
        <span class="page-badge">🏕️ Nos emplacements</span>

        <h1>Choisissez votre prochain terrain d’aventure</h1>

        <p>Explorez tous les emplacements disponibles et filtrez selon le type recherché.</p>
      </div>
    </section>

    <section class="container content-section">
      <div class="toolbar-card">
        <div>
          <h2>Liste des emplacements</h2>
          <p>{{ Emplacements.length }} emplacement(s) trouvé(s)</p>
        </div>

        <div class="filters">
          <select class="form-select custom-select" v-model="type">
            <option value="">Tous les types</option>
            <option value="tente">Tente</option>
            <option value="vr">VR</option>
            <option value="chalet">Chalet</option>
            <option value="glamping">Glamping</option>
            <option value="arrière-pays">Arrière-pays</option>
            <option value="autre">Autres</option>
          </select>

          <button class="btn reset-btn" @click="resetFilters">Réinitialiser</button>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <div
          v-for="emplacement in Emplacements"
          :key="emplacement.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <EmplacementCard :campsite="emplacement" />
        </div>
      </div>
      <div class="empty-state" v-if="Emplacements.length === 0">
        <div class="empty-icon">🌲</div>
        <h3>Aucun emplacement trouvé</h3>
        <p>Essayez de modifier le filtre ou de réinitialiser la recherche.</p>
      </div>
    </section>
  </main>
</template>
<script setup>
import EmplacementCard from '../components/CampsiteCard.vue'
import { onMounted, ref, watch } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
const Emplacements = ref([]) // Ceci devrait être rempli avec les données réelles des emplacements
const type = ref('')
async function getCampsites() {
  let url = `/campsites`
  if (type.value) {
    url += `?type=${type.value}`
  }
  let response
  try {
    response = await apiFetch(url, { method: 'GET' })
    Emplacements.value = response.data
    AlertStore.hasError = false
    AlertStore.Message = 'Emplacements trouvés avec succès'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message =
      error.message || 'Une erreur est survenue lors de la recherche des emplacements.'
  }
}
watch(
  type,
  () => {
    getCampsites()
  },
  { immediate: true },
)
onMounted(() => {
  getCampsites()
})
const resetFilters = () => {
  type.value = ''
}
</script>
<style scoped>
.campsites-page {
  min-height: 100vh;
  background: #f7f5ef;
}

.page-header {
  background:
    linear-gradient(rgba(21, 44, 28, 0.72), rgba(21, 44, 28, 0.82)),
    url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 85px 0;
}

.page-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 10px 18px;
  border-radius: 999px;
  font-weight: 700;
  margin-bottom: 18px;
}

.page-header h1 {
  font-size: clamp(2.2rem, 4vw, 4rem);
  font-weight: 900;
  max-width: 850px;
}

.page-header p {
  max-width: 650px;
  color: #eef5ee;
  font-size: 1.1rem;
}

.content-section {
  padding: 45px 0 70px;
}

.toolbar-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.toolbar-card h2 {
  color: #23462d;
  font-weight: 900;
  margin-bottom: 5px;
}

.toolbar-card p {
  color: #6d7c70;
  margin: 0;
}

.filters {
  display: flex;
  gap: 12px;
  align-items: center;
}

.custom-select {
  min-width: 210px;
  border-radius: 14px;
  padding: 11px 14px;
  border: 1px solid #d8dfd7;
}

.custom-select:focus {
  border-color: #6ba368;
  box-shadow: 0 0 0 0.2rem rgba(107, 163, 104, 0.2);
}

.reset-btn {
  background: #e8f6e9;
  color: #23462d;
  border-radius: 14px;
  padding: 11px 18px;
  font-weight: 800;
}

.reset-btn:hover {
  background: #d6ecd9;
  color: #183321;
}

.empty-state {
  margin-top: 35px;
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
  font-weight: 900;
}

@media (max-width: 768px) {
  .toolbar-card {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .custom-select,
  .reset-btn {
    width: 100%;
  }
}
</style>
