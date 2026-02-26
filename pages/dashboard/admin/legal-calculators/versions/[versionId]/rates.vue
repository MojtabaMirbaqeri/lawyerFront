<template>
  <div class="rates-admin-page">
    <div class="page-header">
      <div class="flex flex-wrap items-center gap-3">
        <NuxtLink to="/dashboard/admin/legal-calculators" class="btn-secondary text-sm! py-1.5! px-3!">
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
          لیست ماشین‌حساب‌ها
        </NuxtLink>
        <button
          v-if="calculatorSlug === 'blood-money'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showDiyahHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل دیه
        </button>
        <button
          v-if="calculatorSlug === 'dowry'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showDowryHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل مهریه
        </button>
        <button
          v-if="calculatorSlug === 'inheritance'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showInheritanceHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل ارث
        </button>
        <button
          v-if="calculatorSlug === 'court-fee'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showCourtFeeHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل حق دادرسی
        </button>
        <button
          v-if="calculatorSlug === 'attorney-fee'"
          type="button"
          class="btn-secondary flex items-center gap-2"
          @click="showAttorneyFeeHelp = true"
        >
          <Icon name="lucide:book-open" class="w-4 h-4" />
          راهنما و نمونه کامل حق الوکاله
        </button>
        <button
          v-if="calculatorSlug === 'dowry'"
          type="button"
          class="btn-primary flex items-center gap-2"
          :disabled="syncInflationPending"
          @click="syncInflationIndex"
        >
          <Icon name="lucide:download" class="w-4 h-4" />
          {{ syncInflationPending ? 'در حال ثبت...' : 'دریافت و ثبت خودکار شاخص تورم' }}
        </button>
        <h1 class="page-title">نرخ‌ها و ضرایب</h1>
      </div>
    </div>

    <Teleport v-if="calculatorSlug === 'blood-money'" to="body">
      <Transition name="rates-diyah-help-fade">
        <div
          v-if="showDiyahHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showDiyahHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل نرخ‌های ماشین‌حساب دیه
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showDiyahHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                برای هر نسخه (سال) ماشین‌حساب دیه، نرخ‌های زیر را با «افزودن نرخ» اضافه کنید. مقدارهای JSON را می‌توانید از نمونه‌های زیر کپی کنید.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه کامل نرخ‌ها</h3>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: full_diyah_amount — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">500000000</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: victim_gender_multipliers — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleVictimGender }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: incident_categories — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleIncidentCategories }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: special_conditions — نوع: json</span>
                  <pre class="admin-diyah-sample-pre">{{ diyahSampleSpecialConditions }}</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: haram_month_multiplier — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">1.33</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                پس از ذخیره، در صفحه عمومی «محاسبه دیه» فیلدهای سال، نوع جنایت (درصدی، قتل نفس، جنین، اعضای بدن، جنابت بر میت)، جنسیت مقتول و محاسبه در ماه حرام از همین نرخ‌ها استفاده می‌شوند.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showDiyahHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport v-if="calculatorSlug === 'dowry'" to="body">
      <Transition name="rates-diyah-help-fade">
        <div
          v-if="showDowryHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showDowryHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل نرخ‌های ماشین‌حساب مهریه
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showDowryHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                محاسبه مهریه به نرخ روز طبق <strong>فرمول قوه‌قضاییه</strong> و بر اساس <strong>شاخص بهای کالاها و خدمات مصرفی (سالانه)</strong> بانک مرکزی انجام می‌شود. برای هر نسخه باید برای هر سال شمسی یک نرخ از نوع <strong>numeric</strong> با کلید <code class="font-mono text-xs bg-gray-200 px-1 rounded">coefficient_YYYY</code> تعریف کنید و مقدار آن را برابر <strong>شاخص سالانه</strong> همان سال قرار دهید (منبع: اعلام بانک مرکزی).
              </p>
              <p class="admin-diyah-help-intro">
                <strong>فرمول:</strong> مبلغ به نرخ روز = مبلغ مهریه × (شاخص سال مطالبه ÷ شاخص سال عقد). اگر برای سالی شاخص تعریف نشده باشد، عدد ۱ استفاده می‌شود.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه شاخص‌های سالانه (بر اساس جدول بانک مرکزی — سال مبنا ۱۳۹۵ = ۱۰۰)</h3>
                <p class="admin-diyah-help-intro mb-3">
                  هر ردیف را با «افزودن نرخ» اضافه کنید؛ مقدارها را از آخرین جدول شاخص سالانه بانک مرکزی به‌روز کنید.
                </p>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1395 — نوع: numeric (سال مبنا)</span>
                  <pre class="admin-diyah-sample-pre">100</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1400 — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">437.042</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1401 — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">640.225</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1402 — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">974.75</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1403 — نوع: numeric</span>
                  <pre class="admin-diyah-sample-pre">1306.77</pre>
                </div>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلید: coefficient_1404 — نوع: numeric (بر اساس اعلام سالانه به‌روز شود)</span>
                  <pre class="admin-diyah-sample-pre">1750</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                برای سال‌های قبل از ۱۳۹۵ یا بعد از ۱۴۰۴ هم می‌توانید نرخ <code class="font-mono text-xs bg-gray-200 px-1 rounded">coefficient_۱۳۳۰</code> تا <code class="font-mono text-xs bg-gray-200 px-1 rounded">coefficient_1410</code> با مقادیر شاخص رسمی اضافه کنید. منبع معتبر: جدول شاخص سالانه بانک مرکزی جمهوری اسلامی ایران.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showDowryHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport v-if="calculatorSlug === 'inheritance'" to="body">
      <Transition name="rates-diyah-help-fade">
        <div
          v-if="showInheritanceHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showInheritanceHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل ماشین‌حساب ارث (سهم‌الارث)
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showInheritanceHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                ماشین‌حساب ارث بر اساس <strong>قانون مدنی جمهوری اسلامی ایران</strong> و قواعد فقهی، سهم هر وارث را در <strong>سه طبقه</strong> محاسبه می‌کند. <strong>نیازی به تعریف نرخ در این صفحه نیست</strong>؛ فقط یک نسخه (مثلاً ۱۴۰۴) با تاریخ اثر داشته باشید. فرم در سایت به‌صورت <strong>آکاردئون</strong> (چهار بخش قابل باز و بسته) نمایش داده می‌شود.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">بخش‌های فرم (آکاردئون)</h3>
                <p class="admin-diyah-help-intro mb-2">
                  <strong>۱. مشخصات ترکه و همسر:</strong> مبلغ ترکه (تومان)، وضعیت همسر (مجرد / دارای شوهر / دارای زن). در صورت انتخاب «دارای زن» فیلد <strong>تعداد زن</strong> نمایش داده می‌شود (تعدد زوجات) و در نتیجه به‌صورت «زوجه (×N)» محاسبه می‌شود.<br />
                  <strong>۲. وارث درجه اول:</strong> تعداد فرزندان پسر و دختر، پدر و مادر در قید حیات.<br />
                  <strong>۳. وارث درجه دوم:</strong> برادران/خواهران (ابوینی، ابی، امی)، حیات اجداد (جد ابی، جده ابی، جد امی، جده امی).<br />
                  <strong>۴. وارث درجه سوم:</strong> عمو، عمه، دایی، خاله (ابوینی، ابی، امی).
                </p>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">قواعد سهم (خلاصه)</h3>
                <p class="admin-diyah-help-intro mb-2">
                  <strong>طبقه ۱:</strong> همسر (زوج ۱/۲ یا ۱/۴، زوجه ۱/۴ یا ۱/۸)، پدر و مادر هر کدام ۱/۶ با وجود فرزند، باقی‌مانده بین فرزندان (پسر ۲ واحد، دختر ۱ واحد).<br />
                  <strong>طبقه ۲:</strong> برادر/خواهر امی (یکی ۱/۶، چند نفر ۱/۳)، بقیه ابوینی/ابی (ذکور ۲× اناث). در نبود برادر/خواهر: اجداد امی ۱/۳، ابی ۲/۳.<br />
                  <strong>طبقه ۳:</strong> دایی/خاله امی (یکی ۱/۶، چند نفر ۱/۳)، بقیه عمو/عمه (۲/۳، ذکور ۲× اناث).
                </p>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه JSON کامل ورودی (متغیرهای قابل ویرایش)</h3>
                <p class="admin-diyah-help-intro mb-2">
                  در API محاسبه ارث، بدنهٔ درخواست می‌تواند شامل متغیرهای زیر باشد. مقادیر زیر یک نمونهٔ کامل است؛ فیلدهای اختیاری را در صورت عدم نیاز حذف یا صفر قرار دهید.
                </p>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">بدنهٔ POST (نمونه) — قابل کپی</span>
                  <pre class="admin-diyah-sample-pre">{{ inheritanceSampleJson }}</pre>
                </div>
                <p class="admin-diyah-help-intro mt-2 mb-1 font-medium">شرح متغیرها:</p>
                <ul class="admin-diyah-help-list text-sm text-gray-700 space-y-1 mb-2">
                  <li><code class="bg-gray-100 px-1 rounded">version_label</code> (اختیاری) — نسخهٔ مقررات (مثلاً ۱۴۰۴)؛ در صورت ارسال، نرخ‌های سهم از همین نسخه در پنل خوانده می‌شوند.</li>
                  <li><code class="bg-gray-100 px-1 rounded">estate_amount</code> (عدد، اجباری) — مبلغ ترکه به تومان</li>
                  <li><code class="bg-gray-100 px-1 rounded">spouse_type</code> (رشته) — <code>""</code> یا <code>"husband"</code> یا <code>"wife"</code></li>
                  <li><code class="bg-gray-100 px-1 rounded">wives_count</code> (عدد، اختیاری، حداقل ۱) — تعداد زن در صورت تعدد زوجات</li>
                  <li><code class="bg-gray-100 px-1 rounded">sons_count</code>, <code class="bg-gray-100 px-1 rounded">daughters_count</code> (عدد، اجباری) — تعداد فرزندان پسر و دختر</li>
                  <li><code class="bg-gray-100 px-1 rounded">father_alive</code>, <code class="bg-gray-100 px-1 rounded">mother_alive</code> (بولین، اجباری) — پدر/مادر در قید حیات</li>
                  <li><code class="bg-gray-100 px-1 rounded">brothers_abuyini</code>, <code class="bg-gray-100 px-1 rounded">brothers_abi</code>, <code class="bg-gray-100 px-1 rounded">brothers_umi</code> — تعداد برادران (ابوینی، ابی، امی)</li>
                  <li><code class="bg-gray-100 px-1 rounded">sisters_abuyini</code>, <code class="bg-gray-100 px-1 rounded">sisters_abi</code>, <code class="bg-gray-100 px-1 rounded">sisters_umi</code> — تعداد خواهران (ابوینی، ابی، امی)</li>
                  <li><code class="bg-gray-100 px-1 rounded">grandfather_paternal_alive</code>, <code class="bg-gray-100 px-1 rounded">grandmother_paternal_alive</code> — جد ابی / جده ابی در قید حیات</li>
                  <li><code class="bg-gray-100 px-1 rounded">grandfather_maternal_alive</code>, <code class="bg-gray-100 px-1 rounded">grandmother_maternal_alive</code> — جد امی / جده امی در قید حیات</li>
                  <li><code class="bg-gray-100 px-1 rounded">uncles_abuyini</code>, <code class="bg-gray-100 px-1 rounded">aunts_abuyini</code>, <code class="bg-gray-100 px-1 rounded">uncles_abi</code>, <code class="bg-gray-100 px-1 rounded">aunts_abi</code>, <code class="bg-gray-100 px-1 rounded">uncles_umi</code>, <code class="bg-gray-100 px-1 rounded">aunts_umi</code> — تعداد عمو، عمه، دایی، خاله (ابوینی، ابی، امی)</li>
                </ul>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نرخ‌های سهم (ضرایب) — قابل ویرایش توسط شما</h3>
                <p class="admin-diyah-help-intro mb-2">
                  می‌توانید سهم‌های ارث را از همین صفحه با <strong>«افزودن نرخ»</strong> تعریف یا ویرایش کنید. هر نرخ از نوع <strong>numeric</strong> است. اگر برای یک کلید نرخ تعریف نشده باشد، مقدار پیش‌فرض قانونی (جدول زیر) استفاده می‌شود.
                </p>
                <div class="admin-diyah-sample-block">
                  <span class="admin-diyah-sample-label">کلیدها و مقادیر پیش‌فرض (متن)</span>
                  <pre class="admin-diyah-sample-pre text-xs">{{ inheritanceShareRatesHelp }}</pre>
                </div>
                <div class="admin-diyah-sample-block mt-3">
                  <span class="admin-diyah-sample-label">نمونه کامل JSON نرخ‌های سهم — برای کپی و مرجع (هر کلید را با «افزودن نرخ» به‌صورت جداگانه، نوع numeric و مقدار متناظر اضافه کنید)</span>
                  <pre class="admin-diyah-sample-pre text-xs">{{ inheritanceShareRatesJson }}</pre>
                </div>
                <p class="admin-diyah-help-note">
                  با «افزودن نرخ» هر ردیف را با کلید و مقدار (مثلاً 0.5 برای یک‌دوم) اضافه کنید. با ویرایش مقدار، محاسبهٔ ارث در سایت از ضرایب جدید استفاده می‌کند.
                </p>
              </section>
              <p class="admin-diyah-help-note">
                کاربر در صفحه عمومی با باز کردن هر بخش آکاردئون، فیلدهای مربوطه را پر می‌کند و جدول سهم هر وارث و مبلغ به تومان نمایش داده می‌شود.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showInheritanceHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport v-if="calculatorSlug === 'court-fee'" to="body">
      <Transition name="rates-diyah-help-fade">
        <div
          v-if="showCourtFeeHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showCourtFeeHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل حق دادرسی
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showCourtFeeHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                ماشین‌حساب حق دادرسی بر اساس <strong>نوع دعوا</strong> (مالی، غیر مالی، چک، کیفری)، <strong>زیرنوع (نوع ان)</strong> برای دعاوی غیر مالی، و <strong>مرحلهٔ رسیدگی</strong> محاسبه می‌کند. همهٔ گزینه‌ها و نرخ‌ها از همین صفحه قابل شخصی‌سازی هستند.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">فرمول نحوه محاسبه</h3>
                <ul class="admin-diyah-help-list text-sm text-gray-700 space-y-2 mb-2">
                  <li><strong>دعاوی مالی:</strong> حق دادرسی = مبلغ خواسته × (نرخ درصد ÷ ۱۰۰). سپس اگر نرخ از حداقل (<code class="bg-gray-100 px-1 rounded">min_fee</code>) کمتر باشد برابر حداقل، و اگر حداکثر (<code class="bg-gray-100 px-1 rounded">max_fee</code>) تعریف شده و نرخ از آن بیشتر باشد برابر حداکثر قرار می‌گیرد. نرخ درصد از <code class="bg-gray-100 px-1 rounded">fee_rate_percent</code> خوانده می‌شود.</li>
                  <li><strong>دعاوی چک:</strong> همان فرمول مالی؛ ولی نرخ درصد و حداقل/حداکثر از <code class="bg-gray-100 px-1 rounded">fee_rate_check</code>, <code class="bg-gray-100 px-1 rounded">min_fee_check</code>, <code class="bg-gray-100 px-1 rounded">max_fee_check</code> خوانده می‌شود.</li>
                  <li><strong>دعاوی غیر مالی:</strong> مبلغ خواسته نادیده گرفته می‌شود. حق دادرسی یک مبلغ ثابت (به ریال) است که از جدول <code class="bg-gray-100 px-1 rounded">fee_table_non_financial</code> بر اساس <strong>زیرنوع</strong> (نوع ان) و <strong>مرحلهٔ رسیدگی</strong> انتخاب می‌شود.</li>
                  <li><strong>دعاوی کیفری:</strong> مبلغ خواسته نادیده گرفته می‌شود. حق دادرسی یک مبلغ ثابت (به ریال) است که از جدول <code class="bg-gray-100 px-1 rounded">fee_table_criminal</code> بر اساس <strong>مرحلهٔ رسیدگی</strong> انتخاب می‌شود.</li>
                </ul>
                <p class="admin-diyah-help-intro mb-0 text-xs">
                  خلاصه: مالی و چک = درصد از مبلغ خواسته + حداقل/حداکثر؛ غیر مالی و کیفری = حق ثابت از جدول نرخ به ازای هر (زیرنوع و) مرحله.
                </p>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه کامل JSON — نوع دعوا (claim_types)</h3>
                <p class="admin-diyah-help-intro mb-2">کلید: <code class="font-mono text-xs bg-gray-200 px-1 rounded">claim_types</code> — نوع: json</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ courtFeeSampleClaimTypes }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه کامل JSON — زیرنوع غیر مالی (non_financial_sub_types)</h3>
                <p class="admin-diyah-help-intro mb-2">کلید: <code class="font-mono text-xs bg-gray-200 px-1 rounded">non_financial_sub_types</code> — نوع: json. این فیلد فقط وقتی نوع دعوا «غیر مالی» است در فرم نمایش داده می‌شود.</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ courtFeeSampleNonFinancialSubTypes }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه کامل JSON — مراحل رسیدگی (stages)</h3>
                <p class="admin-diyah-help-intro mb-2">کلید: <code class="font-mono text-xs bg-gray-200 px-1 rounded">stages</code> — نوع: json</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ courtFeeSampleStages }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">جدول حق ثابت غیر مالی (fee_table_non_financial)</h3>
                <p class="admin-diyah-help-intro mb-2">کلید: <code class="font-mono text-xs bg-gray-200 px-1 rounded">fee_table_non_financial</code> — نوع: json. ساختار: شی دو سطحی؛ سطح اول <code>value</code> زیرنوع (مثلاً commercial، family)، سطح دوم <code>value</code> مرحله (مثلاً initial، appeal). مقدار هر سلول مبلغ حق دادرسی به ریال است.</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre text-xs">{{ courtFeeSampleFeeTableNonFinancial }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">جدول حق ثابت کیفری (fee_table_criminal)</h3>
                <p class="admin-diyah-help-intro mb-2">کلید: <code class="font-mono text-xs bg-gray-200 px-1 rounded">fee_table_criminal</code> — نوع: json. شی با کلید مراحل (initial، objection، appeal، retrial، supreme، third_party) و مقدار مبلغ به ریال.</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ courtFeeSampleFeeTableCriminal }}</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                برای دعاوی <strong>مالی</strong> و <strong>چک</strong> از نرخ درصد و حداقل/حداکثر (<code class="font-mono text-xs bg-gray-200 px-1 rounded">fee_rate_percent</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">min_fee</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">max_fee</code> و برای چک: <code class="font-mono text-xs bg-gray-200 px-1 rounded">fee_rate_check</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">min_fee_check</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">max_fee_check</code>) استفاده می‌شود. مبلغ خواسته فقط برای مالی و چک معتبر است.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showCourtFeeHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport v-if="calculatorSlug === 'attorney-fee'" to="body">
      <Transition name="rates-diyah-help-fade">
        <div
          v-if="showAttorneyFeeHelp"
          class="admin-diyah-help-overlay"
          role="dialog"
          aria-modal="true"
          @click.self="showAttorneyFeeHelp = false"
        >
          <div class="admin-diyah-help-modal">
            <div class="admin-diyah-help-header">
              <h2 class="admin-diyah-help-title">
                <Icon name="lucide:book-open" class="w-5 h-5" />
                راهنما و نمونه کامل حق الوکاله
              </h2>
              <button type="button" class="admin-diyah-help-close" aria-label="بستن" @click="showAttorneyFeeHelp = false">
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="admin-diyah-help-body">
              <p class="admin-diyah-help-intro">
                ماشین‌حساب حق الوکاله بر اساس <strong>موضوع وکالت</strong> (مالی، امور حسبی، کیفری، سایر)، <strong>نتیجه دعوا</strong>، <strong>روزهای ماموریت</strong> داخل/خارج استان، چک‌باکس‌ها (وکیل پس از نقض رأی، تسخیری/معاضدتی، گواهی تخصصی، ورود/جلب/اعتراض ثالث/تقابل) و <strong>مبلغ موضوع پرونده</strong> محاسبه می‌کند. همهٔ گزینه‌ها و نرخ‌ها از همین صفحه قابل شخصی‌سازی هستند.
              </p>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">فرمول نحوه محاسبه</h3>
                <ul class="admin-diyah-help-list text-sm text-gray-700 space-y-2 mb-2">
                  <li><strong>حق پایه:</strong> مبلغ موضوع پرونده × (نرخ تعرفه ÷ ۱۰۰) با اعمال حداقل حق (<code class="bg-gray-100 px-1 rounded">min_fee</code>). نرخ از <code class="bg-gray-100 px-1 rounded">tariff_percent</code> خوانده می‌شود.</li>
                  <li><strong>نتیجه دعوا:</strong> در صورت انتخاب نتیجه، حق پایه در ضریب همان نتیجه (از <code class="bg-gray-100 px-1 rounded">outcome_fee_table</code>) ضرب می‌شود.</li>
                  <li><strong>ماموریت:</strong> (روز داخل استان × <code class="bg-gray-100 px-1 rounded">per_diem_in</code>) + (روز خارج استان × <code class="bg-gray-100 px-1 rounded">per_diem_out</code>) به حق پایه اضافه می‌شود.</li>
                  <li><strong>چک‌باکس‌ها:</strong> وکیل پس از نقض رأی → ضریب <code class="bg-gray-100 px-1 rounded">after_reversal_multiplier</code>؛ تسخیری/معاضدتی → ضریب <code class="bg-gray-100 px-1 rounded">legal_aid_multiplier</code>؛ گواهی تخصصی → افزایش <code class="bg-gray-100 px-1 rounded">specialty_bonus_percent</code>٪؛ ورود/جلب/اعتراض ثالث/تقابل → افزایش <code class="bg-gray-100 px-1 rounded">third_party_bonus_percent</code>٪.</li>
                </ul>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه JSON — موضوع وکالت (case_categories)</h3>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ attorneyFeeSampleCaseCategories }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نمونه JSON — نتیجه دعوا (case_outcomes)</h3>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre text-xs">{{ attorneyFeeSampleCaseOutcomes }}</pre>
                </div>
              </section>
              <section class="admin-diyah-sample-section">
                <h3 class="admin-diyah-sample-title">نرخ ماموریت و ضرایب</h3>
                <p class="admin-diyah-help-intro mb-2">کلیدهای عددی: <code class="font-mono text-xs bg-gray-200 px-1 rounded">per_diem_in</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">per_diem_out</code> (ریال در روز)، <code class="font-mono text-xs bg-gray-200 px-1 rounded">legal_aid_multiplier</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">after_reversal_multiplier</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">specialty_bonus_percent</code>, <code class="font-mono text-xs bg-gray-200 px-1 rounded">third_party_bonus_percent</code>.</p>
                <div class="admin-diyah-sample-block">
                  <pre class="admin-diyah-sample-pre">{{ attorneyFeeSampleOutcomeTable }}</pre>
                </div>
              </section>
              <p class="admin-diyah-help-note">
                نمونهٔ کامل <code class="font-mono text-xs bg-gray-200 px-1 rounded">outcome_fee_table</code> (ضریب به ازای هر نتیجه) در بلوک بالا آمده است. با «افزودن نرخ» هر کلید را با نوع و مقدار مناسب اضافه یا ویرایش کنید.
              </p>
            </div>
            <div class="admin-diyah-help-footer">
              <button type="button" class="btn-primary" @click="showAttorneyFeeHelp = false">متوجه شدم</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div class="card-dashboard">
      <div class="card-dashboard-header">
        <h2 class="card-dashboard-title">افزودن نرخ</h2>
      </div>
      <div class="card-dashboard-body">
        <p v-if="addError" class="text-sm text-red-600 mb-2">{{ addError }}</p>
        <form class="add-rate-form mb-6" @submit.prevent="addRate">
          <div class="add-rate-row">
            <div class="add-rate-field">
              <label class="add-rate-label">کلید (key)</label>
              <input v-model="newRate.key" type="text" class="input-dashboard add-rate-input font-mono" required />
            </div>
            <div class="add-rate-field add-rate-field-type">
              <label class="add-rate-label">نوع مقدار</label>
              <select v-model="newRate.value_type" class="select-dashboard add-rate-input">
                <option value="numeric">numeric</option>
                <option value="text">text</option>
                <option value="json">json</option>
                <option value="boolean">boolean</option>
              </select>
            </div>
            <div v-if="newRate.value_type === 'numeric'" class="add-rate-field add-rate-field-value">
              <label class="add-rate-label">مقدار عددی</label>
              <input v-model.number="newRate.value_numeric" type="number" step="any" class="input-dashboard add-rate-input" />
            </div>
            <div v-else-if="newRate.value_type === 'text'" class="add-rate-field add-rate-field-value">
              <label class="add-rate-label">مقدار متنی</label>
              <input v-model="newRate.value_text" type="text" class="input-dashboard add-rate-input" />
            </div>
            <div v-else-if="newRate.value_type === 'boolean'" class="add-rate-field add-rate-field-value">
              <label class="add-rate-label">مقدار</label>
              <select v-model="newRate.value_text" class="select-dashboard add-rate-input">
                <option value="true">true</option>
                <option value="false">false</option>
                <option value="1">1</option>
                <option value="0">0</option>
              </select>
            </div>
            <div v-else-if="newRate.value_type === 'json'" class="add-rate-field add-rate-field-json">
              <label class="add-rate-label">JSON (آرایه یا شی)</label>
              <textarea v-model="newRate.value_json_text" class="input-dashboard add-rate-input font-mono text-sm" rows="2" placeholder='[{"key":"value"}]' />
            </div>
            <div class="add-rate-field add-rate-field-btn">
              <label class="add-rate-label add-rate-label-invisible">دکمه</label>
              <button type="submit" class="btn-primary shrink-0" :disabled="addPending">
                <Icon name="lucide:plus" class="w-4 h-4" />
                افزودن نرخ
              </button>
            </div>
          </div>
        </form>

        <div class="overflow-x-auto">
          <table class="table-dashboard">
            <thead>
              <tr>
                <th>کلید</th>
                <th>نوع</th>
                <th>مقدار</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in rates" :key="r.id">
                <td class="font-mono text-sm">{{ r.key }}</td>
                <td>{{ r.value_type }}</td>
                <td class="text-sm max-w-xs truncate">
                  <template v-if="editingId === r.id">
                    <input
                      v-if="r.value_type === 'numeric'"
                      v-model.number="editPayload.value_numeric"
                      type="number"
                      step="any"
                      class="input-dashboard w-32"
                    />
                    <input
                      v-else-if="r.value_type === 'text' || r.value_type === 'boolean'"
                      v-model="editPayload.value_text"
                      type="text"
                      class="input-dashboard w-full max-w-xs"
                    />
                    <textarea
                      v-else-if="r.value_type === 'json'"
                      v-model="editPayload.value_json_text"
                      class="input-dashboard w-full max-w-md font-mono text-sm"
                      rows="3"
                    />
                  </template>
                  <template v-else>{{ displayValue(r) }}</template>
                </td>
                <td>
                  <div class="flex gap-2">
                    <template v-if="editingId === r.id">
                      <button
                        type="button"
                        class="btn-primary text-sm! py-1! px-2!"
                        :disabled="savePending"
                        @click="saveEdit(r)"
                      >
                        ذخیره
                      </button>
                      <button
                        type="button"
                        class="btn-secondary text-sm! py-1! px-2!"
                        @click="cancelEdit"
                      >
                        انصراف
                      </button>
                    </template>
                    <template v-else>
                      <button
                        type="button"
                        class="btn-secondary text-sm! py-1! px-2!"
                        @click="startEdit(r)"
                      >
                        <Icon name="lucide:pencil" class="w-4 h-4" />
                        ویرایش
                      </button>
                      <button
                        type="button"
                        class="text-red-600 hover:text-red-800"
                        :disabled="deletePending === r.id"
                        @click="removeRate(r)"
                      >
                        <Icon name="lucide:trash-2" class="w-4 h-4" />
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="rates.length === 0 && !pending" class="empty-state py-12">
          <div class="empty-state-icon">
            <Icon name="lucide:list" class="w-8 h-8" />
          </div>
          <h4 class="empty-state-title">نرخی ثبت نشده است</h4>
          <p class="empty-state-description">با فرم بالا نرخ‌ها و ضرایب را اضافه کنید.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const versionId = computed(() => route.params.versionId as string)
