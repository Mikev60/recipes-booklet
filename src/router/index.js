import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import AdminRecipeDetail from "@/components/AdminRecipeDetail.vue";
import UserRecipeDetail from "@/components/UserRecipeDetail.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
    },
    {
      path: "/admin/recipe/:id",
      name: "admin recipe detail",
      component: AdminRecipeDetail,
    },
    {
      path: "/recipe/:id",
      name: "user recipe detail",
      component: UserRecipeDetail,
    },
  ],
});

export default router;
