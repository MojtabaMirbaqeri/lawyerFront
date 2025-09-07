// stores/global.js
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("globl", {
  state: () => ({
    lawyersCount: 0,
  }),
});
