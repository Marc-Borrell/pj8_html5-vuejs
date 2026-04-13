<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClimateStore } from '@/stores/climateStore'
import LineChart from '@/components/charts/LineChart.vue'
import ArcChart from '@/components/charts/ArcChart.vue'

const store = useClimateStore()
const route = useRoute()
const router = useRouter()

const indicators = [
  { id: 'temperature', label: 'Temperatura Global', unit: 'Anomalia (°C)', color: '#ef4444' },
  { id: 'arctic-ice',  label: 'Gel Àrtic',          unit: 'Milions km²',  color: '#06b6d4' },
  { id: 'co2',         label: 'CO₂ Atmosfèric',     unit: 'ppm',          color: '#f59e0b' }
]

// Ruta dinàmica: si hi ha :indicator a la URL l'usem, sinó el de la store
const activeId = computed(() => route.params.indicator || store.selectedIndicator)
const activeIndicator = computed(() => indicators.find(i => i.id === activeId.value) || indicators[0])

const chartData = computed(() =>
  store.timeSeries.filter(d => d.indicator === activeId.value)
)

// Dades per l'ArcChart: distribució d'impacte dels punts d'inflexió per regió
const arcData = computed(() => {
  const regions = {}
  store.points.forEach(p => {
    regions[p.region] = (regions[p.region] || 0) + p.impact
  })
  const total = Object.values(regions).reduce((a, b) => a + b, 0)
  const colors = ['#10b981', '#06b6d4', '#a855f7', '#f59e0b', '#ef4444']
  return Object.entries(regions).map(([name, value], i) => ({
    name,
    value: Math.round((value / total) * 100),
    color: colors[i % colors.length]
  }))
})

function selectIndicator(id) {
  store.setIndicator(id)
  router.push({ name: 'data-detail', params: { indicator: id } })
}
</script>

<template>
  <div class="data-view">
    <div class="view-header">
      <h1>Dades <span class="highlight">Climàtiques</span></h1>
      <p>Evolució dels principals indicadors del sistema climàtic global.</p>
    </div>

    <!-- Selector d'indicadors -->
    <div class="indicator-tabs">
      <button
        v-for="ind in indicators"
        :key="ind.id"
        :class="['tab', { active: activeId === ind.id }]"
        :style="activeId === ind.id ? { borderColor: ind.color, color: ind.color } : {}"
        @click="selectIndicator(ind.id)"
      >
        {{ ind.label }}
      </button>
    </div>

    <!-- Gràfics -->
    <div class="charts-grid">
      <div class="chart-card">
        <h2>{{ activeIndicator.label }}</h2>
        <p class="chart-sub">Font: NASA GISS / NSIDC / NOAA</p>
        <LineChart
          :data="chartData"
          :color="activeIndicator.color"
          :label="activeIndicator.unit"
        />
      </div>

      <div class="chart-card">
        <h2>Impacte per Regió</h2>
        <p class="chart-sub">Distribució de l'impacte dels punts d'inflexió per zona geogràfica</p>
        <ArcChart :data="arcData" title="Impacte" />
        <!-- Llegenda -->
        <div class="legend">
          <div v-for="item in arcData" :key="item.name" class="legend-item">
            <span class="legend-dot" :style="{ background: item.color }"></span>
            <span>{{ item.name }} ({{ item.value }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.data-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 2rem;
}

.view-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.highlight { color: #10b981; }

.view-header p {
  color: #9ca3af;
}

.indicator-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  border: 1px solid #374151;
  background: #1f2937;
  color: #9ca3af;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: #e5e7eb;
  border-color: #6b7280;
}

.tab.active {
  background: #111827;
  border-width: 2px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 768px) {
  .charts-grid { grid-template-columns: 1fr; }
}

.chart-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
  padding: 1.25rem;
}

.chart-card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #e5e7eb;
}

.chart-sub {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #9ca3af;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>