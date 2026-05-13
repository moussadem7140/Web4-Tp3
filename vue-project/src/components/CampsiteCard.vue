<template>
  <div class="card campsite-card h-100">
    <div class="image-container">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        class="card-img-top"
        alt="Camping"
      />

      <span class="badge campsite-badge">
        {{ campsite.type }}
      </span>
    </div>

    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 class="card-title mb-1">
            {{ campsite.name }}
          </h5>

          <p class="location-text mb-0">📍 {{ campsite.location }}</p>
        </div>

        <div class="price-box">
          <span class="price"> {{ campsite.pricePerNight }}$ </span>

          <small class="night-text"> / nuit </small>
        </div>
      </div>

      <p class="description-text">
        {{ campsite.description }}
      </p>

      <div class="infos-row">
        <div class="info-pill">👥 {{ campsite.capacity }} places</div>

        <div v-for="amenity in campsite.amenities" :key="amenity" class="info-pill">
          {{ amenityIcon(amenity) }}
          {{ amenity }}
        </div>
      </div>

      <RouterLink
        :to="{ name: 'CampsiteDetails', params: { id: campsite.id } }"
        class="details-btn mt-auto text-center custom-link"
        >Réserver</RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  campsite: {
    type: Object,
    required: true,
  },
})

const amenityIcon = (amenity) => {
  switch (amenity.toLowerCase()) {
    case 'électricité':
      return '⚡'

    case 'eau':
      return '🚿'

    case 'wifi':
      return '📶'

    case 'feu':
      return '🔥'

    default:
      return '🏕️'
  }
}
</script>

<style scoped>
.campsite-card {
  border: none;
  border-radius: 24px;
  overflow: hidden;

  background: #ffffff;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);

  transition: 0.35s;
}

.campsite-card:hover {
  transform: translateY(-8px);

  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14);
}

.image-container {
  position: relative;
}

.card-img-top {
  height: 230px;
  object-fit: cover;
}

.campsite-badge {
  position: absolute;

  top: 15px;
  right: 15px;

  background: rgba(33, 70, 45, 0.92);

  color: white;

  border-radius: 999px;

  padding: 10px 14px;

  font-size: 0.8rem;
  font-weight: 600;

  text-transform: capitalize;
}

.card-body {
  padding: 1.4rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #23462d;
}

.location-text {
  color: #64816c;
  font-weight: 500;
}

.price-box {
  text-align: right;
}

.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #23462d;
}

.night-text {
  color: #7d7d7d;
}

.description-text {
  color: #5f5f5f;

  margin-top: 12px;
  margin-bottom: 18px;

  line-height: 1.5;
}

.infos-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-bottom: 20px;
}

.info-pill {
  background: #eef6ef;

  color: #2d5737;

  padding: 8px 12px;

  border-radius: 999px;

  font-size: 0.85rem;
  font-weight: 600;
}

.details-btn {
  background: #23462d;
  color: white;

  border-radius: 14px;

  padding: 10px;

  font-weight: 600;

  transition: 0.3s;
}

.details-btn:hover {
  background: #183321;
  color: white;
}
</style>
