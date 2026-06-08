<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, buildQuery, statusColor, type PaginatedResponse } from '@/api'
import type { NajamOpreme, SelectItem } from '@/types'

const router = useRouter()
const loading = ref(false)
const greska = ref('')
const najmovi = ref<NajamOpreme[]>([])
const najamZaBrisanje = ref<NajamOpreme | null>(null)
const prikaziDialog = ref(false)
const klijenti = ref<SelectItem[]>([])
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const pretraga = ref('')
const status = ref('')
const klijentId = ref('')
const statusi = ['', 'Aktivan', 'Vraćen', 'Otkazan']

const headers = [
  { title: 'Datum', value: 'datum_najma' },
  { title: 'Klijent', value: 'klijent_ime_prezime' },
  { title: 'Oprema', value: 'oprema_naziv' },
  { title: 'Količina', value: 'kolicina' },
  { title: 'Povrat', value: 'datum_povrata' },
  { title: 'Status', value: 'status' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiNajmove() {
  loading.value = true
  greska.value = ''
  try {
    const query = buildQuery({ page: page.value, per_page: perPage.value, q: pretraga.value, status: status.value, klijent_id: klijentId.value })
    const data = await apiFetch<PaginatedResponse<NajamOpreme>>(`/najmovi-opreme?${query}`)
    najmovi.value = data.items
    page.value = data.page
    perPage.value = data.per_page
    total.value = data.total
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

async function osvjeziFiltere() {
  page.value = 1
  await dohvatiNajmove()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  perPage.value = opcije.itemsPerPage
  await dohvatiNajmove()
}

function otvoriBrisanje(item: NajamOpreme) {
  najamZaBrisanje.value = item
  prikaziDialog.value = true
}

async function obrisiNajam() {
  if (!najamZaBrisanje.value) return
  loading.value = true
  try {
    await apiFetch(`/najmovi-opreme/${najamZaBrisanje.value.id}`, { method: 'DELETE' })
    prikaziDialog.value = false
    await dohvatiNajmove()
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(async () => {
  klijenti.value = await apiFetch<SelectItem[]>('/klijenti-dropdown')
  await dohvatiNajmove()
})
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      Najmovi opreme
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/najmovi-opreme/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="pretraga" label="Pretraži" prepend-inner-icon="mdi-magnify" clearable @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="status" :items="statusi" label="Status" @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="klijentId" :items="[{ title: 'Svi klijenti', value: '' }, ...klijenti]" label="Klijent" @update:model-value="osvjeziFiltere" />
        </v-col>
      </v-row>
      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="headers"
        :items="najmovi"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="promijeniOpcije"
      >
        <template #item.datum_povrata="{ item }">{{ item.datum_povrata || '-' }}</template>
        <template #item.status="{ item }">
          <v-chip :color="statusColor(item.status)" size="small" variant="tonal">{{ item.status }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/najmovi-opreme/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/najmovi-opreme/${item.id}/uredi`)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-dialog v-model="prikaziDialog" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati najam opreme?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikaziDialog = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisiNajam">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
