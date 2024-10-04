<template>
    <v-app-bar :elevation="2" color="primary">

        <v-app-bar-title class="cursor-pointer" @click.prevent="navigateTo('home')">Recipes booklet</v-app-bar-title>
        <template v-slot:append>
            <v-btn class="cursor-pointer" @click.prevent="navigateTo('home')">Recipes</v-btn>
            <v-btn class="cursor-pointer" @click.prevent="navigateTo('admin')">Admin</v-btn>
        </template>

    </v-app-bar>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue'
export default {
    name: 'AppHeader',
    setup() {
        const router = useRouter();

        function navigateTo(route) {
            router.push({ name: route })
            drawOpened.value = false;
        }

        let drawOpened = ref(false);

        let items = [
            { text: 'Recipes', icon: 'mdi-book', route: 'home' },
            { text: 'Admin', icon: 'mdi-shield-crown', route: 'admin' },
        ]

        return {
            router,
            drawOpened,
            navigateTo,
            items
        }
    }
}
</script>