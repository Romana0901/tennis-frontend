<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Rezervacija, SelectItem } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')
const klijenti = ref<SelectItem[]>([])
const tereni = ref<SelectItem[]>([])
const statusi = ['Potvrđena', 'Otkazana', 'Završena']
const sati = Array.from({ length: 24 }, (_, sat) => `${String(sat).padStart(2, '0')}:00`)
const trajanja = Array.from({ length: 5 }, (_, index) => {
  const minute = (index + 1) * 60
  const sati = index + 1
  return { title: `${sati} ${sati === 1 ? 'sat' : 'sata'}`, value: minute }
})

const rezervacija = reactive({
  datum: '',
  vrijeme_pocetka: '',
  trajanje: 60,
  status: 'Potvrđena',
  klijent_id: '',
  teren_id: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => jeUredivanje.value ? 'Uredi rezervaciju' : 'Dodaj rezervaciju')

async function dohvatiPodatke() {
  klijenti.value = await apiFetch<SelectItem[]>('/klijenti-dropdown')
  tereni.value = await apiFetch<SelectItem[]>('/tereni-dropdown')
}

async function dohvatiRezervaciju() {
  if (!route.params.id) return
  loading.value = true
  try {
    Object.assign(rezervacija, await apiFetch<Rezervacija>(`/rezervacije/${route.params.id}`))
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function spremiRezervaciju() {
  loading.value = true
  greska.value = ''
  const url = jeUredivanje.value ? `/rezervacije/${route.params.id}` : '/rezervacije'
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  try {
    await apiFetch(url, { method, body: JSON.stringify(rezervacija) })
    router.push('/rezervacije')
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(async () => {
  await dohvatiPodatke()
  await dohvatiRezervaciju()
})
</script>

<template>
  <v-card max-width="700">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="rezervacija.klijent_id" :items="klijenti" label="Klijent" prepend-inner-icon="mdi-account-outline" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="rezervacija.teren_id" :items="tereni" label="Teren" prepend-inner-icon="mdi-tennis" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="rezervacija.datum" label="Datum" type="date" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="rezervacija.vrijeme_pocetka" :items="sati" label="Vrijeme početka" prepend-inner-icon="mdi-clock-outline" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="rezervacija.trajanje" :items="trajanja" label="Trajanje" prepend-inner-icon="mdi-timer-outline" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="rezervacija.status" :items="statusi" label="Status" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/rezervacije')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremiRezervaciju">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