const rates = ref<Record<string, unknown>[]>([])
const pending = ref(true)
const addPending = ref(false)
const calculatorSlug = ref<string | null>(null)
const showDiyahHelp = ref(false)
const showDowryHelp = ref(false)
const showInheritanceHelp = ref(false)
const showCourtFeeHelp = ref(false)
const showAttorneyFeeHelp = ref(false)
const syncInflationPending = ref(false)

/** نمونه‌های JSON حق دادرسی — قابل کپی در پنل */
const courtFeeSampleClaimTypes = `[
  {"value":"financial","label":"مالی"},
  {"value":"non_financial","label":"غیر مالی"},
  {"value":"check","label":"چک"},
  {"value":"criminal","label":"کیفری"}
]`
const courtFeeSampleNonFinancialSubTypes = `[
  {"value":"commercial","label":"مربوط به امور تجاری و شرکتها"},
  {"value":"civil_status","label":"مربوط به اسناد سجلی و امور حسبی"},
  {"value":"family","label":"دعاوی مربوط به امور خانواده (موضوع صلاحیت دادگاه خانواده)"},
  {"value":"provisional","label":"تامین خواسته و دستور موقت (به استثناء دعاوی قابل فرجام و امور خانواده و اعتراض به آراء مراجع غیر دادگستری)"},
  {"value":"objection_non_judicial","label":"اعتراض به آراء مراجع غیر دادگستری"},
  {"value":"appealable","label":"دعاوی قابل فرجام"},
  {"value":"other","label":"سایر دعاوی"}
]`
const courtFeeSampleStages = `[
  {"value":"initial","label":"بدوی"},
  {"value":"objection","label":"واخواهی"},
  {"value":"appeal","label":"تجدیدنظر"},
  {"value":"retrial","label":"اعاده دادرسی"},
  {"value":"supreme","label":"فرجام‌خواهی"},
  {"value":"third_party","label":"اعتراض ثالث"}
]`
const courtFeeSampleFeeTableNonFinancial = `{
  "commercial": {"initial":1000000,"objection":500000,"appeal":500000,"retrial":500000,"supreme":500000,"third_party":500000},
  "civil_status": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000},
  "family": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000},
  "provisional": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000},
  "objection_non_judicial": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000},
  "appealable": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000},
  "other": {"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000}
}`
const courtFeeSampleFeeTableCriminal = '{"initial":500000,"objection":300000,"appeal":300000,"retrial":300000,"supreme":300000,"third_party":300000}'

