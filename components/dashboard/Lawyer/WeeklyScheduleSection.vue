<template>
  <div class="schedule-section">
    <!-- Loading State -->
    <div v-if="isInitialLoading" class="space-y-4">
      <UICSkeletonCard height="100px" />
      <UICSkeletonCard v-for="i in 6" :key="i" height="80px" />
    </div>

    <!-- Main Content -->
    <div v-else>
      <UICFormSection
        title="ساعات کاری هفتگی"
        description="زمان‌های در دسترس بودن شما برای ارائه مشاوره"
        icon="lucide:calendar-clock"
      >
        <template #actions>
          <button @click="copyFromSaturday" class="btn-sm-secondary" title="کپی از شنبه به همه روزها">
            <Icon name="lucide:copy" class="w-4 h-4" />
            کپی از شنبه
          </button>
        </template>

        <!-- Global Settings -->
        <div class="schedule-settings">
          <div class="setting-group">
            <label class="setting-label">
              <Icon name="lucide:clock" class="w-4 h-4" />
              مدت هر جلسه
            </label>
            <div class="setting-options">
              <button 
                v-for="duration in sessionDurations" 
                :key="duration"
                @click="globalSessionDuration = duration"
                :class="['option-btn', { active: globalSessionDuration === duration }]"
              >
                {{ duration }} دقیقه
              </button>
            </div>
          </div>
          <div class="setting-group">
            <label class="setting-label">
              <Icon name="lucide:timer" class="w-4 h-4" />
              فاصله بین جلسات
            </label>
            <div class="setting-options">
              <button 
                v-for="buffer in bufferOptions" 
                :key="buffer"
                @click="globalBuffer = buffer"
                :class="['option-btn', { active: globalBuffer === buffer }]"
              >
                {{ buffer }} دقیقه
              </button>
            </div>
          </div>
        </div>

        <!-- Days Accordion -->
        <div class="days-list">
          <div 
            v-for="(day, index) in weeklySchedule" 
            :key="day.day_of_week"
            class="day-card"
            :class="{ 'has-schedule': hasAnySchedule(day) }"
          >
            <!-- Day Header -->
            <div class="day-header" @click="toggleDay(index)">
              <div class="day-info">
                <span class="day-name">{{ day.label }}</span>
                <div v-if="hasAnySchedule(day)" class="day-badges">
                  <span v-if="day.schedules.phone.enabled" class="day-badge phone">تلفنی</span>
                  <span v-if="day.schedules.chat.enabled" class="day-badge chat">چت</span>
                  <span v-if="day.schedules.inperson.enabled" class="day-badge inperson">حضوری</span>
                </div>
                <span v-else class="day-empty">تعطیل</span>
              </div>
              <div class="day-actions">
                <!-- Slot Preview -->
                <span v-if="hasAnySchedule(day)" class="slot-preview">
                  {{ calculateTotalSlots(day) }} اسلات
                </span>
                <Icon 
                  :name="expandedDays.includes(index) ? 'lucide:chevron-up' : 'lucide:chevron-down'" 
                  class="w-5 h-5 text-gray-400" 
                />
              </div>
            </div>

            <!-- Day Content -->
            <Transition name="slide">
              <div v-if="expandedDays.includes(index)" class="day-content">
                <!-- Consultation Types -->
                <div 
                  v-for="type in consultationTypes" 
                  :key="type.key"
                  class="schedule-type"
                >
                  <div class="type-header">
                    <USwitch v-model="day.schedules[type.key].enabled" />
                    <span class="type-label">{{ type.label }}</span>
                  </div>

                  <Transition name="fade">
                    <div v-if="day.schedules[type.key].enabled" class="type-times">
                      <div class="time-field">
                        <label class="time-label">از ساعت</label>
                        <UICTimePicker 
                          v-model="day.schedules[type.key].start_time"
                          placeholder="۰۰:۰۰"
                        />
                      </div>
                      <div class="time-field">
                        <label class="time-label">تا ساعت</label>
                        <UICTimePicker 
                          v-model="day.schedules[type.key].end_time"
                          placeholder="۰۰:۰۰"
                        />
                      </div>

                      <!-- Validation Error -->
                      <div 
                        v-if="getTimeError(day, type.key)" 
                        class="time-error"
                      >
                        <Icon name="lucide:alert-circle" class="w-4 h-4" />
                        {{ getTimeError(day, type.key) }}
                      </div>

                      <!-- Slot Preview -->
                      <div 
                        v-else-if="day.schedules[type.key].start_time && day.schedules[type.key].end_time"
                        class="slot-info"
                      >
                        <Icon name="lucide:calendar-check" class="w-4 h-4" />
                        {{ calculateSlots(day.schedules[type.key].start_time, day.schedules[type.key].end_time) }} 
                        اسلات {{ globalSessionDuration }} دقیقه‌ای
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Quick Actions -->
                <div class="day-quick-actions">
                  <button @click="copyToAllDays(index)" class="quick-action-btn">
                    <Icon name="lucide:copy" class="w-4 h-4" />
                    کپی به همه روزها
                  </button>
                  <button @click="clearDay(index)" class="quick-action-btn text-red-600">
                    <Icon name="lucide:trash-2" class="w-4 h-4" />
                    پاک کردن
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Save Actions -->
        <div class="schedule-actions">
          <div class="schedule-status">
            <div v-if="hasValidationErrors" class="validation-warning">
              <Icon name="lucide:alert-triangle" class="w-4 h-4" />
              لطفاً خطاهای زمانی را اصلاح کنید
            </div>
            <div v-else-if="hasChanges" class="unsaved-indicator">
              <Icon name="lucide:alert-circle" class="w-4 h-4" />
              تغییرات ذخیره نشده
            </div>
            <div v-else-if="saveSuccess" class="save-success">
              <Icon name="lucide:check-circle" class="w-4 h-4" />
              ذخیره شد
            </div>
          </div>
          <div class="schedule-buttons">
            <button 
              @click="saveSchedule" 
              class="btn-primary"
              :disabled="isLoading || hasValidationErrors"
            >
              <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:check" class="w-4 h-4" />
              {{ isLoading ? 'در حال ذخیره...' : 'ذخیره ساعات کاری' }}
            </button>
          </div>
        </div>
      </UICFormSection>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lawyerInformation: { type: Object, required: true },
});

