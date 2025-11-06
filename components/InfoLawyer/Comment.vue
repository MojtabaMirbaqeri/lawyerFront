<template>
  <section id="comment">
    <div class="">
      <div class="bg-white rounded-[14px] p-7">
        <div class="flex flex-col gap-3">
          <span class="title text-lg font-bold">امتیاز و دیدگاه کاربران</span>
          <div v-if="authStore.user?.user_type == 'user'" class="text-area">
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
              autoresize="" />
            <div class="flex justify-between items-center mb-4">
              <UICMainBtn class="" @click="subComment"> ثبت نظر </UICMainBtn>
              <NuxtRating
                :read-only="false"
                :rating-value="rate"
                dir="ltr"
                style="direction: ltr !important"
                :rating-content="[
                  9.153, 5.408, 12.0, 2.0, 14.847, 5.408, 15.175, 5.996, 15.995, 7.178,
                  17.325, 7.628, 17.961, 7.772, 21.943, 9.548, 19.72, 13.43, 19.286,
                  13.937, 18.464, 15.117, 18.465, 16.577, 18.531, 17.254, 18.145, 21.76,
                  13.925, 20.751, 13.328, 20.477, 12.0, 20.025, 10.672, 20.477, 10.076,
                  20.751, 5.856, 21.761, 5.469, 17.254, 5.535, 16.578, 5.535, 15.118,
                  4.714, 13.938, 4.28, 13.43, 2.057, 9.548, 6.04, 7.772, 6.676, 7.628,
                  8.005, 7.178, 8.825, 5.996,
                ]"
                @rating-selected="addRate" />
            </div>
          </div>
        </div>
        <USeparator class="py-3" />
        <div class="comments">
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="comment text-xs lg:text-sm p-4 flex flex-col gap-3 last:border-b-0 border-b border-[var(--ui-border)]">
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
                    class="underline p-0" />
                </template>
                <template #default>
                  {{ comment.comment }}
                </template>
              </UICDrawer>
            </div>
            <div
              v-if="!comment.has_replies && authStore.user?.user_type == 'lawyer'"
              class="lawyer-input-comment">
              <div class="">
                <UCollapsible class="flex flex-col gap-2 w-full">
                  <UButton
                    color="primary"
                    variant="link"
                    trailing-icon="quill:reply"
                    class="text-right"
                    :ui="{ trailingIcon: 'cursor-pointer size-5!' }"
                    block />

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
                      autoresize="" />
                    <UICMainBtn
                      :disabled="!lawyerComment[comment.id] || isLoading"
                      class="mb-4"
                      @click="subReply(comment.id)">
                      ثبت نظر
                    </UICMainBtn>
                  </template>
                </UCollapsible>
              </div>
            </div>
            <div
              v-if="comment.has_replies"
              class="lawyer-comment rounded-[8px] p-4 flex flex-col gap-3 bg-[#f4f5f7]">
              <div class="" v-for="rep in comment.replies" :key="rep.id">
                <div class="lawyer-info flex justify-between">
                  <div class="lawyer-username opacity-70">
                    {{ props.lawyerFullName }}
                  </div>
                  <div class="lawyer-com-date">
                    {{ new Date(rep.created_at).toLocaleDateString("fa") }}
                  </div>
                </div>
                <div class="lawyer-com-dis">
                  {{ rep.comment }}
                </div>
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
        @click="commentHandle">
        <span>مشاهده بیشتر</span>
      </UICSecondaryBtn>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["lawyerFullName", "id"]);
const res = await useGet({ url: `lawyers/${useRoute().params.id}/reviews` });
const data = await res.data;
const lastPage = ref(data.meta.last_page);
const authStore = useAuthStore();
const isLoading = ref(false);

const rate = ref(5);

const currentPageComment = ref(1);

const comments = ref(await data.data);

const commentHandle = async () => {
  currentPageComment.value++;
  const res = await useGet({
    url: `lawyers/${useRoute().params.id}/reviews?page=${currentPageComment.value}`,
  });
  const data = await res.data;
  const newCom = ref(data.data);
  comments.value.push(...newCom.value);
  nestedComments.value = comments.value
    .filter((c) => c.replied_to_review_id === null) // فقط کامنت‌های ریشه
    .map((root) => {
      const replies = comments.value.filter(
        (reply) => Number(reply.replied_to_review_id) === root.id
      );

      return {
        ...root, // تمام اطلاعات کامنت اصلی
        replies: replies.map((r) => ({ ...r })), // تمام اطلاعات ریپلای‌ها
      };
    });
  console.log(comments.value);
};

const userComment = ref("");

const lawyerComment = ref({});

const addRate = (event) => {
  rate.value = event;
};

const subReply = async (comid) => {
  isLoading.value = true;
  if (!lawyerComment.value[comid]) return;

  const bodyComment = {
    comment: lawyerComment.value[comid],
  };

  const res = await usePost(
    {
      url: `reviews/${comid}/reply`,
      includeAuthHeader: true,
      body: bodyComment,
    },
    false
  );

  isLoading.value = false;

  if (res.statusCode == 201) {
    const allComments = [];

    // fetch all pages up to current
    for (let page = 1; page <= currentPageComment.value; page++) {
      const resPage = await useGet({
        url: `lawyers/${useRoute().params.id}/reviews?page=${page}`,
      });

      const data = await resPage.data;
      if (data && data.data) {
        allComments.push(...data.data);
        if (page === 1) lastPage.value = data.meta.last_page;
      }
    }

    comments.value = allComments;

    lawyerComment.value[comid] = "";
    useToast().add({
      title: "دیدگاه شما با موفقیت ثبت شد.",
      icon: "hugeicons:message-01",
      color: "success",
    });
  } else if (res.statusCode == 403) {
    lawyerComment.value[comid] = "";
    useToast().add({
      title: "شما مجاز به ثبت پاسخ نمی باشید!",
      icon: "ph:warning",
      color: "error",
    });
  } else {
    useToast().add({
      title: res.message || "در فرآیند ثبت دیدگاه خطایی رخ داده است!",
      icon: "ph:warning",
      color: "error",
    });
  }
};

const subComment = async () => {
  isLoading.value = true;

  const bodyComment = {
    lawyer_id: props.id,
    rating: rate.value,
    comment: userComment.value,
  };
  const res = await usePost({
    url: "reviews",
    includeAuthHeader: true,
    body: bodyComment,
  },false);

  isLoading.value = false;
  if (res.statusCode == 201 || res.statusCode == 200) {
    userComment.value = "";
    rate.value = 5;
    useToast().add({
      title: "دیدگاه شما در دست بررسی است.",
      icon: "hugeicons:message-01",
      color: "success",
    });
  } else {
    useToast().add({
      title: res.message || "در فرآیند ثبت دیدگاه خطایی رخ داده است!",
      icon: "ph:warning",
      color: "error",
    });
  }
};
</script>

<style></style>