/** نمونه‌های JSON حق الوکاله */
const attorneyFeeSampleCaseCategories = `[
  {"value":"financial","label":"مالی"},
  {"value":"probate","label":"امور حسبی"},
  {"value":"criminal","label":"کیفری"},
  {"value":"other","label":"سایر"}
]`
const attorneyFeeSampleCaseOutcomes = `[
  {"value":"dismissal_before_defense","label":"قرار ابطال دادخواست پیش از دفاع و پاسخ دعوا"},
  {"value":"dismissal_after_defense","label":"قرار ابطال دادخواست پس از دفاع و پاسخ دعوا"},
  {"value":"appeal_dismissal_before_defense","label":"قرار سقوط دعوا تجدیدنظر قبل از پاسخ و دفاع از دعوا"},
  {"value":"appeal_dismissal_after_defense","label":"قرار سقوط دعوا تجدیدنظر پس از پاسخ و دفاع از دعوا"},
  {"value":"rejection_statute_of_limitations","label":"قرار رد دعوا به علت قبول ایراد مرور زمان"},
  {"value":"rejection_retrial","label":"قرار رد تقاضای اعاده دادرسی"},
  {"value":"rejection_res_judicata","label":"قرار رد دعوا به علت اعتبار امر مختومه"}
]`
const attorneyFeeSampleOutcomeTable = `{
  "dismissal_before_defense": 0.25,
  "dismissal_after_defense": 0.5,
  "appeal_dismissal_before_defense": 0.25,
  "appeal_dismissal_after_defense": 0.5,
  "rejection_statute_of_limitations": 0.5,
  "rejection_retrial": 0.5,
  "rejection_res_judicata": 0.5
}`

