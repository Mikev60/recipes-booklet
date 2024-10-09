<template>
    <v-card class="mx-auto" elevation="3" id="recipesList">
        <snack-bar v-model="show_snackbar" timeOut=2000 :type="snackbar_type" :icon="snackbar_icon"
            :text="snackbar_message"></snack-bar>
        <v-dialog v-model="show_dialog" width="auto">
            <v-card max-width="400" prepend-icon="mdi-delete-alert" text="Are you sure you want to delete this recipe ?"
                title="Recipe deletion">
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Cancel" @click="show_dialog = false"></v-btn>
                    <v-btn class="ms-auto" text="Ok" @click="deleteRecipe"></v-btn>
                </template>
            </v-card>
        </v-dialog>
        <v-list variant="plain">
            <v-list-item @click.prevent="goTo(recipe.id)" v-for="recipe in recipes" :title="recipe.title"
                :subtitle="recipe.id" class="recipeItem" :prepend-avatar="recipe.main_picture.url">
                <template #append v-if="type == 'admin'"><v-icon icon="mdi-delete-circle"
                        @click.prevent.stop="showConfirmationDialog(recipe)"></v-icon></template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import { deleteRecipe as deleteRecipeFunc } from '@/includes/collections/recipes'
import SnackBar from '@/components/SnackBar.vue'

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
    components: {
        SnackBar
    },
    emits: ['deleteRecipe'],
    setup(props, context) {
        const router = useRouter()
        const type = props.type || 'user'
        let activeRecipe = ref(null)
        let show_dialog = ref(false)
        let show_snackbar = ref(false)
        let snackbar_type = "success"
        let snackbar_icon = "mdi-check-circle-outline"
        let snackbar_message = "Recipe has been deleted"

        function showConfirmationDialog(recipe) {
            show_dialog.value = true;
            activeRecipe.value = recipe;
        }

        async function deleteRecipe() {
            show_dialog.value = false
            try {
                await deleteRecipeFunc(activeRecipe.value.id, activeRecipe.value.main_picture, activeRecipe.value.steps)
                show_snackbar.value = true
                context.emit('deleteRecipe')
            } catch (error) {
                show_snackbar.value = true
                snackbar_message = "An error occured"
                snackbar_type = "error"
                snackbar_icon = "mdi-alert-circle"
                console.log(error)
            }
        }

        function goTo(id) {
            if (type == "admin") {
                router.push({ name: 'admin recipe detail', params: { id: id } })
            } else {
                router.push({ name: 'user recipe detail', params: { id: id } })
            }
        }

        return {
            goTo,
            show_dialog,
            showConfirmationDialog,
            show_snackbar,
            deleteRecipe,
            snackbar_type,
            snackbar_icon,
            snackbar_message
        }
    }
}
</script>