const emit = defineEmits(['update:changes', 'saved']);
const toast = useToast();

// Constants
const sessionDurations = [15, 30, 45, 60];
const bufferOptions = [0, 5, 10, 15];
const consultationTypes = [
  { key: "phone", label: "مشاوره تلفنی" },
  { key: "chat", label: "مشاوره چت" },
  { key: "inperson", label: "مشاوره حضوری" },
];

const defaultDays = [
  { day_of_week: 0, label: "شنبه" },
  { day_of_week: 1, label: "یکشنبه" },
  { day_of_week: 2, label: "دوشنبه" },
  { day_of_week: 3, label: "سه‌شنبه" },
  { day_of_week: 4, label: "چهارشنبه" },
  { day_of_week: 5, label: "پنج‌شنبه" },
];

// State
const isInitialLoading = ref(true);
const isLoading = ref(false);
const saveSuccess = ref(false);
const hasChanges = ref(false);
const expandedDays = ref([0]); // Saturday expanded by default

const globalSessionDuration = ref(30);
const globalBuffer = ref(10);

const weeklySchedule = ref([]);

// Watch for changes
watch(weeklySchedule, () => {
  hasChanges.value = true;
  emit('update:changes', 'schedule', true);
}, { deep: true });

// Computed
const hasValidationErrors = computed(() => {
  return weeklySchedule.value.some(day => {
    return consultationTypes.some(type => {
      const schedule = day.schedules[type.key];
      if (!schedule.enabled) return false;
      return !!getTimeError(day, type.key);
    });
  });
});

