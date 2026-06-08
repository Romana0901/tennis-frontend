<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch, buildQuery, type PaginatedResponse } from '@/api'
import type { Teren } from '@/types'

const router = useRouter()
const loading = ref(false)
const greska = ref('')
const tereni = ref<Teren[]>([])
const terenZaBrisanje = ref<Teren | null>(null)
const prikaziDialog = ref(false)
const page = ref(1)
const perPage = ref(10)
const total = ref(0)
const pretraga = ref('')
const aktivan = ref('')

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Naziv', value: 'naziv' },
  { title: 'Podloga', value: 'podloga' },
  { title: 'Lokacija', value: 'lokacija' },
  { title: 'Cijena/h', value: 'cijena_po_satu' },
  { title: 'Aktivan', value: 'aktivan' },
  { title: 'Akcije', key: 'actions', sortable: false },
]

async function dohvatiTerene() {
  loading.value = true
  greska.value = ''
  try {
    const query = buildQuery({ page: page.value, per_page: perPage.value, q: pretraga.value, aktivan: aktivan.value })
    const data = await apiFetch<PaginatedResponse<Teren>>(`/tereni?${query}`)
    tereni.value = data.items
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
  await dohvatiTerene()
}

async function promijeniOpcije(opcije: any) {
  page.value = opcije.page
  perPage.value = opcije.itemsPerPage
  await dohvatiTerene()
}

function otvoriBrisanje(teren: Teren) {
  terenZaBrisanje.value = teren
  prikaziDialog.value = true
}

async function obrisiTeren() {
  if (!terenZaBrisanje.value) return
  loading.value = true
  try {
    await apiFetch(`/tereni/${terenZaBrisanje.value.id}`, { method: 'DELETE' })
    prikaziDialog.value = false
    await dohvatiTerene()
  } catch (error) {
    greska.value = (error as Error).message
  }
  loading.value = false
}

onMounted(dohvatiTerene)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center flex-wrap ga-2">
      Tereni
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="router.push('/tereni/dodaj')">Dodaj</v-btn>
    </v-card-title>
    <v-card-text>
      <v-alert v-if="greska" type="error" variant="tonal" class="mb-4">{{ greska }}</v-alert>
      <v-row>
        <v-col cols="12" md="8">
          <v-text-field v-model="pretraga" label="Pretraži terene" prepend-inner-icon="mdi-magnify" clearable @update:model-value="osvjeziFiltere" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="aktivan"
            :items="[{ title: 'Svi tereni', value: '' }, { title: 'Aktivni', value: 'true' }, { title: 'Neaktivni', value: 'false' }]"
            label="Status terena"
            @update:model-value="osvjeziFiltere"
          />
        </v-col>
      </v-row>

      <v-data-table-server
        v-model:page="page"
        v-model:items-per-page="perPage"
        :headers="headers"
        :items="tereni"
        :items-length="total"
        :loading="loading"
        :items-per-page-options="[5, 10, 15]"
        @update:options="promijeniOpcije"
      >
        <template #item.cijena_po_satu="{ item }">{{ item.cijena_po_satu }} KM</template>
        <template #item.aktivan="{ item }">
          <v-chip :color="item.aktivan ? 'primary' : 'red'" size="small" variant="tonal">
            {{ item.aktivan ? 'Da' : 'Ne' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-eye" size="small" variant="text" @click="router.push(`/tereni/${item.id}`)" />
          <v-btn icon="mdi-pencil" size="small" variant="text" @click="router.push(`/tereni/${item.id}/uredi`)" />
          <v-btn icon="mdi-delete" size="small" variant="text" @click="otvoriBrisanje(item)" />
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>

  <v-dialog v-model="prikaziDialog" max-width="500">
    <v-card>
      <v-card-title>Potvrda brisanja</v-card-title>
      <v-card-text>Jeste li sigurni da želite obrisati teren {{ terenZaBrisanje?.naziv }}?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="prikaziDialog = false">Odustani</v-btn>
        <v-btn color="red" :loading="loading" @click="obrisiTeren">Obriši</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
