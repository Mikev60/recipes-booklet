<template>
  <div class="about px-4 py-4 gap-y-4">
    <v-card class="py-4 px-4">
      <h1>Recipes Management</h1>
      <v-tabs v-model="tab" bg-color="secondary" class="mt-2">
        <v-tab value="list">List</v-tab>
        <v-tab value="create">Create</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="pt-2">
        <v-tabs-window-item value="list">
          <recipes-list @delete-recipe="initializeRecipes" type="admin" :recipes="recipes"></recipes-list>
        </v-tabs-window-item>

        <v-tabs-window-item value="create">
          <create-edit-recipe-form></create-edit-recipe-form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import RecipesList from '@/components/RecipesList.vue'
import { getRecipes } from '@/includes/collections/recipes'
import CreateEditRecipeForm from '@/components/CreateEditRecipeForm.vue'
import { watch } from 'vue'

export default {
  name: 'AdminView',
  components: {
    RecipesList,
    CreateEditRecipeForm
  },
  setup() {
    let tab = ref("list") // list, create
    let recipes = ref([])

    watch(tab, async (newTab) => {
      if (newTab == 'list') {
        await initializeRecipes()
      }
    })

    async function initializeRecipes() {
      recipes.value = await getRecipes()
    }

    initializeRecipes()
    return {
      tab,
      recipes,
      initializeRecipes
    }
  }
}
</script>
