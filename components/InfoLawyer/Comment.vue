<template>
  <section>
    <div class="container">
      <div class="bg-white rounded-[14px] p-7">
        <div class="flex flex-col gap-3">
          <span class="title">امتیاز و دیدگاه کاربران</span>
          <div class="text-area">
            <UTextarea
              color="neutral"
              variant="subtle"
              class="w-full mb-4 outline-0"
              :ui="{base:'focus-visible:ring-ring-color focus-visible:ring-1'}"
              placeholder="نظر خود را درباره ی وکیل مورد نظر بنویسید..."
              :maxrows="6"
              v-model="userComment"
              autoresize=""
            />
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
              <UiDrawer v-if="comment.dis.length > 135">
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
              </UiDrawer>
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
    dis: "دکتر هادلی بی نظیر بودند خارج از ساعت کاری سایت من رو ویزیت کردند، امتانت و ادب و تشخیص بی نظیر و  رو شکر که پیداشون کردم",
    replay: {
      username: "مجتبی میر باقری",
      date: "1404/4/9",
      dis: "ممنون",
    },
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "دکتر هادلی بی نظیر بودند خارج از ساعت کاری سایت من رو ویزیت کردند، امتانت و ادب و تشخیص بی نظیر و گوش دادن به مشکلات عالی بودند. وقت من تموم شده بود ولی گفتند اگر باز هم سوالی داری جواب میدم خدا رو شکر که پیداشون کردم",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "دکتر هادلی بی نظیر بودند خارج از ساعت کاری سایت من رو ویزیت کردند، امتانت و ادب و تشخیص بی نظیر و گوش دادن به مشکلات عالی بودند. وقت من تموم شده بود ولی گفتند اگر باز هم سوالی داری جواب میدم خدا رو شکر که پیداشون کردم",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "دکتر هادلی بی نظیر بودند خارج از ساعت کاری سایت من رو ویزیت کردند، امتانت و ادب و تشخیص بی نظیر و گوش دادن به مشکلات عالی بودند. وقت من تموم شده بود ولی گفتند اگر باز هم سوالی داری جواب میدم خدا رو شکر که پیداشون کردم",
    replay: {},
  },
  {
    username: "محمد طاها",
    date: "1404/4/9",
    dis: "دکتر هادلی بی نظیر بودند خارج از ساعت کاری سایت من رو ویزیت کردند، امتانت و ادب و تشخیص بی نظیر و گوش دادن به مشکلات عالی بودند. وقت من تموم شده بود ولی گفتند اگر باز هم سوالی داری جواب میدم خدا رو شکر که پیداشون کردم",
    replay: {},
  },
]);

const userComment = ref("");
</script>

<style>
</style>