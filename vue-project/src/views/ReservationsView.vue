<template>
  <section class="reservations-page container py-5">
    <div class="page-header mb-5">
      <span class="section-badge"> 📅 Historique des réservations </span>

      <h1 class="page-title">Mes réservations</h1>

      <p class="page-subtitle">Consultez vos réservations actives et votre historique.</p>
    </div>

    <div v-if="reservations.length === 0" class="empty-state">
      <div class="empty-icon">🏕️</div>

      <h3>Aucune réservation</h3>

      <p>Vous n'avez encore réservé aucun emplacement.</p>

      <RouterLink :to="{ name: 'Campsites' }" class="btn browse-btn">
        Explorer les emplacements
      </RouterLink>
    </div>

    <div v-else class="table-wrapper">
      <table class="table align-middle custom-table">
        <thead>
          <tr>
            <th>Emplacement</th>
            <th>Arrivée</th>
            <th>Départ</th>
            <th>Personnes</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="reservation in reservations" :key="reservation._id">
            <td>
              <div class="fw-semibold">
                {{ reservation.campsite.name }}
              </div>

              <small class="text-muted">
                {{ reservation.campsite.location }}
              </small>
            </td>

            <td>
              {{ formatDate(reservation.startDate) }}
            </td>

            <td>
              {{ formatDate(reservation.endDate) }}
            </td>

            <td>
              {{ reservation.guests }}
            </td>

            <td class="fw-bold">{{ reservation.totalPrice }} $</td>

            <td>
              <span class="status-badge" :class="statusClass(reservation.status)">
                {{ reservation.status }}
              </span>
            </td>

            <td>
              <div class="d-flex gap-2 flex-wrap">
                <RouterLink
                  :to="{
                    name: 'ReservationDetail',
                    params: { id: reservation._id },
                  }"
                  class="btn btn-sm details-btn"
                >
                  Voir
                </RouterLink>

                <button
                  v-if="reservation.status === 'pending'"
                  class="btn btn-sm cancel-btn"
                  @click="cancelReservation(reservation._id)"
                >
                  Annuler
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
const reservations = ref([])

onMounted(async () => {
  await getReservations()
  AlertStore.hasError = false
  AlertStore.Message = 'Réservations chargées avec succès.'
})
async function getReservations() {
  const response = await apiFetch('/reservations', {
    method: 'GET',
  })
  reservations.value = response.data
}
//j'arrive pas à mette directement, ça me met une erreur
function statusClass(status) {
  if (status === 'pending') {
    return 'pending'
  }

  if (status === 'confirmed') {
    return 'confirmed'
  }

  if (status === 'cancelled') {
    return 'cancelled'
  }

  return ''
}

async function cancelReservation(id) {
  await apiFetch(`/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'cancelled',
    }),
  })
  AlertStore.hasError = false
  AlertStore.Message = 'Réservation annulée avec succès.'
  await getReservations() // Rafraîchir la liste des réservations après l'annulation
}
//Pour formater les dates dans le tableau, vu  sur internet..
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-CA')
}
</script>

<style scoped>
.reservations-page {
  min-height: 100vh;
}

.page-header {
  text-align: center;
}

.section-badge {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(34, 85, 34, 0.12);
  color: #225522;
  font-weight: 600;
  margin-bottom: 20px;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1f2937;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.table-wrapper {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 28px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.custom-table thead th {
  border-bottom: none;
  color: #225522;
  font-weight: 700;
}

.custom-table tbody tr {
  vertical-align: middle;
}

.custom-table tbody tr:hover {
  background: rgba(34, 85, 34, 0.05);
}

.status-badge {
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
}

.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.confirmed {
  background: rgba(25, 135, 84, 0.18);
  color: #146c43;
}

.cancelled {
  background: rgba(220, 53, 69, 0.18);
  color: #b02a37;
}

.details-btn {
  border-radius: 12px;
  padding: 8px 16px;
  border: 1px solid #225522;
  color: #225522;
  font-weight: 600;
}

.details-btn:hover {
  background: #225522;
  color: white;
}

.cancel-btn {
  border-radius: 12px;
  padding: 8px 16px;
  font-weight: 600;
  border: none;
  background: rgba(220, 53, 69, 0.15);
  color: #b02a37;
}

.cancel-btn:hover {
  background: #dc3545;
  color: white;
}

.empty-state {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  padding: 70px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.browse-btn {
  margin-top: 20px;
  background: #225522;
  color: white;
  border-radius: 14px;
  padding: 12px 24px;
  font-weight: 600;
}

.browse-btn:hover {
  background: #1a421a;
  color: white;
}
</style>
