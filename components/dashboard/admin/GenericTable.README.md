# dashboard-admin-generic-table Component

یک component جدول قابل استفاده مجدد برای تمام صفحات admin.

## استفاده پایه

```vue
<dashboard-admin-generic-table
  :data="myData"
  :columns="tableColumns"
  :current-page="page"
  :total-items="total"
  @update:page="page = $event"
/>
```

## Props

### data (required)
آرایه‌ای از داده‌ها که باید نمایش داده شود.

```js
const data = ref([
  { id: 1, name: 'علی', phone: '09123456789' },
  { id: 2, name: 'محمد', phone: '09123456788' }
])
```

### columns (required)
تعریف ستون‌های جدول.

```js
const tableColumns = [
  { 
    key: 'name',           // کلید در data
    label: 'نام',          // عنوان ستون
    headerClass: '',       // کلاس برای header (اختیاری)
    cellClass: '',         // کلاس برای cell (اختیاری)
    format: 'text'         // نوع فرمت: text, currency, number, date, phone
  },
  { 
    key: 'phone', 
    label: 'تلفن',
    format: 'phone'
  }
]
```

### Pagination Props
- `currentPage`: شماره صفحه فعلی (default: 1)
- `totalItems`: تعداد کل آیتم‌ها (default: 0)
- `itemsPerPage`: تعداد آیتم در هر صفحه (default: 15)
- `showPagination`: نمایش pagination (default: true)

### Row Configuration
- `rowKey`: کلید یکتا برای هر ردیف (default: 'id')
- `rowClass`: کلاس CSS برای ردیف‌ها
- `onRowClick`: فعال کردن کلیک روی ردیف (default: false)

### Actions
آرایه‌ای از اکشن‌ها برای هر ردیف:

```js
const actions = [
  { 
    name: 'view',
    label: 'مشاهده',
    icon: 'lucide:eye',
    event: 'view'
  }
]
```

### Empty State
- `emptyTitle`: عنوان حالت خالی (default: 'داده‌ای یافت نشد')
- `emptyMessage`: پیام حالت خالی
- `emptyIcon`: آیکون حالت خالی (default: 'lucide:inbox')

## Slots

### Custom Cell Rendering
برای سفارشی‌سازی نمایش هر cell:

```vue
<dashboard-admin-generic-table :data="data" :columns="columns">
  <template #cell-name="{ row, value }">
    <div class="flex items-center gap-2">
      <img :src="row.avatar" />
      <span>{{ value }}</span>
    </div>
  </template>
</dashboard-admin-generic-table>
```

### Custom Actions
برای سفارشی‌سازی ستون actions:

```vue
<dashboard-admin-generic-table :data="data" :columns="columns">
  <template #actions="{ row }">
    <button @click="edit(row)">ویرایش</button>
    <button @click="delete(row)">حذف</button>
  </template>
</dashboard-admin-generic-table>
```

### Custom Empty State
برای سفارشی‌سازی حالت خالی:

```vue
<dashboard-admin-generic-table :data="data" :columns="columns">
  <template #empty>
    <div class="custom-empty">
      <h3>هیچ داده‌ای وجود ندارد</h3>
      <button>افزودن داده جدید</button>
    </div>
  </template>
</dashboard-admin-generic-table>
```

## Events

- `@update:page`: زمانی که صفحه تغییر میکند
- `@row-click`: زمانی که روی ردیف کلیک میشود (اگر onRowClick فعال باشد)
- هر event دیگری که در actions تعریف شده

## مثال کامل

```vue
<template>
  <dashboard-admin-generic-table
    :data="users"
    :columns="tableColumns"
    :current-page="page"
    :total-items="total"
    :items-per-page="15"
    row-key="id"
    empty-title="کاربری یافت نشد"
    empty-message="با جستجو کاربران را پیدا کنید"
    empty-icon="lucide:users"
    @update:page="page = $event"
  >
    <!-- Custom cell for avatar -->
    <template #cell-name="{ row }">
      <div class="flex items-center gap-3">
        <div class="avatar">{{ row.name[0] }}</div>
        <span>{{ row.name }}</span>
      </div>
    </template>

    <!-- Custom cell for status -->
    <template #cell-status="{ value }">
      <span class="badge" :class="value ? 'badge-success' : 'badge-error'">
        {{ value ? 'فعال' : 'غیرفعال' }}
      </span>
    </template>

    <!-- Custom actions -->
    <template #actions="{ row }">
      <button @click="viewUser(row)" class="btn-icon">
        <Icon name="lucide:eye" />
      </button>
      <button @click="editUser(row)" class="btn-icon">
        <Icon name="lucide:edit" />
      </button>
    </template>
  </dashboard-admin-generic-table>
</template>

<script setup>
const page = ref(1)
const total = ref(100)
const users = ref([...])

const tableColumns = [
  { key: 'name', label: 'نام' },
  { key: 'email', label: 'ایمیل' },
  { key: 'phone', label: 'تلفن', format: 'phone' },
  { key: 'balance', label: 'موجودی', format: 'currency', headerClass: 'text-center', cellClass: 'text-center' },
  { key: 'status', label: 'وضعیت' },
]

const viewUser = (user) => {
  console.log('View:', user)
}

const editUser = (user) => {
  console.log('Edit:', user)
}
</script>
```

## Format Types

- `text`: متن ساده (پیش‌فرض)
- `currency`: فرمت پولی (۱۲,۳۴۵ تومان)
- `number`: فرمت عددی (۱۲,۳۴۵)
- `date`: فرمت تاریخ
- `phone`: شماره تلفن

## نکات

1. برای هر column که نیاز به custom rendering دارید، از slot استفاده کنید
2. اگر actions ساده دارید، از prop استفاده کنید، اگر پیچیده است از slot
3. برای بهینه‌سازی، rowKey را به یک فیلد یکتا تنظیم کنید
4. برای جداول clickable، onRowClick را true کنید و event row-click را handle کنید
