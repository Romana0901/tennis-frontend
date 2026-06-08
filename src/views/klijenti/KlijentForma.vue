<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiFetch } from '@/api'
import type { Klijent } from '@/types'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const greska = ref('')

const klijent = reactive({
  ime: '',
  prezime: '',
  email: '',
  telefon: '',
})

const jeUredivanje = computed(() => !!route.params.id)
const naslov = computed(() => jeUredivanje.value ? 'Uredi klijenta' : 'Dodaj klijenta')
const tekstGumba = computed(() => jeUredivanje.value ? 'Spremi promjene' : 'Spremi klijenta')

async function dohvatiKlijenta() {
  if (!route.params.id) return

  loading.value = true
  try {
    Object.assign(klijent, await apiFetch<Klijent>(`/klijenti/${route.params.id}`))
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function spremiKlijenta() {
  loading.value = true
  greska.value = ''

  const url = jeUredivanje.value ? `/klijenti/${route.params.id}` : '/klijenti'
  const method = jeUredivanje.value ? 'PUT' : 'POST'

  try {
    await apiFetch(url, { method, body: JSON.stringify(klijent) })
    router.push('/klijenti')
  } catch (error) {
    greska.value = (error as Error).message
  }

  loading.value = false
}

onMounted(dohvatiKlijenta)
</script>

<template>
  <v-card max-width="700">
    <v-card-title>{{ naslov }}</v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">
        {{ greska }}
      </v-alert>
      <v-text-field v-model="klijent.ime" label="Ime" prepend-inner-icon="mdi-account" />
      <v-text-field v-model="klijent.prezime" label="Prezime" prepend-inner-icon="mdi-account-outline" />
      <v-text-field v-model="klijent.email" label="E-pošta" prepend-inner-icon="mdi-email-outline" />
      <v-text-field v-model="klijent.telefon" label="Telefon" prepend-inner-icon="mdi-phone-outline" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" @click="router.push('/klijenti')">Odustani</v-btn>
      <v-btn color="primary" :loading="loading" @click="spremiKlijenta">{{ tekstGumba }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
