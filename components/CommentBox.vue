<template>
  <div class="comment-box">
    <div class="comment-header">
      <UserProfile
        :detail="{
          name: `${commentDetail?.user?.name} ${commentDetail?.user?.family}`,
          text: 'مراجعه کننده:',
        }" />
      <div class="badge-group">
        <UICBadge
          variant="yellow"
          icon-size="size-5!"
          :value="4.8"
          icon="ic:round-star" />
        <UICBadge variant="gray" :value="commentDetail?.created_at_formatted" />
      </div>
    </div>

    <div class="comment-content">
      <p class="comment-text">
        {{
          commentDetail.comment.length > 160
            ? commentDetail?.comment.slice(0, 160) + "..."
            : commentDetail?.comment
        }}
        <UICDrawer v-if="commentDetail?.comment?.length > 160" title="read more">
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

    <div class="comment-footer">
      <NuxtLink :to="`lawyer/${commentDetail?.lawyer?.id}`">
        <div class="lawyer-tag">
          <NuxtImg
            :src="commentDetail?.lawyer.profile_image || '/images/nullavatar.png'"
            class="lawyer-avatar" />
          {{ commentDetail?.lawyer.full_name }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
defineProps({
  commentDetail: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.comment-box {
  @apply bg-white p-4 rounded-2xl space-y-3 border border-gray-200 select-none;
}

.comment-header {
  @apply flex items-start justify-between gap-1;
}

.comment-user {
  @apply flex items-center gap-2.5 min-w-0;
}

.user-avatar {
  @apply size-10 rounded-full bg-blue-100 relative shrink-0;
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
}

.comment-text {
  @apply text-sm text-justify leading-6;
}

.comment-footer {
}

.lawyer-tag {
  @apply rounded-full border border-gray-200 flex items-center gap-3 w-fit pe-3 text-sm;
}

.lawyer-avatar {
  @apply rounded-full size-7 shadow-[0_0_0_4px] shadow-blue-100;
}
</style>
