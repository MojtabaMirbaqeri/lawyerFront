// stores/register.js
import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    isVisible: true,
  }),

  actions: {
    toggleVisiblity() {
      this.isVisible = !this.isVisible;
    },
  },
});
