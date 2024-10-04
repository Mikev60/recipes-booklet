<template>
    <v-card class="mx-auto" elevation="3" id="recipesList">
        <v-list variant="plain">
            <v-list-item @click.prevent="goTo(recipe.id)" v-for="recipe in recipes" :title="recipe.title"
                :subtitle="recipe.id" class="recipeItem" :prepend-avatar="recipe.main_picture.url">
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    name: 'RecipesList',
    props: {
        recipes: {
            type: Object,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const router = useRouter()
        const type = props.type || 'user'

        function goTo(id) {
            if (type == "admin") {
                router.push({ name: 'admin recipe detail', params: { id: id } })
            } else {
                router.push({ name: 'user recipe detail', params: { id: id } })
            }
        }

        return {
            goTo
        }
    }
}
</script>