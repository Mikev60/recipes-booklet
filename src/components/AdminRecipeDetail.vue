<template>
    <main class="px-2 py-2">
        <v-card class="px-2 py-2">
            <create-edit-recipe-form :recipe="recipeObject"></create-edit-recipe-form>
        </v-card>
    </main>
</template>

<script>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { getSingleRecipe } from '@/includes/collections/recipes'
import CreateEditRecipeForm from './CreateEditRecipeForm.vue';

export default {
    name: 'Admin Recipe Detail',
    components: {
        CreateEditRecipeForm
    },
    setup() {
        const route = useRoute()
        const recipeId = route.params.id
        let recipeObject = ref({})

        async function initializeRecipe() {
            recipeObject.value = await getSingleRecipe(recipeId)
        }

        initializeRecipe()

        return {
            recipeObject
        }
    }
}
</script>