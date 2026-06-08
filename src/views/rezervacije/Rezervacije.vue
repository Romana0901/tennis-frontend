<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, buildQuery, statusColor, type PaginatedResponse } from '@/api'
import type { Rezervacija, SelectItem } from '@/types'

const router = useRouter()
const loading = ref(false)
const greska = ref('')
const rezervacije = ref<Rezervacija[]>([])
const rezervacijaZaBrisanje = ref<Rezervacija | null>(null)
const prikaziDialog = ref(false)
const tereni = ref<SelectItem[]>([])
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const pretraga = ref('')
const datum = ref('')
const status = ref('')
const terenId = ref('')

const statusi = ['', 'Potvrđena', 'Otkazana', 'Završena']
const headers = [
  { title: 'Datum', value: 'datum' },
  { title: 'Vrijeme', value: 'vrijeme_pocetka' },
  { title: 'Trajanje', value: 'trajanje' },
  { title: 'Klijent', value: 'klijent_ime_prezime' },
  { title: 'Teren', value: 'teren_naziv' },
  { title: 'Status', value: 'status' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

function formatTrajanje(minute: number) {
  const sati = minute / 60
  return `${sati} ${sati === 1 ? 'sat' : 'sata'}`
}

async function dohvatiRezervacije() {
  loading.value = true
  greska.value = ''
  try {
    const query = buildQuery({
      page: page.value,
      per_page: perPage.value,
      q: pretraga.value,
      datum: datum.value,
      status: status.value,
      teren_id: terenId.value,
    })
    const data = await apiFetch<PaginatedResponse<Rezervacija>>(`/rezervacije?${query}`)
    rezervacije.value = data.items
    page.value = data.page
    perPage.value = data.per_page
    total.value = data.total
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function dohvatiDropdowne() {
  tereni.value = await apiFetch<SelectItem[]>('/tereni-dropdown')
}

async function osvjeziFiltere() {
  page.value = 1
  await dohvatiRezervacije()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  perPage.value = opcije.itemsPerPage
  await dohvatiRezervacije()
}

function otvoriBrisanje(item: Rezervacija) {
  rezervacijaZaBrisanje.value = item
  prikaziDialog.value = true
}

async function obrisiRezervaciju() {
  if (!rezervacijaZaBrisanje.value) return
  loading.value = true
  try {
    await apiFetch(`/rezervacije/${rezervacijaZaBrisanje.value.id}`, { method: 'DELETE' })
    prikaziDialog.value = false
    await dohvatiRezervacije()
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(async () => {
  await dohvatiDropdowne()
  await dohvatiRezervacije()
})
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      Rezervacije
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/rezervacije/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field v-model="pretraga" label="Pretraži" prepend-inner-icon="mdi-magnify" clearable @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="datum" label="Datum" type="date" @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="status" :items="statusi" label="Status" @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="3">
          <v-select v-model="terenId" :items="[{ title: 'Svi tereni', value: '' }, ...tereni]" label="Teren" @update:model-value="osvjeziFiltere" />
        </v-col>
      </v-row>
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="headers"
        :items="rezervacije"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="promijeniOpcije"
      >
        <template #item.trajanje="{ item }">{{ formatTrajanje(item.trajanje) }}</template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">{{ item.status }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/rezervacije/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/rezervacije/${item.id}/uredi`)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-dialog v-model="prikaziDialog" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati rezervaciju?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikaziDialog = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisiRezervaciju">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
