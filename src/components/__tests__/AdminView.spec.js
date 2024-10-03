import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import AdminView from "@/views/AdminView.vue"; // Remplacez par le chemin correct
import { createVuetify } from "vuetify";
import "vuetify/styles"; // Importer les styles de Vuetify

const vuetify = createVuetify();
global.ResizeObserver = class {
  constructor(callback) {
    this.callback = callback;
  }

  observe(target) {
    this.callback && this.callback([{ target }]);
  }

  unobserve() {}

  disconnect() {}
};

describe("AdminView", () => {
  test("Component Mounted", () => {
    const wrapper = mount(AdminView, {
      global: {
        plugins: [vuetify],
      },
    });
    expect(wrapper.text()).toContain("Recipes Management");
  });
});
