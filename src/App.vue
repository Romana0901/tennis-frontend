<template>
  <v-app>
    <v-app-bar flat border>
      <v-container class="mx-auto d-flex align-center">
        <div class="text-h6 font-weight-bold">
          Teniski centar
        </div>

        <v-spacer />

        <v-btn
          v-for="link in links"
          :key="link.link"
          :prepend-icon="link.icon"
          variant="text"
          class="d-none d-md-inline-flex"
          @click="router.push(link.link)"
        >
          {{ link.text }}
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-menu"
              variant="text"
              class="d-md-none"
            />
          </template>

          <v-list>
            <v-list-item
              v-for="link in links"
              :key="link.link"
              :prepend-icon="link.icon"
              :title="link.text"
              @click="router.push(link.link)"
            />
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { link: '/', text: 'Početna', icon: 'mdi-view-dashboard-outline' },
  { link: '/klijenti', text: 'Klijenti', icon: 'mdi-account-group-outline' },
  { link: '/tereni', text: 'Tereni', icon: 'mdi-tennis' },
  { link: '/oprema', text: 'Oprema', icon: 'mdi-bag-personal-outline' },
  { link: '/rezervacije', text: 'Rezervacije', icon: 'mdi-calendar-clock' },
  { link: '/najmovi-opreme', text: 'Najmovi', icon: 'mdi-clipboard-list-outline' },
]
</script>
