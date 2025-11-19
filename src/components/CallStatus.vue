<template>
  <q-card class="call-status-card">
    <q-card-section class="bg-white">
      <div class="text-center">
        <!-- Estado visual -->
        <div class="status-badge" :class="statusClass">
          <q-icon 
            :name="statusIcon" 
            size="lg"
            class="animated-icon"
          />
        </div>

        <!-- Información principal -->
        <div class="q-mt-md">
          <div class="text-h6 text-weight-bold">
            {{ statusText }}
          </div>
          
          <div class="text-subtitle2 text-grey q-mt-sm">
            Tiempo en espera: <span class="text-bold">{{ formatTime(waitTime) }}</span>
          </div>

          <!-- Indicador de música -->
          <div v-if="musicPlaying" class="q-mt-md">
            <q-linear-progress 
              indeterminate 
              color="amber"
              class="animated-progress"
            />
            <div class="text-caption text-grey q-mt-xs">
              🎵 Reproduciendo música de espera...
            </div>
          </div>
        </div>

        <!-- Estado de la llamada -->
        <div class="status-info q-mt-lg">
          <q-chip 
            color="primary" 
            text-color="white"
            icon="phone_in_talk"
          >
            Llamada Activa
          </q-chip>
        </div>

        <!-- Botón para finalizar -->
        <div class="q-mt-lg">
          <q-btn
            unelevated
            color="negative"
            label="Finalizar Llamada"
            icon="call_end"
            size="lg"
            @click="$emit('end-call')"
            class="full-width"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'CallStatus',
  props: {
    status: {
      type: String,
      default: 'idle'
    },
    waitTime: {
      type: Number,
      default: 0
    },
    musicPlaying: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statusText() {
      const statuses = {
        'idle': 'Listo para iniciar',
        'waiting': 'En espera...',
        'on-hold': 'En pausa',
        'transferring': 'Transfiriendo...',
        'ended': 'Llamada finalizada'
      }
      return statuses[this.status] || 'Desconocido'
    },
    statusIcon() {
      const icons = {
        'idle': 'phone',
        'waiting': 'schedule',
        'on-hold': 'pause_circle',
        'transferring': 'call_split',
        'ended': 'call_end'
      }
      return icons[this.status] || 'phone'
    },
    statusClass() {
      return `status-${this.status}`
    }
  },
  methods: {
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.call-status-card {
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.status-badge {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 60px;
  
  &.status-idle {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  &.status-waiting {
    background-color: #fff3e0;
    color: #e65100;
    animation: pulse 1.5s infinite;
  }
  
  &.status-on-hold {
    background-color: #f3e5f5;
    color: #6a1b9a;
  }
  
  &.status-transferring {
    background-color: #e3f2fd;
    color: #1565c0;
    animation: spin 2s linear infinite;
  }
  
  &.status-ended {
    background-color: #ffebee;
    color: #c62828;
  }
}

.animated-icon {
  animation: float 3s ease-in-out infinite;
}

.animated-progress {
  animation: fadeInOut 2s infinite;
}

.status-info {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(230, 81, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 30px rgba(230, 81, 0, 0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
</style>