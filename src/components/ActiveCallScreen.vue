<template>
  <div class="active-call-screen">
    <div class="call-background"></div>
    
    <div class="call-content">
      
      <!-- Información de la llamada -->
      <div class="call-header text-center">
        <q-avatar size="70px" class="avatar-shadow q-mb-md">
          <img src="https://img.freepik.com/vector-premium/avatar-perfil-persona-soporte-negocio-masculino-vector-icono-servicio-al-cliente-auriculares-computadora-portatil_435942-983.jpg" alt="Aerolínea" />
        </q-avatar>

        <div class="text-h4 text-weight-bold text-white q-mb-xs">{{ displayName }}</div>
        <div class="text-h6 text-grey-3 q-mb-sm">Llamada en curso</div>
        <div class="text-h3 text-weight-bold text-white q-mb-lg">00:00</div>
      </div>

      <!-- Controles principales -->
      <div class="controls-container">
        
        <!-- Fila 1 -->
        <div class="control-row">
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              :color="isMuted ? 'red' : 'white'" 
              :text-color="isMuted ? 'white' : 'grey-9'"
              :icon="isMuted ? 'mic_off' : 'mic'" 
              class="control-btn"
              @click="$emit('mute-toggle')"
            />
            <div class="control-label">{{ isMuted ? 'Activado' : 'Silenciar' }}</div>
          </div>
          
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              color="white" 
              text-color="grey-9"
              icon="dialpad" 
              class="control-btn"
              @click="$emit('keypad-toggle')"
            />
            <div class="control-label">Teclado</div>
          </div>
          
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              color="white" 
              text-color="grey-9"
              icon="volume_up" 
              class="control-btn"
              @click="$emit('audio-toggle')"
            />
            <div class="control-label">Altavoz</div>
          </div>
        </div>

        <!-- Fila 2 -->
        <div class="control-row">
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              color="green" 
              icon="add" 
              class="control-btn"
              @click="$emit('add-call')"
            />
            <div class="control-label">Añadir</div>
          </div>
          
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              color="orange" 
              icon="person" 
              class="control-btn"
              @click="$emit('contacts')"
            />
            <div class="control-label">Contactos</div>
          </div>
          
          <div class="column items-center control-item">
            <q-btn 
              round 
              size="lg" 
              color="purple" 
              icon="videocam" 
              class="control-btn"
              @click="$emit('facetime')"
            />
            <div class="control-label">Video</div>
          </div>
        </div>

      </div>

      <!-- Botón para finalizar llamada -->
      <div class="end-call-section">
        <q-btn
          round
          size="xl"
          color="red"
          icon="call_end"
          class="end-call-btn"
          @click="endCall"
        />
        <div class="end-call-label text-white">Finalizar</div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  phoneNumber: {
    type: String,
    default: ''
  },
  isMuted: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'mute-toggle',
  'keypad-toggle', 
  'audio-toggle',
  'add-call',
  'facetime',
  'contacts',
  'end-call'
])

const displayName = computed(() => {
  const names = {
    '8001234567': 'AeroSim Airlines',
    '1': 'Reservaciones',
    '2': 'Cancelaciones', 
    '3': 'Reclamaciones',
    '0': 'Operador'
  }
  return names[props.phoneNumber] || props.phoneNumber || 'AeroSim Airlines'
})

const endCall = () => {
  emit('end-call')
}
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
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.call-background {
  position: absolute;
  top: -15px;
  left: -15px;
  right: -15px;
  bottom: -15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

.call-content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 15px 25px 15px;
  height: 100%;
  min-height: 0;
  justify-content: space-between;
  margin: 0;
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
  width: 70px;
  height: 70px;
}

@keyframes avatarPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.control-btn {
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
  width: 45px;
  height: 45px;
  
  &:hover {
    transform: scale(1.1);
  }
}

.control-label {
  color: white;
  font-weight: 500;
  margin-top: 4px;
  font-size: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.end-call-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
  padding: 8px 0 3px 0;
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
  
  :deep(.q-icon) {
    font-size: 26px;
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

.text-h4 {
  font-size: 1.1rem;
  line-height: 1.2;
}

.text-h3 {
  font-size: 1.3rem;
}

.text-h6 {
  font-size: 0.75rem;
  opacity: 0.9;
}
</style>