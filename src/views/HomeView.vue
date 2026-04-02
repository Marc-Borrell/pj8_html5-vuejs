<script setup>
import { computed } from 'vue'
import { useClimateStore } from '@/stores/climateStore'
import HistogramChart from '@/components/charts/HistogramChart.vue'
import ChartControls from '@/components/ui/ChartControls.vue'

const store = useClimateStore()

// Computed que transforma dades de la store abans d'enviar-les a D3
const chartData = computed(() => store.distributionSamples)

const colorMap = {
  normal: '#10b981',
  optimista: '#3b82f6',
  pessimista: '#ef4444'
}
const chartColor = computed(() => colorMap[store.selectedDistribution])
</script>

<template>
  <div class="home">

    <section class="hero">
      <div class="hero-text">
        <h1>Punts d'Inflexió <span class="highlight">Climàtics</span></h1>
        <p>
          Els punts d'inflexió són llindars del sistema climàtic on petits canvis
          poden desencadenar transformacions grans i irreversibles.
        </p>
        <nav class="hero-nav">
        <RouterLink :to="{ name: 'home' }">Inici</RouterLink>
        <span class="divider">|</span>
        <RouterLink :to="{ name: 'about' }">Sobre</RouterLink>
      </nav>
      </div>

      <!-- Histograma + controls -->
      <div class="hero-chart">
        <div class="chart-title">
        <p class="chart-desc">
          Simulació d'anomalies de temperatura en anys futurs segons l'escenari d'emissions.
          La línia vermella marca el límit crític de 
          l'<a href="https://www.miteco.gob.es/es/cambio-climatico/temas/el-proceso-internacional-de-lucha-contra-el-cambio-climatico/naciones-unidas/elmentos-acuerdo-paris.html" target="_blank" rel="noopener noreferrer">Acord de París</a>. 
        </p>
      </div>
        <HistogramChart :data="chartData" :color="chartColor" />
        <ChartControls
          :distribution="store.selectedDistribution"
          :sample-size="store.sampleSize"
          @update:distribution="store.setDistribution"
          @update:sampleSize="store.setSampleSize"
        />
        <p class="chart-hint">
        Cada barra mostra quants dels {{ store.sampleSize }} anys simulats 
        assolirien aquell rang de temperatura.
      </p>
      </div>
    </section>

    <section class="cards">
      <div
        v-for="point in store.points.slice(0, 3)"
        :key="point.id"
        class="card"
        :style="{ borderColor: point.color }"
      >
        <h3 :style="{ color: point.color }">{{ point.name }}</h3>
        <p class="threshold">Llindar: <strong>{{ point.threshold }}°C</strong></p>
        <p>{{ point.description }}</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero */
.hero {
  display: flex;
  align-items: center;
  gap: 3rem;
  min-height: 50vh;
  flex-wrap: wrap;
}
.hero-text {
  flex: 1;
  min-width: 280px;
}
.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}
.highlight {
  color: #10b981;
}
.hero-text p {
  color: #9ca3af;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.hero-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.hero-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero-nav a {
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.hero-nav a:hover,
.hero-nav a.router-link-exact-active {
  color: #10b981;
}

.divider {
  color: #374151;
}
.chart-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
}
.hero-chart {
  flex: 1;
  min-width: 300px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 4rem;
}
.card {
  background: #1f2937;
  border: 1px solid #374151;
  border-left-width: 4px;
  border-radius: 8px;
  padding: 1.25rem;
}
.card h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.threshold {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}
.card p {
  font-size: 0.9rem;
  color: #d1d5db;
  line-height: 1.5;
}
.chart-title {
  margin-bottom: 0.5rem;
}
.chart-desc {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.5;
}
</style>