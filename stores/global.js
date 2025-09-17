// stores/global.js
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("globl", {
  state: () => ({
    lawyersCount: 0,
    sidebarVisblity: false,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarVisblity = !this.sidebarVisblity;
    },
  },
});
