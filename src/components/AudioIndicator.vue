<template>
  <div class="audio-indicator">
    <div class="pulse-dots">
      <span v-for="n in 3" :key="n" class="dot" :style="`animation-delay: ${(n-1)*-0.16}s`"></span>
    </div>
    <span class="audio-text">Audio activo</span>
  </div>
</template>

<script setup>

</script>

<style scoped>
.audio-indicator {
  position: absolute;
  top: 10px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.pulse-dots {
  display: flex;
  gap: 3px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite both;
}

.audio-text {
  font-weight: 500;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>