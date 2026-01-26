<template>
  <div class="chat-wrapper h-[calc(100svh-64px)] lg:h-[calc(100svh-80px)];">
    <div v-if="roomId !== 0" ref="messagesContainer" class="messages-container">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="[
          'chat-bubble',
          msg.user?.id === authStore.user.id ? 'me' : 'other',
        ]"
      >
        <div class="avatar shrink-0" v-if="msg.user?.id !== authStore.user.id">
          <img
            v-if="msg.user.profile_image && msg.user.profile_image !== '0'"
            :src="msg.user.profile_image"
            alt="avatar"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            :class="[
              'w-full h-full flex items-center justify-center text-white font-bold text-sm',
              getUserAvatarColor(msg.user.id),
            ]"
          >
            <span>{{ getUserInitials(msg.user) }}</span>
          </div>
        </div>

        <div class="bubble-content">
          <div
            v-if="msg.attachments && msg.attachments.length > 0"
            class="attachments-wrapper"
          >
            <div
              v-for="file in msg.attachments"
              :key="file.file_name"
              class="file-attachment"
            >
              <div
                v-if="file.file_type === 'image'"
                class="image-preview-wrapper relative"
              >
                <img
                  :src="file.file_url"
                  alt="Image Attachment"
                  class="image-preview"
                />
                <div class="absolute inset-0 z-10 cursor-pointer">
                  <UICPictureModal
                    :image="file.file_url"
                    class="full-size-trigger"
                  />
                </div>
              </div>

              <UICAudioPlayer
                v-else-if="
                  file.mime_type &&
                  (file.mime_type.startsWith('audio/') ||
                    file.mime_type.includes('webm'))
                "
                :src="file.file_url"
                :is-me="msg.user?.id === authStore.user.id"
              />

              <div v-else class="generic-file-wrapper">
                <div class="file-icon">
                  <UIcon
                    :name="getFileIcon(file)"
                    class="size-8"
                    :class="getFileIconColor(file)"
                  />
                </div>
                <div class="file-details">
                  <span class="file-name">{{ file.original_name }}</span>
                  <span class="file-size"
                    >{{ (file.file_size / 1024).toFixed(1) }} KB</span
                  >
                </div>
                <div class="download-action">
                  <a
                    v-if="file.localUrl"
                    :href="file.localUrl"
                    target="_blank"
                    class="action-button"
                  >
                    <UIcon name="i-heroicons-document-text" class="size-6" />
                  </a>
                  <button
                    v-else-if="file.isDownloading"
                    @click="cancelDownload(file)"
                    class="action-button justify-center items-center progress-button"
                  >
                    <svg
                      class="progress-circle"
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                    >
                      <circle class="bg" cx="16" cy="16" r="14"></circle>
                      <circle
                        class="progress"
                        cx="16"
                        cy="16"
                        r="14"
                        :style="{
                          strokeDashoffset: `calc(88 - (88 * ${file.progress}) / 100)`,
                        }"
                      ></circle>
                    </svg>
                    <UIcon
                      name="i-heroicons-x-mark-20-solid"
                      class="cancel-icon"
                    />
                  </button>
                  <button
                    v-else
                    @click="handleFileDownload(file)"
                    class="action-button"
                  >
                    <UIcon
                      name="i-heroicons-arrow-down-tray-20-solid"
                      class="size-6"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p v-if="msg.message" class="text">{{ msg.message }}</p>

          <span class="time">{{
            new Date(msg.created_at).toLocaleString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input flex-col gap-3" v-if="chatStore.selectedRoom != 0">
      <div
        :class="`flex lg:me-auto items-start justify-start`"
      >
        <UFileUpload
          v-model="fileModel"
          multiple
          :ui="{
            wrapper: 'flex-row items-center border-0 py-[6px] px-[10px]',
            base: 'p-0 w-6! border-0 bg-red-500 hidden',
            avatar: 'bg-transparent scale-[1.3] text-black! file',
            label: 'm-0',
            root: `flex-row-reverse max-w-[100svw] px-5`,
            fileName: 'block',
            file: 'w-fit gap-1 py-[2px] px-[3px] rounded-full shrink-0',
            fileSize: 'hidden',
            files:
              'flex flex-row items-start flex-nowrap overflow-x-auto max-w-full lg:flex-wrap lg:overflow-x-visible',
          }"
          icon="solar:link-bold"
          variant="button"
          :disabled="fileModel.length === 4"
          position="outside"
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          class="me-auto"
          layout="list"
        />
      </div>
      <div class="flex w-full gap-3">
        <div class="w-full relative">
          <input
            v-model="messageInput"
            @keyup.enter="handleSendMessage"
            placeholder="پیام خود را بنویسید..."
            :disabled="!currentRoomId || sendStatus.loading"
            class="w-full"
          />

          <UModal
            :ui="{ body: 'p-0!', content: 'max-w-[400px]' }"
            v-model:open="isOpenVoiceModal"
          >
            <template #body>
              <UICVoiceRecorder @send-recording="handleSendVoiceMessage" />
            </template>
          </UModal>

          <UIcon
            name="lineicons:microphone-1"
            @click="isOpenVoiceModal = true"
            class="size-6! absolute left-3 bottom-0 -translate-y-[40%] cursor-pointer"
          />

          <UFileUpload
            v-model="fileModel"
            label=""
            multiple
            :ui="{
              wrapper: 'flex-row items-center border-0 py-[6px] px-[10px]',
              base: 'p-0 w-6! border-0 bg-transparent',
              avatar: 'bg-transparent scale-[1.3] text-black! file',
              label: 'm-0',
              root: 'flex-row-reverse absolute top-1/2 -translate-y-[50%] left-11 items-center',
              fileName: 'hidden',
              file: 'hidden',
              fileSize: 'hidden',
              files: 'hidden',
            }"
            icon="solar:link-bold"
            variant="area"
            :disabled="fileModel.length === 4"
            position="outside"
            layout="list"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
        </div>
        <button
          class="shrink-0 w-[44px] flex justify-center items-center"
          @click="handleSendMessage"
          :disabled="
            !currentRoomId ||
            sendStatus.loading ||
            (!messageInput.trim() && fileModel.length === 0)
          "
        >
          <UIcon name="tabler:send-2" class="size-6! rotate-180" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
