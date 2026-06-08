<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { NajamOpreme, SelectItem } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')
const klijenti = ref<SelectItem[]>([])
const oprema = ref<SelectItem[]>([])
const rezervacije = ref<SelectItem[]>([])
const inicijalizacija = ref(true)
const statusi = ['Aktivan', 'Vraćen', 'Otkazan']

const najam = reactive({
  datum_najma: '',
  datum_povrata: '',
  kolicina: 1,
  status: 'Aktivan',
  klijent_id: '',
  oprema_id: '',
  rezervacija_id: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => jeUredivanje.value ? 'Uredi najam opreme' : 'Dodaj najam opreme')

async function dohvatiPodatke() {
  klijenti.value = await apiFetch<SelectItem[]>('/klijenti-dropdown')
  oprema.value = await apiFetch<SelectItem[]>('/oprema-dropdown')
}

async function dohvatiRezervacije() {
  if (!najam.klijent_id) {
    rezervacije.value = []
    return
  }

  rezervacije.value = await apiFetch<SelectItem[]>(`/rezervacije-dropdown?klijent_id=${najam.klijent_id}`)
}

async function dohvatiNajam() {
  if (!route.params.id) return
  loading.value = true
  try {
    Object.assign(najam, await apiFetch<NajamOpreme>(`/najmovi-opreme/${route.params.id}`))
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function spremiNajam() {
  loading.value = true
  greska.value = ''
  const url = jeUredivanje.value ? `/najmovi-opreme/${route.params.id}` : '/najmovi-opreme'
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  try {
    await apiFetch(url, { method, body: JSON.stringify(najam) })
    router.push('/najmovi-opreme')
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(async () => {
  await dohvatiPodatke()
  await dohvatiNajam()
  await dohvatiRezervacije()
  inicijalizacija.value = false
})

watch(() => najam.klijent_id, async () => {
  if (inicijalizacija.value) return
  najam.rezervacija_id = ''
  await dohvatiRezervacije()
})
</script>

<template>
  <v-card max-width="700">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="6">
          <v-select v-model="najam.klijent_id" :items="klijenti" label="Klijent" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="najam.oprema_id" :items="oprema" label="Oprema" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="najam.rezervacija_id" :items="rezervacije" label="Rezervacija" :disabled="!najam.klijent_id" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select v-model="najam.status" :items="statusi" label="Status" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="najam.datum_najma" label="Datum najma" type="date" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="najam.datum_povrata" label="Datum povrata" type="date" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="najam.kolicina" label="Količina" type="number" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/najmovi-opreme')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremiNajam">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
