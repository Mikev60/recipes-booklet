import { createApp } from "vue";
import { createPinia } from "pinia";
import "./styles/tailwind.css";

import App from "./App.vue";
import router from "./router";

// Import Vuetify et ses styles
import "vuetify/styles";
import { createVuetify } from "vuetify";

// Import de l'icône Material Design
import "@mdi/font/css/materialdesignicons.css";

// Import des styles nécessaires
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "monTheme", // Nom de ton thème
    themes: {
      monTheme: {
        dark: false, // ou true pour activer le mode sombre
        colors: {
          primary: "#3f51b5", // Couleur du bouton primaire
          secondary: "#b0bec5", // Couleur du bouton secondaire
          accent: "#8c9eff",
          error: "#b71c1c",
        },
      },
    },
  },
  components,
  directives,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
