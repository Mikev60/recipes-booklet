<script>

import { reactive, ref } from 'vue'
import { getRecipes } from '@/includes/collections/recipes.js'
import RecipesList from '@/components/RecipesList.vue'

export default {
  name: 'HomeView',
  components: {
    RecipesList
  },
  setup() {
    let recipes = ref([])

    async function initializeRecipes() {
      recipes.value = await getRecipes()
    }

    initializeRecipes()
    return {
      recipes
    }
  }
}


</script>

<template>
  <main class="px-4 py-4">
    <recipes-list type="user" :recipes="recipes"></recipes-list>
  </main>
</template>
