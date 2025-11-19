<template>
  <div class="app-wrapper">
    <div class="phone-container">
      <q-layout view="hHh lpR fFf" class="phone-layout">
        <!-- iPhone notch -->
        <div class="iphone-notch"></div>

        <q-page-container>
          <q-page class="phone-page bg-light">
            <!-- Indicador de audio -->
            <div v-if="isCalling" class="audio-indicator">
              <div class="pulse-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <span class="audio-text">Audio activo</span>
            </div>

            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              duration="300"
            >
              <!-- Solo dos pantallas: Marcado y Llamada -->
              <div v-if="!isCalling" key="dial" class="screen-container">
                <DialPad 
                  :phone-number="phoneNumber"
                  @digit-pressed="addDigit"
                  @backspace="removeDigit"
                  @start-call="handleStartCall"
                  @clear="clearPhoneNumber"
                />
              </div>

              <!-- Pantalla de llamada activa -->
              <div v-else key="active-call" class="screen-container fullscreen-call">
                <ActiveCallScreen 
                  :phone-number="phoneNumber"
                  :is-muted="isMuted"
                  @mute-toggle="toggleMute"
                  @keypad-toggle="toggleKeypad"
                  @audio-toggle="toggleAudio"
                  @add-call="addCall"
                  @facetime="startFaceTime"
                  @contacts="showContacts"
                  @end-call="handleEndCall"
                />

                <!-- Keypad overlay -->
                <DialPadOverlay 
                  v-if="showKeypadOverlay"
                  @digit-pressed="addDigitDuringCall"
                  @close="showKeypadOverlay = false"
                />
              </div>
            </transition>
          </q-page>
        </q-page-container>

        <!-- iPhone home indicator -->
        <div class="iphone-home-indicator"></div>
      </q-layout>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import DialPad from './components/DialPad.vue'
import ActiveCallScreen from './components/ActiveCallScreen.vue'
import DialPadOverlay from './components/DialPadOverlay.vue'
import { CallSimulator } from './utils/callSimulator.js'

const $q = useQuasar()

// Estados reactivos
const isCalling = ref(false)
const phoneNumber = ref('8001234567')
const isMuted = ref(false)
const showKeypadOverlay = ref(false)

// Simulador de audio
const callSimulator = ref(null)

// Métodos
const addDigit = (digit) => {
  if (phoneNumber.value.length < 20) {
    phoneNumber.value += digit
  }
}

const removeDigit = () => {
  phoneNumber.value = phoneNumber.value.slice(0, -1)
}

const clearPhoneNumber = () => {
  phoneNumber.value = ''
}

const handleStartCall = async () => {
  console.log('🟢 Iniciando llamada a:', phoneNumber.value)
  if (!phoneNumber.value) {
    $q.notify({
      type: 'warning',
      message: 'Ingresa un número de teléfono',
      position: 'top'
    })
    return
  }
  
  await startCall()
}

const startCall = async () => {
  console.log('🚀 Llamada iniciada')
  isCalling.value = true
  isMuted.value = false
  showKeypadOverlay.value = false

  // Iniciar simulación de audio
  if (callSimulator.value) {
    await callSimulator.value.startCallSimulation()
  }
}

const handleEndCall = () => {
  console.log('📞 Llamada finalizada')
  endCall()
}

const endCall = () => {
  isCalling.value = false
  isMuted.value = false
  
  // Detener audio
  if (callSimulator.value) {
    callSimulator.value.stopAll()
  }
  
  phoneNumber.value = '8001234567'
  
  $q.notify({
    type: 'info',
    message: 'Llamada finalizada',
    position: 'top',
    timeout: 1000
  })
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  // Aquí podrías agregar lógica para mute real del audio
}

const toggleKeypad = () => {
  showKeypadOverlay.value = !showKeypadOverlay.value
}

const toggleAudio = () => {
  $q.notify({
    type: 'info',
    message: 'Cambiando dispositivo de audio...',
    position: 'top',
    timeout: 1000
  })
}

const addCall = () => {
  $q.notify({
    type: 'info',
    message: 'Agregar llamada no disponible',
    position: 'top'
  })
}

const startFaceTime = () => {
  $q.notify({
    type: 'warning',
    message: 'FaceTime no disponible',
    position: 'top'
  })
}

const showContacts = () => {
  $q.notify({
    type: 'info',
    message: 'Abriendo contactos...',
    position: 'top',
    timeout: 1000
  })
}

const addDigitDuringCall = (digit) => {
  console.log('DTMF:', digit)
  // Aquí podrías agregar sonidos DTMF
}

// Lifecycle
onMounted(() => {
  // Inicializar simulador de audio
  callSimulator.value = new CallSimulator()
  
  // Esperar a que las voces estén cargadas
  setTimeout(() => {
    console.log('✅ Simulador de audio listo')
  }, 1000)
})

onUnmounted(() => {
  // Limpiar audio al desmontar
  if (callSimulator.value) {
    callSimulator.value.stopAll()
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.phone-container {
  width: 340px;
  height: 700px;
  border-radius: 40px;
  background: #000;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  border: 10px solid #000;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 25px;
    background: #000;
    border-radius: 0 0 25px 25px;
    z-index: 100;
  }
}

.iphone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 25px;
  background: #000;
  border-radius: 0 0 25px 25px;
  z-index: 50;
}

.iphone-home-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #333;
  border-radius: 2px;
  z-index: 50;
}

.phone-layout {
  width: 100%;
  height: 100%;
  background: #f5f5f7;
}

.bg-light {
  background-color: #f5f5f7 !important;
}

.phone-page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  padding: 0 !important;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.fullscreen-call {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

/* Indicador de audio */
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

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

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