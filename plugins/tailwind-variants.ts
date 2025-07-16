import { tv } from "tailwind-variants";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      tv,
    },
  };
});
