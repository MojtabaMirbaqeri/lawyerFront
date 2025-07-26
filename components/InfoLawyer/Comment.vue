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
      <UICSecondaryBtn :disabled="currentPageComment == lastPage" :class="{'bg-gray-500! cursor-no-drop!' : currentPageComment == lastPage}" @click="commentHandle" class="mx-auto my-4">
        <span>مشاهده بیشتر</span>
      </UICSecondaryBtn>
    </div>
  </section>
</template>

<script setup>
const props = defineProps(["lawyerFullName"]);
const res = await useGet(`lawyers/${useRoute().params.id}/reviews`);
const data = await res.data;
const lastPage = ref(data.data.last_page)

const currentPageComment = ref(1);

const comments = ref(data.data.data);


// watch(() => currentPageComment , (page) => {

// })

const commentHandle = async () => {
  currentPageComment.value++;
  const res = await useGet(
    `lawyers/${useRoute().params.id}/reviews?page=${currentPageComment.value}`
  );
  const data = await res.data;
  const newCom = ref(data.data.data)
  comments.value.push(...newCom.value)
  console.log(comments.value);
  
};

const userComment = ref("");
</script>

<style>
</style>

