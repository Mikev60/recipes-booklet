<template>
    <main class="px-2 py-2">
        <v-card class="px-2 py-2 flex items-center justify-center">
            <h1>{{ recipeObject.title }} </h1>
            <v-switch label="Exam mode" v-model="exam_mode" color="primary"></v-switch>
            <v-img :src="recipeObject.main_picture?.url" max-width="60%" height="400px" class="mx-auto mt-2"></v-img>
            <div v-if="recipeObject.to_do_before">
                <h2>To do before</h2>
                <p v-html="recipeObject.to_do_before"></p>
            </div>
            <div v-if="recipeObject.material">
                <h2>Material needed</h2>
                <p v-html="recipeObject.material"></p>
            </div>
            <div v-if="recipeObject.warning" class="mb-2">
                <h2>Warning</h2>
                <p v-html="recipeObject.warning"></p>
            </div>
            <h2>Ingredients </h2>
            <v-list lines="one">
                <v-list-item v-if="recipeObject?.categories?.length > 0" v-for="category in ingredientsPerCategory"
                    :key="category.title">
                    <h3>{{ category.category.title }}</h3>
                    <p v-for="ingredient in category.ingredients" :key="ingredient.title">
                        {{ ingredient.title }} ({{ ingredient.quantity }} {{ ingredient.unit }})</p>
                </v-list-item>
                <v-list-item v-else v-for="ingredient in recipeObject.ingredients" :key="ingredient.title">
                    {{ ingredient.title }} ({{ ingredient.quantity }} {{ ingredient.unit }})
                </v-list-item>
            </v-list>
            <h2 v-if="!exam_mode">Steps</h2>
            <v-expansion-panels v-if="!exam_mode">
                <div class="w-100" v-for="(step, index) in recipeObject.steps" :key="index">
                    <v-expansion-panel :title="`Step ${index + 1} : ${step.title}`">
                        <v-expansion-panel-text class="flex flex-col ">
                            <v-row class="mt-1">
                                <div v-html="step.description"></div>
                            </v-row>
                            <v-container class="mt-2 max-w-2">
                                <v-row class="mt-1"><v-carousel>
                                        <v-carousel-item v-for="picture in step.pictures" :src="picture.url"
                                            contain></v-carousel-item></v-carousel></v-row>
                            </v-container>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </div>
            </v-expansion-panels>
        </v-card>
    </main>
</template>

<script>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { getSingleRecipe } from '@/includes/collections/recipes'

export default {
    name: 'User recipe detail',
    setup() {
        let route = useRoute()
        let recipeId = route.params.id
        let recipeObject = ref({})
        let ingredientsPerCategory = ref([])
        let exam_mode = ref(false)

        async function initializeRecipe() {
            recipeObject.value = await getSingleRecipe(recipeId);
            if (recipeObject.value?.categories?.length > 0) {
                recipeObject.value.categories.forEach((category) => {
                    ingredientsPerCategory.value.push({
                        category,
                        ingredients: recipeObject.value.ingredients.filter((ingredient) => ingredient.category.title == category.title)
                    })
                })
            }

        }

        initializeRecipe()

        return { recipeObject, exam_mode, ingredientsPerCategory }
    }
}
</script>