const diyahSampleVictimGender = '{"male":1,"female":0.5}'
const diyahSampleIncidentCategories = `[
  {"key":"percentage","label":"درصدی","multiplier":1},
  {"key":"murder","label":"قتل نفس","multiplier":1},
  {"key":"fetus","label":"جنین","multiplier":0.05},
  {"key":"body_parts","label":"اعضای بدن","multiplier":1},
  {"key":"deceased_violation","label":"جنابت بر میت","multiplier":1}
]`
const diyahSampleSpecialConditions = '[{"value":"haram_month","label":"محاسبه دیه در ماه حرام"}]'

/** نمونه JSON کامل ورودی ماشین‌حساب ارث — همه متغیرهایی که کاربر می‌تواند در API ارسال کند */
const inheritanceSampleJson = `{
  "version_label": "1404",
  "estate_amount": 500000000,
  "spouse_type": "wife",
  "wives_count": 1,
  "sons_count": 2,
  "daughters_count": 1,
  "father_alive": true,
  "mother_alive": true,
  "brothers_abuyini": 0,
  "brothers_abi": 0,
  "brothers_umi": 0,
  "sisters_abuyini": 0,
  "sisters_abi": 0,
  "sisters_umi": 0,
  "grandfather_paternal_alive": false,
  "grandmother_paternal_alive": false,
  "grandfather_maternal_alive": false,
  "grandmother_maternal_alive": false,
  "uncles_abuyini": 0,
  "aunts_abuyini": 0,
  "uncles_abi": 0,
  "aunts_abi": 0,
  "uncles_umi": 0,
  "aunts_umi": 0
}`

