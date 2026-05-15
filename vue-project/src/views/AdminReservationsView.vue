<template>
  <main class="admin-page">
    <div class="container py-5">
      <div class="admin-header mb-4">
        <div>
          <span class="admin-badge">Administration</span>
          <h1>Gestion des réservations</h1>
          <p>Consulter, filtrer et modifier le statut des réservations.</p>
        </div>
      </div>

      <div class="filter-card mb-4">
        <label class="form-label" for="statusFilter">Filtrer par statut</label>

        <div class="d-flex gap-2 flex-wrap">
          <select id="statusFilter" class="form-select custom-input" v-model="statusFilter">
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>

          <button class="btn reset-btn" @click="resetFilter">Réinitialiser</button>
        </div>
      </div>

      <div class="table-card">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>Client</th>
              <th>Emplacement</th>
              <th>Arrivée</th>
              <th>Départ</th>
              <th>Personnes</th>
              <th>Total</th>
              <th>Statut</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="reservation in filteredReservations" :key="reservation._id">
              <td>
                <strong>
                  {{ reservation.user?.firstName }} {{ reservation.user?.lastName }}
                </strong>
                <br />
                <small class="text-muted">{{ reservation.user?.email }}</small>
              </td>

              <td>{{ reservation.campsite?.name }}</td>
              <td>{{ formatDate(reservation.startDate) }}</td>
              <td>{{ formatDate(reservation.endDate) }}</td>
              <td>{{ reservation.guests }}</td>
              <td class="fw-bold">{{ reservation.totalPrice }} $</td>

              <td>
                <span class="status-badge" :class="statusClass(reservation.status)">
                  {{ statusLabel(reservation.status) }}
                </span>
              </td>

              <td class="text-end">
                <RouterLink
                  :to="{ name: 'ReservationDetail', params: { id: reservation._id } }"
                  class="btn btn-sm details-btn me-2"
                >
                  Voir
                </RouterLink>

                <button
                  v-if="reservation.status === 'pending'"
                  class="btn btn-sm confirm-btn me-2"
                  @click="confirmReservation(reservation)"
                >
                  Confirmer
                </button>

                <button
                  v-if="reservation.status !== 'cancelled'"
                  class="btn btn-sm cancel-btn"
                  @click="cancelReservation(reservation)"
                >
                  Annuler
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredReservations.length === 0" class="empty-state">
          Aucune réservation trouvée.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'

const AlertStore = alert()

const reservations = ref([])
const statusFilter = ref('')

onMounted(() => {
  loadReservations()
})

const filteredReservations = computed(() => {
  if (!statusFilter.value) {
    return reservations.value
  }

  return reservations.value.filter((reservation) => reservation.status === statusFilter.value)
})

async function loadReservations() {
  try {
    const response = await apiFetch('/reservations', {
      method: 'GET',
    })

    reservations.value = response.data
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors du chargement des réservations.'
  }
}

function resetFilter() {
  statusFilter.value = ''
}

async function confirmReservation(reservation) {
  try {
    await apiFetch(`/reservations/${reservation._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' }),
    })
    loadReservations()

    AlertStore.hasError = false
    AlertStore.Message = 'Réservation confirmée avec succès.'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la confirmation.'
  }
}

async function cancelReservation(reservation) {
  try {
    await apiFetch(`/reservations/${reservation._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    })
    loadReservations() // Recharger les réservations pour refléter le changement de statut
    AlertStore.hasError = false
    AlertStore.Message = 'Réservation annulée avec succès.'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de l’annulation.'
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-CA')
}

function statusClass(status) {
  if (status === 'pending') return 'pending'
  if (status === 'confirmed') return 'confirmed'
  if (status === 'cancelled') return 'cancelled'
  return ''
}

function statusLabel(status) {
  if (status === 'pending') return 'En attente'
  if (status === 'confirmed') return 'Confirmée'
  if (status === 'cancelled') return 'Annulée'
  return status
}
</script>
<style scoped>
.status-badge {
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 800;
}

.pending {
  background: #fff3cd;
  color: #856404;
}

.confirmed {
  background: #d1e7dd;
  color: #146c43;
}

.cancelled {
  background: #f8d7da;
  color: #b02a37;
}

.filter-card {
  background: white;
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.reset-btn,
.details-btn {
  background: #e8f6e9;
  color: #23462d;
  border-radius: 12px;
  font-weight: 700;
}

.confirm-btn {
  background: #198754;
  color: white;
  border-radius: 12px;
  font-weight: 700;
}

.cancel-btn {
  background: #dc3545;
  color: white;
  border-radius: 12px;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 35px;
  color: #6d7c70;
  font-weight: 700;
}
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
