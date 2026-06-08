<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { apiFetch, statusColor } from '@/api'
import type { Rezervacija } from '@/types'

type Dashboard = {
  broj_klijenata: number
  broj_terena: number
  dostupna_oprema: number
  buduce_rezervacije: number
  danasnje_rezervacije: Rezervacija[]
  nadolazece_rezervacije: Rezervacija[]
}

const loading = ref(false)
const greska = ref('')
const dashboard = ref<Dashboard>({
  broj_klijenata: 0,
  broj_terena: 0,
  dostupna_oprema: 0,
  buduce_rezervacije: 0,
  danasnje_rezervacije: [],
  nadolazece_rezervacije: [],
})

const kartice = [
  { key: 'broj_klijenata', label: 'Klijenti', icon: 'mdi-account-group-outline', color: 'primary' },
  { key: 'broj_terena', label: 'Tereni', icon: 'mdi-tennis', color: 'secondary' },
  { key: 'dostupna_oprema', label: 'Dostupna oprema', icon: 'mdi-bag-personal-outline', color: 'accent' },
  { key: 'buduce_rezervacije', label: 'Buduće rezervacije', icon: 'mdi-calendar-clock', color: 'primary' },
]

const rezervacijeHeaders = [
  { title: 'Datum', value: 'datum' },
  { title: 'Vrijeme', value: 'vrijeme_pocetka' },
  { title: 'Klijent', value: 'klijent_ime_prezime' },
  { title: 'Teren', value: 'teren_naziv' },
  { title: 'Status', value: 'status' },
]

async function dohvatiDashboard() {
  loading.value = true
  greska.value = ''

  try {
    dashboard.value = await apiFetch<Dashboard>('/dashboard')
  } catch (error) {
    greska.value = (error as Error).message
  }

  loading.value = false
}

onMounted(dohvatiDashboard)
</script>

<template>
  <div>
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          Dashboard
        </h1>
        <div class="text-body-2 text-medium-emphasis">
          Pregled rezervacija, terena i opreme
        </div>
      </div>

      <v-spacer />

      <v-btn
        icon="mdi-refresh"
        variant="text"
        :loading="loading"
        @click="dohvatiDashboard"
      />
    </div>

    <v-alert
      v-if="greska"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ greska }}
    </v-alert>

    <v-row>
      <v-col
        v-for="kartica in kartice"
        :key="kartica.key"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <v-card-text class="d-flex align-center">
            <v-avatar
              :color="kartica.color"
              variant="tonal"
              class="mr-4"
            >
              <v-icon :icon="kartica.icon" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">
                {{ dashboard[kartica.key as keyof Dashboard] }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{ kartica.label }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title>Nadolazeće rezervacije</v-card-title>
          <v-data-table
            :headers="rezervacijeHeaders"
            :items="dashboard.nadolazece_rezervacije"
            :loading="loading"
            density="comfortable"
          >
            <template #item.status="{ item }">
              <v-chip
                :color="statusColor(item.status)"
                size="small"
                variant="tonal"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
