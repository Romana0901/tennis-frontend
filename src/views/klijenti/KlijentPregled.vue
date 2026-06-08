<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Klijent } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')
const klijent = ref<Klijent | null>(null)

async function dohvatiKlijenta() {
  loading.value = true
  try {
    klijent.value = await apiFetch<Klijent>(`/klijenti/${route.params.id}`)
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(dohvatiKlijenta)
</script>

<template>
  <v-card max-width="700">
    <v-card-title class="d-flex align-center">
      Pregled klijenta
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-pencil" @click="router.push(`/klijenti/${route.params.id}/uredi`)">
        Uredi
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal">{{ greska }}</v-alert>
      <v-list v-else-if="klijent">
        <v-list-item title="Ime i prezime" :subtitle="klijent.ime_prezime" />
        <v-list-item title="E-pošta" :subtitle="klijent.email" />
        <v-list-item title="Telefon" :subtitle="klijent.telefon || '-'" />
      </v-list>
      <div v-else>Učitavanje...</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/klijenti')">Natrag</v-btn>
    </v-card-actions>
  </v-card>
</template>
