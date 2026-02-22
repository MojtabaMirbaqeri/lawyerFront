<template>
  <div class="comment-box h-full flex flex-col">
    <div class="comment-header shrink-0">
      <UserProfile
        :detail="{
          name: `${commentDetail?.user?.name} ${commentDetail?.user?.family}`,
          text: 'مراجعه کننده:',
        }" />
      <div class="badge-group">
        <UICBadge
          variant="yellow"
          icon-size="size-5!"
          :value="displayRating"
          icon="ic:round-star" />
        <UICBadge variant="gray" :value="displayDate" />
      </div>
    </div>

    <div class="comment-content flex-1 min-h-0 flex flex-col">
      <p class="comment-text flex-1 min-h-0">
        {{
          (commentDetail?.comment?.length ?? 0) > 160
            ? commentDetail?.comment?.slice(0, 160) + "..."
            : commentDetail?.comment ?? ""
        }}
        <UICDrawer v-if="(commentDetail?.comment?.length ?? 0) > 160" title="read more">
          <template #button>
            <UButton
              label="مشاهده ی بیشتر"
              color="primary"
              variant="link"
              class="underline p-0 ps-1 cursor-pointer" />
          </template>
          <template #default>
            {{ commentDetail?.comment }}
          </template>
        </UICDrawer>
      </p>
    </div>

    <div class="comment-footer shrink-0">
      <NuxtLink :to="`/lawyer/${commentDetail?.lawyer?.id}`">
        <div class="lawyer-tag">
          <NuxtImg
            :src="lawyerAvatarSrc"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            class="lawyer-avatar" />
          {{ commentDetail?.lawyer?.full_name }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const props = defineProps({
  commentDetail: {
    type: Object,
    required: true,
  },
});

const lawyerAvatarSrc = computed(() => {
  const img =
    props.commentDetail?.lawyer_info?.profile_image ??
    props.commentDetail?.lawyer?.profile_image;
  if (img) {
    const url = useStorageImageUrl(img);
    return url || "/images/nullavatar.png";
  }
  return "/images/nullavatar.png";
});

const displayRating = computed(() => {
  const r = props.commentDetail?.rating;
  if (r != null && r !== "") return Number(r);
  return "—";
});

const displayDate = computed(() => {
  const formatted = props.commentDetail?.created_at_formatted;
  if (formatted) return formatted;
  const raw = props.commentDetail?.created_at;
  if (raw) {
    try {
      const d = new Date(raw);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(d);
    } catch {
      return raw;
    }
  }
  return "—";
});
</script>

<style scoped>
@reference "tailwindcss";

.comment-box {
  @apply bg-white p-4 rounded-2xl space-y-3 border border-gray-200 select-none flex flex-col h-full;
}

.comment-header {
  @apply flex items-start justify-between gap-1;
}

.comment-user {
  @apply flex items-center gap-2.5 min-w-0;
}

.user-avatar {
  @apply size-10 rounded-full bg-[#e8edf5] relative shrink-0;
}

.user-info {
  @apply min-w-0;
}

.user-name {
  @apply font-semibold truncate whitespace-nowrap overflow-hidden;
}

.badge-group {
  @apply flex items-center gap-1 shrink-0;
}

.comment-content {
  @apply flex-1 min-h-0 flex flex-col;
}

.comment-text {
  @apply text-sm text-justify leading-6;
}

.comment-footer {
  @apply shrink-0;
}

.lawyer-tag {
  @apply rounded-full border border-gray-200 flex items-center gap-3 w-fit pe-3 text-sm;
}

.lawyer-avatar {
  @apply rounded-full size-7 shadow-[0_0_0_4px] shadow-[#e8edf5];
}
</style>
