/**
 * منطق یکسان محاسبه درصد تکمیل پروفایل وکیل.
 * در داشبورد و صفحه پروفایل از همین composable استفاده شود.
 */
export type ProfileCompletionChecklistItem = {
  id: string;
  label: string;
  weight: number;
  status: 'completed' | 'pending' | 'incomplete';
  hint: string | null;
  cta: string;
};

export interface UseProfileCompletionInput {
  lawyerInfo: Record<string, unknown> | null | undefined;
  kycStatus?: string;
  hasEducation?: boolean;
  hasWorkplace?: boolean;
  hasSchedule?: boolean;
  hasPricing?: boolean;
}

export function useProfileCompletion(
  input: Ref<UseProfileCompletionInput> | UseProfileCompletionInput | (() => UseProfileCompletionInput)
) {
  const resolvedInput = computed<UseProfileCompletionInput>(() =>
    typeof input === 'function' ? input() : unref(input)
  );

  const checklistItems = computed<ProfileCompletionChecklistItem[]>(() => {
    const props = resolvedInput.value;
    const rawData = props?.lawyerInfo?.data ?? props?.lawyerInfo;
    const info = (rawData?.lawyer_info ?? {}) as Record<string, unknown>;

    const hasPersonalInfo = !!(
      info.gender &&
      info.father_name &&
      info.birth_date &&
      info.province_id &&
      info.city_id
    );
    const hasProfile = !!(info.about && String(info.about).length > 50);

    const kycCompleted = props?.kycStatus === 'approved';
    const kycPending = props?.kycStatus === 'pending';

    return [
      {
        id: 'personal_information',
        label: 'اطلاعات شخصی',
        weight: 20,
        status: hasPersonalInfo ? 'completed' : 'incomplete',
        hint: hasPersonalInfo ? null : 'نام، جنسیت، تاریخ تولد',
        cta: 'تکمیل اطلاعات شخصی',
      },
      {
        id: 'profile',
        label: 'پروفایل و معرفی',
        weight: 15,
        status: hasProfile ? 'completed' : 'incomplete',
        hint: hasProfile ? null : 'درباره من، تخصص‌ها',
        cta: 'تکمیل پروفایل',
      },
      {
        id: 'experience',
        label: 'سوابق تحصیلی',
        weight: 15,
        status: props?.hasEducation ? 'completed' : 'incomplete',
        hint: props?.hasEducation ? null : 'حداقل یک سابقه تحصیلی',
        cta: 'افزودن سابقه تحصیلی',
      },
      {
        id: 'workplaces',
        label: 'محل کار',
        weight: 20,
        status: props?.hasWorkplace ? 'completed' : 'incomplete',
        hint: props?.hasWorkplace ? null : 'حداقل یک محل کار',
        cta: 'افزودن محل کار',
      },
      {
        id: 'pricing',
        label: 'قیمت‌گذاری',
        weight: 15,
        status: props?.hasPricing ? 'completed' : 'incomplete',
        hint: props?.hasPricing ? null : 'تعیین قیمت مشاوره',
        cta: 'تنظیم قیمت‌ها',
      },
      {
        id: 'authentication',
        label: 'احراز هویت',
        weight: 15,
        status: kycCompleted ? 'completed' : kycPending ? 'pending' : 'incomplete',
        hint: kycCompleted ? 'تایید شده' : kycPending ? 'در انتظار بررسی' : 'ارسال مدارک',
        cta: 'ارسال مدارک',
      },
    ];
  });

  const completionPercentage = computed(() => {
    const completed = checklistItems.value
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.weight, 0);
    return Math.min(100, completed);
  });

  const isComplete = computed(() => completionPercentage.value >= 100);

  const nextIncompleteSection = computed(() =>
    checklistItems.value.find((item) => item.status === 'incomplete')
  );

  return {
    checklistItems,
    completionPercentage,
    isComplete,
    nextIncompleteSection,
  };
}
