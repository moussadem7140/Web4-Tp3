import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: LoginView,
    },
    {
      path: '/campsites',
      name: 'Campsites',
      component: CampsitesView,
    },
    {
      path: '/campsite/:id',
      name: 'CampsiteDetails',
      component: CampsiteDetailsView,
    },

    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
      // Page protégée, il faut être connecté pour y accéder
      meta: { requiresAuth: true },
    },

    {
      path: '/reservation/:id',
      name: 'ReservationDetail',
      component: ReservationDetailView,
      // Page protégée, il faut être connecté pour y accéder
      meta: { requiresAuth: true },
    },
    {
      path: '/reservations',
      name: 'Reservations',
      component: ReservationsView,
      // Page protégée, il faut être connecté pour y accéder
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/campsites',
      name: 'AdminCampsites',
      component: AdminCampsitesView,
      // Page protégée, il faut être connecté et être admin pour y accéder
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/reservations',
      name: 'AdminReservations',
      component: AdminReservationsView,
      // Page protégée, il faut être connecté et être admin pour y accéder
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    { path: '/:notFound(.*)', component: NotFound },
  ],
})

export default router
