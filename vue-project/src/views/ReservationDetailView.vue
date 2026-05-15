<template>
  <main class="reservation-detail-page">
    <div class="container py-5">
      <nav class="breadcrumb-box mb-4">
        <RouterLink :to="{ name: 'Reservations' }">Mes réservations</RouterLink>
        <span>›</span>
        <strong>Détail</strong>
      </nav>

      <section class="detail-card" v-if="reservation">
        <div class="detail-header">
          <div>
            <span class="status-badge" :class="statusClass(reservation?.status)">
              {{ statusLabel(reservation?.status) }}
            </span>

            <h1>{{ reservation?.campsite?.name }}</h1>

            <RouterLink
              :to="{ name: 'CampsiteDetails', params: { id: reservation?.campsite?._id } }"
              class="site-link"
            >
              Voir l’emplacement
            </RouterLink>
          </div>

          <div class="total-box">
            <span>Total</span>
            <strong>{{ reservation?.totalPrice }} $</strong>
          </div>
        </div>

        <div class="info-grid mt-4">
          <div class="info-pill">
            <span>📍</span>
            <div>
              <strong>Lieu</strong>
              <p>{{ reservation?.campsite?.location }}</p>
            </div>
          </div>

          <div class="info-pill">
            <span>🏕️</span>
            <div>
              <strong>Type</strong>
              <p>{{ reservation?.campsite?.type }}</p>
            </div>
          </div>

          <div class="info-pill">
            <span>📅</span>
            <div>
              <strong>Dates</strong>
              <p>
                {{ formatDate(reservation?.startDate) }} → {{ formatDate(reservation?.endDate) }}
              </p>
            </div>
          </div>

          <div class="info-pill">
            <span>🌙</span>
            <div>
              <strong>Durée</strong>
              <p>{{ nbNuits }} nuit(s)</p>
            </div>
          </div>

          <div class="info-pill">
            <span>👥</span>
            <div>
              <strong>Personnes</strong>
              <p>{{ reservation?.guests }}</p>
            </div>
          </div>

          <div class="info-pill" v-if="reservation?.vehicleLength">
            <span>🚐</span>
            <div>
              <strong>Longueur véhicule</strong>
              <p>{{ reservation?.vehicleLength }} pieds</p>
            </div>
          </div>
        </div>

        <div class="financial-box mt-4">
          <h2>Résumé financier</h2>

          <div class="financial-row">
            <span>{{ nbNuits }} nuit(s) × {{ reservation?.campsite?.pricePerNight }} $</span>
            <strong>{{ reservation?.totalPrice }} $</strong>
          </div>
        </div>

        <div class="actions-box mt-4">
          <h2>Actions disponibles</h2>

          <div class="d-flex gap-2 flex-wrap">
            <div class="d-flex gap-2 flex-wrap">
              <!-- UTILISATEUR -->

              <button
                v-if="!UserStore.isAdmin && reservation?.status === 'pending'"
                class="btn action-btn danger-action"
                @click="cancelReservation"
              >
                Annuler
              </button>

              <!-- ADMIN -->

              <div v-else-if="UserStore.isAdmin">
                <!-- pending -->

                <div v-if="reservation?.status === 'pending'">
                  <button class="btn action-btn success-action" @click="confirmReservation">
                    Confirmer
                  </button>

                  <button class="btn action-btn danger-action" @click="cancelReservation">
                    Annuler
                  </button>
                </div>

                <!-- confirmed -->

                <div v-else-if="reservation?.status === 'confirmed'">
                  <button class="btn action-btn warning-action" @click="pendingReservation">
                    Remettre en attente
                  </button>

                  <button class="btn action-btn danger-action" @click="cancelReservation">
                    Annuler
                  </button>
                </div>

                <!-- cancelled -->

                <div v-else-if="reservation?.status === 'cancelled'">
                  <button class="btn action-btn warning-action" @click="pendingReservation">
                    Remettre en attente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="client-box mt-4" v-if="UserStore.isAdmin">
          <h2>Informations du client</h2>

          <p>
            <strong>Nom :</strong>
            {{ reservation?.user?.firstName }} {{ reservation?.user?.lastName }}
          </p>

          <p>
            <strong>Courriel :</strong>
            {{ reservation?.user?.email }}
          </p>

          <p>
            <strong>Téléphone :</strong>
            {{ reservation?.user?.phone }}
          </p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { apiFetch } from '../Utils/ApiFetch'
import alert from '../stores/alert'
import auth from '../stores/auth'
const UserStore = auth()
const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés
const route = useRoute()
const reservation_id = route.params.id
let reservation = ref(null)
async function getReservationDetails() {
  const response = await apiFetch(`/reservations/${reservation_id}`, {
    method: 'GET',
  })
  console.log('Détails de la réservation récupérés :', response.data)
  reservation.value = response.data
}
onMounted(() => {
  try {
    getReservationDetails()
    AlertStore.hasError = false
    AlertStore.Message = 'Détails de la réservation chargés avec succès.'
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors du chargement des détails de la réservation.'
  }
})
const nbNuits = computed(() => {
  const start = new Date(reservation.value?.startDate)
  const end = new Date(reservation.value?.endDate)

  return Math.max((end - start) / (1000 * 60 * 60 * 24), 0)
})

function statusClass(status) {
  if (status === 'pending') return 'pending'
  if (status === 'confirmed') return 'confirmed'
  if (status === 'cancelled') return 'cancelled'
  return 'default-status'
}

function statusLabel(status) {
  if (status === 'pending') return 'En attente'
  if (status === 'confirmed') return 'Confirmée'
  if (status === 'cancelled') return 'Annulée'
  return status
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-CA')
}

