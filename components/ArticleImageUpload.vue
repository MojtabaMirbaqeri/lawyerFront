<template>
  <div class="article-image-upload">
    <label class="block text-sm font-medium text-gray-700 mb-2">تصویر شاخص مقاله (اختیاری)</label>
    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
      class="hidden"
      @change="onFileSelect"
    />
    <div v-if="!hasImage" class="upload-area" @click="fileInputRef?.click()">
      <div v-if="uploading" class="upload-placeholder">
        <Icon name="lucide:loader-2" class="w-10 h-10 animate-spin text-gray-400" />
        <span class="text-sm text-gray-500 mt-2">در حال آپلود...</span>
      </div>
      <div v-else class="upload-placeholder">
        <Icon name="lucide:image-plus" class="w-10 h-10 text-gray-400" />
        <span class="text-sm text-gray-500 mt-2">کلیک کنید یا تصویر را اینجا بکشید</span>
        <span class="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP — حداکثر ۵ مگابایت</span>
      </div>
    </div>
    <div v-else class="preview-area">
      <img
        :src="previewImageUrl"
        alt="پیش‌نمایش"
        class="preview-image"
        @error="onImageError"
      />
      <div class="preview-actions">
        <button type="button" class="btn-change" @click="fileInputRef?.click()">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
          تغییر تصویر
        </button>
        <button type="button" class="btn-remove" @click="remove">
          <Icon name="lucide:trash-2" class="w-4 h-4" />
          حذف
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const fileInputRef = ref(null);
const uploading = ref(false);
/** پیش‌نمایش از طریق Blob URL (همان فایل انتخاب‌شده) تا درخواست به سرور بلاک نشود */
const localPreviewUrl = ref("");
/** آدرس سرور بعد از آپلود؛ برای ارسال به parent و ذخیره در مقاله */
const serverImageUrl = ref("");

const hasImage = computed(
  () =>
    !!(localPreviewUrl.value || serverImageUrl.value || (props.modelValue && props.modelValue.trim()))
);

const previewImageUrl = computed(() => {
  if (localPreviewUrl.value) return localPreviewUrl.value;
  const url = serverImageUrl.value || props.modelValue;
  return useArticleImageUrl(url || "");
});

function revokeBlobUrl() {
  if (localPreviewUrl.value && localPreviewUrl.value.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(localPreviewUrl.value);
    } catch (_) {}
  }
  localPreviewUrl.value = "";
}

async function onFileSelect(e) {
  const file = e.target?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    useToast().add({ title: "لطفاً یک فایل تصویری انتخاب کنید.", color: "error" });
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    useToast().add({ title: "حداکثر حجم تصویر ۵ مگابایت است.", color: "error" });
    return;
  }
  revokeBlobUrl();
  const blobUrl = URL.createObjectURL(file);
  localPreviewUrl.value = blobUrl;

  uploading.value = true;
  const formData = new FormData();
  formData.append("image", file);
  const config = useRuntimeConfig();
  const res = await usePost({
    url: "articles/upload-image",
    includeAuthHeader: true,
    body: formData,
  });
  uploading.value = false;
  e.target.value = "";

  const raw = res?.data;
  let url =
    (typeof raw?.data === "object" && raw?.data?.url) ||
    raw?.data?.url ||
    raw?.url ||
    (typeof raw === "object" && raw?.url) ||
    null;
  if (url && typeof url === "string") {
    if (url.startsWith("/")) {
      const base = (config.public?.apiEndpoint || config.public?.imageBase || "").replace(
        /\/api\/?$/,
        ""
      );
      url = base ? base + url : url;
    }
    serverImageUrl.value = url;
    emit("update:modelValue", url);
    useToast().add({ title: "تصویر آپلود شد.", color: "success" });
  } else {
    revokeBlobUrl();
    serverImageUrl.value = "";
    useToast().add({
      title: "آدرس تصویر از سرور دریافت نشد.",
      color: "error",
    });
  }
}

function onImageError() {
  // در صورت خطای لود، پیش‌نمایش را مخفی نمی‌کنیم
}

function remove() {
  revokeBlobUrl();
  serverImageUrl.value = "";
  emit("update:modelValue", "");
}

onUnmounted(() => {
  revokeBlobUrl();
});

</script>

<style scoped>
@reference "tailwindcss";
.article-image-upload {
  @apply w-full;
}
.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition hover:border-gray-400 hover:bg-gray-50;
}
.upload-placeholder {
  @apply flex flex-col items-center justify-center;
}
.preview-area {
  @apply relative rounded-xl overflow-hidden border border-gray-200 max-w-xs;
}
.preview-image {
  @apply w-full h-28 object-contain block bg-gray-50;
}
.preview-actions {
  @apply flex gap-2 p-2 bg-gray-50 border-t border-gray-200;
}
.btn-change,
.btn-remove {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition;
}
.btn-change {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50;
}
.btn-remove {
  @apply text-red-600 hover:bg-red-50;
}
</style>
