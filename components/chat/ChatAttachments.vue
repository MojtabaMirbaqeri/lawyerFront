<template>
  <div class="voice-recorder">
    <div class="header">
      <span class="title">{{ isRecording ? 'در حال ضبط' : 'آماده ضبط' }}</span>
    </div>

    <div class="recorder-display">
      <canvas ref="canvasRef" class="visualizer" width="300" height="100"></canvas>
      <div v-if="isRecording" class="timer">
        <span class="blinking-dot"></span>
        {{ formattedTime }}
      </div>
    </div>

    <div class="controls-wrapper">
      <button class="btn-icon" @click="resetRecording" :disabled="isRecording">
        <UIcon name="system-uicons:reset" class="size-6!"/>
      </button>

      <button v-if="!isRecording" class="btn-main start" @click="startRecording">
         <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </button>
      <button v-else class="btn-main stop" @click="stopRecording">
        <div class="stop-icon"></div>
      </button>

      <button class="btn-icon" disabled style="opacity: 0; cursor: default;"></button>
    </div>

    <div v-if="audioUrl && !isRecording" class="preview">
      <audio :src="audioUrl" controls></audio>
      <button class="btn-icon send" @click="handleSend" title="ارسال ویس">
        <UIcon name="tabler:send-2" class="size-6! rotate-180" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";

const emit = defineEmits(['send-recording']);

const isRecording = ref(false);
const audioUrl = ref(null);
const recordingTime = ref(0);
const canvasRef = ref(null);
const recordedFile = ref(null);

let mediaRecorder, audioChunks = [], timerInterval, audioStream, audioContext, analyserNode, animationFrameId;

const formattedTime = computed(() => {
  const minutes = Math.floor(recordingTime.value / 60);
  const seconds = recordingTime.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const startRecording = async () => {
  resetRecording();
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setupMediaRecorder(audioStream);
    setupVisualizer(audioStream);
    mediaRecorder.start();
    startTimer();
    visualize();
    isRecording.value = true;
  } catch (err) {
    alert("امکان دسترسی به میکروفون وجود ندارد.");
  }
};

const stopRecording = () => {
  if (mediaRecorder?.state === "recording") {
    mediaRecorder.stop();
    stopTimer();
    isRecording.value = false;
  }
};

const handleSend = () => {
  if (recordedFile.value) {
    emit('send-recording', recordedFile.value);
    resetRecording();
  }
};

const resetRecording = () => {
  if (isRecording.value) stopRecording();
  stopVisualizer();
  audioUrl.value = null;
  recordedFile.value = null;
  audioChunks = [];
  recordingTime.value = 0;
  if (canvasRef.value) {
    canvasRef.value.getContext("2d").clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
};

const setupMediaRecorder = (stream) => {
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  audioChunks = [];
  mediaRecorder.ondataavailable = e => e.data.size > 0 && audioChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    audioUrl.value = URL.createObjectURL(blob);
    recordedFile.value = new File([blob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
    audioStream.getTracks().forEach(track => track.stop());
  };
};

const startTimer = () => timerInterval = setInterval(() => recordingTime.value++, 1000);
const stopTimer = () => clearInterval(timerInterval);

const setupVisualizer = (stream) => {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioContext.createAnalyser();
  audioContext.createMediaStreamSource(stream).connect(analyserNode);
  analyserNode.fftSize = 256;
};

const visualize = () => {
  const canvas = canvasRef.value, canvasCtx = canvas.getContext("2d");
  const bufferLength = analyserNode.frequencyBinCount, dataArray = new Uint8Array(bufferLength);
  const draw = () => {
    animationFrameId = requestAnimationFrame(draw);
    analyserNode.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 1.2;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2.8;
      canvasCtx.fillStyle = '#111';
      canvasCtx.fillRect(x, (canvas.height / 2) - (barHeight / 2), barWidth, barHeight);
      x += barWidth + 2;
    }
  };
  draw();
};

const stopVisualizer = () => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (audioContext?.state !== "closed") audioContext.close();
};

onUnmounted(() => {
  stopVisualizer();
  stopTimer();
});
</script>

<style scoped>
.voice-recorder { display: flex; flex-direction: column; align-items: center; background-color: #ffffff; padding: 1.5rem; width: 100%; border-bottom: 1px solid #f0f0f0; box-sizing: border-box; }
.header { width: 100%; text-align: center; padding-bottom: 1rem; }
.title { font-size: 1.2rem; font-weight: 600; color: #333; }
.recorder-display { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 150px; }
.visualizer { width: 100%; height: 100px; }
.timer { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; color: #555; margin-top: 1rem; font-family: monospace; }
.blinking-dot { width: 10px; height: 10px; background-color: #ff4d4d; border-radius: 50%; animation: blink 1.2s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.controls-wrapper { display: flex; justify-content: space-around; align-items: center; width: 100%; margin-top: 1.5rem; }
button { border: none; cursor: pointer; background: none; display: flex; justify-content: center; align-items: center; transition: all 0.2s ease; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-main { width: 70px; height: 70px; border-radius: 50%; background-color: #ff4d4d; border: 4px solid #f0f0f0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); color: white; }
.btn-main:hover { transform: scale(1.05); }
.btn-main .stop-icon { width: 24px; height: 24px; background-color: white; border-radius: 4px; }
.btn-main.start { background-color: white; border: 4px solid #f0f0f0; color: #2B7FFF; }
.btn-icon { width: 44px; height: 44px; border-radius: 50%; color: #555; }
.btn-icon:not(:disabled):hover { background-color: #f5f5f5; }
.preview { width: 100%; margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; background: #f8f9fa; padding: 8px; border-radius: 999px; }
.preview audio { width: 100%; }
.btn-icon.send { background-color: #2B7FFF; color: white; flex-shrink: 0; }
.btn-icon.send:hover { background-color: #1f5fd1; }
</style>