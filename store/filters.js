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
    lawyerTypes: [],
    lawyerSpecialties: [],
    selectedFilters: {
      visitType: null,
      gender: null,
      lawyerType: null,
      lawyerSpecialty: null,
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

      this.selectedFilters.lawyerType =
        filters.lawyerType ?? this.selectedFilters.lawyerType;

      this.selectedFilters.lawyerSpecialty =
        filters.lawyerSpecialty ?? this.selectedFilters.lawyerSpecialty;
    },
  },
});
