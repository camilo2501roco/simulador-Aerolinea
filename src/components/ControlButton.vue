<template>
  <div class="control-item">
    <q-btn 
      round 
      size="lg" 
      :color="color" 
      :text-color="active ? 'white' : 'grey-9'"
      :icon="active && activeIcon ? activeIcon : icon" 
      class="control-btn"
      @click="$emit('click')"
    />
    <div class="control-label">{{ active && activeLabel ? activeLabel : label }}</div>
  </div>
</template>

<script setup>
defineProps({
  active: Boolean,
  icon: String,
  activeIcon: String,
  label: String,
  activeLabel: String,
  color: {
    type: String,
    default: 'white'
  }
})

defineEmits(['click'])
</script>

<style scoped>
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
</style>