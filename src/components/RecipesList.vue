<template>
    <v-card class="mx-auto" elevation="3" id="recipesList">
        <v-list variant="plain">
            <v-list-item v-for="recipe in recipes" :title="recipe.test" subtitle="subtitle" prepend-avatar="de"
                class="recipeItem"></v-list-item>
        </v-list>
    </v-card>
</template>

<script>
export default {
    name: 'RecipesList',
    props: {
        recipes: {
            type: Object,
            required: true
        }
    },
    setup() {


        return {}
    }
}
</script>