/** راهنمای نرخ‌های سهم ارث (کلید + مقدار پیش‌فرض) برای پنل ادمین */
const inheritanceShareRatesHelp = `همسر (طبقه ۱ و ۲ و ۳):
  share_spouse_husband_no_children   = 0.5     (زوج بدون فرزند: ۱/۲)
  share_spouse_husband_with_children = 0.25    (زوج با فرزند: ۱/۴)
  share_spouse_wife_no_children      = 0.25    (زوجه بدون فرزند: ۱/۴)
  share_spouse_wife_with_children    = 0.125   (زوجه با فرزند: ۱/۸)

پدر و مادر (طبقه ۱):
  share_father_with_children = 0.166667   (پدر با وجود فرزند: ۱/۶)
  share_mother_with_children = 0.166667   (مادر با وجود فرزند: ۱/۶)
  share_father_no_children  = 0.666667   (پدر بدون فرزند: ۲/۳)
  share_mother_no_children  = 0.333333   (مادر بدون فرزند: ۱/۳)
  share_father_only         = 1          (فقط پدر)
  share_mother_only         = 1          (فقط مادر)

واحد فرزندان (نسبت پسر به دختر):
  son_unit     = 2    (پسر ۲ واحد)
  daughter_unit = 1   (دختر ۱ واحد)

برادر/خواهر امی (طبقه ۲):
  share_maternal_sibling_one  = 0.166667   (یکی: ۱/۶)
  share_maternal_sibling_many = 0.333333   (چند نفر: ۱/۳)
  brother_unit = 2    (برادر ابوینی/ابی: ۲ واحد)
  sister_unit  = 1    (خواهر ابوینی/ابی: ۱ واحد)

اجداد (طبقه ۲):
  share_maternal_grandparent = 0.333333   (سهم مادری از باقی‌مانده: ۱/۳)
  share_paternal_grandparent = 0.666667   (سهم پدری: ۲/۳)

دایی/خاله و عمو/عمه (طبقه ۳):
  share_maternal_uncle_one  = 0.166667   (دایی/خاله امی یکی: ۱/۶)
  share_maternal_uncle_many = 0.333333   (چند نفر: ۱/۳)
  uncle_unit = 2    (عمو: ۲ واحد)
  aunt_unit  = 1    (عمه: ۱ واحد)`

