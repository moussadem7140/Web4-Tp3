<template>
  <main class="admin-page">
    <div class="container py-5">
      <div class="admin-header mb-4">
        <div>
          <span class="admin-badge"> Administration</span>
          <h1>Gestion des emplacements</h1>
          <p>Créer, modifier et supprimer les emplacements du camping.</p>
        </div>

        <button
          class="btn add-btn"
          data-bs-toggle="modal"
          data-bs-target="#campsiteModal"
          @click="openCreateModal"
        >
          + Ajouter
        </button>
      </div>

      <div class="table-card">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Lieu</th>
              <th>Type</th>
              <th>Prix/nuit</th>
              <th>Capacité</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="camp in campsites" :key="camp._id">
              <td class="fw-bold">{{ camp.name }}</td>
              <td>{{ camp.location }}</td>
              <td>
                <span class="type-badge">{{ camp.type }}</span>
              </td>
              <td>{{ camp.pricePerNight }} $</td>
              <td>{{ camp.capacity }}</td>

              <td class="text-end">
                <button
                  class="btn btn-sm edit-btn me-2"
                  data-bs-toggle="modal"
                  data-bs-target="#campsiteModal"
                  @click="openEditModal(camp)"
                >
                  Modifier
                </button>

                <button
                  class="btn btn-sm delete-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#deleteModal"
                  @click="selectedCampsite = camp"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODALE AJOUT / MODIFICATION -->
    <div class="modal fade" id="campsiteModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Modifier un emplacement' : 'Ajouter un emplacement' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <form @submit.prevent="saveCampsite" novalidate>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12 col-md-6">
                  <label class="form-label" for="name">Nom</label>
                  <input
                    id="name"
                    class="form-control custom-input"
                    v-model="form.name"
                    :aria-invalid="!!errors.name"
                    aria-describedby="nameError"
                  />
                  <span id="nameError" class="text-danger" v-if="errors.name">
                    {{ errors.name }}
                  </span>
                </div>

                <div class="col-12 col-md-6">
                  <label class="form-label" for="location">Lieu</label>
                  <input
                    id="location"
                    class="form-control custom-input"
                    v-model="form.location"
                    :aria-invalid="!!errors.location"
                    aria-describedby="locationError"
                  />
                  <span id="locationError" class="text-danger" v-if="errors.location">
                    {{ errors.location }}
                  </span>
                </div>

                <div class="col-12">
                  <label class="form-label" for="description">Description</label>
                  <textarea
                    id="description"
                    class="form-control custom-input"
                    rows="3"
                    v-model="form.description"
                  ></textarea>
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label" for="type">Type</label>
                  <select id="type" class="form-select custom-input" v-model="form.type">
                    <option value="tente">Tente</option>
                    <option value="vr">VR</option>
                    <option value="chalet">Chalet</option>
                    <option value="glamping">Glamping</option>
                    <option value="arrière-pays">Arrière-pays</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label" for="price">Prix/nuit</label>
                  <input
                    id="price"
                    type="number"
                    class="form-control custom-input"
                    v-model.number="form.pricePerNight"
                    :aria-invalid="!!errors.pricePerNight"
                    aria-describedby="pricePerNightError"
                  />
                  <span id="pricePerNightError" class="text-danger" v-if="errors.pricePerNight">
                    {{ errors.pricePerNight }}
                  </span>
                </div>

                <div class="col-12 col-md-4">
                  <label class="form-label" for="capacity">Capacité</label>
                  <input
                    id="capacity"
                    type="number"
                    class="form-control custom-input"
                    v-model.number="form.capacity"
                    :aria-invalid="!!errors.capacity"
                    aria-describedby="capacityError"
                  />
                  <span id="capacityError" class="text-danger" v-if="errors.capacity">
                    {{ errors.capacity }}
                  </span>
                </div>

                <div class="col-12 col-md-6" v-if="form.type === 'vr'">
                  <label class="form-label" for="maxVehicleLength"> Longueur max véhicule </label>
                  <input
                    id="maxVehicleLength"
                    type="number"
                    class="form-control custom-input"
                    v-model.number="form.maxVehicleLength"
                    :aria-invalid="!!errors.maxVehicleLength"
                    aria-describedby="maxVehicleLengthError"
                  />
                  <span
                    id="maxVehicleLengthError"
                    class="text-danger"
                    v-if="errors.maxVehicleLength"
                  >
                    {{ errors.maxVehicleLength }}
                  </span>
                </div>

                <div class="col-12">
                  <label class="form-label">Équipements</label>

                  <div class="amenities-box">
                    <label v-for="amenity in amenitiesOptions" :key="amenity" class="amenity-check">
                      <input type="checkbox" :value="amenity" v-model="form.amenities" />
                      {{ amenity }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn cancel-modal-btn" data-bs-dismiss="modal">
                Annuler
              </button>
              <button type="submit" class="btn save-modal-btn">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- MODALE SUPPRESSION -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <h5 class="modal-title text-danger">Confirmer la suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <p>
              Voulez-vous vraiment supprimer
              <strong>{{ selectedCampsite?.name }}</strong> ?
            </p>
            <p class="warning-text">Cette action est irréversible.</p>
          </div>

          <div class="modal-footer">
            <button class="btn cancel-modal-btn" data-bs-dismiss="modal">Annuler</button>
            <button class="btn delete-confirm-btn" @click="deleteCampsite">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'

const AlertStore = alert()

const campsites = ref([])
const selectedCampsite = ref(null)
const isEditing = ref(false)

const errors = reactive({
  name: '',
  location: '',
  pricePerNight: '',
  capacity: '',
  maxVehicleLength: '',
})

const amenitiesOptions = [
  'électricité',
  'eau',
  'wifi',
  'douche',
  'toilettes',
  'feu de camp',
  'table de pique-nique',
  'égout',
]

const form = reactive({
  name: '',
  location: '',
  description: '',
  type: 'tente',
  pricePerNight: 0,
  capacity: 1,
  maxVehicleLength: null,
  amenities: [],
})

onMounted(() => {
  loadCampsites()
})

async function loadCampsites() {
  try {
    const response = await apiFetch('/campsites', {
      method: 'GET',
    })

    campsites.value = response.data
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors du chargement des emplacements.'
  }
}

function resetErrors() {
  errors.name = ''
  errors.location = ''
  errors.pricePerNight = ''
  errors.capacity = ''
  errors.maxVehicleLength = ''
}

function validateForm() {
  resetErrors()

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Le nom est requis.'
    isValid = false
  }

  if (!form.location.trim()) {
    errors.location = 'Le lieu est requis.'
    isValid = false
  }

  if (form.pricePerNight === null || form.pricePerNight === '' || form.pricePerNight < 0) {
    errors.pricePerNight = 'Le prix doit être supérieur ou égal à 0.'
    isValid = false
  }

  if (!form.capacity || form.capacity < 1) {
    errors.capacity = 'La capacité doit être au moins 1.'
    isValid = false
  }

  if (
    form.type === 'vr' &&
    form.maxVehicleLength !== null &&
    form.maxVehicleLength !== '' &&
    form.maxVehicleLength < 1
  ) {
    errors.maxVehicleLength = 'La longueur maximale doit être au moins 1.'
    isValid = false
  }

  return isValid
}

