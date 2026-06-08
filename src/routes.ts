import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const Pocetna = () => import('@/views/pages/Pocetna.vue')
const Klijenti = () => import('@/views/klijenti/Klijenti.vue')
const KlijentForma = () => import('@/views/klijenti/KlijentForma.vue')
const KlijentPregled = () => import('@/views/klijenti/KlijentPregled.vue')
const Tereni = () => import('@/views/tereni/Tereni.vue')
const TerenForma = () => import('@/views/tereni/TerenForma.vue')
const TerenPregled = () => import('@/views/tereni/TerenPregled.vue')
const OpremaLista = () => import('@/views/oprema/OpremaLista.vue')
const OpremaForma = () => import('@/views/oprema/OpremaForma.vue')
const OpremaPregled = () => import('@/views/oprema/OpremaPregled.vue')
const Rezervacije = () => import('@/views/rezervacije/Rezervacije.vue')
const RezervacijaForma = () => import('@/views/rezervacije/RezervacijaForma.vue')
const RezervacijaPregled = () => import('@/views/rezervacije/RezervacijaPregled.vue')
const NajmoviOpreme = () => import('@/views/najmovi/NajmoviOpreme.vue')
const NajamOpremeForma = () => import('@/views/najmovi/NajamOpremeForma.vue')
const NajamOpremePregled = () => import('@/views/najmovi/NajamOpremePregled.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Pocetna', component: Pocetna },
  { path: '/klijenti', name: 'Klijenti', component: Klijenti },
  { path: '/klijenti/dodaj', name: 'KlijentDodaj', component: KlijentForma },
  { path: '/klijenti/:id', name: 'KlijentPregled', component: KlijentPregled },
  { path: '/klijenti/:id/uredi', name: 'KlijentUredi', component: KlijentForma },
  { path: '/tereni', name: 'Tereni', component: Tereni },
  { path: '/tereni/dodaj', name: 'TerenDodaj', component: TerenForma },
  { path: '/tereni/:id', name: 'TerenPregled', component: TerenPregled },
  { path: '/tereni/:id/uredi', name: 'TerenUredi', component: TerenForma },
  { path: '/oprema', name: 'Oprema', component: OpremaLista },
  { path: '/oprema/dodaj', name: 'OpremaDodaj', component: OpremaForma },
  { path: '/oprema/:id', name: 'OpremaPregled', component: OpremaPregled },
  { path: '/oprema/:id/uredi', name: 'OpremaUredi', component: OpremaForma },
  { path: '/rezervacije', name: 'Rezervacije', component: Rezervacije },
  { path: '/rezervacije/dodaj', name: 'RezervacijaDodaj', component: RezervacijaForma },
  { path: '/rezervacije/:id', name: 'RezervacijaPregled', component: RezervacijaPregled },
  { path: '/rezervacije/:id/uredi', name: 'RezervacijaUredi', component: RezervacijaForma },
  { path: '/najmovi-opreme', name: 'NajmoviOpreme', component: NajmoviOpreme },
  { path: '/najmovi-opreme/dodaj', name: 'NajamOpremeDodaj', component: NajamOpremeForma },
  { path: '/najmovi-opreme/:id', name: 'NajamOpremePregled', component: NajamOpremePregled },
  { path: '/najmovi-opreme/:id/uredi', name: 'NajamOpremeUredi', component: NajamOpremeForma },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
