<template>
  <q-dialog 
    v-model="showDialog" 
    @hide="$emit('close')"
    maximized
  >
    <q-card class="dial-pad-overlay">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Teclado</div>
        <q-space />
        <q-btn 
          icon="close" 
          flat 
          round 
          dense 
          @click="$emit('close')"
        />
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <div class="keypad-grid">
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['digit-pressed', 'close'])

const showDialog = ref(true)
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
</script>

<style lang="scss" scoped>
.dial-pad-overlay {
  background: white;
}

.keypad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.key-button {
  background: #f5f5f7;
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
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
  font-size: 32px;
  font-weight: 600;
}

.key-letters {
  font-size: 12px;
  letter-spacing: 1px;
  margin-top: 4px;
  color: #666;
}
</style>