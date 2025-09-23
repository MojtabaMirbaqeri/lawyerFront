<template>
  <div class="audio-player" :class="{ 'player-me': isMe }">
    <button @click="togglePlayPause" class="play-pause-btn">
      <UIcon v-if="!isPlaying" name="i-heroicons-play-solid" class="size-5" />
      <UIcon v-else name="i-heroicons-pause-solid" class="size-5" />
    </button>

    <div class="progress-wrapper" ref="progressWrapperRef" @click="seek">
      <canvas ref="waveformCanvasRef" class="waveform-canvas"></canvas>
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="time-display">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </div>

    <audio
      ref="audioRef"
      :src="src"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="onEnded"
    ></audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  isMe: { type: Boolean, default: false },
});

const audioRef = ref(null);
const waveformCanvasRef = ref(null);
const progressWrapperRef = ref(null);

const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);
const waveformBars = ref([]);

const progress = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const togglePlayPause = () => {
  if (!audioRef.value) return;
  isPlaying.value ? audioRef.value.pause() : audioRef.value.play();
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const onLoadedMetadata = () => {
  if (audioRef.value) {
    duration.value = audioRef.value.duration;
    generateWaveformData();
    drawWaveform();
  }
};

const onTimeUpdate = () => {
  if (audioRef.value) currentTime.value = audioRef.value.currentTime;
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
};

const seek = (event) => {
  if (duration.value === 0 || !progressWrapperRef.value) return;
  const rect = progressWrapperRef.value.getBoundingClientRect();
  const percentage = (event.clientX - rect.left) / rect.width;
  audioRef.value.currentTime = duration.value * percentage;
};

const generateWaveformData = () => {
  const barCount = 60;
  waveformBars.value = Array.from({ length: barCount }, () => Math.random() * 0.7 + 0.3);
};

const drawWaveform = () => {
  const canvas = waveformCanvasRef.value;
  if (!canvas || waveformBars.value.length === 0) return;
  const ctx = canvas.getContext('2d');
  
  // Set canvas physical dimensions based on display size for high-DPI screens
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;

  // Normalize coordinate system to use CSS pixels
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  const width = rect.width;
  const height = rect.height;
  ctx.clearRect(0, 0, width, height);

  const barWidth = 2;
  const gap = 2;
  const totalBarWidth = barWidth + gap;

  ctx.fillStyle = props.isMe ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';

  waveformBars.value.forEach((barHeight, i) => {
    const x = i * totalBarWidth;
    const y = height * (1 - barHeight);
    ctx.fillRect(x, y, barWidth, height * barHeight);
  });
};

onMounted(() => {
  // Wait for the DOM to be ready and then draw the initial waveform
  // This is now handled inside onLoadedMetadata to ensure data is ready
  // and canvas is mounted. The initial sizing is now in drawWaveform.
});

onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value.src = '';
  }
});
</script>

<style scoped>
.audio-player { display: flex; align-items: center; gap: 12px; background-color: #f3f4f6; padding: 8px 12px; border-radius: 9999px; width: 100%; max-width: 280px; }
.audio-player.player-me { background-color: rgba(255, 255, 255, 0.2); color: white; }
.play-pause-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background-color: #2b7fff; color: white; border: none; cursor: pointer; flex-shrink: 0; transition: background-color 0.2s; }
.play-pause-btn:hover { background-color: #1f5fd1; }
.audio-player.player-me .play-pause-btn { background-color: white; color: #2b7fff; }
.progress-wrapper { flex-grow: 1; height: 30px; position: relative; cursor: pointer; display: flex; align-items: center; }
.waveform-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.progress-bar { position: absolute; top: 0; left: 0; height: 100%; background-color: rgba(43, 127, 255, 0.4); pointer-events: none; }
.audio-player.player-me .progress-bar { background-color: rgba(255, 255, 255, 0.4); }
.time-display { font-size: 12px; font-family: monospace; white-space: nowrap; color: #555; }
.audio-player.player-me .time-display { color: rgba(255, 255, 255, 0.8); }
</style>