/** نمونه کامل JSON همه نرخ‌های سهم ارث — برای کپی و ویرایش (هر کلید را به‌صورت نرخ جدا با نوع numeric اضافه کنید) */
const inheritanceShareRatesJson = `{
  "share_spouse_husband_no_children": 0.5,
  "share_spouse_husband_with_children": 0.25,
  "share_spouse_wife_no_children": 0.25,
  "share_spouse_wife_with_children": 0.125,
  "share_father_with_children": 0.166667,
  "share_mother_with_children": 0.166667,
  "share_father_no_children": 0.666667,
  "share_mother_no_children": 0.333333,
  "share_father_only": 1,
  "share_mother_only": 1,
  "son_unit": 2,
  "daughter_unit": 1,
  "share_maternal_sibling_one": 0.166667,
  "share_maternal_sibling_many": 0.333333,
  "brother_unit": 2,
  "sister_unit": 1,
  "share_maternal_grandparent": 0.333333,
  "share_paternal_grandparent": 0.666667,
  "share_maternal_uncle_one": 0.166667,
  "share_maternal_uncle_many": 0.333333,
  "uncle_unit": 2,
  "aunt_unit": 1
}`

const newRate = reactive({
  key: '',
  value_type: 'numeric' as string,
  value_numeric: 0 as number | '',
  value_text: '',
  value_json_text: '[]',
})
const addError = ref('')
const editingId = ref<number | null>(null)
const savePending = ref(false)
const deletePending = ref<number | null>(null)
const editPayload = reactive<{ value_numeric?: number; value_text?: string; value_json_text?: string }>({})

