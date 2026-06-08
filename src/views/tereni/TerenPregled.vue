<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Teren } from '@/types'

const route = useRoute()
const router = useRouter()
const teren = ref<Teren | null>(null)
const greska = ref('')

async function dohvatiTeren() {
  try {
    teren.value = await apiFetch<Teren>(`/tereni/${route.params.id}`)
  } catch (error) {
    greska.value = (error as Error).message
  }
}

onMounted(dohvatiTeren)
</script>

<template>
  <v-card max-width="700">
    <v-card-title class="d-flex align-center">
      Pregled terena
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-pencil" @click="router.push(`/tereni/${route.params.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal">{{ greska }}</v-alert>
      <v-list v-else-if="teren">
        <v-list-item title="Naziv" :subtitle="teren.naziv" />
        <v-list-item title="Podloga" :subtitle="teren.podloga" />
        <v-list-item title="Lokacija" :subtitle="teren.lokacija" />
        <v-list-item title="Cijena po satu" :subtitle="`${teren.cijena_po_satu} KM`" />
        <v-list-item title="Aktivan" :subtitle="teren.aktivan ? 'Da' : 'Ne'" />
      </v-list>
      <div v-else>Učitavanje...</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/tereni')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
