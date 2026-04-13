<script setup>
import { ref, computed } from 'vue'
import { useClimateStore } from '@/stores/climateStore'
import ForceGraph from '@/components/charts/ForceGraph.vue'

const store = useClimateStore()
const selectedNode = ref(null)

// Computed que construeix els links a partir de les connexions de cada punt
const graphLinks = computed(() => {
  const links = []
  store.points.forEach(point => {
    point.connections.forEach(targetId => {
      links.push({ source: point.id, target: targetId })
    })
  })
  return links
})

// Còpia dels nodes per no mutar la store directament
const graphNodes = computed(() =>
  store.points.map(p => ({ ...p }))
)

function onNodeClick(node) {
  selectedNode.value = node
}
</script>

<template>
  <div class="tipping-view">
    <div class="view-header">
      <h1>Punts d'Inflexió <span class="highlight">Climàtics</span></h1>
      <p>
        Cada node representa un punt d'inflexió. La seva mida indica l'impacte global.
        Les línies mostren interconnexions: quan un punt es traspassa, pot desencadenar els altres.
        <strong>Fes clic en un node</strong> per veure més detalls.
      </p>
    </div>

    <div class="graph-layout">
      <!-- Graf de forces -->
      <div class="graph-container">
        <ForceGraph
          :nodes="graphNodes"
          :links="graphLinks"
          @node-click="onNodeClick"
        />
      </div>

      <!-- Panell lateral -->
      <div class="detail-panel">
        <div v-if="selectedNode" class="node-detail">
          <div class="node-header" :style="{ borderColor: selectedNode.color }">
            <h2 :style="{ color: selectedNode.color }">{{ selectedNode.name }}</h2>
            <span class="region">{{ selectedNode.region }}</span>
          </div>
          <p class="description">{{ selectedNode.description }}</p>
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Límit crític</span>
              <span class="stat-value" :style="{ color: selectedNode.color }">
                {{ selectedNode.threshold }}°C
              </span>
            </div>
            <div class="stat">
              <span class="stat-label">Impacte global</span>
              <span class="stat-value" :style="{ color: selectedNode.color }">
                {{ selectedNode.impact }}/10
              </span>
            </div>
          </div>
          <div v-if="selectedNode.connections.length" class="connections">
            <span class="stat-label">Connectat amb:</span>
            <div class="connection-tags">
              <span
                v-for="conn in selectedNode.connections"
                :key="conn"
                class="tag"
              >
                {{ store.points.find(p => p.id === conn)?.name }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="node-placeholder">
          <p>Selecciona un node del graf per veure informació detallada.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tipping-view {
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
  margin-bottom: 0.75rem;
}

.highlight { color: #10b981; }

.view-header p {
  color: #9ca3af;
  line-height: 1.6;
  max-width: 700px;
}

.graph-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.graph-container {
  flex: 2;
  min-width: 300px;
}

.detail-panel {
  flex: 1;
  min-width: 240px;
}

.node-detail {
  background: #1f2937;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #374151;
}

.node-header {
  border-left: 4px solid;
  padding-left: 0.75rem;
  margin-bottom: 1rem;
}

.node-header h2 {
  font-size: 1.05rem;
  margin-bottom: 0.2rem;
}

.region {
  font-size: 0.8rem;
  color: #6b7280;
}

.description {
  font-size: 0.9rem;
  color: #d1d5db;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
}

.connection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.tag {
  background: #111827;
  border: 1px solid #374151;
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.node-placeholder {
  background: #1f2937;
  border-radius: 10px;
  padding: 2rem 1.25rem;
  border: 1px dashed #374151;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}
</style>