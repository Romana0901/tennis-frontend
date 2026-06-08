<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Oprema } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')
const kategorije = ['Reket', 'Loptice', 'Obuća', 'Torba', 'Dodaci']

const oprema = reactive({
  naziv: '',
  kategorija: '',
  ukupna_kolicina: '',
  dostupna_kolicina: '',
  cijena_najma: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => jeUredivanje.value ? 'Uredi opremu' : 'Dodaj opremu')

async function dohvatiOpremu() {
  if (!route.params.id) return
  loading.value = true
  try {
    Object.assign(oprema, await apiFetch<Oprema>(`/oprema/${route.params.id}`))
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function spremiOpremu() {
  loading.value = true
  greska.value = ''
  const url = jeUredivanje.value ? `/oprema/${route.params.id}` : '/oprema'
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  try {
      await apiFetch(url, { method, body: JSON.stringify(oprema) })
    router.push('/oprema')
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(dohvatiOpremu)
</script>

<template>
  <v-card max-width="700">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-text-field v-model="oprema.naziv" label="Naziv" prepend-inner-icon="mdi-bag-personal-outline" />
      <v-select v-model="oprema.kategorija" :items="kategorije" label="Kategorija" />
      <v-text-field v-model="oprema.ukupna_kolicina" label="Ukupna količina" type="number" />
      <v-text-field v-model="oprema.dostupna_kolicina" label="Dostupna količina" type="number" />
      <v-text-field v-model="oprema.cijena_najma" label="Cijena najma" type="number" prepend-inner-icon="mdi-cash" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/oprema')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremiOpremu">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
