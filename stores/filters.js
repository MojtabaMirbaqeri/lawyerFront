// stores/filters.js
import { defineStore } from "pinia";

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    drawerVisiblity: false,
    visitTypes: [
      { title: "حضوری", id: "inperson", icon: "hugeicons:building-06" },
      { title: "تلفنی", id: "phone", icon: "hugeicons:telephone" },
      { title: "چت", id: "chat", icon: "hugeicons:message-multiple-02" },
    ],
    genders: [
      { title: "مرد", id: "male", icon: "custom:male" },
      { title: "زن", id: "female", icon: "custom:female" },
    ],
    sortItems: [
      {
        label: "پیش فرض",
        value: "default",
      },
      {
        label: "بیشترین مراجعه",
        value: "clients",
      },
      {
        label: "بیشترین امتیاز",
        value: "rating",
      },
    ],
    lawyerTypes: [],
    lawyerSpecialties: [],
    lawyerServices: [],
    selectedFilters: {
      visitType: [],
      gender: null,
      sortBy: null,
      lawyerType: null,
      lawyerSpecialty: null,
      city: null,
      searchField: null,
    },
    price: [],
  }),

  actions: {
    setLawyerTypes(types) {
      this.lawyerTypes = types;
      this.selectedFilters.lawyerType = types[0]?.id;
    },
    setLawyerSpecialties(specialties) {
      this.lawyerSpecialties = specialties;
    },
    setLawyerServices(services) {
      this.lawyerServices = services;
    },
    applyFilters(filters) {
      const keys = ["visitType", "gender", "lawyerSpecialty"];
      keys.forEach((key) => {
        if (filters[key] !== undefined) {
          this.selectedFilters[key] = filters[key];
        }
      });
    },
  },
});
