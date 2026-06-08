<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, buildQuery, type PaginatedResponse } from '@/api'
import type { Klijent } from '@/types'

const router = useRouter()
const loading = ref(false)
const greska = ref('')
const poruka = ref('')
const prikaziPoruku = ref(false)
const prikaziDialog = ref(false)
const klijenti = ref<Klijent[]>([])
const klijentZaBrisanje = ref<Klijent | null>(null)
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const pretraga = ref('')

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Ime', value: 'ime' },
  { title: 'Prezime', value: 'prezime' },
  { title: 'E-pošta', value: 'email' },
  { title: 'Telefon', value: 'telefon' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiKlijente() {
  loading.value = true
  greska.value = ''

  try {
    const query = buildQuery({ page: page.value, per_page: perPage.value, q: pretraga.value })
    const data = await apiFetch<PaginatedResponse<Klijent>>(`/klijenti?${query}`)
    klijenti.value = data.items
    page.value = data.page
    perPage.value = data.per_page
    total.value = data.total
  } catch (error) {
    greska.value = (error as Error).message
  }

  loading.value = false
}

async function pretrazi() {
  page.value = 1
  await dohvatiKlijente()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  perPage.value = opcije.itemsPerPage
  await dohvatiKlijente()
}

function otvoriBrisanje(klijent: Klijent) {
  klijentZaBrisanje.value = klijent
  prikaziDialog.value = true
}

function zatvoriBrisanje() {
  klijentZaBrisanje.value = null
  prikaziDialog.value = false
}

async function obrisiKlijenta() {
  if (!klijentZaBrisanje.value) return

  loading.value = true
  greska.value = ''

  try {
    await apiFetch(`/klijenti/${klijentZaBrisanje.value.id}`, { method: 'DELETE' })
    poruka.value = 'Klijent je obrisan.'
    prikaziPoruku.value = true
    await dohvatiKlijente()
    zatvoriBrisanje()
  } catch (error) {
    greska.value = (error as Error).message
  }

  loading.value = false
}

onMounted(dohvatiKlijente)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      Klijenti
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="router.push('/klijenti/dodaj')"
      >
        Dodaj
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-alert
        v-if="greska"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ greska }}
      </v-alert>

      <v-text-field
        v-model="pretraga"
        label="Pretraži klijente"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mb-4"
        @update:model-value="pretrazi"
      />

      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="headers"
        :items="klijenti"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="promijeniOpcije"
      >
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/klijenti/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/klijenti/${item.id}/uredi`)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-dialog v-model="prikaziDialog" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>
        Jeste li sigurni da želite obrisati klijenta {{ klijentZaBrisanje?.ime_prezime }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="zatvoriBrisanje">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisiKlijenta">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="prikaziPoruku" color="primary" timeout="2500">
    {{ poruka }}
  </v-snackbar>
</template>