// Methods
function toggleDay(index) {
  const idx = expandedDays.value.indexOf(index);
  if (idx === -1) {
    expandedDays.value.push(index);
  } else {
    expandedDays.value.splice(idx, 1);
  }
}

function hasAnySchedule(day) {
  return consultationTypes.some(type => day.schedules[type.key].enabled);
}

function getTimeError(day, typeKey) {
  const schedule = day.schedules[typeKey];
  if (!schedule.enabled) return null;
  if (!schedule.start_time || !schedule.end_time) return null;
  
  const start = timeToMinutes(schedule.start_time);
  const end = timeToMinutes(schedule.end_time);
  
  if (start >= end) {
    return "ساعت پایان باید بعد از ساعت شروع باشد";
  }
  
  if (end - start < globalSessionDuration.value) {
    return `حداقل ${globalSessionDuration.value} دقیقه فاصله لازم است`;
  }
  
  return null;
}

function timeToMinutes(time) {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateSlots(startTime, endTime) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const duration = globalSessionDuration.value + globalBuffer.value;
  return Math.floor((end - start) / duration);
}

function calculateTotalSlots(day) {
  let total = 0;
  consultationTypes.forEach(type => {
    const schedule = day.schedules[type.key];
    if (schedule.enabled && schedule.start_time && schedule.end_time) {
      total += calculateSlots(schedule.start_time, schedule.end_time);
    }
  });
  return total;
}

function copyFromSaturday() {
  const saturday = weeklySchedule.value[0];
  weeklySchedule.value.forEach((day, index) => {
    if (index === 0) return;
    consultationTypes.forEach(type => {
      day.schedules[type.key] = { ...saturday.schedules[type.key] };
    });
  });
  toast.add({ description: "ساعات شنبه به همه روزها کپی شد", color: "success" });
}

function copyToAllDays(fromIndex) {
  const sourceDay = weeklySchedule.value[fromIndex];
  weeklySchedule.value.forEach((day, index) => {
    if (index === fromIndex) return;
    consultationTypes.forEach(type => {
      day.schedules[type.key] = { ...sourceDay.schedules[type.key] };
    });
  });
  toast.add({ description: `ساعات ${sourceDay.label} به همه روزها کپی شد`, color: "success" });
}

function clearDay(index) {
  consultationTypes.forEach(type => {
    weeklySchedule.value[index].schedules[type.key] = {
      enabled: false,
      start_time: "",
      end_time: "",
    };
  });
}

async function fetchSchedule() {
  isInitialLoading.value = true;
  try {
    const res = await useGet({ 
      url: "lawyer_schedules/weekly", 
      includeAuthHeader: true 
    });
    
    const apiSchedule = res.status ? res.data?.weekly_schedule || [] : [];
    
    weeklySchedule.value = defaultDays.map((day) => {
      const apiDayData = apiSchedule.find((d) => d.day_of_week == day.day_of_week);
      const schedules = {};

      consultationTypes.forEach((type) => {
        const scheduleData = apiDayData?.schedules?.[type.key]?.[0];
        schedules[type.key] = {
          enabled: !!scheduleData,
          start_time: scheduleData?.start_time?.slice(0, 5) || "",
          end_time: scheduleData?.end_time?.slice(0, 5) || "",
        };
      });

      return { ...day, schedules };
    });
    
    hasChanges.value = false;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    toast.add({ description: "خطا در دریافت ساعات کاری", color: "error" });
  } finally {
    isInitialLoading.value = false;
  }
}

