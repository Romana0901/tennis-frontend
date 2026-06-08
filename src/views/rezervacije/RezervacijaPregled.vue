<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch, statusColor } from '@/api'
import type { Rezervacija } from '@/types'

const route = useRoute()
const router = useRouter()
const rezervacija = ref<Rezervacija | null>(null)
const greska = ref('')

async function dohvatiRezervaciju() {
  try {
    rezervacija.value = await apiFetch<Rezervacija>(`/rezervacije/${route.params.id}`)
  } catch (error) {
    greska.value = (error as Error).message
  }
}

function formatTrajanje(minute: number) {
  const sati = minute / 60
  return `${sati} ${sati === 1 ? 'sat' : 'sata'}`
}

onMounted(dohvatiRezervaciju)
</script>

<template>
  <v-card max-width="700">
    <v-card-title class="d-flex align-center">
      Pregled rezervacije
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-pencil" @click="router.push(`/rezervacije/${route.params.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal">{{ greska }}</v-alert>
      <v-list v-else-if="rezervacija">
        <v-list-item title="Klijent" :subtitle="rezervacija.klijent_ime_prezime" />
        <v-list-item title="Teren" :subtitle="rezervacija.teren_naziv" />
        <v-list-item title="Datum" :subtitle="rezervacija.datum" />
        <v-list-item title="Vrijeme početka" :subtitle="rezervacija.vrijeme_pocetka" />
        <v-list-item title="Trajanje" :subtitle="formatTrajanje(rezervacija.trajanje)" />
        <v-list-item title="Status">
          <template #subtitle>
            <v-chip :color="statusColor(rezervacija.status)" size="small" variant="tonal">{{ rezervacija.status }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
      <div v-else>Učitavanje...</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/rezervacije')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