function resetForm() {
  form.name = ''
  form.location = ''
  form.description = ''
  form.type = 'tente'
  form.pricePerNight = 0
  form.capacity = 1
  form.maxVehicleLength = null
  form.amenities = []

  selectedCampsite.value = null
  isEditing.value = false
  resetErrors()
}

function openCreateModal() {
  resetForm()
}

function openEditModal(camp) {
  resetErrors()

  selectedCampsite.value = camp
  isEditing.value = true

  form.name = camp.name
  form.location = camp.location
  form.description = camp.description
  form.type = camp.type
  form.pricePerNight = camp.pricePerNight
  form.capacity = camp.capacity
  form.maxVehicleLength = camp.maxVehicleLength || null
  form.amenities = [...camp.amenities]
}

async function saveCampsite() {
  if (!validateForm()) {
    return
  }

  try {
    const body = {
      name: form.name,
      location: form.location,
      description: form.description,
      type: form.type,
      pricePerNight: form.pricePerNight,
      capacity: form.capacity,
      amenities: form.amenities,
    }

    if (form.type === 'vr') {
      body.maxVehicleLength = form.maxVehicleLength
    }

    if (isEditing.value) {
      await apiFetch(`/campsites/${selectedCampsite.value._id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      })

      AlertStore.Message = 'Emplacement modifié avec succès.'
    } else {
      await apiFetch('/campsites', {
        method: 'POST',
        body: JSON.stringify(body),
      })

      AlertStore.Message = 'Emplacement ajouté avec succès.'
    }

    AlertStore.hasError = false
    await loadCampsites()
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de l’enregistrement.'
  }
}

function openDeleteModal(camp) {
  selectedCampsite.value = camp
}

async function deleteCampsite() {
  try {
    await apiFetch(`/campsites/${selectedCampsite.value._id}`, {
      method: 'DELETE',
    })

    AlertStore.hasError = false
    AlertStore.Message = 'Emplacement supprimé avec succès.'

    await loadCampsites()
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la suppression.'
  }
}
</script>
<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f7f5ef;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.admin-badge {
  display: inline-block;
  background: #e8f6e9;
  color: #23462d;
  padding: 9px 16px;
  border-radius: 999px;
  font-weight: 800;
  margin-bottom: 12px;
}

.admin-header h1 {
  color: #23462d;
  font-weight: 900;
}

.admin-header p {
  color: #6d7c70;
}

.table-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.type-badge {
  background: #e8f6e9;
  color: #23462d;
  padding: 7px 13px;
  border-radius: 999px;
  font-weight: 700;
}

.add-btn,
.save-modal-btn {
  background: #23462d;
  color: white;
  border-radius: 14px;
  font-weight: 800;
  padding: 11px 20px;
}

.add-btn:hover,
.save-modal-btn:hover {
  background: #183321;
  color: white;
}

.edit-btn {
  background: #e8f6e9;
  color: #23462d;
  border-radius: 12px;
  font-weight: 700;
}

.edit-btn:hover {
  background: #d6ecd9;
  color: #183321;
}

.delete-btn,
.delete-confirm-btn {
  background: #dc3545;
  color: white;
  border-radius: 12px;
  font-weight: 700;
}

.delete-btn:hover,
.delete-confirm-btn:hover {
  background: #bb2d3b;
  color: white;
}

.cancel-modal-btn {
  background: #e9ecef;
  border-radius: 12px;
  font-weight: 700;
}

.custom-modal {
  border-radius: 24px;
  border: none;
}

.custom-input {
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid #d8dfd7;
}

.form-label {
  color: #23462d;
  font-weight: 700;
}

.amenities-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.amenity-check {
  background: #f0f7f1;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  color: #23462d;
}

.warning-text {
  color: #b02a37;
  font-weight: 700;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-card {
    overflow-x: auto;
  }
}
</style>
