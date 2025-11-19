<template>
  <div class="app-wrapper">
    <div class="phone-container">
      <q-layout view="hHh lpR fFf" class="phone-layout">
        <div class="iphone-notch"></div>

        <q-page-container>
          <q-page class="phone-page bg-light">
            <AudioIndicator v-if="llamadaActiva" />

            <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
              <component 
                :is="currentScreen" 
                v-bind="screenProps"
                @toggle-mute="alternarSilenciado"
                @end-call="manejarLlamada"
                @start-call="manejarLlamada"
                @digit-pressed="agregarDigito"
                @backspace="eliminarDigito"
                @clear="limpiarNumero"
              />
            </transition>
          </q-page>
        </q-page-container>

        <div class="iphone-home-indicator"></div>
      </q-layout>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import DialPad from './components/DialPad.vue'
import ActiveCallScreen from './components/ActiveCallScreen.vue'
import AudioIndicator from './components/AudioIndicator.vue'
import { CallSimulator } from './utils/callSimulator.js'

// Estados
const llamadaActiva = ref(false)
const numeroTelefono = ref('8001234567')
const microfonoSilenciado = ref(false)
const duracionLlamada = ref(0)

// Computados
const currentScreen = computed(() => llamadaActiva.value ? ActiveCallScreen : DialPad)
const screenProps = computed(() => llamadaActiva.value ? {
  phoneNumber: numeroTelefono.value,
  isMuted: microfonoSilenciado.value,
  callDuration: duracionLlamada.value
} : { phoneNumber: numeroTelefono.value })

// Simulador
const simuladorLlamada = ref(null)
let temporizadorDuracion = null

// Métodos
const agregarDigito = (digito) => {
  if (numeroTelefono.value.length < 20) numeroTelefono.value += digito
}

const eliminarDigito = () => {
  numeroTelefono.value = numeroTelefono.value.slice(0, -1)
}

const limpiarNumero = () => {
  numeroTelefono.value = ''
}

const manejarLlamada = () => {
  if (!llamadaActiva.value && !numeroTelefono.value) return
  llamadaActiva.value ? finalizarLlamada() : iniciarLlamada()
}

const iniciarLlamada = () => {
  llamadaActiva.value = true
  microfonoSilenciado.value = false
  duracionLlamada.value = 0

  temporizadorDuracion = setInterval(() => duracionLlamada.value++, 1000)
  simuladorLlamada.value?.startCallSimulation()
}

const finalizarLlamada = () => {
  llamadaActiva.value = false
  microfonoSilenciado.value = false
  
  clearInterval(temporizadorDuracion)
  temporizadorDuracion = null
  simuladorLlamada.value?.stopAll()
  
  numeroTelefono.value = '8001234567'
}

const alternarSilenciado = () => {
  microfonoSilenciado.value = !microfonoSilenciado.value
}

// Lifecycle
onMounted(() => {
  simuladorLlamada.value = new CallSimulator()
})

onUnmounted(() => {
  clearInterval(temporizadorDuracion)
  simuladorLlamada.value?.stopAll()
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

.phone-layout, .bg-light {
  background: #f5f5f7;
}

.phone-page {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  padding: 0 !important;
}
</style>