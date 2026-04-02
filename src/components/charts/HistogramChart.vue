<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: '#10b981'
  }
})

const svgRef = ref(null)
const width = ref(500)
const height = 220
const margin = { top: 10, right: 20, bottom: 30, left: 30 }

function draw(data) {
  if (!svgRef.value || !data.length) return

  const w = width.value - margin.left - margin.right
  const h = height - margin.top - margin.bottom

  //Escales
  const x = d3.scaleLinear()
    .domain([d3.min(data) - 0.1, d3.max(data) + 0.1])
    .range([0, w])

  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(x.ticks(30))(data)

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([h, 0])

  //Selecció del SVG
  const svg = d3.select(svgRef.value)
  svg.attr('width', width.value).attr('height', height)

  let g = svg.select('g.chart-group')
  if (g.empty()) {
    g = svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left},${margin.top})`)
  }

  //Eixos
  let xAxisG = g.select('g.x-axis')
  if (xAxisG.empty()) {
    xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${h})`)
  }
  xAxisG.transition().duration(500)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d.toFixed(1)}°C`))

  let yAxisG = g.select('g.y-axis')
  if (yAxisG.empty()) {
    yAxisG = g.append('g').attr('class', 'y-axis')
  }
  yAxisG.transition().duration(500)
    .call(d3.axisLeft(y).ticks(4))

  //Etiqueta eix Y
  let yLabel = g.select('text.y-label')
  if (yLabel.empty()) {
    g.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', -margin.left + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '11px')
      .text('Nombre d\'anys')
  }

  //Etiqueta eix X
  let xLabel = g.select('text.x-label')
  if (xLabel.empty()) {
    g.append('text')
      .attr('class', 'x-label')
      .attr('x', w / 2)
      .attr('y', h + margin.bottom - 2)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280')
      .attr('font-size', '11px')
      .text('Anomalia de temperatura (°C)')
  }

  //Línia llindar 1.5°C
  const thresholdX = x(1.5)
  let thresholdLine = g.select('line.threshold')
  if (thresholdLine.empty()) {
    thresholdLine = g.append('line').attr('class', 'threshold')
  }
  thresholdLine
    .attr('x1', thresholdX).attr('x2', thresholdX)
    .attr('y1', 0).attr('y2', h)
    .attr('stroke', '#ef4444')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3')

  let thresholdLabel = g.select('text.threshold-label')
  if (thresholdLabel.empty()) {
    thresholdLabel = g.append('text').attr('class', 'threshold-label')
  }
  thresholdLabel
    .attr('x', thresholdX + 4)
    .attr('y', 14)
    .attr('fill', '#ef4444')
    .attr('font-size', '10px')
    .text('Límit crític 1.5°C')

  //Barres amb join() + transicions
  g.selectAll('rect.bar')
    .data(bins)
    .join(
      enter => enter.append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.x0) + 1)
        .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr('y', h)
        .attr('height', 0)
        .attr('fill', props.color)
        .attr('opacity', 0.85)
        .call(enter => enter.transition().duration(600)
          .attr('y', d => y(d.length))
          .attr('height', d => h - y(d.length))
        ),
      update => update
        .call(update => update.transition().duration(500)
          .attr('x', d => x(d.x0) + 1)
          .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
          .attr('y', d => y(d.length))
          .attr('height', d => h - y(d.length))
          .attr('fill', props.color)
        ),
      exit => exit
        .call(exit => exit.transition().duration(300)
          .attr('height', 0)
          .attr('y', h)
          .remove()
        )
    )

  // Estil dels eixos
  svg.selectAll('.domain, .tick line').attr('stroke', '#4b5563')
  svg.selectAll('.tick text').attr('fill', '#9ca3af').attr('font-size', '10px')
}

// Redimensiona quan canvia la finestra
function onResize() {
  if (svgRef.value) {
    width.value = svgRef.value.parentElement.clientWidth || 500
    draw(props.data)
  }
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

// Redibuixa quan canvien les dades (watch per disparar D3)
watch(() => props.data, (newData) => {
  draw(newData)
}, { deep: true })
</script>

<template>
  <svg ref="svgRef" class="histogram-svg"></svg>
</template>

<style scoped>
.histogram-svg {
  width: 100%;
  display: block;
}

</style>