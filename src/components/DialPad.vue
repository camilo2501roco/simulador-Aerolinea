<template>
  <q-card class="dial-pad-card">
    <q-card-section>
      <!-- Display del número -->
      <div class="display-container q-mb-lg">
        <div class="display-text">
          {{ phoneNumber || 'Marcador' }}
        </div>
        <div class="text-caption text-grey q-mt-xs">
          {{ phoneNumber ? 'Número de aerolínea' : 'Agregar número' }}
        </div>
      </div>

      <!-- Teclado numérico -->
      <div class="keypad-grid q-mb-lg">
        <button 
          v-for="key in keys"
          :key="key.digit"
          class="key-button"
          @click="() => $emit('digit-pressed', key.digit)"
        >
          <div class="key-digit">{{ key.digit }}</div>
          <div class="key-letters">{{ key.letters }}</div>
        </button>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons q-mb-lg">
        <q-btn
          round
          dense
          color="negative"
          icon="backspace"
          @click="$emit('backspace')"
          size="md"
        />
        <q-space />
       
      </div>

      <!-- Botón de llamada VERDE -->
      <q-btn
        unelevated
        color="positive"
        label="Llamar"
        icon="call"
        size="lg"
        class="full-width call-button"
        @click="handleCall"
        :disable="!phoneNumber"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

// Definir props y emits
const props = defineProps({
  phoneNumber: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['digit-pressed', 'backspace', 'clear', 'start-call'])

const keys = ref([
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
  { digit: '*', letters: '' },
  { digit: '0', letters: '+' },
  { digit: '#', letters: '' }
])

const handleCall = () => {
  console.log('Botón llamar clickeado, número:', props.phoneNumber)
  emit('start-call')
}
</script>

<style lang="scss" scoped>
.dial-pad-card {
  border-radius: 20px;
  background: white;
  box-shadow: none;
  border: none;
}

.display-container {
  text-align: center;
  padding: 20px;
  background: #f5f5f7;
  border-radius: 12px;
}

.display-text {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 1px;
  word-break: break-all;
  color: #000;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.key-button {
  background: #f5f5f7;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  margin: 0 auto;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e5e5ea;
    transform: scale(1.1);
  }
  
  &:active {
    background: #d5d5da;
    transform: scale(0.95);
  }
}

.key-digit {
  font-size: 28px;
  font-weight: 600;
}

.key-letters {
  font-size: 11px;
  letter-spacing: 1px;
  margin-top: 2px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.call-button {
  border-radius: 50px;
  padding: 14px !important;
  font-weight: 600;
  font-size: 16px;
  background: #34c759 !important;
  height: 56px;
  
  &:not(:disabled):hover {
    background: #30b352 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 199, 89, 0.4);
  }
  
  &:disabled {
    background: #c8e6c9 !important;
    color: #666;
    cursor: not-allowed;
  }
}
</style>