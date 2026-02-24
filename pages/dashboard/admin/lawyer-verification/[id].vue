<template>
  <section class="verification-detail-page">
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <NuxtLink
        to="/dashboard/admin/lawyer-verification"
        class="inline-flex items-center gap-2 text-[#1e3a5f] hover:underline font-medium">
        <Icon name="lucide:arrow-right" class="w-4 h-4" />
        بازگشت به لیست
      </NuxtLink>
      <NuxtLink
        v-if="detail?.lawyer_id"
        :to="`/dashboard/admin/lawyerlist/edit/${detail.lawyer_id}`"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-[#1e3a5f] font-medium">
        <Icon name="lucide:external-link" class="w-4 h-4" />
        ویرایش وکیل
      </NuxtLink>
    </div>

    <div v-if="loading" class="loading-wrap">
      <UIcon name="lucide:loader-2" class="size-8 animate-spin text-gray-400" />
      <span>در حال بارگذاری...</span>
    </div>

    <div v-else-if="error" class="error-wrap">
      <Icon name="lucide:alert-circle" class="w-12 h-12 text-red-400" />
      <p class="font-medium text-gray-800">{{ error }}</p>
      <NuxtLink to="/dashboard/admin/lawyer-verification" class="btn-primary mt-4">
        بازگشت به لیست
      </NuxtLink>
    </div>

    <template v-else-if="detail">
      <!-- خلاصه درخواست -->
      <div class="card mb-6">
        <h2 class="section-title">وضعیت درخواست</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span class="label">وضعیت</span>
            <span :class="statusClass(detail.status)">{{ statusLabel(detail.status) }}</span>
          </div>
          <div>
            <span class="label">تاریخ درخواست</span>
            <span class="value">{{ formatDate(detail.requested_at) }}</span>
          </div>
          <div v-if="detail.reviewed_at">
            <span class="label">تاریخ بررسی</span>
            <span class="value">{{ formatDate(detail.reviewed_at) }}</span>
          </div>
          <div v-if="detail.notes">
            <span class="label">یادداشت</span>
            <span class="value">{{ detail.notes }}</span>
          </div>
        </div>
      </div>

      <!-- اطلاعات تماس و پایه -->
      <div class="card mb-6">
        <h2 class="section-title">اطلاعات تماس و پایه</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><span class="label">نام</span><span class="value">{{ detail.lawyer?.name }}</span></div>
          <div><span class="label">نام خانوادگی</span><span class="value">{{ detail.lawyer?.family }}</span></div>
          <div><span class="label">موبایل</span><span class="value font-mono">{{ detail.lawyer?.phone || '—' }}</span></div>
          <div><span class="label">ایمیل</span><span class="value">{{ detail.lawyer?.email || '—' }}</span></div>
          <div><span class="label">پایه</span><span class="value">{{ detail.lawyer?.base || '—' }}</span></div>
          <div><span class="label">شهر / استان</span><span class="value">{{ [detail.lawyer?.city, detail.lawyer?.province].filter(Boolean).join(' / ') || '—' }}</span></div>
          <div><span class="label">نمایش در سایت</span><span class="value">{{ detail.lawyer?.is_active ? 'فعال' : 'غیرفعال' }}</span></div>
          <div><span class="label">احراز هویت (KYC)</span><span class="value">{{ detail.lawyer?.kyc_verified ? 'تایید شده' : 'تایید نشده' }}</span></div>
        </div>
      </div>

      <!-- اطلاعات شخصی / پروفایل -->
      <div v-if="detail.lawyer?.lawyer_info" class="card mb-6">
        <h2 class="section-title">اطلاعات شخصی و پروفایل</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="detail.lawyer.lawyer_info.gender"><span class="label">جنسیت</span><span class="value">{{ detail.lawyer.lawyer_info.gender === 'male' ? 'مرد' : detail.lawyer.lawyer_info.gender === 'female' ? 'زن' : detail.lawyer.lawyer_info.gender }}</span></div>
          <div v-if="detail.lawyer.lawyer_info.father_name"><span class="label">نام پدر</span><span class="value">{{ detail.lawyer.lawyer_info.father_name }}</span></div>
          <div v-if="detail.lawyer.lawyer_info.birth_date"><span class="label">تاریخ تولد</span><span class="value">{{ detail.lawyer.lawyer_info.birth_date }}</span></div>
          <div v-if="detail.lawyer.lawyer_info.address" class="sm:col-span-2"><span class="label">آدرس</span><span class="value">{{ detail.lawyer.lawyer_info.address }}</span></div>
        </div>
        <div v-if="detail.lawyer.lawyer_info.about" class="mt-4">
          <span class="label block mb-1">درباره وکیل</span>
          <p class="value text-sm leading-relaxed">{{ detail.lawyer.lawyer_info.about }}</p>
        </div>
        <div v-if="detail.lawyer.lawyer_info.profile_image" class="mt-4">
          <span class="label block mb-1">تصویر پروفایل</span>
          <img
            :src="(config.public?.imageBase || '') + detail.lawyer.lawyer_info.profile_image"
            alt="پروفایل"
            class="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>

      <!-- سوابق تحصیلی -->
      <div class="card mb-6">
        <h2 class="section-title">سوابق تحصیلی</h2>
        <div v-if="!detail.educations?.length" class="text-sm text-gray-500">ثبت نشده</div>
        <ul v-else class="space-y-3">
          <li
            v-for="(edu, i) in detail.educations"
            :key="edu.id || i"
            class="border border-gray-100 rounded-lg p-3 text-sm">
            <span class="font-medium">{{ edu.degree_text || edu.degree }}</span>
            <span v-if="edu.field_of_study"> — {{ edu.field_of_study }}</span>
            <span v-if="edu.university" class="block text-gray-600">{{ edu.university }}</span>
            <span v-if="edu.place_of_study" class="block text-gray-500">{{ edu.place_of_study }}</span>
          </li>
        </ul>
      </div>

      <!-- محل کار -->
      <div class="card mb-6">
        <h2 class="section-title">محل کار</h2>
        <div v-if="!detail.workplaces?.length" class="text-sm text-gray-500">ثبت نشده</div>
        <ul v-else class="space-y-3">
          <li
            v-for="(wp, i) in detail.workplaces"
            :key="wp.id || i"
            class="border border-gray-100 rounded-lg p-3 text-sm">
            <span class="font-medium">{{ wp.name }}</span>
            <span v-if="wp.address" class="block text-gray-600">{{ wp.address }}</span>
            <span v-if="wp.phone" class="block font-mono text-gray-500">{{ wp.phone }}</span>
            <span v-if="wp.city?.name || wp.province?.name" class="block text-gray-500">{{ [wp.city?.name, wp.province?.name].filter(Boolean).join('، ') }}</span>
            <div v-if="wp.work_times?.length" class="mt-2 text-xs text-gray-500">
              ساعات: {{ wp.work_times.map(wt => `${wt.day_name || ''} ${wt.shift1_start || ''}-${wt.shift1_end || ''}`).join(' | ') }}
            </div>
          </li>
        </ul>
      </div>

      <!-- ساعات کاری -->
      <div class="card mb-6">
        <h2 class="section-title">ساعات کاری</h2>
        <div v-if="!detail.weekly_schedule?.length" class="text-sm text-gray-500">ثبت نشده</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm text-right">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="py-2 px-2">روز</th>
                <th class="py-2 px-2">چت</th>
                <th class="py-2 px-2">تلفن</th>
                <th class="py-2 px-2">حضوری</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="day in detail.weekly_schedule"
                :key="day.day_of_week"
                class="border-b border-gray-100">
                <td class="py-2 px-2 font-medium">{{ day.day_name }}</td>
                <td class="py-2 px-2">{{ formatScheduleSlots(day.schedules?.chat) }}</td>
                <td class="py-2 px-2">{{ formatScheduleSlots(day.schedules?.phone) }}</td>
                <td class="py-2 px-2">{{ formatScheduleSlots(day.schedules?.inperson) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- قیمت‌گذاری -->
      <div class="card mb-6">
        <h2 class="section-title">قیمت‌گذاری مشاوره</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><span class="label">چت</span><span class="value">{{ formatPrice(detail.lawyer?.consultation_price_chat ?? detail.prices?.chat) }}</span></div>
          <div><span class="label">تلفنی</span><span class="value">{{ formatPrice(detail.lawyer?.consultation_price_phone ?? detail.prices?.phone) }}</span></div>
          <div><span class="label">حضوری</span><span class="value">{{ formatPrice(detail.lawyer?.consultation_price_inperson ?? detail.prices?.inperson) }}</span></div>
        </div>
      </div>

      <!-- دکمه‌های تایید / رد -->
      <div v-if="detail.status === 'pending'" class="card flex flex-wrap gap-4">
        <button
          type="button"
          class="btn-approve"
          :disabled="actionLoading === 'approve'"
          @click="approve(detail.id)">
          <Icon v-if="actionLoading === 'approve'" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:check" class="w-4 h-4" />
          تایید درخواست
        </button>
        <button
          type="button"
          class="btn-reject"
          :disabled="actionLoading === 'reject'"
          @click="reject(detail.id)">
          <Icon v-if="actionLoading === 'reject'" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
          <Icon v-else name="lucide:x" class="w-4 h-4" />
          رد درخواست
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig();

const detail = ref(null);
const loading = ref(true);
const error = ref(null);
const actionLoading = ref(null);

async function fetchDetail() {
  loading.value = true;
  error.value = null;
  try {
    const res = await useGet({
      url: `admin/lawyer-verification-requests/${route.params.id}`,
      includeAuthHeader: true,
    });
    const data = res.data?.data ?? res.data;
    if (data && (data.id || data.lawyer_id !== undefined)) {
      detail.value = data;
    } else {
      error.value = 'درخواست یافت نشد.';
    }
  } catch (e) {
    error.value = e?.data?.message || 'خطا در بارگذاری اطلاعات.';
  } finally {
    loading.value = false;
  }
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusLabel(s) {
  const map = { pending: 'در انتظار بررسی', approved: 'تایید شده', rejected: 'رد شده' };
  return map[s] || s;
}

function statusClass(s) {
  const map = {
    pending: 'badge badge-warning',
    approved: 'badge badge-success',
    rejected: 'badge badge-error',
  };
  return map[s] || 'badge';
}

function formatPrice(v) {
  if (v == null || v === '') return '—';
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n > 0 ? `${n.toLocaleString('fa-IR')} تومان` : '—';
}

function formatScheduleSlots(slots) {
  if (!slots || !Array.isArray(slots) || slots.length === 0) return '—';
  return slots.map((s) => `${s.start_time || ''}-${s.end_time || ''}`).filter(Boolean).join(' ، ');
}

async function approve(id) {
  actionLoading.value = 'approve';
  try {
    const res = await usePut({
      url: `admin/lawyer-verification-requests/${id}/approve`,
      includeAuthHeader: true,
      body: {},
    });
    if (res.statusCode === 200) {
      toast.add({ title: 'وکیل با موفقیت تایید شد', color: 'success' });
      await fetchDetail();
      router.push('/dashboard/admin/lawyer-verification');
    } else {
      toast.add({ title: res.message || 'خطا در تایید', color: 'error' });
    }
  } catch (e) {
    toast.add({ title: 'خطا در تایید', color: 'error' });
  } finally {
    actionLoading.value = null;
  }
}

async function reject(id) {
  actionLoading.value = 'reject';
  try {
    const res = await usePut({
      url: `admin/lawyer-verification-requests/${id}/reject`,
      includeAuthHeader: true,
      body: {},
    });
    if (res.statusCode === 200) {
      toast.add({ title: 'درخواست رد شد', color: 'success' });
      await fetchDetail();
      router.push('/dashboard/admin/lawyer-verification');
    } else {
      toast.add({ title: res.message || 'خطا در رد', color: 'error' });
    }
  } catch (e) {
    toast.add({ title: 'خطا در رد', color: 'error' });
  } finally {
    actionLoading.value = null;
  }
}

onMounted(() => {
  fetchDetail();
});

useHead({
  title: 'جزئیات درخواست تایید وکیل | وکیل وکیل',
});
</script>

<style scoped>
@reference "tailwindcss";

.verification-detail-page {
  @apply w-auto;
}

.loading-wrap,
.error-wrap {
  @apply flex flex-col items-center justify-center py-16 gap-3 text-gray-500;
}

.card {
  @apply bg-white rounded-xl border border-gray-100 p-6 shadow-sm;
}

.section-title {
  @apply text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100;
}

.label {
  @apply block text-xs font-medium text-gray-500 mb-0.5;
}

.value {
  @apply text-sm text-gray-800;
}

.badge {
  @apply px-2 py-0.5 rounded text-xs font-medium;
}

.badge-warning {
  @apply bg-amber-100 text-amber-800;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.btn-approve {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50;
}

.btn-reject {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50;
}
</style>
