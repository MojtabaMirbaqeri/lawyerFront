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
    price: [],
    ticketFilter: {
      status: [
        {
          id: 'open',
          label: 'باز'
        },
        {
          id: 'in_progress',
          label: 'در حال پیگیری'
        },
        {
          id: 'answered',
          label: 'پاسخ داده شده'
        },
        {
          id: 'waiting_for_user',
          label: 'در انتظار پاسخ کاربر'
        },
        {
          id: 'closed',
          label: 'بسته شده'
        },
        {
          id:0,
          label:'همه'
        }
      ],
      priority: [
        {
          id: 1,
          label: 'کم'
        },
        {
          id: 2,
          label: 'متوسط'
        },
        {
          id: 3,
          label: 'زیاد'
        },
        {
          id: 4,
          label: 'فوری'
        },
        {
          id:0,
          label:'همه'
        }
      ],
      type: [
        { id: 'financial', label: 'مالی' },
        { id: 'technical', label: 'فنی' },
        { id: 'violation_report', label: 'گزارش تخلف' },
        { id: 'other', label: 'سایر' },
        {
          id:0,
          label:'همه'
        }
      ]
    }
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
      const keys = ["visitType", "gender", "lawyerSpecialty"];
      keys.forEach((key) => {
        if (filters[key] !== undefined) {
          this.selectedFilters[key] = filters[key];
        }
      });
    },
  },
});
