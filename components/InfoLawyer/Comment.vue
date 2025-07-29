<template>
  <section id="comment">
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
            <div class="flex justify-between items-center mb-4">
              <UICMainBtn class="" @click="subComment"> ثبت نظر </UICMainBtn>
              <NuxtRating
                :read-only="false"
                :rating-value="rate"
                dir="ltr"
                style="direction: ltr !important"
                :rating-content="[
                  9.153, 5.408, 12.0, 2.0, 14.847, 5.408, 15.175, 5.996, 15.995,
                  7.178, 17.325, 7.628, 17.961, 7.772, 21.943, 9.548, 19.72,
                  13.43, 19.286, 13.937, 18.464, 15.117, 18.465, 16.577, 18.531,
                  17.254, 18.145, 21.76, 13.925, 20.751, 13.328, 20.477, 12.0,
                  20.025, 10.672, 20.477, 10.076, 20.751, 5.856, 21.761, 5.469,
                  17.254, 5.535, 16.578, 5.535, 15.118, 4.714, 13.938, 4.28,
                  13.43, 2.057, 9.548, 6.04, 7.772, 6.676, 7.628, 8.005, 7.178,
                  8.825, 5.996,
                ]"
                @rating-selected="addRate"
              />
            </div>
          </div>
        </div>
        <USeparator />
        <div class="comments">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment text-xs lg:text-sm p-4 flex flex-col gap-3 last:border-b-0 border-b border-[var(--ui-border)]"
          >
            <div class="info flex justify-between">
              <div class="username opacity-70">
                {{ `${comment.user.name} ${comment.user.family}` }}
              </div>
              <div class="date">
                {{ new Date(comment.created_at).toLocaleDateString("fa") }}
              </div>
            </div>
            <div class="user-comment cursor-pointer flex flex-col">
              {{
                comment.comment.length > 135
                  ? comment.comment.slice(0, 135) + "..."
                  : comment.comment
              }}
              <UICDrawer v-if="comment.comment.length > 135" title="more">
                <template #button>
                  <UButton
                    label="مشاهده ی بیشتر"
                    color="primary"
                    variant="link"
                    class="underline p-0"
                  />
                </template>
                <template #default>
                  {{ comment.comment }}
                </template>
              </UICDrawer>
            </div>
            <div v-if="!comment.reply" class="lawyer-input-comment">
              <div class="">
                <UCollapsible class="flex flex-col gap-2 w-full">
                  <UButton
                    color="primary"
                    variant="link"
                    trailing-icon="quill:reply"
                    class="text-right"
                    :ui="{ trailingIcon: 'cursor-pointer size-5!' }"
                    block
                  />

                  <template #content>
                    <UTextarea
                      v-model="lawyerComment[comment.id]"
                      color="neutral"
                      variant="subtle"
                      class="w-full mb-4 outline-0"
                      :ui="{
                        base: 'focus-visible:ring-ring-color focus-visible:ring-1',
                      }"
                      placeholder="نظر خود را درباره ی نظر کاربر مورد نظر بنویسید..."
                      :maxrows="6"
                      autoresize=""
                    />
                    <UICMainBtn class="mb-4" @click="subReply(comment.id)">
                      ثبت نظر
                    </UICMainBtn>
                  </template>
                </UCollapsible>
              </div>
            </div>
            <div
              v-if="comment.reply"
              class="lawyer-comment rounded-[8px] p-4 flex flex-col gap-3 bg-[#f4f5f7]"
            >
              <div class="lawyer-info flex justify-between">
                <div class="lawyer-username opacity-70">
                  {{ props.lawyerFullName }}
                </div>
                <div class="lawyer-com-date">
                  {{ new Date(comment.created_at).toLocaleDateString("fa") }}
                </div>
              </div>
              <div class="lawyer-com-dis">
                {{ comment.reply }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <UICSecondaryBtn
        :disabled="currentPageComment == lastPage"
        :class="{
          'bg-gray-500! cursor-no-drop!': currentPageComment == lastPage,
        }"
        class="mx-auto my-4"
        @click="commentHandle"
      >
        <span>مشاهده بیشتر</span>
      </UICSecondaryBtn>
    </div>
  </section>
</template>

<script setup>
import { useUserAuthStore } from "~/store/userAuth";
const props = defineProps(["lawyerFullName", "id"]);
const res = await useGet({url:`lawyers/${useRoute().params.id}/reviews`});
const data = await res.data;
const lastPage = ref(data.data.last_page);

const rate = ref(5);

const currentPageComment = ref(1);

const comments = ref(data.data.data);

const commentHandle = async () => {
  currentPageComment.value++;
  const res = await useGet(
   {url: `lawyers/${useRoute().params.id}/reviews?page=${currentPageComment.value}`}
  );
  const data = await res.data;
  const newCom = ref(data.data.data);
  comments.value.push(...newCom.value);
  console.log(comments.value);
};

const userComment = ref("");

const lawyerComment = ref({});

const addRate = (event) => {
  rate.value = event;
};

const subReply = async (comid) => {
  const bodyComment = {
    comment: lawyerComment.value[comid],
  };
  const res = await usePost(
    `reviews/${comid}/reply`,
    useUserAuthStore().userToken,
    bodyComment
  );
  if (res.statusCode) {
    const res = await useGet({url:`lawyers/${useRoute().params.id}/reviews`});
    const data = await res.data;
    lastPage.value = data.data.last_page;
    comments.value = data.data.data;
    lawyerComment.value[comid] = "";
    alert('انجام شد')
  } else {
    alert("خطا");
  }
};

const subComment = async () => {
  const bodyComment = {
    lawyer_id: props.id,
    rating: rate.value,
    comment: userComment.value,
  };
  const res = await usePost(
    "reviews",
    useUserAuthStore().userToken,
    bodyComment
  );
  if (res.statusCode) {
    const res = await useGet({url:`lawyers/${useRoute().params.id}/reviews`});
    const data = await res.data;
    lastPage.value = data.data.last_page;
    comments.value = data.data.data;
    userComment.value = "";
    rate.value = 5;
  } else {
    alert("خطا");
  }
};
</script>

<style>
</style>

