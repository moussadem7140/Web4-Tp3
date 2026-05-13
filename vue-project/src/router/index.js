import { createRouter, createWebHistory } from 'vue-router'
import alert from '../stores/alert'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import CampsitesView from '../views/CampsitesView.vue'
import CampsiteDetailsView from '../views/CampsiteDetailsView.vue'
import ProfileView from '../views/ProfileView.vue'
import ReservationDetailView from '../views/ReservationDetailView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import AdminCampsitesView from '../views/AdminCampsitesView.vue'
import AdminReservationsView from '../views/AdminReservationsView.vue'
import NotFound from '../views/NotFound.vue'
import auth from '../stores/auth'

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
router.beforeEach((to) => {
  const authStore = auth() // on doit l'instancier pour accéder à ses propriétés réactives
  const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/connexion', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !authStore.UserInfos.IsAdmin) {
    AlertStore.hasError = true
    AlertStore.Message = "Accès refusé (403) : vous n'êtes pas administrateur."
    return { path: '/' }
  }
})
//je vais eteindre toutes les alertes à chaque changement de page pour éviter les messages persistants
//on verra si ça marche
// router.afterEach(() => {
//   const AlertStore = alert() // on doit l'instancier pour accéder à ses propriétés réactives
//   AlertStore.hasError = false
//   AlertStore.Message = ''
// })
export default router
