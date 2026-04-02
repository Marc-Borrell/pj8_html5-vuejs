<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: { type: Array, required: true },
  color: { type: String, default: '#10b981' },
  label: { type: String, default: '' }
})

const svgRef = ref(null)
const width = ref(600)
const height = 280
const margin = { top: 20, right: 20, bottom: 40, left: 50 }

function draw(data) {
  if (!svgRef.value || !data.length) return

  const w = width.value - margin.left - margin.right
  const h = height - margin.top - margin.bottom

  const svg = d3.select(svgRef.value)
    .attr('width', width.value)
    .attr('height', height)

  let g = svg.select('g.chart-group')
  if (g.empty()) {
    g = svg.append('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left},${margin.top})`)
  }

  //Escales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, w])

  const y = d3.scaleLinear()
    .domain([d3.min(data, d => d.value) * 0.9, d3.max(data, d => d.value) * 1.1])
    .range([h, 0])

  //Gradient sota la línia
  const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')

  const gradientId = `line-gradient-${props.label.replace(/[^a-zA-Z0-9]/g, '_')}`
  let grad = defs.select(`#${gradientId}`)
  if (grad.empty()) {
    grad = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0').attr('x2', '0')
      .attr('y1', '0').attr('y2', '1')
  }
  grad.selectAll('stop').remove()
  grad.append('stop').attr('offset', '0%').attr('stop-color', props.color).attr('stop-opacity', 0.4)
  grad.append('stop').attr('offset', '100%').attr('stop-color', props.color).attr('stop-opacity', 0)

  //Àrea sota la línia
  const area = d3.area()
    .x(d => x(d.year))
    .y0(h)
    .y1(d => y(d.value))
    .curve(d3.curveMonotoneX)

  let areaPath = g.select('path.area')
  if (areaPath.empty()) areaPath = g.append('path').attr('class', 'area')
  areaPath
    .datum(data)
    .attr('fill', `url(#${gradientId})`)
    .transition().duration(600)
    .attr('d', area)

  //Línia principal
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))
    .curve(d3.curveMonotoneX)

  let linePath = g.select('path.line')
  if (linePath.empty()) linePath = g.append('path').attr('class', 'line')
  linePath
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', props.color)
    .attr('stroke-width', 2.5)
    .transition().duration(600)
    .attr('d', line)

  //Punts
  g.selectAll('circle.dot')
    .data(data)
    .join(
      enter => enter.append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.year))
        .attr('cy', h)
        .attr('r', 4)
        .attr('fill', props.color)
        .attr('stroke', '#111827')
        .attr('stroke-width', 1.5)
        .call(e => e.transition().duration(600).attr('cy', d => y(d.value))),
      update => update
        .call(u => u.transition().duration(500)
          .attr('cx', d => x(d.year))
          .attr('cy', d => y(d.value))
        ),
      exit => exit.remove()
    )

  //Eixos
  let xAxisG = g.select('g.x-axis')
  if (xAxisG.empty()) {
    xAxisG = g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${h})`)
  }
  xAxisG.transition().duration(500)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}`))

  let yAxisG = g.select('g.y-axis')
  if (yAxisG.empty()) yAxisG = g.append('g').attr('class', 'y-axis')
  yAxisG.transition().duration(500)
    .call(d3.axisLeft(y).ticks(5))

  // Etiquetes eixos
  let yLabel = g.select('text.y-label')
  if (yLabel.empty()) {
    g.append('text').attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2).attr('y', -margin.left + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280').attr('font-size', '11px')
      .text(props.label)
  }

  let xLabel = g.select('text.x-label')
  if (xLabel.empty()) {
    g.append('text').attr('class', 'x-label')
      .attr('x', w / 2).attr('y', h + margin.bottom - 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6b7280').attr('font-size', '11px')
      .text('Any')
  }

  svg.selectAll('.domain, .tick line').attr('stroke', '#4b5563')
  svg.selectAll('.tick text').attr('fill', '#9ca3af').attr('font-size', '10px')
}

function onResize() {
  if (svgRef.value) {
    width.value = svgRef.value.parentElement.clientWidth || 600
    draw(props.data)
  }
}

onMounted(() => { onResize(); window.addEventListener('resize', onResize) })
onUnmounted(() => window.removeEventListener('resize', onResize))
watch(() => props.data, (newData) => draw(newData), { deep: true })
</script>

<template>
  <svg ref="svgRef" class="line-svg"></svg>
</template>

<style scoped>
.line-svg { width: 100%; display: block; }
</style>