function displayValue(r: Record<string, unknown>): string {
  if (r.value_type === 'numeric') return String(r.value_numeric ?? '')
  if (r.value_type === 'text') return String(r.value_text ?? '')
  if (r.value_type === 'json') return JSON.stringify(r.value_json ?? {})
  return String(r.value_text ?? '')
}

async function load() {
  pending.value = true
  const res = await useGet({
    url: `admin/legal-calculator-versions/${versionId.value}/rates`,
    includeAuthHeader: true,
  }, false)
  const body = res.data as { data?: unknown[] }
  rates.value = (Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []) as Record<string, unknown>[]
  pending.value = false
}

async function addRate() {
  addError.value = ''
  addPending.value = true
  const body: Record<string, unknown> = {
    key: newRate.key,
    value_type: newRate.value_type,
  }
  if (newRate.value_type === 'numeric') body.value_numeric = newRate.value_numeric
  else if (newRate.value_type === 'text' || newRate.value_type === 'boolean') body.value_text = newRate.value_text
  else if (newRate.value_type === 'json') {
    try {
      body.value_json = JSON.parse(newRate.value_json_text || '[]')
    } catch {
      addError.value = 'JSON نامعتبر است.'
      addPending.value = false
      return
    }
  }
  const res = await usePost({
    url: `admin/legal-calculator-versions/${versionId.value}/rates`,
    includeAuthHeader: true,
    body,
  }, true)
  addPending.value = false
  if (res.status !== false) await load()
  else if (res.message) addError.value = res.message
}

