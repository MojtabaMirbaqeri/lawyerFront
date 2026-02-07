<template>
  <div class="space-y-5">
    <div class="rounded-lg p-3 border border-gray-200 bg-gray-100 space-y-3">
      <div class="flex gap-3 items-center">
        <div class="relative">
          <NuxtImg
            :src="profileImagePreview || '/images/nullavatar.png'"
            class="size-14 lg:size-16 rounded-full" />
        </div>
        <div>
          <h1 class="text-base font-bold">
            {{ authStore.user.name }} {{ authStore.user.family }}
          </h1>
          <h1 class="text-sm text-gray">{{ authStore.user.phone }}</h1>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row items-stretch gap-2">
        <UModal v-model:open="isProfileImageModalOpen" title="تصویر پروفایل">
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
              @update:model-value="handleImageUpload" />
          </template>
        </UModal>
        <UICSelect
          v-model="formData.base"
          disabled
          class="w-full sm:max-w-60"
          :items="mappedTypes" />
      </div>
    </div>
    <div class="space-y-8 lg:space-y-10">
      <div class="space-y-3">
        <h1 class="font-semibold">تخصص های شما</h1>
        <UCheckboxGroup
          v-model="formData.specialties"
          :items="filtersStore.lawyerSpecialties"
          label-key="title"
          value-key="id"
          :ui="{
            fieldset:
              'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3',
          }" />
      </div>
      <div class="space-y-3">
        <h1 class="font-semibold">خدمات شما</h1>
        <UCheckboxGroup
          v-model="formData.services"
          :items="filtersStore.lawyerServices"
          label-key="title"
          value-key="id"
          :ui="{
            fieldset: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3',
          }" />
      </div>
      <div class="space-y-3">
        <h1 class="font-semibold">درباره شما</h1>
        <ThingTextarea
          id="about"
          v-model="formData.about"
          class="max-h-[250px]! min-h-[150px]"
          :maxlength="1500"
          placeholder="وکیل پایه یک دادگستری..." />
        <div class="text-end">1500 / {{ formData.about.length }}</div>
        <UICSecondaryBtn
          :disabled="!hasChanges || isLoading"
          class="rounded-lg w-full sm:w-auto"
          @click="updateProfile">
          {{ isLoading ? "در حال ارسال..." : "اعمال تغییرات" }}
        </UICSecondaryBtn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject } from "vue";

const filtersStore = useFiltersStore();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const reFetchLawyer = inject("reFetchLawyerInformation");

const props = defineProps({
  lawyerInformation: {
    type: Object,
    required: true,
  },
});

const isLoading = ref(false);
const isProfileImageModalOpen = ref(false);

const lawyerInfo = computed(() => props.lawyerInformation?.lawyer_info ?? {});
const formData = reactive({
  name: authStore.user?.name ?? "",
  family: authStore.user?.family ?? "",
  base: Number(lawyerInfo.value?.base_lawyer?.id) || 0,
  specialties: (lawyerInfo.value?.specialties || []).map(Number),
  services: (lawyerInfo.value?.services || []).map(Number),
  about: lawyerInfo.value?.about || props.lawyerInformation?.about || "",
  profile_image: null,
});

// --- INITIAL STATE (با ref) ---
const initialData = reactive({
  name: authStore.user?.name ?? "",
  family: authStore.user?.family ?? "",
  base: Number(lawyerInfo.value?.base_lawyer?.id) || 0,
  specialties: (lawyerInfo.value?.specialties || []).map(Number),
  services: (lawyerInfo.value?.services || []).map(Number),
  about: lawyerInfo.value?.about || props.lawyerInformation?.about || "",
});

// --- PREVIEW & MAPPED ---
const profileImagePreview = ref(
  lawyerInfo.value?.profile_image
    ? config.public.imageBase + lawyerInfo.value.profile_image
    : null,
);

const mappedTypes = [...filtersStore.lawyerTypes]
  .map((type) => ({
    id: type.id,
    label: type.title,
  }))
  .filter((type) => type.id != 0);

// --- CHANGE DETECTION ---
const hasChanges = computed(() => {
  return (
    formData.name !== initialData.name ||
    formData.family !== initialData.family ||
    formData.base !== initialData.base ||
    JSON.stringify([...formData.specialties].sort()) !==
      JSON.stringify([...initialData.specialties].sort()) ||
    JSON.stringify([...formData.services].sort()) !==
      JSON.stringify([...initialData.services].sort()) ||
    formData.about !== initialData.about ||
    formData.profile_image !== null
  );
});

// --- METHODS ---
const handleImageUpload = (file) => {
  if (!(file instanceof File)) return;
  formData.profile_image = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
  isProfileImageModalOpen.value = false;
};

const updateProfile = async () => {
  if (!hasChanges.value || isLoading.value) return;
  isLoading.value = true;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("family", formData.family);
    formDataToSend.append("base", formData.base.toString());
    formDataToSend.append("about", formData.about);

    formData.specialties.forEach((s) => formDataToSend.append("specialties[]", s));
    formData.services.forEach((s) => formDataToSend.append("services[]", s));
    if (formData.profile_image) {
      formDataToSend.append("profile_image", formData.profile_image);
    }

    const response = await usePost({
      url: "lawyers/updateProfile",
      includeAuthHeader: true,
      body: formDataToSend,
    });

    if (response.statusCode == 200) {
      // 🔹 آپدیت initial values
      Object.assign(initialData, {
        name: formData.name,
        family: formData.family,
        base: formData.base,
        specialties: [...formData.specialties].map(Number),
        services: [...formData.services].map(Number),
        about: formData.about,
      });

      formData.profile_image = null;
      await reFetchLawyer();

      useToast().add({
        color: "success",
        description: "اطلاعات با موفقیت به‌روزرسانی شد",
      });
      // } else {
      //   useToast().add({
      //     color: "error",
      //     description: "خطایی در به‌روزرسانی اطلاعات رخ داد",
      //   });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    // useToast().add({
    //   color: "error",
    //   description: "خطایی در ارسال اطلاعات رخ داد",
    // });
  } finally {
    isLoading.value = false;
  }
};
</script>
