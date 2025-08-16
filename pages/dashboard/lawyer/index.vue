<template>
  <section class="flex space-y-3 flex-col">
    <UTabs
      v-model="activeTab"
      color="primary"
      variant="link"
      :items="tabItems"
      class="ds-table-con"
    >
      <template #profile>
        <div class="space-y-5">
          <div
            class="rounded-lg p-3 border border-gray-200 bg-gray-100 space-y-3"
          >
            <div class="flex gap-3 items-center">
              <div class="relative">
                <NuxtImg
                  :src="profileImagePreview || '/images/null-avatar.png'"
                  class="size-14 lg:size-16 rounded-full"
                />
              </div>
              <div class="">
                <h1 class="text-base font-bold">
                  {{ authStore.user.name }} {{ authStore.user.family }}
                </h1>
                <h1 class="text-sm text-gray">{{ authStore.user.phone }}</h1>
              </div>
            </div>
            <div class="flex items-stretch gap-2">
              <UModal
                v-model:open="isProfileImageModalOpen"
                title="تصویر پروفایل"
              >
                <UICSecondaryBtn class="w-full rounded-lg sm:w-auto">
                  ویرایش تصویر
                  <UIcon name="solar:gallery-edit-linear" class="size-4.5!" />
                </UICSecondaryBtn>
                <template #body>
                  <UFileUpload
                    v-model="formData.profile_image"
                    icon="i-lucide-image"
                    label="تصویر پروفایل مورد نظر خود را آپلود کنید"
                    description="Image/* (max. 3MB)"
                    layout="list"
                    accept="image/*"
                    :ui="{
                      base: 'border-black/30',
                      wrapper: 'py-2',
                    }"
                    @update:model-value="handleImageUpload"
                  />
                </template>
              </UModal>
              <UICSelect
                v-model="formData.base"
                class="w-auto"
                :items="mappedTypes"
              />
            </div>
          </div>
          <div class="space-y-8 lg:space-y-10">
            <div class="space-y-3">
              <h1 class="font-semibold">تخصص های شما</h1>
              <div>
                <UCheckboxGroup
                  v-model="formData.specialties"
                  :items="filtersStore.lawyerSpecialties"
                  label-key="title"
                  value-key="id"
                  :ui="{
                    fieldset:
                      'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-3',
                  }"
                />
              </div>
            </div>
            <div class="space-y-3">
              <h1 class="font-semibold">خدمات شما</h1>
              <div>
                <UCheckboxGroup
                  v-model="formData.services"
                  :items="filtersStore.lawyerServices"
                  label-key="title"
                  value-key="id"
                  :ui="{
                    fieldset:
                      'grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-3',
                  }"
                />
              </div>
            </div>
            <div class="space-y-3">
              <h1 class="font-semibold">درباره شما</h1>
              <ThingTextarea
                id="about"
                v-model="formData.about"
                class="max-h-[250px]! min-h-[150px]"
                :maxlength="1500"
                placeholder="وکیل پایه یک دادگستری..."
              />
              <div class="text-end">1500 / {{ formData.about.length }}</div>
              <UICSecondaryBtn
                :disabled="!hasChanges || isLoading"
                class="rounded-lg"
                @click="updateProfile"
              >
                {{ isLoading ? "در حال ارسال..." : "اعمال تغییرات" }}
              </UICSecondaryBtn>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </section>
</template>

<script setup>
const filtersStore = useFiltersStore();
const authStore = useAuthStore();

const { data: lawyerInformation } = await useGet({
  url: `lawyers/${authStore.user?.lawyer_id}`,
  includeAuthHeader: true,
});

// Reactive form data
const formData = reactive({
  name: authStore.user.name,
  family: authStore.user.family,
  base: lawyerInformation.data.lawyer_info.base_lawyer.id,
  specialties: [...(lawyerInformation.data.lawyer_info.specialties || [])],
  services: [...(lawyerInformation.data.lawyer_info.services || [])],
  about: lawyerInformation.data.about || "",
  profile_image: null,
});

