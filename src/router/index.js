import { createRouter, createWebHistory } from 'vue-router'
import { useClimateStore } from '@/stores/climateStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Inici' }
    },
    {
      path: '/punts',
      name: 'tipping-points',
      component: () => import('@/views/TippingPointsView.vue'),
      meta: { title: "Punts d'Inflexió" }
    },
    {
      path: '/dades',
      name: 'data',
      component: () => import('@/views/DataView.vue'),
      meta: { title: 'Dades' }
    },
    {
      path: '/dades/:indicator',
      name: 'data-detail',
      component: () => import('@/views/DataView.vue'),
      meta: { title: 'Indicador Climàtic' }
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'Sobre el projecte' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Guard: actualitza títol i inicialitza la store
router.beforeEach((to) => {
  document.title = `${to.meta.title ?? 'Pàgina'} Punts d'Inflexió`

  const store = useClimateStore()
  if (!store.isInitialized) {
    store.initialize()
  }
})

export default router