<template>
  <q-card class="dial-pad-card">
    <q-card-section>
     
      <div class="display-container q-mb-lg">
        <div class="display-text">{{ phoneNumber || 'Marcador' }}</div>
        <div class="text-caption text-grey q-mt-xs">
          {{ phoneNumber ? 'Número de aerolínea' : 'Agregar número' }}
        </div>
      </div>

    
      <div class="keypad-grid q-mb-lg">
        <button 
          v-for="key in keys"
          :key="key.digit"
          class="key-button"
          @click="$emit('digit-pressed', key.digit)"
        >
          <div class="key-digit">{{ key.digit }}</div>
          <div class="key-letters">{{ key.letters }}</div>
        </button>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons q-mb-lg">
        <q-btn round dense color="negative" icon="backspace" @click="$emit('backspace')" />
        <q-space />
        <q-btn round dense color="primary" icon="clear" @click="$emit('clear')" />
      </div>

      <!-- Llamada -->
      <q-btn
        unelevated
        color="positive"
        label="Llamar"
        icon="call"
        size="lg"
        class="full-width call-button"
        @click="$emit('start-call')"
        :disable="!phoneNumber"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps(['phoneNumber'])
defineEmits(['digit-pressed', 'backspace', 'clear', 'start-call'])

const keys = [
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
]
</script>

<style lang="scss" scoped>
.dial-pad-card {
  border-radius: 20px;
  background: white;
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
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.call-button {
  border-radius: 50px;
  padding: 14px;
  font-weight: 600;
  font-size: 16px;
  background: #34c759;
  height: 56px;
}
</style>