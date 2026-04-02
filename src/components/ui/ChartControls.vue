<script setup>
// Props entrants + emits sortints → arquitectura desacoblada (3pts)
const props = defineProps({
  distribution: {
    type: String,
    required: true
  },
  sampleSize: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:distribution', 'update:sampleSize'])
</script>

<template>
  <div class="controls">
    <div class="control-row">
      <label>Escenari de distribució</label>
      <select
        :value="props.distribution"
        @change="emit('update:distribution', $event.target.value)"
      >
        <option value="normal">Actual (~1.1°C)</option>
        <option value="optimista">Optimista (&lt;1.0°C)</option>
        <option value="pessimista">Pessimista (&gt;1.5°C)</option>
      </select>
    </div>

    <div class="control-row">
      <label>Anys simulats: {{ props.sampleSize }}</label>
      <input
        type="range"
        min="50"
        max="500"
        step="50"
        :value="props.sampleSize"
        @input="emit('update:sampleSize', Number($event.target.value))"
      />
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #9ca3af;
}
.control-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
select {
  background: #1f2937;
  color: #e5e7eb;
  border: 1px solid #374151;
  border-radius: 4px;
  padding: 0.3rem 0.5rem;
}
input[type='range'] {
  accent-color: #a855f7;
}
</style>