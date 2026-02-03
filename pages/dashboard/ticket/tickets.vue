<!-- eslint-disable vue/no-ref-as-operand -->
<template>
  <section class="tickets-page overflow-x-hidden">
    <div class="ds-table-con tickets-container">
      <!-- دکمه ایجاد: در موبایل تمام عرض -->
      <UICSecondaryBtn
        class="ticket-create-btn w-full sm:w-auto rounded-[8px]! sm:ms-auto"
        @click="navigateTo('/dashboard/new/ticket')">
        <span>ایجاد تیکت</span>
      </UICSecondaryBtn>

      <!-- فیلترها: در موبایل گرید دو ستونه، از sm به بعد در یک ردیف -->
      <div class="tickets-filters grid grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap gap-2 items-stretch">
        <div class="filter-search col-span-2 sm:max-w-[220px] lg:max-w-[250px] flex flex-col gap-1">
          <label class="filter-label text-sm font-medium text-gray-700">جستجو</label>
          <UInput
            v-model="globalFilter"
            :ui="{ base: 'h-[42px] w-full' }"
            placeholder="جستجو در تیکت‌ها..."
            @input="debouncedSearch"
            icon="solar:magnifer-linear" />
        </div>
        <div class="filter-field sm:min-w-[120px] sm:max-w-[160px]">
          <UICInput label="وضعیت">
            <template #input>
              <UICSelect :items="filterStore.ticketFilter.status" v-model="status" />
            </template>
          </UICInput>
        </div>
        <div class="filter-field sm:min-w-[120px] sm:max-w-[160px]">
          <UICInput label="اولویت">
            <template #input>
              <UICSelect :items="filterStore.ticketFilter.priority" v-model="priority" />
            </template>
          </UICInput>
        </div>
        <div class="filter-field col-span-2 sm:col-span-1 sm:min-w-[120px] sm:max-w-[160px]">
          <UICInput label="دپارتمان">
            <template #input>
              <UICSelect :items="filterStore.ticketFilter.type" v-model="type" />
            </template>
          </UICInput>
        </div>
      </div>

      <!-- جدول: در موبایل داخل اسکرول افقی تا صفحه اسکرول نکند -->
      <div class="table-scroll-wrap min-w-0 overflow-x-auto -mx-1 px-1">
        <UICDataTable :data="data" :columns="columns" :total="total" v-model="page" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { h, resolveComponent } from "vue";

const globalFilter = ref("");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");
const filterStore = useFiltersStore();

const status = ref(0);
const priority = ref(0);
const type = ref(0);

const selectQuery = ref();

watch([status, priority, type], async (newVal, oldVal) => {
  const obj = { status: newVal[0], priority: newVal[1], type: newVal[2] };
  selectQuery.value = obj;
  console.log(selectQuery.value);
  refetch(null, selectQuery.value, true);
  page.value = 1;
});

const page = ref(1);

const searchHandle = () => {
  if (!globalFilter.value) {
    refetch(null, null, true, null);
  } else {
    refetch(null, null, true, globalFilter.value);
    page.value = 1;
  }
};

let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchHandle();
  }, 400);
};

const refetch = async (page = null, query = null, setTotal = false, search = null) => {
  console.log(search);

  const res = await useGet({
    url: "tickets/user",
    includeAuthHeader: true,
    query: {
      page: page ? page : undefined,
      status: query && query.status ? query.status : undefined,
      priority: query && query.priority ? query.priority : undefined,
      type: query && query.type ? query.type : undefined,
      search: search ? search : undefined,
    },
  });
  data.value = res.data.data.data.tickets.map((ticket) => {
    return {
      id: ticket?.ticket_number,
      ticketTitle: ticket?.title,
      priority: ticket?.priority?.label,
      type: ticket?.type?.label,
      status: ticket?.status?.label,
      statusVal: ticket?.status?.value,
      fullname: `${ticket?.user?.name} ${ticket?.user?.family}`,
      ticketId: ticket?.id,
    };
  });

  if (setTotal) {
    total.value = res.data.data.data.pagination.total;
    console.log(total.value);
  }
};

watch(
  () => page.value,
  async (page) => {
    if (
      selectQuery.value?.status ||
      selectQuery.value?.priority ||
      selectQuery.value?.type
    ) {
      refetch(page, selectQuery.value, true);
    } else if (globalFilter.value) {
      refetch(page, null, null, globalFilter.value);
    } else {
      refetch(page, null);
    }
  }
);

const res = await useGet({
  url: "tickets/user",
  includeAuthHeader: true,
});

const tickets = ref(res.data.data.data.tickets);

const total = ref(res.data.data.data.pagination.total);

const data = ref(
  tickets.value.map((ticket) => {
    return {
      id: ticket?.ticket_number,
      ticketTitle: ticket?.title,
      priority: ticket?.priority?.label,
      type: ticket?.type?.label,
      status: ticket?.status?.label,
      statusVal: ticket?.status?.value,
      fullname: `${ticket?.user?.name} ${ticket?.user?.family}`,
      ticketId: ticket?.id,
    };
  })
);

const columns = ref([
  {
    accessorKey: "id",
    header: "شماره تیکت",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "ticketTitle",
    header: "عنوان تیکت",
  },
  {
    accessorKey: "fullname",
    header: "کاربر",
  },
  {
    accessorKey: "priority",
    header: "اولویت",
  },
  {
    accessorKey: "type",
    header: "دپارتمان",
  },
  {
    accessorKey: "statusVal",
    header: "دپارتمان",
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const color = {
        open: "primary",
        closed: "error",
        in_progress: "secondary",
        answered: "success",
        waiting_for_user: "warning",
      }[row.getValue("statusVal")];

      return h(UBadge, { class: "capitalize", variant: "soft", color }, () =>
        row.getValue("status")
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },

            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            })
        )
      );
    },
  },
]);

function getRowItems(row) {
  const items = [
    {
      type: "label",
      label: "فعالیت ها",
    },
  ];

  if (row.original.statusVal !== "closed") {
    items.splice(1, 0, {
      label: "پاسخ به تیکت",
      onSelect() {
        navigateTo(`/dashboard/ticket/${row.original.ticketId}`);
      },
      icon: "solar:pen-outline",
    });
  }

  if (row.original.statusVal === "closed") {
    items.splice(1, 0, {
      label: "مشاهده تیکت ها",
      onSelect() {
        navigateTo(`/dashboard/ticket/${row.original.ticketId}`);
      },
      icon: "hugeicons:message-multiple-02",
    });
  }

  return items;
}
useHead({
  title: "تیکت‌ها | وکیل وکیل",
});
</script>

<style scoped>
@reference "tailwindcss";

.tickets-page {
  @apply min-w-0 w-full;
}

.tickets-container {
  @apply min-w-0;
}

.table-scroll-wrap {
  @apply min-w-0 overflow-x-auto;
  -webkit-overflow-scrolling: touch;
}
</style>
