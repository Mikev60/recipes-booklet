

<template>
  <v-app>
    <app-header></app-header>

    <RouterView class="mt-16" />
  </v-app>
</template>

<script>
import { ref, reactive } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'


export default {
  components: {
    AppHeader
  }
}
</script>