async function cancelReservation() {
  try {
    await apiFetch(`/reservations/${reservation_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'cancelled',
      }),
    })
    AlertStore.hasError = false
    AlertStore.Message = 'Réservation annulée avec succès.'
    getReservationDetails() // Rafraîchir les détails de la réservation après l'annulation
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || "Erreur lors de l'annulation de la réservation."
  }
}
async function confirmReservation() {
  try {
    await apiFetch(`/reservations/${reservation_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'confirmed',
      }),
    })
    AlertStore.hasError = false
    AlertStore.Message = 'Réservation confirmée avec succès.'
    getReservationDetails() // Rafraîchir les détails de la réservation après la confirmation
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la confirmation de la réservation.'
  }
}
async function pendingReservation() {
  try {
    await apiFetch(`/reservations/${reservation_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'pending',
      }),
    })
    AlertStore.hasError = false
    AlertStore.Message = 'Réservation remise en attente avec succès.'
    getReservationDetails() // Rafraîchir les détails de la réservation après avoir remis en attente
  } catch (error) {
    AlertStore.hasError = true
    AlertStore.Message = error.message || 'Erreur lors de la remise en attente de la réservation.'
  }
}
</script>
<style scoped>
.reservation-detail-page {
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 60px;
}

/* ---------- BREADCRUMB ---------- */

.breadcrumb-box {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 0.95rem;
  font-weight: 600;
}

.breadcrumb-box a {
  color: #225522;
  text-decoration: none;
}

.breadcrumb-box a:hover {
  text-decoration: underline;
}

/* ---------- MAIN CARD ---------- */

.detail-card {
  background: rgba(255, 255, 255, 0.92);

  border-radius: 32px;

  padding: 40px;

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.08);
}

/* ---------- HEADER ---------- */

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;

  flex-wrap: wrap;
}

.detail-header h1 {
  margin-top: 18px;
  margin-bottom: 10px;

  font-size: 2.7rem;
  font-weight: 800;

  color: #1f2937;
}

.site-link {
  color: #225522;
  font-weight: 600;
  text-decoration: none;
}

.site-link:hover {
  text-decoration: underline;
}

/* ---------- STATUS BADGES ---------- */

.status-badge {
  display: inline-flex;
  align-items: center;

  padding: 10px 18px;

  border-radius: 999px;

  font-size: 0.9rem;
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

.default-status {
  background: rgba(108, 117, 125, 0.16);
  color: #495057;
}

/* ---------- TOTAL ---------- */

.total-box {
  min-width: 180px;

  padding: 22px;

  border-radius: 24px;

  background: linear-gradient(135deg, #225522, #2f6b2f);

  color: white;

  text-align: center;

  box-shadow: 0 15px 35px rgba(34, 85, 34, 0.25);
}

.total-box span {
  display: block;

  opacity: 0.82;

  margin-bottom: 8px;
}

.total-box strong {
  font-size: 2rem;
  font-weight: 800;
}

/* ---------- INFO GRID ---------- */

.info-grid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  gap: 22px;
}

.info-pill {
  display: flex;
  align-items: flex-start;
  gap: 18px;

  padding: 22px;

  border-radius: 22px;

  background: rgba(34, 85, 34, 0.05);

  border: 1px solid rgba(34, 85, 34, 0.08);

  transition: all 0.25s ease;
}

.info-pill:hover {
  transform: translateY(-3px);

  background: rgba(34, 85, 34, 0.08);
}

.info-pill span {
  font-size: 1.8rem;
}

.info-pill strong {
  display: block;

  color: #225522;

  margin-bottom: 4px;

  font-size: 1rem;
}

.info-pill p {
  margin: 0;

  color: #4b5563;
}

/* ---------- FINANCIAL BOX ---------- */

.financial-box {
  padding: 30px;

  border-radius: 28px;

  background: linear-gradient(135deg, rgba(34, 85, 34, 0.08), rgba(34, 85, 34, 0.03));
}

.financial-box h2 {
  margin-bottom: 25px;

  font-size: 1.8rem;
  font-weight: 800;

  color: #1f2937;
}

.financial-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 20px;

  flex-wrap: wrap;

  font-size: 1.15rem;
}

.financial-row strong {
  font-size: 1.7rem;

  color: #225522;
}

/* ---------- ACTIONS ---------- */

.actions-box {
  padding: 30px;

  border-radius: 28px;

  background: rgba(255, 255, 255, 0.7);

  border: 1px solid rgba(0, 0, 0, 0.05);
}

.actions-box h2 {
  margin-bottom: 24px;

  font-size: 1.8rem;
  font-weight: 800;
}

.action-btn {
  border: none;

  padding: 12px 20px;

  border-radius: 16px;

  font-weight: 700;

  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.success-action {
  background: #198754;
  color: white;
}

.success-action:hover {
  background: #157347;
}

.warning-action {
  background: #ffc107;
  color: #1f2937;
}

.warning-action:hover {
  background: #ffca2c;
}

.danger-action {
  background: #dc3545;
  color: white;
}

.danger-action:hover {
  background: #bb2d3b;
}

/* ---------- CLIENT ---------- */

.client-box {
  padding: 30px;

  border-radius: 28px;

  background: rgba(15, 23, 42, 0.04);
}

.client-box h2 {
  margin-bottom: 22px;

  font-size: 1.8rem;
  font-weight: 800;
}

.client-box p {
  margin-bottom: 10px;

  color: #374151;
}

/* ---------- RESPONSIVE ---------- */

@media (max-width: 768px) {
  .detail-card {
    padding: 28px;
  }

  .detail-header h1 {
    font-size: 2rem;
  }

  .financial-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
