<template>
  <div class="pricing-section">
    <UICFormSection
      title="قیمت‌گذاری مشاوره"
      description="تعیین قیمت برای انواع مشاوره. قیمت‌ها برای هر جلسه ۳۰ دقیقه‌ای است."
      icon="lucide:banknote"
    >
      <template #actions>
        <div v-if="saveSuccess" class="save-status success">
          <Icon name="lucide:check-circle" class="w-4 h-4" />
          ذخیره شد
        </div>
      </template>

      <!-- Session Duration Setting -->
      <div class="session-settings">
        <div class="setting-item">
          <label class="setting-label">مدت هر جلسه</label>
          <div class="setting-options">
            <button 
              v-for="duration in durationOptions" 
              :key="duration.value"
              @click="sessionDuration = duration.value"
              :class="['duration-option', { active: sessionDuration === duration.value }]"
            >
              {{ duration.label }}
            </button>
          </div>
        </div>
        <div class="setting-item">
          <label class="setting-label">کارمزد پلتفرم</label>
          <span class="setting-value">{{ platformFeePercent }}%</span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-cards">
        <!-- Phone Counseling -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <div class="pricing-icon phone">
              <Icon name="lucide:phone" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="pricing-title">مشاوره تلفنی</h4>
              <p class="pricing-subtitle">{{ sessionDuration }} دقیقه مکالمه</p>
            </div>
          </div>
          <div class="pricing-card-body">
            <div class="price-input-wrap">
              <UInput
                :model-value="displayPrices.phone"
                @update:model-value="(val) => handlePriceInput('phone', val)"
                placeholder="قیمت را وارد کنید"
                class="price-input"
                dir="ltr"
              />
              <span class="price-suffix">تومان</span>
            </div>
            <p v-if="displayPrices.phone" class="price-words">{{ numberToWords(displayPrices.phone) }}</p>
            
            <!-- Net Income -->
            <div v-if="prices.phone" class="net-income">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              <span>درآمد خالص شما: <strong>{{ formatNumber(calculateNetIncome(prices.phone)) }}</strong> تومان</span>
            </div>

            <!-- Price Warning -->
            <div v-if="prices.phone && prices.phone < minPrice" class="price-warning">
              <Icon name="lucide:alert-triangle" class="w-4 h-4" />
              قیمت کمتر از حداقل پیشنهادی است ({{ formatNumber(minPrice) }} تومان)
            </div>
          </div>
        </div>

        <!-- Chat Counseling -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <div class="pricing-icon chat">
              <Icon name="lucide:message-circle" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="pricing-title">مشاوره چت</h4>
              <p class="pricing-subtitle">{{ sessionDuration }} دقیقه چت آنلاین</p>
            </div>
          </div>
          <div class="pricing-card-body">
            <div class="price-input-wrap">
              <UInput
                :model-value="displayPrices.chat"
                @update:model-value="(val) => handlePriceInput('chat', val)"
                placeholder="قیمت را وارد کنید"
                class="price-input"
                dir="ltr"
              />
              <span class="price-suffix">تومان</span>
            </div>
            <p v-if="displayPrices.chat" class="price-words">{{ numberToWords(displayPrices.chat) }}</p>
            
            <div v-if="prices.chat" class="net-income">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              <span>درآمد خالص شما: <strong>{{ formatNumber(calculateNetIncome(prices.chat)) }}</strong> تومان</span>
            </div>

            <div v-if="prices.chat && prices.chat < minPrice" class="price-warning">
              <Icon name="lucide:alert-triangle" class="w-4 h-4" />
              قیمت کمتر از حداقل پیشنهادی است
            </div>
          </div>
        </div>

        <!-- In-Person Counseling -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <div class="pricing-icon inperson">
              <Icon name="lucide:user" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="pricing-title">مشاوره حضوری</h4>
              <p class="pricing-subtitle">{{ sessionDuration }} دقیقه ملاقات</p>
            </div>
          </div>
          <div class="pricing-card-body">
            <div class="price-input-wrap">
              <UInput
                :model-value="displayPrices.inperson"
                @update:model-value="(val) => handlePriceInput('inperson', val)"
                placeholder="قیمت را وارد کنید"
                class="price-input"
                dir="ltr"
              />
              <span class="price-suffix">تومان</span>
            </div>
            <p v-if="displayPrices.inperson" class="price-words">{{ numberToWords(displayPrices.inperson) }}</p>
            
            <div v-if="prices.inperson" class="net-income">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              <span>درآمد خالص شما: <strong>{{ formatNumber(calculateNetIncome(prices.inperson)) }}</strong> تومان</span>
            </div>

            <div v-if="prices.inperson && prices.inperson < minPrice" class="price-warning">
              <Icon name="lucide:alert-triangle" class="w-4 h-4" />
              قیمت کمتر از حداقل پیشنهادی است
            </div>
          </div>
        </div>
      </div>

      <!-- Save Actions -->
      <div class="pricing-actions">
        <div class="pricing-status">
          <div v-if="hasChanges" class="unsaved-indicator">
            <Icon name="lucide:alert-circle" class="w-4 h-4" />
            تغییرات ذخیره نشده
          </div>
        </div>
        <div class="pricing-buttons">
          <button 
            v-if="hasChanges" 
            @click="resetPrices" 
            class="btn-secondary"
            :disabled="isLoading"
          >
            <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
            بازنشانی
          </button>
          <button 
            @click="savePrices" 
            class="btn-primary"
            :disabled="isLoading || !hasChanges"
          >
            <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:check" class="w-4 h-4" />
            {{ isLoading ? 'در حال ذخیره...' : 'ذخیره قیمت‌ها' }}
          </button>
        </div>
      </div>
    </UICFormSection>
  </div>