// Initial data for comparison
const initialData = {
  name: authStore.user.name,
  family: authStore.user.family,
  base: lawyerInformation.data.lawyer_info.base_lawyer.id,
  specialties: [...(lawyerInformation.data.lawyer_info.specialties || [])],
  services: [...(lawyerInformation.data.lawyer_info.services || [])],
  about: lawyerInformation.data.about || "",
};

// UI state
const isLoading = ref(false);
const isProfileImageModalOpen = ref(false);
const profileImagePreview = ref(lawyerInformation.data.profile_image || null);

const mappedTypes = [...filtersStore.lawyerTypes]
  .map((type) => ({
    id: type.id,
    label: type.title,
  }))
  .filter((type) => {
    return type.id != 0;
  });

const tabItems = ref([
  {
    label: "پروفایل",
    value: "profile",
    slot: "profile",
  },
  {
    label: "اطلاعات شخصی",
    value: "personal_information",
    slot: "personal_information",
  },
  {
    label: "تحصیلات/سابقه کاری",
    value: "resume",
    slot: "resume",
  },
  {
    label: "محل کار / ساعت کاری",
    value: "schedule",
    slot: "schedule",
  },
  {
    label: "احراز هویت مدارک",
    value: "authentication",
    slot: "authentication",
  },
]);

const activeTab = ref(tabItems.value[0].value);

// Check if there are changes
const hasChanges = computed(() => {
  return (
    formData.name !== initialData.name ||
    formData.family !== initialData.family ||
    formData.base !== initialData.base ||
    JSON.stringify(formData.specialties.sort()) !==
      JSON.stringify(initialData.specialties.sort()) ||
    JSON.stringify(formData.services.sort()) !==
      JSON.stringify(initialData.services.sort()) ||
    formData.about !== initialData.about ||
    formData.profile_image !== null
  );
});

// Handle image upload
// Handle image upload
const handleImageUpload = (file) => {
  console.log("Uploaded file:", file);

  if (!(file instanceof File)) return;

  formData.profile_image = file;

  // ساختن preview
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // بستن مودال
  isProfileImageModalOpen.value = false;
};

// Update profile function
const updateProfile = async () => {
  if (!hasChanges.value || isLoading.value) return;

  isLoading.value = true;

  try {
    // Create FormData
    const formDataToSend = new FormData();

    // Add all form fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("family", formData.family);
    formDataToSend.append("base", formData.base.toString());
    formDataToSend.append("about", formData.about);

    // Add specialties as separate entries
    formData.specialties.forEach((specialty) => {
      formDataToSend.append("specialties[]", specialty);
    });

    // Add services as separate entries
    formData.services.forEach((service) => {
      formDataToSend.append("services[]", service);
    });

    // Add profile image if exists
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    for (const [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    // Send request
    const response = await usePost({
      url: "lawyers/updateProfile",
      includeAuthHeader: true,
      body: formDataToSend,
    });

    if (response.status) {
      // Success - update initial data
      initialData.name = formData.name;
      initialData.family = formData.family;
      initialData.base = formData.base;
      initialData.specialties = [...formData.specialties];
      initialData.services = [...formData.services];
      initialData.about = formData.about;

      // Reset profile image
      formData.profile_image = null;

      // Show success message (you can customize this based on your notification system)
      console.log("Profile updated successfully");
      // Example: useToast().add({ title: 'موفق', description: 'اطلاعات با موفقیت به روز رسانی شد' });
    } else {
      // Handle error
      console.error("Error updating profile:", response.error);
      // Example: useToast().add({ title: 'خطا', description: 'خطایی در به روز رسانی اطلاعات رخ داد' });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    // Example: useToast().add({ title: 'خطا', description: 'خطایی در ارسال اطلاعات رخ داد' });
  } finally {
    isLoading.value = false;
  }
};
</script>