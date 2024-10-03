<template>
    <h2>Create / Edit a recipe</h2>
    <v-alert :text="alert_text" :type="alert_type" v-if="show_alert"></v-alert>
    <v-form class="w-full mt-4" @submit.prevent="submitForm" ref="formRef">
        <!-- Title, Picture inputs-->
        <v-text-field :rules="rules.title.rules" label="Title" v-model="recipe_title">

        </v-text-field>
        <v-file-input preprend-icon="mdi-camera" label="Picture" v-model="recipe_picture"></v-file-input>
        <!-- Ingredients-->
        <v-container class="px-0 mx-0 w-full">
            <v-row>
                <v-col cols="2">
                    <h3>Ingredients</h3>
                </v-col>
                <v-col><v-icon icon="mdi-plus" @click.prevent="addIngredient"></v-icon></v-col>
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
                <v-col cols="1">
                    <h3>Steps</h3>
                </v-col>
                <v-col><v-icon icon="mdi-plus" @click.prevent="addStep"></v-icon></v-col>
            </v-row>
            <v-container class="px-0" v-for="(step, index) in steps" :key="index">
                <v-row align="center">
                    <v-col><v-text-field label="Title" v-model="step.title"
                            :rules="rules.ingredient_title.rules"></v-text-field></v-col>
                    <v-col class="flex-grow-0"><v-icon icon="mdi-delete-circle" size="x-large" color="error" class="mb-4"
                            @click.prevent="removeStep(index)"></v-icon></v-col>

                </v-row>

                <v-textarea label="Description" v-model="step.description"
                    :rules="rules.step_description.rules"></v-textarea>
                <v-file-input label="Pictures" multiple v-model="step.pictures"></v-file-input>
            </v-container>


        </v-container>
        <v-btn v-if="!in_submission" class="mt-2" type="submit" block color="primary">Submit</v-btn>
        <div class="d-flex justify-center align-center"><v-progress-circular v-if="in_submission" color="primary"
                indeterminate></v-progress-circular></div>


    </v-form>
</template>

<script>
import { ref } from 'vue'
import { addRecipe } from '@/includes/collections/recipes'

export default {
    name: 'CreateEditRecipeForm',
    setup() {
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
        let show_alert = ref(false)
        let alert_text = ref('')
        let alert_type = ref('')
        let units = ['gr', 'kg', 'L', 'ml', 'cl', 'u']
        let recipe_title = ref('')
        let recipe_picture = ref(null)
        let in_submission = ref(false)

        let ingredients = ref([])
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

        let steps = ref([])
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
            const recipe = {
                title: recipe_title.value,
                ingredients: ingredients.value
            }
            try {

                await addRecipe(recipe, recipe_picture.value, steps.value)
                show_alert.value = true;
                alert_type.value = 'success';
                alert_text.value = 'You recipe has been added';
                formRef.value.reset()
                ingredients.value = []
                steps.value = []

            } catch (error) {
                show_alert.value = true;
                alert_type.value = 'error';
                alert_text.value = 'An error occured';
                in_submission.value = false
                console.log(error)
                return;
            }
            setTimeout(() => {
                show_alert.value = false
            }, 2000);
            in_submission.value = false
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
            show_alert,
            alert_text,
            alert_type,
            formRef,
            in_submission
        }
    }
}
</script>