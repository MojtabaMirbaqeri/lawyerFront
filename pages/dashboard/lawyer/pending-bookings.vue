<template>
  <div class="pending-bookings-page">
    <div class="page-header mb-6">
      <h1 class="page-title">درخواست‌های در انتظار تایید</h1>
      <p class="page-description">درخواست‌های رزروی که باید آن‌ها را تایید یا رد کنید.</p>
    </div>
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
    </div>
    <div v-else class="space-y-4">
      <div v-if="items.length === 0" class="card-dashboard">
        <div class="card-dashboard-body py-16 text-center">
          <Icon name="lucide:inbox" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-muted-foreground">درخواست در انتظار تاییدی ندارید.</p>
        </div>
      </div>
      <div v-for="apt in items" :key="apt.id" class="card-dashboard">
        <div class="card-dashboard-body p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="font-semibold text-content">{{ apt.user?.name }} {{ apt.user?.family }}</p>
              <p class="text-sm text-muted-foreground mt-1">
                {{ formatDate(apt.date) }} – ساعت {{ (apt.time || '').slice(0, 5) }} – {{ apt.duration }} دقیقه
              </p>
              <p v-if="apt.description" class="text-sm text-gray-600 mt-2">{{ apt.description }}</p>
              <p class="text-sm mt-2">مبلغ نوبت: {{ (apt.price || 0).toLocaleString('fa-IR') }} تومان</p>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="btn-primary"
                :disabled="actionId === apt.id"
                @click="accept(apt.id)"
              >
                تایید
              </button>
              <button
                type="button"
                class="btn-secondary border-red-200 text-red-700 hover:bg-red-50"
                :disabled="actionId === apt.id"
                @click="reject(apt.id)"
              >
                رد
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'درخواست‌های در انتظار تایید | وکیل وکیل' });
const toast = useToast();
const items = ref([]);
const loading = ref(true);
const actionId = ref(null);
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('fa-IR');
}
async function fetchItems() {
  try {
    const res = await useGet({ url: 'lawyer/appointments/pending-approval', includeAuthHeader: true });
    items.value = res.data?.data ?? [];
  } catch (e) {
    toast.add({ title: 'خطا در بارگذاری', color: 'error' });
  } finally {
    loading.value = false;
  }
}
async function accept(id) {
  actionId.value = id;
  try {
    await usePost({ url: `lawyer/appointments/${id}/accept`, includeAuthHeader: true });
    toast.add({ title: 'درخواست تایید شد', color: 'success' });
    items.value = items.value.filter((i) => i.id !== id);
  } catch (e) {
    toast.add({ title: e?.data?.message || 'خطا', color: 'error' });
  } finally {
    actionId.value = null;
  }
}
async function reject(id) {
  if (!confirm('آیا از رد این درخواست مطمئن هستید؟')) return;
  actionId.value = id;
  try {
    await usePost({ url: `lawyer/appointments/${id}/reject`, includeAuthHeader: true });
    toast.add({ title: 'درخواست رد شد', color: 'success' });
    items.value = items.value.filter((i) => i.id !== id);
  } catch (e) {
    toast.add({ title: e?.data?.message || 'خطا', color: 'error' });
  } finally {
    actionId.value = null;
  }
}
onMounted(fetchItems);
</script>
