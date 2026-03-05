<template>
  <div class="blocked-times-page">
    <div class="page-header mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="page-title">بازه‌های مسدود</h1>
        <p class="page-description">زمان‌هایی که برای رزرو در دسترس نیستند (دادگاه، مرخصی، استراحت و ...).</p>
      </div>
      <button type="button" class="btn-primary" @click="openAddModal">
        <Icon name="lucide:plus" class="w-4 h-4" />
        افزودن بازه مسدود
      </button>
    </div>
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
    </div>
    <div v-else class="card-dashboard">
      <div class="card-dashboard-body p-6">
        <div v-if="items.length === 0" class="empty-state py-12 text-center">
          <Icon name="lucide:calendar-off" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-muted-foreground">هنوز بازه مسدودی تعریف نشده است.</p>
          <button type="button" class="btn-primary mt-4" @click="openAddModal">افزودن بازه مسدود</button>
        </div>
        <ul v-else class="divide-y divide-gray-100">
          <li v-for="item in items" :key="item.id" class="py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="font-medium">{{ formatDate(item.start_at) }} – {{ formatDate(item.end_at) }}</span>
              <span class="mr-2 badge badge-gray">{{ typeLabel(item.type) }}</span>
              <p v-if="item.note" class="text-sm text-muted-foreground mt-1">{{ item.note }}</p>
            </div>
            <button type="button" class="btn-ghost text-red-600 hover:bg-red-50" :disabled="deletingId === item.id" @click="remove(item.id)">
              حذف
            </button>
          </li>
        </ul>
      </div>
    </div>
    <UModal v-model:open="showAddModal" class="overflow-visible">
      <template #content>
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">افزودن بازه مسدود</h3>
            <button type="button" class="btn-icon" @click="showAddModal = false">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <form class="modal-body space-y-4" @submit.prevent="submitAdd">
            <div>
              <label class="block text-sm font-medium mb-1">از</label>
              <div class="date-picker-wrap">
                <PersianDate
                  v-model="addForm.start_at"
                  :column="1"
                  mode="single"
                  type="datetime"
                >
                  <template #icon>
                    <UIcon name="solar:calendar-linear" class="h-full! w-5!" />
                  </template>
                </PersianDate>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">تا</label>
              <div class="date-picker-wrap">
                <PersianDate
                  v-model="addForm.end_at"
                  :column="1"
                  mode="single"
                  type="datetime"
                >
                  <template #icon>
                    <UIcon name="solar:calendar-linear" class="h-full! w-5!" />
                  </template>
                </PersianDate>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">نوع</label>
              <select v-model="addForm.type" class="input-dashboard w-full rounded border border-gray-200 p-2">
                <option value="court">جلسه دادگاه</option>
                <option value="break">استراحت</option>
                <option value="personal">شخصی</option>
                <option value="vacation">مرخصی</option>
                <option value="external">رزرو خارجی</option>
                <option value="other">سایر</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">یادداشت (اختیاری)</label>
              <UTextarea v-model="addForm.note" rows="2" />
            </div>
          </form>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showAddModal = false">انصراف</button>
            <button type="button" class="btn-primary" @click="submitAdd">افزودن</button>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>
import PersianDate from "@alireza-ab/vue3-persian-datepicker";
import { toGregorian } from "jalaali-js";

useHead({ title: 'بازه‌های مسدود | وکیل وکیل' });
const toast = useToast();

const pad = (n) => String(n).padStart(2, "0");
const items = ref([]);
const loading = ref(true);
const deletingId = ref(null);
const showAddModal = ref(false);
const addForm = ref({
  start_at: '',
  end_at: '',
  type: 'other',
  note: '',
});
const typeLabels = { court: 'جلسه دادگاه', break: 'استراحت', personal: 'شخصی', vacation: 'مرخصی', external: 'رزرو خارجی', other: 'سایر' };
function typeLabel(type) { return typeLabels[type] || type; }
function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}
async function fetchItems() {
  try {
    const res = await useGet({ url: 'lawyer/blocked-times', includeAuthHeader: true });
    items.value = res.data?.data ?? [];
  } catch (e) {
    toast.add({ title: 'خطا در بارگذاری', color: 'error' });
  } finally {
    loading.value = false;
  }
}
/** مقدار اولیه به فرمت "YYYY-MM-DD HH:mm" برای PersianDate type="datetime" (میلادی برای سازگاری) */
function getInitialDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function openAddModal() {
  const now = new Date();
  const end = new Date(now.getTime() + 60 * 60 * 1000);
  addForm.value = {
    start_at: getInitialDateTime(now),
    end_at: getInitialDateTime(end),
    type: 'other',
    note: '',
  };
  showAddModal.value = true;
}

/** تبدیل خروجی datepicker (شمسی یا میلادی) به فرمت API: "YYYY-MM-DD HH:mm:ss" میلادی */
function toApiDateTime(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  const [datePart, timePart] = trimmed.split(/\s+/);
  if (!datePart) return '';
  const parts = datePart.split('-').map(Number);
  if (parts.length < 3) return '';
  let [y, m, d] = parts;
  let gy, gm, gd;
  if (y >= 1300 && y <= 1500) {
    const g = toGregorian(y, m, d);
    gy = g.gy;
    gm = g.gm;
    gd = g.gd;
  } else {
    gy = y;
    gm = m;
    gd = d;
  }
  const time = (timePart || '00:00').slice(0, 5);
  return `${gy}-${pad(gm)}-${pad(gd)} ${time}:00`;
}
async function submitAdd() {
  const start = toApiDateTime(addForm.value.start_at);
  const end = toApiDateTime(addForm.value.end_at);
  if (!start || !end) {
    toast.add({ title: 'لطفاً تاریخ و ساعت شروع و پایان را انتخاب کنید', color: 'error' });
    return;
  }
  try {
    await usePost({
      url: 'lawyer/blocked-times',
      includeAuthHeader: true,
      body: {
        start_at: start,
        end_at: end,
        type: addForm.value.type,
        note: addForm.value.note || undefined,
      },
    });
    toast.add({ title: 'بازه مسدود اضافه شد', color: 'success' });
    showAddModal.value = false;
    fetchItems();
  } catch (e) {
    toast.add({ title: e?.data?.message || 'خطا', color: 'error' });
  }
}
async function remove(id) {
  if (!confirm('حذف این بازه؟')) return;
  deletingId.value = id;
  try {
    await useDelete({ url: `lawyer/blocked-times/${id}`, includeAuthHeader: true });
    items.value = items.value.filter((i) => i.id !== id);
    toast.add({ title: 'حذف شد', color: 'success' });
  } catch (e) {
    toast.add({ title: 'خطا در حذف', color: 'error' });
  } finally {
    deletingId.value = null;
  }
}
onMounted(fetchItems);
</script>

<style scoped>
@reference "tailwindcss";

.date-picker-wrap {
  @apply relative;
}
</style>
