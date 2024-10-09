<template>
    <h2>{{ recipeToEdit.id ? `Edit a recipe` : 'Create a recipe' }}</h2>
    <v-snackbar v-model="openSnackBar" timeout="2000" :color="alert_type"><v-icon
            :icon="alert_type == 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle'"></v-icon> {{
                alert_text }}</v-snackbar>
    <v-form class="w-full mt-4" @submit.prevent="submitForm" ref="formRef">
        <!-- Title, Picture inputs-->
        <v-text-field :rules="rules.title.rules" label="Title" v-model="recipe_title">

        </v-text-field>
        <v-file-input preprend-icon="mdi-camera" label="Picture" @change="addMainPicture"
            v-model="temp_recipe_picture"></v-file-input>
        <img :src="recipe_picture.url" width="200" v-if="recipe_picture?.url" />
        <!-- Ingredients-->
        <v-container class="px-0 mx-0 w-full">
            <v-row align-content="end" justify="end">
                <v-col col="1">
                    <h3>Ingredients</h3>
                </v-col>
                <v-col align-self="end"><v-icon icon="mdi-plus" @click.prevent="addIngredient"
                        class="items-end"></v-icon></v-col>
            </v-row>
            <v-row align="center" v-for="(ingredient, index) in ingredients" :key="index">
                <v-col>
                    <v-text-field label="Title" v-model="ingredient.title"
                        :rules="rules.ingredient_title.rules"></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Quantity" type="number" v-model="ingredient.quantity"
                        :rules="rules.ingredient_quantity.rules"></v-text-field>
                </v-col>
                <v-col>
                    <v-combobox label="Unit" :items="units" v-model="ingredient.unit"
                        :rules="rules.ingredient_unit.rules"></v-combobox>
                </v-col>
                <v-col class="d-flex flex-column flex-grow-0 flex-shrink-0">
                    <v-icon icon="mdi-delete-circle" size="x-large" color="error" class="mb-4"
                        @click.prevent="removeIngredient(index)"></v-icon>
                </v-col>
            </v-row>
        </v-container>
        <!-- Steps-->
        <v-container class="px-0 mx-0">
            <v-row no-gutters>
                <v-col>
                    <h3>Steps</h3>
                </v-col>
                <v-col><v-icon icon="mdi-plus" @click.prevent="addStep"></v-icon></v-col>
            </v-row>
            <v-container class="px-0" v-for="(step, index) in steps" :key="index">
                <v-row align="center">
                    <v-col><v-text-field label="Title" v-model="step.title"
                            :rules="rules.ingredient_title.rules"></v-text-field>
                    </v-col>
                    <v-col class="flex-grow-0"><v-icon icon="mdi-delete-circle" size="x-large" color="error" class="mb-4"
                            @click.prevent="removeStep(index)"></v-icon></v-col>

                </v-row>

                <quill-editor theme="snow" v-model:content="step.description" contentType="html"></quill-editor>
                <v-file-input label="Pictures" multiple v-model="temp_step_pictures"
                    @change="addStepPicture(index)"></v-file-input>
                <div v-if="recipe.steps.length > 0">
                    <div class="flex flex-row" v-for="(picture, pictureIndex) in step.pictures" :key="picture.url">
                        <div class="relative"><img width="200" :src="picture.url" /><v-icon class="absolute top-0 right-0"
                                icon="mdi-delete-circle" color="error"
                                @click.prevent="removePicture(index, pictureIndex)"></v-icon></div>
                    </div>

                </div>
            </v-container>


        </v-container>
        <v-btn v-if="!in_submission" class="mt-2" type="submit" block color="primary">Submit</v-btn>
        <div class="d-flex justify-center align-center"><v-progress-circular v-if="in_submission" color="primary"
                indeterminate></v-progress-circular></div>


    </v-form>
</template>