</template>

<script setup>
const props = defineProps({
  lawyerInformation: { type: Object, required: true },
});

const emit = defineEmits(['update:changes', 'saved']);
const toast = useToast();
const reFetchLawyer = inject("reFetchLawyerInformation");
const { formatNumber, parseNumber, numberToWords } = useNumberFormat();

// Constants
const platformFeePercent = 15;
const minPrice = 50000;
const durationOptions = [
  { value: 15, label: '۱۵ دقیقه' },
  { value: 30, label: '۳۰ دقیقه' },
  { value: 60, label: '۶۰ دقیقه' },
];

// Handle both nested {data: {...}} and flat {...} structures
const lawyerData = computed(() => {
  const info = props.lawyerInformation;
  return info?.data || info;
});

// State
const isLoading = ref(false);
const saveSuccess = ref(false);
const sessionDuration = ref(30);

const getInitialPrices = () => {
  const data = lawyerData.value || {};
  return {
    phone: data.consultation_price_phone || "",
    chat: data.consultation_price_chat || "",
    inperson: data.consultation_price_inperson || "",
  };
};

const prices = reactive(getInitialPrices());

const initialPrices = reactive(getInitialPrices());

const displayPrices = reactive({
  phone: formatNumber(prices.phone),
  chat: formatNumber(prices.chat),
  inperson: formatNumber(prices.inperson),
});

// Computed
const hasChanges = computed(() => {
  return (
    prices.phone !== initialPrices.phone ||
    prices.chat !== initialPrices.chat ||
    prices.inperson !== initialPrices.inperson
  );
});

// Watch for changes
watch(hasChanges, (val) => {
  emit('update:changes', 'pricing', val);
});

// Methods
function handlePriceInput(field, value) {
  const formatted = formatNumber(value);
  displayPrices[field] = formatted;
  prices[field] = parseNumber(formatted);
}

function calculateNetIncome(price) {
  if (!price) return 0;
  return Math.floor(price * (1 - platformFeePercent / 100));
}

function resetPrices() {
  Object.assign(prices, { ...initialPrices });
  displayPrices.phone = formatNumber(initialPrices.phone);
  displayPrices.chat = formatNumber(initialPrices.chat);
  displayPrices.inperson = formatNumber(initialPrices.inperson);
}

async function savePrices() {
  isLoading.value = true;

  const formData = new FormData();
  formData.append("consultation_price_phone", prices.phone);
  formData.append("consultation_price_chat", prices.chat);
  formData.append("consultation_price_inperson", prices.inperson);

  try {
    const res = await usePost({
      url: "lawyers/updateProfile",
      includeAuthHeader: true,
      body: formData,
    });

    if (res.statusCode === 200) {
      Object.assign(initialPrices, { ...prices });
      
      saveSuccess.value = true;
      setTimeout(() => { saveSuccess.value = false; }, 3000);
      
      toast.add({ description: "قیمت‌ها با موفقیت ذخیره شد.", color: "success" });
      await reFetchLawyer();
      emit('saved');
    } else {
      toast.add({ description: "خطا در ذخیره قیمت‌ها.", color: "error" });
    }
  } catch (err) {
    console.error("Pricing submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.pricing-section {
  @apply flex flex-col gap-6;
}

/* Session Settings */
.session-settings {
  @apply flex flex-wrap items-center gap-6 p-4 bg-gray-50 rounded-lg mb-6;
}

.setting-item {
  @apply flex items-center gap-3;
}

.setting-label {
  @apply text-sm font-medium text-gray-600;
}

.setting-options {
  @apply flex gap-1;
}

.duration-option {
  @apply px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors;
}

.duration-option.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.duration-option:not(.active):hover {
  @apply bg-gray-100;
}

.setting-value {
  @apply text-sm font-semibold text-gray-900;
}

/* Pricing Cards */
.pricing-cards {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.pricing-card {
  @apply bg-white rounded-xl border border-gray-100 overflow-hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.pricing-card-header {
  @apply flex items-center gap-3 p-4 border-b border-gray-100;
}

.pricing-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center;
}

.pricing-icon.phone {
  @apply bg-green-100 text-green-600;
}

.pricing-icon.chat {
  @apply bg-blue-100 text-blue-600;
}

.pricing-icon.inperson {
  @apply bg-purple-100 text-purple-600;
}

.pricing-title {
  @apply text-sm font-semibold text-gray-900;
}

.pricing-subtitle {
  @apply text-xs text-gray-500;
}

.pricing-card-body {
  @apply p-4 space-y-3;
}

/* Price Input */
.price-input-wrap {
  @apply flex items-center gap-2;
}

.price-input {
  @apply flex-1;
}

.price-suffix {
  @apply text-sm font-medium text-gray-500;
}

.price-words {
  @apply text-xs text-gray-500;
}

/* Net Income */
.net-income {
  @apply flex items-center gap-2 p-2 bg-green-50 rounded-lg text-xs text-green-700;
}

.net-income strong {
  @apply font-semibold;
}

/* Price Warning */
.price-warning {
  @apply flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-xs text-amber-700;
}

/* Actions */
.pricing-actions {
  @apply flex items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-6;
}

.pricing-status {
  @apply min-h-[24px];
}

.unsaved-indicator {
  @apply flex items-center gap-2 text-sm text-amber-600;
}

.save-status.success {
  @apply flex items-center gap-1 text-sm text-green-600;
}

.pricing-buttons {
  @apply flex items-center gap-3;
}

@media (max-width: 768px) {
  .pricing-cards {
    @apply grid-cols-1;
  }
  
  .pricing-actions {
    @apply flex-col items-stretch;
  }
  
  .pricing-buttons {
    @apply justify-end;
  }
}
</style>
