<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Teren } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')

const teren = reactive({
  naziv: '',
  podloga: '',
  lokacija: '',
  cijena_po_satu: '',
  aktivan: true,
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => jeUredivanje.value ? 'Uredi teren' : 'Dodaj teren')

async function dohvatiTeren() {
  if (!route.params.id) return
  loading.value = true
  try {
    Object.assign(teren, await apiFetch<Teren>(`/tereni/${route.params.id}`))
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function spremiTeren() {
  loading.value = true
  greska.value = ''
  const url = jeUredivanje.value ? `/tereni/${route.params.id}` : '/tereni'
  const method = jeUredivanje.value ? 'PUT' : 'POST'
  try {
    await apiFetch(url, { method, body: JSON.stringify(teren) })
    router.push('/tereni')
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(dohvatiTeren)
</script>

<template>
  <v-card max-width="700">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-text-field v-model="teren.naziv" label="Naziv" prepend-inner-icon="mdi-tennis" />
      <v-select v-model="teren.podloga" :items="['Zemlja', 'Beton', 'Trava', 'Tepih']" label="Podloga" prepend-inner-icon="mdi-texture-box" />
      <v-text-field v-model="teren.lokacija" label="Lokacija" prepend-inner-icon="mdi-map-marker-outline" />
      <v-text-field v-model="teren.cijena_po_satu" label="Cijena po satu" type="number" prepend-inner-icon="mdi-cash" />
      <v-switch v-model="teren.aktivan" color="primary" label="Teren je aktivan" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/tereni')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremiTeren">Spremi</v-btn>
    </v-card-actions>
  </v-card>
</template>
