<template>
  <div class="rich-text-editor">
    <div ref="containerRef" class="quill-editor-container" dir="rtl" />
  </div>
</template>

<script setup>
import "quill/dist/quill.snow.css";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "متن را بنویسید..." },
  minHeight: { type: String, default: "200px" },
});

const emit = defineEmits(["update:modelValue"]);

const containerRef = ref(null);
let quill = null;
let ignoreNextEmit = false;

onMounted(async () => {
  if (!containerRef.value) return;
  const Quill = (await import("quill")).default;
  quill = new Quill(containerRef.value, {
    theme: "snow",
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike", "code"],
        [{ color: [] }, { background: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video", "formula"],
        ["clean"],
      ],
    },
  });
  if (props.modelValue) {
    quill.clipboard.dangerouslyPasteHTML(props.modelValue);
  }
  quill.on("text-change", () => {
    if (ignoreNextEmit) {
      ignoreNextEmit = false;
      return;
    }
    emit("update:modelValue", quill.root.innerHTML);
  });
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (!quill) return;
    const current = quill.root.innerHTML;
    if (newVal !== current) {
      ignoreNextEmit = true;
      quill.clipboard.dangerouslyPasteHTML(newVal || "");
    }
  }
);

onBeforeUnmount(() => {
  quill = null;
});
</script>

<style scoped>
.rich-text-editor {
  @apply w-full;
}
.quill-editor-container {
  min-height: v-bind(minHeight);
}
:deep(.ql-container) {
  font-family: inherit;
}
:deep(.ql-editor) {
  min-height: v-bind(minHeight);
  text-align: right;
}
:deep(.ql-toolbar.ql-snow) {
  border-radius: 8px 8px 0 0;
  border-color: rgb(209 213 219);
}
/* فاصله بین متن و آیکن در دکمه‌های dropdown نوار ابزار؛ آیکن در Quill همیشه سمت right است (۱۸px) */
:deep(.ql-toolbar .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) .ql-picker-label) {
  padding-left: 10px;
  padding-right: 22px;
}
:deep(.ql-toolbar .ql-picker:not(.ql-color-picker):not(.ql-icon-picker)) {
  padding-left: 4px;
  padding-right: 4px;
}
:deep(.ql-container.ql-snow) {
  border-radius: 0 0 8px 8px;
  border-color: rgb(209 213 219);
}
:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #9ca3af;
}
</style>
