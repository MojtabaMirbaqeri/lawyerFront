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
    selectedFilters: {
      visitType: [],
      gender: null,
      sortBy: null,
      lawyerType: null,
      lawyerSpecialty: null,
      city: null,
      searchField: null,
    },
  }),

  actions: {
    setLawyerTypes(types) {
      this.lawyerTypes = types;
      this.selectedFilters.lawyerType = types[0]?.id;
    },
    setLawyerSpecialties(specialties) {
      this.lawyerSpecialties = specialties;
    },
    applyFilters(filters) {
      this.selectedFilters.visitType =
        filters.visitType ?? this.selectedFilters.visitType;

      this.selectedFilters.gender = filters.gender ?? this.selectedFilters.gender;

      this.selectedFilters.lawyerSpecialty =
        filters.lawyerSpecialty ?? this.selectedFilters.lawyerSpecialty;
    },
  },
});
