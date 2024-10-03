<template>
    <v-app-bar :elevation="2" color="primary">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.prevent="drawOpened = !drawOpened"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Recipes booklet</v-app-bar-title>

    </v-app-bar>

    <v-navigation-drawer v-if="drawOpened" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i" :value="item" color="primary" variant="plain"
            @click.prevent="navigateTo(item.route)">
            <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item>
    </v-navigation-drawer>
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