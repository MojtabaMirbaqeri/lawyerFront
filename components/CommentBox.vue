<template>
  <div class="comment-box">
    <div class="comment-header">
      <div class="comment-user">
        <div class="user-avatar">
          <UIcon
            name="hugeicons:user-circle-02"
            class="size-6! absolute -translate-1/2 top-1/2 end-1/2 text-primary"
          />
        </div>
        <div class="user-info">
          <h3 class="user-name">عاطفه عباس نیا</h3>
          <h5 class="text-sm text-gray">مشاوره تلفنی</h5>
        </div>
      </div>
      <div class="badge-group">
        <UICBadge
          variant="yellow"
          icon-size="size-5!"
          :value="4.8"
          icon="ic:round-star"
        />
        <UICBadge variant="gray" value="۳ روز پیش" />
      </div>
    </div>

    <div class="comment-content">
      <p class="comment-text">
        {{
          commentDetail.comment.length > 160
            ? commentDetail.comment.slice(0, 160) + "..."
            : commentDetail.comment
        }}
        <UICDrawer v-if="commentDetail.comment.length > 160" title="read more">
          <template #button>
            <UButton
              label="مشاهده ی بیشتر"
              color="primary"
              variant="link"
              class="underline p-0 ps-1 cursor-pointer"
            />
          </template>
          <template #default>
            {{ commentDetail.comment }}
          </template>
        </UICDrawer>
      </p>
    </div>

    <div class="comment-footer">
      <NuxtLink to="lawyer/4">
        <div class="lawyer-tag">
          <NuxtImg src="/images/lawyerpic.png" class="lawyer-avatar" />
          محمد امین زاده
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const commentDetail = {
  id: 1,
  parent_id: null,
  user_id: "2",
  lawyer_id: "4",
  rating: 4,
  comment:
    "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
  reply: null,
  status: "approved",
  is_approved: "1",
  created_at: "2025-07-01T08:11:40.000000Z",
  updated_at: "2025-07-01T08:11:40.000000Z",
  deleted_at: null,
  user: {
    id: 2,
    name: "111",
    family: "2222",
    phone: "09912374132",
    email: "te121q@gmail.com",
    email_verified_at: "2025-06-28T13:43:47.000000Z",
    created_at: "2025-06-28T13:43:43.000000Z",
    updated_at: "2025-06-30T10:52:26.000000Z",
    kyc_verified_at: null,
  },
  lawyer: {
    id: 4,
    user_id: "2",
    slug: null,
    email: "te121q@gmail.com",
    phone: "09912374132",
    linkedin: null,
    instagram: null,
    telegram: null,
    is_active: false,
    view_count: "0",
    consultation_price_inperson: "20000",
    consultation_price_phone: "40000",
    consultation_price_chat: "10000",
    created_at: "2025-06-28T10:16:30.000000Z",
    updated_at: "2025-07-03T10:22:51.000000Z",
    deleted_at: null,
    lawyer_info_id: "6",
    average_rating: "0.8000",
    review_count: 5,
  },
};
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