function startEdit(r: Record<string, unknown>) {
  editingId.value = r.id as number
  editPayload.value_numeric = r.value_numeric != null ? Number(r.value_numeric) : undefined
  editPayload.value_text = r.value_text != null ? String(r.value_text) : ''
  editPayload.value_json_text = r.value_json != null ? JSON.stringify(r.value_json, null, 2) : '[]'
}

function cancelEdit() {
  editingId.value = null
}

async function saveEdit(r: Record<string, unknown>) {
  savePending.value = true
  const payload: Record<string, unknown> = {
    key: r.key,
    value_type: r.value_type,
    value_numeric: r.value_numeric,
    value_text: r.value_text,
    value_json: r.value_json,
  }
  if (r.value_type === 'numeric') payload.value_numeric = editPayload.value_numeric
  else if (r.value_type === 'text' || r.value_type === 'boolean') payload.value_text = editPayload.value_text
  else if (r.value_type === 'json') {
    try {
      payload.value_json = JSON.parse(editPayload.value_json_text || '[]')
    } catch {
      useToast().add({ color: 'error', description: 'JSON نامعتبر است.' })
      savePending.value = false
      return
    }
  }
  await usePatch({
    url: `admin/legal-calculator-rates/${r.id}`,
    includeAuthHeader: true,
    body: payload,
  }, true)
  savePending.value = false
  editingId.value = null
  await load()
}

async function removeRate(r: Record<string, unknown>) {
  if (!confirm('آیا از حذف این نرخ اطمینان دارید؟')) return
  const rid = r.id as number
  deletePending.value = rid
  const res = await useDelete({ url: `admin/legal-calculator-rates/${rid}`, includeAuthHeader: true })
  deletePending.value = null
  if (res.status !== false) await load()
}

async function loadVersion() {
  const res = await useGet({ url: `admin/legal-calculator-versions/${versionId.value}`, includeAuthHeader: true }, false)
  const body = res.data as { data?: { calculator?: { slug?: string } } }
  const slug = body?.data?.calculator?.slug
  calculatorSlug.value = typeof slug === 'string' ? slug : null
}

async function syncInflationIndex() {
  if (syncInflationPending.value) return
  syncInflationPending.value = true
  const res = await usePost({
    url: `admin/legal-calculator-versions/${versionId.value}/rates/sync-inflation-index`,
    includeAuthHeader: true,
    body: {},
  }, true)
  syncInflationPending.value = false
  if (res.status !== false && res.message) {
    useToast().add({ color: 'success', description: res.message })
    await load()
  } else if (res.message) {
    useToast().add({ color: 'error', description: res.message })
  }
}

onMounted(() => {
  load()
  loadVersion()
})
watch(versionId, () => {
  load()
  loadVersion()
})

useHead({ title: 'نرخ‌های نسخه | پنل ادمین' })
</script>

<style scoped>
@reference "tailwindcss";

.rates-admin-page {
  @apply space-y-6;
}

.add-rate-form {
  /* form spacing handled by .add-rate-row */
}

.add-rate-row {
  @apply flex flex-nowrap items-end gap-3;
}

.add-rate-field {
  flex: 0 0 auto;
}

.add-rate-field:first-child .add-rate-input {
  width: 11rem;
}

.add-rate-field-type {
  min-width: 7rem;
}

.add-rate-field-value .add-rate-input {
  width: 8rem;
}

.add-rate-field-json {
  flex: 1 1 12rem;
  min-width: 12rem;
}

.add-rate-field-json .add-rate-input {
  width: 100%;
  min-height: 4rem;
}

.add-rate-field-btn {
  flex-shrink: 0;
}

.add-rate-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.add-rate-label-invisible {
  @apply opacity-0 pointer-events-none;
}

.add-rate-input {
  @apply block;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.page-title {
  @apply text-xl font-bold text-gray-900;
}

.admin-diyah-help-overlay {
  @apply fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4;
}

.admin-diyah-help-modal {
  @apply my-8 w-full max-w-2xl rounded-xl bg-white shadow-xl;
}

.admin-diyah-help-header {
  @apply flex items-center justify-between border-b border-gray-200 px-6 py-4;
}

.admin-diyah-help-title {
  @apply flex items-center gap-2 text-lg font-bold text-gray-900;
}

.admin-diyah-help-close {
  @apply rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700;
}

.admin-diyah-help-body {
  @apply max-h-[70vh] overflow-y-auto px-6 py-4;
}

.admin-diyah-help-intro {
  @apply mb-4 text-sm text-gray-600;
}

.admin-diyah-sample-section {
  @apply mb-4;
}

.admin-diyah-sample-title {
  @apply mb-3 text-sm font-semibold text-gray-800;
}

.admin-diyah-sample-block {
  @apply mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3;
}

.admin-diyah-sample-label {
  @apply mb-1 block text-xs font-medium text-gray-500;
}

.admin-diyah-sample-pre {
  @apply overflow-x-auto font-mono text-xs text-gray-800 whitespace-pre-wrap break-all;
}

.admin-diyah-help-note {
  @apply mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800;
}

.admin-diyah-help-footer {
  @apply border-t border-gray-200 px-6 py-4;
}

.rates-diyah-help-fade-enter-active,
.rates-diyah-help-fade-leave-active {
  transition: opacity 0.2s ease;
}

.rates-diyah-help-fade-enter-from,
.rates-diyah-help-fade-leave-to {
  opacity: 0;
}
</style>
