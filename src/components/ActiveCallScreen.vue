<template>
  <div class="active-call-screen">
    <div class="call-background"></div>
    
    <div class="call-content">
      <!-- Información de la llamada -->
      <div class="call-header text-center">
        <q-avatar size="70px" class="avatar-shadow q-mb-md">
          <img src="https://img.freepik.com/vector-premium/avatar-perfil-persona-soporte-negocio-masculino-vector-icono-servicio-al-cliente-auriculares-computadora-portatil_435942-983.jpg" alt="Aerolínea" />
        </q-avatar>

        <div class="text-h4 text-weight-bold text-white q-mb-xs">Aero Gil</div>
        <div class="text-h6 text-grey-3 q-mb-sm">Llamada en curso</div>
        <div class="text-h3 text-weight-bold text-white q-mb-lg">{{ tiempoFormateado }}</div>
      </div>

      <!-- Controles principales -->
      <div class="controls-container">
        <div class="control-row">
          <ControlButton 
            :active="isMuted"
            icon="mic"
            active-icon="mic_off"
            label="Silenciar"
            :color="isMuted ? 'red' : 'white'"
            @click="$emit('toggle-mute')"
          />
          
          <ControlButton 
            icon="dialpad"
            label="Teclado"
          />
          
          <ControlButton 
            icon="volume_up"
            label="Altavoz"
          />
        </div>

        <div class="control-row">
          <ControlButton 
            icon="add"
            label="Añadir"
            color="green"
          />
          
          <ControlButton 
            icon="person"
            label="Contactos"
            color="orange"
          />
          
          <ControlButton 
            icon="videocam"
            label="Video"
            color="purple"
          />
        </div>
      </div>

      <!-- Botón finalizar -->
      <div class="end-call-section">
        <q-btn
          round
          size="xl"
          color="red"
          icon="call_end"
          class="end-call-btn"
          @click="$emit('end-call')"
        />
        <div class="end-call-label text-white">Finalizar</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ControlButton from './ControlButton.vue'

const props = defineProps({
  phoneNumber: { type: String, default: '' },
  isMuted: { type: Boolean, default: false },
  callDuration: { type: Number, default: 0 }
})

defineEmits(['toggle-mute', 'end-call'])

const tiempoFormateado = computed(() => {
  const minutos = Math.floor(props.callDuration / 60)
  const segundos = props.callDuration % 60
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
})
</script>

<style lang="scss" scoped>
.active-call-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.call-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 15px 25px;
  justify-content: space-between;
}

.call-header {
  text-align: center;
  flex-shrink: 0;
  margin-top: 5px;
  width: 100%;
}

.avatar-shadow {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  animation: avatarPulse 3s ease-in-out infinite;
}

.controls-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 10px 0;
  flex-shrink: 0;
}

.control-row {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.end-call-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
  padding: 8px 0 3px;
}

.end-call-btn {
  box-shadow: 0 6px 24px rgba(244, 67, 54, 0.6);
  border: 3px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  width: 65px !important;
  height: 65px !important;
  margin-bottom: 6px;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(244, 67, 54, 0.8);
  }
}

.end-call-label {
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.text-white {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes avatarPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>