async function saveSchedule() {
  if (hasValidationErrors.value) return;
  
  isLoading.value = true;
  const payload = { schedules: [] };

  weeklySchedule.value.forEach((day) => {
    consultationTypes.forEach((type) => {
      const schedule = day.schedules[type.key];
      if (schedule.enabled && schedule.start_time && schedule.end_time) {
        payload.schedules.push({
          day_of_week: day.day_of_week,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          type: type.key,
        });
      }
    });
  });

  try {
    const res = await usePost({
      url: "lawyer_schedules/weekly",
      includeAuthHeader: true,
      body: payload,
    });
    
    if (res.status) {
      hasChanges.value = false;
      saveSuccess.value = true;
      setTimeout(() => { saveSuccess.value = false; }, 3000);
      toast.add({ description: "ساعات کاری با موفقیت ثبت شد.", color: "success" });
      emit('update:changes', 'schedule', false);
      emit('saved');
    } else {
      toast.add({ description: "خطا در ثبت ساعات کاری.", color: "error" });
    }
  } catch (err) {
    console.error("Schedule submit error:", err);
    toast.add({ description: "خطای سرور.", color: "error" });
  } finally {
    isLoading.value = false;
  }
}

// Init
fetchSchedule();
</script>

<style scoped>
@reference "tailwindcss";

.schedule-section {
  @apply flex flex-col gap-6;
}

/* Settings */
.schedule-settings {
  @apply flex flex-wrap gap-6 p-4 bg-gray-50 rounded-lg mb-6;
}

.setting-group {
  @apply flex items-center gap-3;
}

.setting-label {
  @apply flex items-center gap-1.5 text-sm font-medium text-gray-600;
}

.setting-options {
  @apply flex gap-1;
}

.option-btn {
  @apply px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors;
}

.option-btn.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.option-btn:not(.active):hover {
  @apply bg-gray-100;
}

/* Days List */
.days-list {
  @apply space-y-3;
}

.day-card {
  @apply bg-white rounded-xl border border-gray-100 overflow-hidden transition-all;
}

.day-card.has-schedule {
  @apply border-blue-100;
}

.day-header {
  @apply flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors;
}

.day-info {
  @apply flex items-center gap-3;
}

.day-name {
  @apply text-sm font-semibold text-gray-900 min-w-[70px];
}

.day-badges {
  @apply flex gap-1.5;
}

.day-badge {
  @apply px-2 py-0.5 text-xs font-medium rounded-full;
}

.day-badge.phone {
  @apply bg-green-100 text-green-700;
}

.day-badge.chat {
  @apply bg-blue-100 text-blue-700;
}

.day-badge.inperson {
  @apply bg-purple-100 text-purple-700;
}

.day-empty {
  @apply text-sm text-gray-400;
}

.day-actions {
  @apply flex items-center gap-3;
}

.slot-preview {
  @apply text-xs text-gray-500;
}

/* Day Content */
.day-content {
  @apply p-4 pt-0 space-y-4;
}

.schedule-type {
  @apply p-3 bg-gray-50 rounded-lg;
}

.type-header {
  @apply flex items-center gap-3;
}

.type-label {
  @apply text-sm font-medium text-gray-700;
}

.type-times {
  @apply mt-3 space-y-3;
}

.time-field {
  @apply inline-flex flex-col gap-1 mr-4;
}

.time-label {
  @apply text-xs text-gray-500;
}

.time-error {
  @apply flex items-center gap-2 p-2 bg-red-50 rounded-lg text-xs text-red-600 mt-2;
}

.slot-info {
  @apply flex items-center gap-2 p-2 bg-green-50 rounded-lg text-xs text-green-700 mt-2;
}

/* Quick Actions */
.day-quick-actions {
  @apply flex items-center gap-3 pt-3 border-t border-gray-100;
}

.quick-action-btn {
  @apply inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors;
}

/* Actions */
.schedule-actions {
  @apply flex items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-6;
}

.schedule-status {
  @apply min-h-[24px];
}

.validation-warning {
  @apply flex items-center gap-2 text-sm text-red-600;
}

.unsaved-indicator {
  @apply flex items-center gap-2 text-sm text-amber-600;
}

.save-success {
  @apply flex items-center gap-2 text-sm text-green-600;
}

.schedule-buttons {
  @apply flex items-center gap-3;
}

.btn-sm-secondary {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .schedule-settings {
    @apply flex-col items-start;
  }
  
  .schedule-actions {
    @apply flex-col items-stretch;
  }
  
  .schedule-buttons {
    @apply justify-end;
  }
}
</style>
