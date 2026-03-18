# Lawyer Public Profile (Frontend)

## Component Structure

- `pages/lawyer/[id]/[slug].vue`: orchestration and data fetching.
- `components/LawyerProfile/LawyerProfileHeader.vue`: hero section + main CTA.
- `components/LawyerProfile/LawyerProfileStickyBookingCard.vue`: sticky booking card.
- `components/LawyerProfile/LawyerProfileAboutSection.vue`: lawyer introduction.
- `components/LawyerProfile/LawyerProfileEducationSection.vue`: education cards.
- `components/LawyerProfile/LawyerProfileExperienceSection.vue`: work experience cards.
- `components/LawyerProfile/LawyerProfileAwardsSection.vue`: awards cards.
- `components/LawyerProfile/LawyerProfileCertificationsSection.vue`: certifications/licenses cards.
- `components/LawyerProfile/LawyerProfileServicesSection.vue`: specialties/services.
- `components/LawyerProfile/LawyerProfileLanguagesSection.vue`: language chips.
- `components/LawyerProfile/LawyerProfilePublicationsSection.vue`: latest publications.
- `components/LawyerProfile/LawyerProfileContactSection.vue`: public links only.
- `components/LawyerProfile/LawyerProfileTrustSection.vue`: trust metrics.
- `components/LawyerProfile/LawyerProfileReviewsSection.vue`: reviews block.

## Conditional Rendering Rules

- Each section receives data via props and renders only when meaningful data exists.
- Empty sections are hidden (`v-if` on data length/content).
- Sparse profiles show one neutral hint card via `LawyerProfileSparseHintCard`.
- Q&A preview remains pluggable and hidden when no items exist.

## Field Mapping

- `data.educations` -> `LawyerProfileEducationSection`
- `data.work_experiences` -> `LawyerProfileExperienceSection`
- `data.awards` -> `LawyerProfileAwardsSection`
- `data.lawyer_info.certifications` -> `LawyerProfileCertificationsSection`
- `data.specialties_titles` + `data.lawyer_info.services` -> `LawyerProfileServicesSection`
- `data.lawyer_info.languages` -> `LawyerProfileLanguagesSection`
- `GET /api/lawyers/{id}/publications` -> `LawyerProfilePublicationsSection`
- `data.links` -> `LawyerProfileContactSection`

## New Persian UI Strings

- معرفی وکیل
- تخصص‌ها و حوزه‌های فعالیت
- سوابق تحصیلی
- سوابق کاری
- جوایز و افتخارات
- گواهی‌ها و مجوزها
- خدمات قابل ارائه
- زبان‌ها
- مقالات و نوشته‌ها
- اطلاعات تماس
- نظرات و امتیاز کاربران
- اعتماد و شفافیت
- راهنمای انتخاب وکیل
- رزرو مشاوره
- رزرو آنلاین و سریع
- در صورت نیاز، ابتدا پرسش حقوقی ثبت کنید
