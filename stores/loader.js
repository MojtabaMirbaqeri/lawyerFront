// stores/register.js
import { defineStore } from "pinia";

export const useLoaderStore = defineStore("loader", {
  state: () => ({
    isVisible: true,
    isBlur: false,
  }),

  actions: {
    toggleVisiblity() {
      this.isVisible = !this.isVisible;
    },
    showLoader({ blur = false }) {
      if (blur) this.isBlur = true;
      this.isVisible = true;
      document.body.classList.add("overflow-y-clip!");
    },
    hideLoader() {
      this.isBlur = false;
      this.isVisible = false;
      document.body.classList.remove("overflow-y-clip!");
    },
  },
});
