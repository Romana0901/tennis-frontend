<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch, statusColor } from '@/api'
import type { NajamOpreme } from '@/types'

const route = useRoute()
const router = useRouter()
const najam = ref<NajamOpreme | null>(null)
const greska = ref('')

async function dohvatiNajam() {
  try {
    najam.value = await apiFetch<NajamOpreme>(`/najmovi-opreme/${route.params.id}`)
  } catch (error) {
    greska.value = (error as Error).message
  }
}

onMounted(dohvatiNajam)
</script>

<template>
  <v-card max-width="700">
    <v-card-title class="d-flex align-center">
      Pregled najma opreme
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-pencil" @click="router.push(`/najmovi-opreme/${route.params.id}/uredi`)">Uredi</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal">{{ greska }}</v-alert>
      <v-list v-else-if="najam">
        <v-list-item title="Klijent" :subtitle="najam.klijent_ime_prezime" />
        <v-list-item title="Oprema" :subtitle="najam.oprema_naziv" />
        <v-list-item title="Rezervacija" :subtitle="najam.rezervacija_opis || '-'" />
        <v-list-item title="Datum najma" :subtitle="najam.datum_najma" />
        <v-list-item title="Datum povrata" :subtitle="najam.datum_povrata || '-'" />
        <v-list-item title="Količina" :subtitle="String(najam.kolicina)" />
        <v-list-item title="Status">
          <template #subtitle>
            <v-chip :color="statusColor(najam.status)" size="small" variant="tonal">{{ najam.status }}</v-chip>
          </template>
        </v-list-item>
      </v-list>
      <div v-else>Učitavanje...</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/najmovi-opreme')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
