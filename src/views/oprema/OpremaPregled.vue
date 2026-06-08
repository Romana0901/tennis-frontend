<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Oprema } from '@/types'

const route = useRoute()
const router = useRouter()
const oprema = ref<Oprema | null>(null)
const greska = ref('')

async function dohvatiOpremu() {
  try {
    oprema.value = await apiFetch<Oprema>(`/oprema/${route.params.id}`)
  } catch (error) {
    greska.value = (error as Error).message
  }
}

onMounted(dohvatiOpremu)
</script>

<template>
  <v-card max-width="700">
    <v-card-title class="d-flex align-center">
      Pregled opreme
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-pencil" @click="router.push(`/oprema/${route.params.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal">{{ greska }}</v-alert>
      <v-list v-else-if="oprema">
        <v-list-item title="Naziv" :subtitle="oprema.naziv" />
        <v-list-item title="Kategorija" :subtitle="oprema.kategorija" />
        <v-list-item title="Ukupna količina" :subtitle="String(oprema.ukupna_kolicina)" />
        <v-list-item title="Dostupna količina" :subtitle="String(oprema.dostupna_kolicina)" />
        <v-list-item title="Cijena najma" :subtitle="`${oprema.cijena_najma} KM`" />
      </v-list>
      <div v-else>Učitavanje...</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/oprema')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
