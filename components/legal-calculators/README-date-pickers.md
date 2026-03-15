# انتخابگرهای تاریخ شمسی (YearPicker و MonthYearPicker)

کامپوننت‌های قابل استفاده مجدد برای انتخاب **سال** یا **ماه و سال** شمسی در هر جای پروژه.

## وابستگی‌ها

- **`~/utils/persianDate`**: توابع و نوع‌های مشترک (`toPersianDigits`, `PERSIAN_MONTH_NAMES`, `PersianMonthYear`, `getYearRange`, `getPersianMonthName`)

## YearPicker

انتخاب فقط **سال** با گرید ۴ ستونه و اسکرول.

```vue
<LegalCalculatorsYearPicker
  v-model="selectedYear"
  label="سال سررسید"
  placeholder="انتخاب کنید"
  :min-year="1315"
  :max-year="1410"
  hint="سال شمسی را انتخاب کنید"
/>
```

| Prop | نوع | پیش‌فرض | توضیح |
|------|-----|---------|--------|
| `modelValue` | `number \| null` | `null` | سال انتخاب‌شده |
| `label` | `string` | `''` | برچسب فیلد |
| `placeholder` | `string` | `'انتخاب کنید'` | متن وقتی مقدار خالی است |
| `minYear` | `number` | `1315` | کمترین سال |
| `maxYear` | `number` | `1410` | بیشترین سال |
| `disabled` | `boolean` | `false` | غیرفعال |
| `hint` | `string` | `''` | راهنمای زیر فیلد |
| `ariaLabel` | `string` | `'انتخاب سال'` | برای دسترسی |

---

## MonthYearPicker

انتخاب **ماه و سال** شمسی: گرید ماه‌های فارسی و امکان تغییر سال.

```vue
<LegalCalculatorsMonthYearPicker
  v-model="selectedMonthYear"
  label="زمان پرداخت"
  placeholder="انتخاب کنید"
  :min-year="1315"
  :max-year="1410"
  :default-year="1403"
/>
```

مقدار `v-model` از نوع `PersianMonthYear | null`:

```ts
interface PersianMonthYear {
  year: number   // سال شمسی
  month: number  // ۱ تا ۱۲ (فروردین تا اسفند)
}
```

| Prop | نوع | پیش‌فرض | توضیح |
|------|-----|---------|--------|
| `modelValue` | `PersianMonthYear \| null` | `null` | ماه و سال انتخاب‌شده |
| `label` | `string` | `''` | برچسب فیلد |
| `placeholder` | `string` | `'انتخاب کنید'` | متن وقتی مقدار خالی است |
| `minYear` | `number` | `1315` | کمترین سال |
| `maxYear` | `number` | `1410` | بیشترین سال |
| `defaultYear` | `number` | `1403` | سال پیش‌فرض در هدر پنل وقتی مقدار خالی است |
| `disabled` | `boolean` | `false` | غیرفعال |
| `hint` | `string` | `''` | راهنمای زیر فیلد |
| `ariaLabel` | `string` | `'انتخاب ماه و سال'` | برای دسترسی |

---

## تم (CSS Variables)

برای یکدست کردن با تم پروژه می‌توان از متغیرهای CSS زیر روی والد استفاده کرد:

- `--picker-accent`: رنگ تأکید (پیش‌فرض: نارنجی)
- `--picker-label-color`, `--picker-text`, `--picker-border`, `--picker-bg`, `--picker-icon`, `--picker-hint`
- `--picker-panel-bg`, `--picker-panel-border`
- `--picker-cell-text`, `--picker-cell-bg`, `--picker-cell-border`, `--picker-cell-hover-bg`, `--picker-cell-hover-border`, `--picker-cell-selected-text`

مثال:

```vue
<div class="my-form" style="--picker-accent: #059669;">
  <LegalCalculatorsYearPicker v-model="year" label="سال" />
</div>
```
