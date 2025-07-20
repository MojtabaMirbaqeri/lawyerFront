<template>
  <section>
    <div class="">
      <div class="bg-white rounded-[14px] p-7">
        <div class="flex flex-col gap-3">
          <span class="title">امتیاز و دیدگاه کاربران</span>
          <div class="text-area">
            <UTextarea
              color="neutral"
              variant="subtle"
              class="w-full mb-4 outline-0"
              :ui="{
                base: 'focus-visible:ring-ring-color focus-visible:ring-1',
              }"
              placeholder="نظر خود را درباره ی وکیل مورد نظر بنویسید..."
              :maxrows="6"
              v-model="userComment"
              autoresize=""
            />
            <UICMainBtn class="mb-4"> ثبت نظر </UICMainBtn>
          </div>
        </div>
        <USeparator />
        <div class="comments">
          <div
            class="comment text-xs lg:text-sm p-4 flex flex-col gap-3 last:border-b-0 border-b border-[var(--ui-border)]"
            v-for="comment in comments"
            :key="comment"
          >
            <div class="info flex justify-between">
              <div class="username opacity-70">{{ comment.username }}</div>
              <div class="date">{{ comment.date }}</div>
            </div>
            <div class="user-comment cursor-pointer flex flex-col">
              {{
                comment.dis.length > 135
                  ? comment.dis.slice(0, 135) + "..."
                  : comment.dis
              }}
              <UICDrawer v-if="comment.dis.length > 135" title="more">
                <template #button>
                  <UButton
                    label="مشاهده ی بیشتر"
                    color="primary"
                    variant="link"
                    class="underline p-0"
                  />
                </template>
                <template #default>
                  {{ comment.dis }}
                </template>
              </UICDrawer>
            </div>
            <div
              class="lawyer-input-comment"
              v-if="Object.keys(comment.replay).length <= 0"
            >
              <div class="">
                <UTextarea
                  color="neutral"
                  variant="subtle"
                  class="w-full mb-4 outline-0"
                  :ui="{
                    base: 'focus-visible:ring-ring-color focus-visible:ring-1',
                  }"
                  placeholder="نظر خود را درباره ی نظر کاربر مورد نظر بنویسید..."
                  :maxrows="6"
                  v-model="userComment"
                  autoresize=""
                />
                <UICMainBtn class="mb-4"> ثبت نظر </UICMainBtn>
              </div>
            </div>
            <div
              v-if="Object.keys(comment.replay).length > 0"
              class="lawyer-comment rounded-[8px] p-4 flex flex-col gap-3 bg-[#f4f5f7]"
            >
              <div class="lawyer-info flex justify-between">
                <div class="lawyer-username opacity-70">
                  {{ comment.replay.username }}
                </div>
                <div class="lawyer-com-date">
                  {{ comment.replay.date }}
                </div>
              </div>
              <div class="lawyer-com-dis">
                {{ comment.replay.dis }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const comments = ref([
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
    replay: {
      username: "مجتبی میر باقری",
      date: "1404/4/9",
      dis: "ممنون",
    },
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "بسیار راضی هستم از خدمات این وکیل؛ هم شرایط شخصی من را به دقت در نظر گرفتند و هم مدیریت رفتاری‌شان عالی بود. علاوه بر این، حتی خارج از برنامه درمان، همواره حمایت و راهنمایی‌های ارزشمندی دریافت کردم. ",
    replay: {},
  },
]);

const userComment = ref("");
</script>

<style>
</style>