<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, buildQuery, type PaginatedResponse } from '@/api'
import type { Oprema } from '@/types'

const router = useRouter()
const loading = ref(false)
const greska = ref('')
const oprema = ref<Oprema[]>([])
const opremaZaBrisanje = ref<Oprema | null>(null)
const prikaziDialog = ref(false)
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const pretraga = ref('')
const kategorija = ref('')
const dostupno = ref(false)

const kategorije = ['', 'Reket', 'Loptice', 'Obuća', 'Torba', 'Dodaci']
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Naziv', value: 'naziv' },
  { title: 'Kategorija', value: 'kategorija' },
  { title: 'Ukupno', value: 'ukupna_kolicina' },
  { title: 'Dostupno', value: 'dostupna_kolicina' },
  { title: 'Cijena', value: 'cijena_najma' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiOpremu() {
  loading.value = true
  greska.value = ''
  try {
    const query = buildQuery({ page: page.value, per_page: perPage.value, q: pretraga.value, kategorija: kategorija.value, dostupno: dostupno.value || '' })
    const data = await apiFetch<PaginatedResponse<Oprema>>(`/oprema?${query}`)
    oprema.value = data.items
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
  await dohvatiOpremu()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  perPage.value = opcije.itemsPerPage
  await dohvatiOpremu()
}

function otvoriBrisanje(item: Oprema) {
  opremaZaBrisanje.value = item
  prikaziDialog.value = true
}

async function obrisiOpremu() {
  if (!opremaZaBrisanje.value) return
  loading.value = true
  try {
    await apiFetch(`/oprema/${opremaZaBrisanje.value.id}`, { method: 'DELETE' })
    prikaziDialog.value = false
    await dohvatiOpremu()
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(dohvatiOpremu)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      Oprema
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/oprema/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field v-model="pretraga" label="Pretraži opremu" prepend-inner-icon="mdi-magnify" clearable @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="kategorija" :items="kategorije" label="Kategorija" @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="3">
          <v-checkbox v-model="dostupno" label="Samo dostupno" color="primary" @update:model-value="osvjeziFiltere" />
        </v-col>
      </v-row>

      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="headers"
        :items="oprema"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="promijeniOpcije"
      >
        <template #item.dostupna_kolicina="{ item }">
          <v-chip :color="item.dostupna_kolicina > 0 ? 'primary' : 'red'" size="small" variant="tonal">
            {{ item.dostupna_kolicina }}
          </v-chip>
        </template>
        <template #item.cijena_najma="{ item }">{{ item.cijena_najma }} KM</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/oprema/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/oprema/${item.id}/uredi`)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-dialog v-model="prikaziDialog" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati opremu {{ opremaZaBrisanje?.naziv }}?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikaziDialog = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisiOpremu">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
