<template>
  <LawyerProfileSectionCard
    section-id="reviews"
    title="نظرات و امتیاز کاربران"
    subtitle="نظرات تنها برای رزروهای ثبت‌شده نمایش داده می‌شود.">
    <InfoLawyerComment
      :id="lawyerId"
      :lawyer-full-name="lawyerFullName"
      :initial-reviews="initialReviews"
      :initial-reviews-last-page="initialReviewsLastPage" />
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({
  lawyerId: { type: Number, required: true },
  lawyerFullName: { type: String, required: true },
  initialReviews: { type: Array, default: () => [] },
  initialReviewsLastPage: { type: Number, default: 1 },
});
</script>
