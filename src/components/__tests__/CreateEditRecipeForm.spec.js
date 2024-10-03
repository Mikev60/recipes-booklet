import { mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import CreateEditRecipeForm from "@/components/CreateEditRecipeForm.vue";
import { describe, it, expect, beforeEach } from "vitest";

// Create a vuetify instance
const vuetify = createVuetify();

describe("CreateEditRecipeForm.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(CreateEditRecipeForm, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("Add an ingredient", () => {
    expect(wrapper.vm.ingredients.length).toBe(0);

    wrapper.vm.addIngredient();

    expect(wrapper.vm.ingredients.length).toBe(1);
    expect(wrapper.vm.ingredients[0]).toEqual({
      name: "",
      quantity: 0,
      unit: "",
    });
  });

  it("Delete Ingredient", () => {
    wrapper.vm.addIngredient();
    wrapper.vm.addIngredient();
    expect(wrapper.vm.ingredients.length).toBe(2);

    wrapper.vm.removeIngredient(0);

    expect(wrapper.vm.ingredients.length).toBe(1);
    expect(wrapper.vm.ingredients[0]).toEqual({
      name: "",
      quantity: 0,
      unit: "",
    });
  });

  it("Add step", () => {
    expect(wrapper.vm.steps.length).toBe(0);

    wrapper.vm.addStep();

    expect(wrapper.vm.steps.length).toBe(1);
    expect(wrapper.vm.steps[0]).toEqual({
      title: "",
      description: "",
      pictures: [],
    });
  });

  it("Remove step", () => {
    wrapper.vm.addStep();
    wrapper.vm.addStep();
    expect(wrapper.vm.steps.length).toBe(2);

    wrapper.vm.removeStep(0);

    expect(wrapper.vm.steps.length).toBe(1);
    expect(wrapper.vm.steps[0]).toEqual({
      title: "",
      description: "",
      pictures: [],
    });
  });
});
