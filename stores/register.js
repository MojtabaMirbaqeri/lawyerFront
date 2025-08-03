// stores/register.js
import { defineStore } from "pinia";

export const useRegisterStore = defineStore("register", {
  state: () => ({
    formStep: 1,
    userInformation:{phone:'',code:'',type:''}
  }),

  actions: {
    nextStep() {
      this.formStep += 1;
    },
    prevStep() {
      this.formStep -= 1;
    },
  },
});