// import { useAuthStore } from '~/stores/auth';
// import { useChatStore } from '~/stores/chat';
import UICAudioPlayer from "./UIC/AudioPlayer.vue";

const props = defineProps(["roomID"]);
const authStore = useAuthStore();
const chatStore = useChatStore();
const roomId = ref(chatStore.selectedRoom);
const fileModel = ref([]);
const isOpenVoiceModal = ref(false);

const userId = ref(authStore.user?.id);
const currentRoomId = ref(null);
const messages = ref([]);
const messageInput = ref("");
const messagesContainer = ref(null);
const lastPage = ref(0);
const sendStatus = ref({ loading: false });
const loadingOld = ref(false);
const currentPage = ref(1);
const scrollTimeout = ref(null);

// تابع کمکی برای اسکرول به پایین
const scrollToBottom = () => {
  nextTick(() => {
    const container = messagesContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

watch(
  () => chatStore.selectedRoom,
  async (newVal) => {
    roomId.value = newVal;
    await handleJoinRoom();
     nextTick(() => {
      // چندبار پشت سر هم اسکرول کن تا مطمئن بشی بعد از لود عکس‌ها هم میره پایین
      let tries = 5;
      function tryScroll() {
        scrollToBottom();
        if (tries-- > 0) requestAnimationFrame(tryScroll);
      }
      tryScroll();
    });  // <-- اسکرول کردن بعد از تغییر روم

    // افزودن مجدد listener برای اسکرول و بارگذاری پیام‌های قدیمی‌تر
    nextTick(() => {
      const el = messagesContainer.value;
      if (!el) return;
      const onScroll = () => {
        if (scrollTimeout.value) {
          clearTimeout(scrollTimeout.value);
        }
        scrollTimeout.value = setTimeout(() => {
          // Only fetch if user is very close to the top (within 100px)
          if (el.scrollTop <= 100) {
            loadOlderMessages();
          }
        }, 200);
      };
      el.removeEventListener("scroll", onScroll);
      el.addEventListener("scroll", onScroll);
    });
  }
);

// ... سایر کدهای script setup

// آرایه‌ای از رنگ‌ها برای پس‌زمینه آواتارها
const avatarColors = [
  "bg-red-500",
  "bg-[#1e3a5f]",
  "bg-green-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
];

/**
 * بر اساس آیدی کاربر، یک رنگ ثابت از آرایه بالا برمی‌گرداند
 * @param {number} userId - آیدی کاربر
 * @returns {string} کلاس رنگ Tailwind CSS
 */
const getUserAvatarColor = (userId) => {
  if (!userId) return "bg-gray-500"; // رنگ پیش‌فرض
  const index = userId % avatarColors.length;
  return avatarColors[index];
};

/**
 * حروف اول نام و نام خانوادگی کاربر را برمی‌گرداند
 * @param {object} user - آبجکت کاربر
 * @returns {string} دو حرف اول نام و نام خانوادگی
 */
const getUserInitials = (user) => {
  if (!user) return "";
  const firstNameInitial = user.name ? user.name.charAt(0) : "";
  const familyNameInitial = user.family ? user.family.charAt(0) : "";
  return `${firstNameInitial}${familyNameInitial}`.toUpperCase();
};

// ... بقیه کدهای script setup

const handleJoinRoom = async () => {
  if (!window.Echo) return;
  cleanupEchoListeners();
  currentRoomId.value = Number(roomId.value);
  
  // Reset pagination when joining a new room
  currentPage.value = 1;
  lastPage.value = 0;
  loadingOld.value = false;
  
  try {
    if (roomId.value !== 0) {
      await usePost({
        url: `chat/rooms/${currentRoomId.value}/join`,
        includeAuthHeader: true,
      });
      const { data: messagesData } = await useGet({
        url: `chat/rooms/${currentRoomId.value}/messages`,
        includeAuthHeader: true,
      });
      lastPage.value = messagesData.data.data.pagination.last_page;

      // تغییر اصلی: به‌روزرسانی یکجای پیام‌ها
      if (messagesData.data.data.messages) {
        const initialMessages = messagesData.data.data.messages
          .reverse()
          .map((m) => ({
            ...m,
            mine: m.user?.id === userId.value,
            attachments: (m.attachments || []).map((file) => ({
              ...file,
              isDownloading: false,
              progress: 0,
              localUrl: null,
              abortController: null,
            })),
          }));
        messages.value = initialMessages;
      } else {
        messages.value = [];
      }

      setupEchoListeners();
    }
  } catch (error) {
    console.error("Join room error:", error);
  }
};

const setupEchoListeners = () => {
  if (!window.Echo || !currentRoomId.value) return;
  const channelName = `chat.room.${currentRoomId.value}`;
  if (window.Echo.connector.channels[channelName])
    window.Echo.leave(channelName);

  window.Echo.private(channelName).listen(".chat.message", (data) => {
    if (data && data.message) {
      appendMessage(data.message, data.message.user?.id === userId.value);
    }
  });
};

const handleSendMessage = async () => {
  const message = messageInput.value.trim();
  if (!message && fileModel.value.length === 0) return;

  sendStatus.value = { loading: true };
  try {
    const formData = new FormData();
    if (message) formData.append("message", message);

    if (fileModel.value.length > 0) {
      fileModel.value.forEach((file) => {
        formData.append("files[]", file);
      });
    }

    const res = await usePost({
      url: `chat/rooms/${currentRoomId.value}/messages`,
      body: formData,
      includeAuthHeader: true,
    });

    if (res) {
      messageInput.value = "";
      fileModel.value = [];
    } else {
      throw new Error("Send failed");
    }
  } catch (error) {
    console.error("Send message error:", error);
  } finally {
    sendStatus.value = { loading: false };
  }
};

const handleSendVoiceMessage = async (voiceFile) => {
  if (!voiceFile) return;

  isOpenVoiceModal.value = false;
  sendStatus.value = { loading: true };
  try {
    const formData = new FormData();
    formData.append("files[]", voiceFile);

    const res = await usePost({
      url: `chat/rooms/${currentRoomId.value}/messages`,
      body: formData,
      includeAuthHeader: true,
    });

    if (!res) {
      throw new Error("Voice message send failed");
    }
  } catch (error) {
    console.error("Send voice message error:", error);
  } finally {
    sendStatus.value = { loading: false };
  }
};

const appendMessage = (msgData, mine = false) => {
  const attachments = (msgData.attachments || []).map((file) => ({
    ...file,
    isDownloading: false,
    progress: 0,
    localUrl: null,
    abortController: null,
  }));

  messages.value.push({ ...msgData, attachments, mine });

  // فقط برای پیام جدید از ایونت سرور اسکرول کن
  if (mine || msgData.user?.id !== userId.value) {
    scrollToBottom();
  }
};


const loadOlderMessages = async () => {
  // Check if already loading or reached the last page
  if (loadingOld.value) return;
  
  // Check if we're already on or past the last page
  if (lastPage.value && currentPage.value >= lastPage.value) {
    return;
  }
  
  loadingOld.value = true;
  try {
    currentPage.value++;
    const { data: messagesData } = await useGet({
      url: `chat/rooms/${currentRoomId.value}/messages?page=${currentPage.value}`,
      includeAuthHeader: true,
    });
    
    // Update lastPage from response
    lastPage.value = messagesData.data.data.pagination.last_page;
    
    // Check again after getting the page info
    if (currentPage.value > lastPage.value) {
      loadingOld.value = false;
      return;
    }
    
    const el = messagesContainer.value;
    if (!el) return;
    const oldScrollTop = el.scrollTop,
      oldScrollHeight = el.scrollHeight;

    const prepend = messagesData.data.data.messages.reverse().map((m) => ({
      ...m,
      mine: m.user?.id === userId.value,
      attachments: (m.attachments || []).map((file) => ({
        ...file,
        isDownloading: false,
        progress: 0,
        localUrl: null,
        abortController: null,
      })),
    }));

    messages.value.unshift(...prepend);
    nextTick(() => {
      el.scrollTop = oldScrollTop + (el.scrollHeight - oldScrollHeight);
    });
  } catch (e) {
    console.error("Load older error:", e);
  } finally {
    loadingOld.value = false;
  }
};

const handleFileDownload = async (file) => {
  if (file.isDownloading) return;
  file.isDownloading = true;
  file.progress = 0;
  file.abortController = new AbortController();
  try {
    const response = await fetch(file.file_url, {
      signal: file.abortController.signal,
    });
    if (!response.ok) throw new Error("Network error");
    const totalSize = Number(response.headers.get("content-length"));
    const reader = response.body.getReader();
    let receivedLength = 0,
      chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;
      if (totalSize)
        file.progress = Math.round((receivedLength / totalSize) * 100);
    }
    
    // --- شروع تغییرات ---

    // 1. یک Blob از تکه‌های داده بسازید
    const blob = new Blob(chunks);
    // 2. یک URL موقت برای این Blob ایجاد کنید
    const url = URL.createObjectURL(blob);
    // 3. یک تگ <a> موقت در حافظه ایجاد کنید
    const a = document.createElement('a');
    // 4. آدرس Blob را به عنوان href تنظیم کنید
    a.href = url;
    // 5. نام فایل اصلی را به ویژگی download بدهید (این بخش کلیدی است)
    a.download = file.original_name || 'download'; // یک نام پیش‌فرض در صورت نبودن نام اصلی
    // 6. تگ را به بدنه صفحه اضافه کنید (برای سازگاری با برخی مرورگرها)
    document.body.appendChild(a);
    // 7. به صورت برنامه‌نویسی روی آن کلیک کنید تا دانلود شروع شود
    a.click();
    // 8. تگ موقت را از صفحه حذف کنید
    document.body.removeChild(a);
    // 9. URL ساخته شده را از حافظه پاک کنید تا از نشت حافظه (memory leak) جلوگیری شود
    URL.revokeObjectURL(url);

    // دیگر نیازی به ذخیره localUrl در state نیست
    // file.localUrl = ... // این خط را حذف یا کامنت کنید

    // --- پایان تغییرات ---

  } catch (error) {
    if (error.name !== "AbortError") console.error("Download error:", error);
  } finally {
    file.isDownloading = false;
    // چون دیگر localUrl نداریم، progress را ریست می‌کنیم تا دکمه دانلود دوباره نمایش داده شود
    file.progress = 0;
  }
};
const cancelDownload = (file) => {
  if (file.abortController) file.abortController.abort();
};

const getFileIcon = (file) => {
  const mime = file.mime_type || "";
  const name = file.original_name || "";
  if (mime.includes("pdf")) return "i-heroicons-document-text";
  if (mime.includes("word") || mime.includes("document"))
    return "i-heroicons-document";
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("archive"))
    return "i-heroicons-archive-box";
  if (mime.includes("plain") || name.endsWith(".txt"))
    return "i-heroicons-clipboard-document";
  return file.localUrl
    ? "i-heroicons-document-check"
    : "i-heroicons-document-arrow-down";
};

const getFileIconColor = (file) => {
  const mime = file.mime_type || "";
  if (file.localUrl) return "text-green-500";
  if (mime.includes("pdf")) return "text-red-500";
  if (mime.includes("word") || mime.includes("document"))
    return "text-[#1e3a5f]";
  if (mime.includes("zip") || mime.includes("rar") || mime.includes("archive"))
    return "text-yellow-600";
  return "text-gray-500";
};

const cleanupEchoListeners = () => {
  if (!window.Echo) return;
  Object.keys(window.Echo.connector.channels).forEach((channel) =>
    window.Echo.leave(channel)
  );
};

onMounted(async () => {
  await nextTick(async () => {
    const authToken = useCookie("jwtToken").value;
    if (window.initEcho) {
      await window.initEcho(authToken);
      await handleJoinRoom();
      scrollToBottom(); // <-- اسکرول کردن بعد از mount شدن کامپوننت
    }
  });

  await nextTick(() => {
      // چندبار پشت سر هم اسکرول کن تا مطمئن بشی بعد از لود عکس‌ها هم میره پایین
      let tries = 5;
      function tryScroll() {
        scrollToBottom();
        if (tries-- > 0) requestAnimationFrame(tryScroll);
      }
      tryScroll();
    });

  await nextTick(() => {
      const el = messagesContainer.value;
      if (!el) return;
      const onScroll = () => {
        if (scrollTimeout.value) {
          clearTimeout(scrollTimeout.value);
        }
        scrollTimeout.value = setTimeout(() => {
          // Only fetch if user is very close to the top (within 100px)
          if (el.scrollTop <= 100) {
            loadOlderMessages();
          }
        }, 200);
      };
      el.removeEventListener("scroll", onScroll);
      el.addEventListener("scroll", onScroll);
    });
});

onUnmounted(() => {
  cleanupEchoListeners();
  chatStore.chatRooms = []
});
</script>

<style scoped>
@reference 'tailwindcss';

.chat-wrapper {
  background-image: url(/images/new2.png);
  @apply h-[calc(100svh-64px)] lg:h-[calc(100svh-80px)] bg-size-[80%] lg:bg-size-[35%];
  display: flex;
  border-radius: 8px;
  flex-direction: column;
  background-repeat: repeat;
}
.messages-container {
  flex: 1;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chat-bubble {
  display: flex;
  align-items: flex-end;
  max-width: 80%;
  lg: max-w-screen-sm;
  flex-direction: row-reverse;
}
.chat-bubble.me {
  align-self: flex-start;
}
.chat-bubble.other {
  align-self: flex-end;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 8px;
  flex-shrink: 0;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.bubble-content {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.chat-bubble.me .bubble-content {
  @apply bg-[#1e3a5f];
  color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-bubble.other .bubble-content {
  background: #fff;
  color: #111827;
  border-bottom-left-radius: 4px;
}
.text {
  font-size: 14px;
  margin: 0;
  word-wrap: break-word; /* مرورگرهای قدیمی‌تر */
  overflow-wrap: break-word; /* استاندارد جدید */
  word-break: break-word;
}
.time {
  display: block;
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}
.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
}
.chat-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  outline: none;
  font-size: 14px;
  padding-left: 65px;
}
.chat-input input:focus {
  border-color: #2b7fff;
}
.chat-input button {
  background: #2b7fff;
  border: none;
  color: white;
  border-radius: 50%;
  margin-left: 8px;
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-input button:hover:enabled {
  background: #4f46e5;
}
.chat-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.attachments-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 5px;
}
.image-preview-wrapper {
  display: block;
  max-width: 250px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.image-preview {
  width: 100%;
  height: auto;
  display: block;
}
.generic-file-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #f3f4f6;
  padding: 10px;
  border-radius: 12px;
  max-width: 280px;
}
.chat-bubble.me .generic-file-wrapper {
  background-color: rgba(255, 255, 255, 0.2);
}
.file-details {
  flex-grow: 1;
  overflow: hidden;
}
.file-name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chat-bubble.me .file-name {
  color: #fff;
}
.chat-bubble.other .file-name {
  color: #111827;
}
.file-size {
  display: block;
  font-size: 11px;
  opacity: 0.8;
}
.download-action {
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
  padding: 0;
}
.action-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.chat-bubble.me .action-button {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.chat-bubble.me .action-button:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
.chat-bubble.other .action-button {
  color: #374151;
}
.progress-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
}
.progress-circle .bg {
  fill: none;
  stroke: rgba(0, 0, 0, 0.1);
  stroke-width: 2.5;
}
.chat-bubble.me .progress-circle .bg {
  stroke: rgba(255, 255, 255, 0.2);
}
.progress-circle .progress {
  fill: none;
  stroke: #2b7fff;
  stroke-width: 2.5;
  stroke-dasharray: 88;
  transition: stroke-dashoffset 0.2s;
}
.chat-bubble.me .progress-circle .progress {
  stroke: #fff;
}
.cancel-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  pointer-events: none;
}
.attachments-wrapper + .text {
  margin-top: 8px;
}
</style>

<style>
/* Global style if needed */
.file .iconify {
  color: black !important;
}
.full-size-trigger {
  width: 100%;
  height: 100%;
  align-items: baseline;
}
.full-size-trigger :deep(button) {
  width: 100%;
  height: 100%;
  background: transparent !important;
  color: transparent !important;
  padding: 0;
  border: none;
}
</style>