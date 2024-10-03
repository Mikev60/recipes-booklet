import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import HomeView from "@/views/HomeView.vue"; // Remplacez par le chemin correct
import * as firestore from "firebase/firestore"; // Importer toutes les fonctions dans un objet
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Importer les styles de Vuetify

// Jeu de données mocké
const mockRecipes = [
  { test: "Recette 1" },
  { test: "Recette 2" },
  { test: "Recette 3" },
];

const vuetify = createVuetify();

// Partial mock for getDocs
vi.mock("firebase/firestore", async () => {
  // Import for other functions of the module
  const actual = await vi.importActual("firebase/firestore");
  return {
    ...actual,
    getDocs: vi.fn(),
  };
});

describe("HomeView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("Display correct numbers of recipes", async () => {
    // Mock specifically getDocs
    vi.spyOn(firestore, "getDocs").mockResolvedValue({
      forEach: (callback) => {
        mockRecipes.forEach((recipe) => {
          callback({ data: () => recipe });
        });
      },
    });

    const wrapper = mount(HomeView, {
      global: {
        plugins: [vuetify],
      },
    });

    // Force to wait for asynchronous operations to complete before testing
    await new Promise((resolve) => setTimeout(resolve, 0));
    await wrapper.vm.$nextTick();

    const recipeItems = wrapper.findAll(".recipeItem");

    expect(recipeItems.length).toBe(mockRecipes.length);
  });
});