<script>
import { ref, watch, shallowRef } from 'vue'
import { addRecipe, editRecipe } from '@/includes/collections/recipes'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    name: 'CreateEditRecipeForm',
    components: {
        QuillEditor
    },
    props: {
        recipe: {
            type: Object,
            required: false
        }
    },
    setup(props) {
        // Validation rules
        let rules = {
            title: {
                rules: [
                    value => {
                        if (value && value.length > 5) return true

                        return 'You must enter a title (5 car min).'
                    },
                ]
            },
            ingredient_title: {
                rules: [
                    value => {
                        if (value && value.length > 1) return true

                        return 'You must enter a title (1 car min).'
                    },
                ]
            },
            ingredient_quantity: {
                rules: [
                    value => {
                        if (value && value > 0) return true

                        return 'You must enter a quantity.'
                    },
                ]
            },
            ingredient_unit: {
                rules: [
                    value => {
                        if (value) return true

                        return 'You must select a unit.'
                    },
                ]
            },
            step_title: {
                rules: [
                    value => {
                        if (value && value.length > 1) return true

                        return 'You must enter a title (1 car min).'
                    },
                ]
            },
            step_description: {
                rules: [
                    value => {
                        if (value && value.length > 1) return true

                        return 'You must enter a title (1 car min).'
                    },
                ]
            },
        }
        const formRef = ref(null)
        let alert_text = ref('')
        let alert_type = ref('')
        let in_submission = ref(false)
        let units = ['gr', 'kg', 'L', 'ml', 'cl', 'u']
        let filesToDelete = ref([])
        let openSnackBar = ref(false)

        // Recipe value initialization
        let recipe_title = ref('')
        let temp_recipe_picture = ref(null)
        let temp_step_pictures = ref(null)
        let recipe_picture = ref(null)
        let recipeToEdit = ref(props.recipe || {})
        let ingredients = ref([])
        let steps = ref([])
        watch(() => props.recipe, (newRecipe) => { //Change recipe when props is initialized
            recipeToEdit.value = newRecipe
            recipe_title.value = recipeToEdit.value.title
            recipe_picture.value = recipeToEdit.value.main_picture
            steps.value = recipeToEdit.value.steps
            ingredients.value = recipeToEdit.value.ingredients
        })

        function addMainPicture() {
            filesToDelete.value.push(recipe_picture.value)
            // Create temporary url to display imagepreview
            recipe_picture.value = temp_recipe_picture.value
            recipe_picture.value.url = URL.createObjectURL(temp_recipe_picture.value);
            temp_recipe_picture.value = null
        }
        function addStepPicture(stepIndex) {
            temp_step_pictures.value.forEach((stepPicture) => {
                let currentStep = steps.value[stepIndex]
                currentStep.pictures.push(stepPicture)
                currentStep.pictures[currentStep.pictures.length - 1].url = URL.createObjectURL(currentStep.pictures[steps.value[stepIndex].pictures.length - 1])
            }
            )
            temp_step_pictures.value = null
        }
        function addIngredient() {
            const ingredientTemplate = {
                name: '',
                quantity: 0,
                unit: ''
            }
            ingredients.value.push(ingredientTemplate)
        }
        function removeIngredient(index) {
            ingredients.value.splice(index, 1)
        }
        function addStep() {
            let stepTemplate = {
                title: '',
                description: '',
                pictures: []
            }
            steps.value.push(stepTemplate)
        }
        function removeStep(index) {
            steps.value.splice(index, 1)
        }
        async function submitForm() {
            in_submission.value = true
            openSnackBar.value = true
            const recipe = {
                title: recipe_title.value,
                ingredients: ingredients.value
            }
            try {
                if (recipeToEdit.value.id) {
                    await editRecipe(recipeToEdit.value.id, recipe, steps.value, recipe_picture.value, filesToDelete.value)
                    alert_text.value = 'You recipe has been edited';
                    filesToDelete.value = []
                } else {
                    await addRecipe(recipe, recipe_picture.value, steps.value)
                    formRef.value.reset()
                    ingredients.value = []
                    steps.value = []
                    alert_text.value = 'You recipe has been added';
                }
                alert_type.value = 'success';


            } catch (error) {
                alert_type.value = 'error';
                alert_text.value = 'An error occured';
                in_submission.value = false
                console.log(error)
                return;
            }
            in_submission.value = false
        }
        function removePicture(stepIndex, pictureIndex) {
            filesToDelete.value.push(steps.value[stepIndex].pictures[pictureIndex])
            steps.value[stepIndex].pictures.splice(pictureIndex, 1)
        }

        return {
            rules,
            recipe_title,
            recipe_picture,
            ingredients,
            addIngredient,
            removeIngredient,
            steps,
            addStep,
            removeStep,
            units,
            submitForm,
            alert_text,
            alert_type,
            formRef,
            in_submission,
            recipeToEdit,
            addMainPicture,
            temp_recipe_picture,
            removePicture,
            temp_step_pictures,
            addStepPicture,
            openSnackBar
        }
    }
}
</script>