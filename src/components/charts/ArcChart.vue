<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  data: { type: Array, required: true }, // [{ name, value, color }]
  title: { type: String, default: '' }
})

const svgRef = ref(null)
const size = ref(300)

function draw(data) {
  if (!svgRef.value || !data.length) return

  const s = size.value
  const radius = s / 2 - 20

  const svg = d3.select(svgRef.value)
    .attr('width', s).attr('height', s)

  let g = svg.select('g.arc-group')
  if (g.empty()) {
    g = svg.append('g')
      .attr('class', 'arc-group')
      .attr('transform', `translate(${s / 2},${s / 2})`)
  }

  //Pie layout
  const pie = d3.pie()
    .value(d => d.value)
    .sort(null)

  const arc = d3.arc()
    .innerRadius(radius * 0.55)   // donut
    .outerRadius(radius)

  const arcHover = d3.arc()
    .innerRadius(radius * 0.55)
    .outerRadius(radius + 8)

  //Arcs amb join() + transicions
  g.selectAll('path.arc-slice')
    .data(pie(data))
    .join(
      enter => enter.append('path')
        .attr('class', 'arc-slice')
        .attr('fill', d => d.data.color)
        .attr('stroke', '#111827')
        .attr('stroke-width', 2)
        .attr('opacity', 0.85)
        .attr('d', arc)
        .on('mouseover', function() {
          d3.select(this).transition().duration(200).attr('d', arcHover)
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(200).attr('d', arc)
        })
        .call(e => e.transition().duration(700)
          .attrTween('d', function(d) {
            const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
            return t => arc(i(t))
          })
        ),
      update => update
        .call(u => u.transition().duration(500).attr('d', arc).attr('fill', d => d.data.color)),
      exit => exit.transition().duration(300).attr('opacity', 0).remove()
    )

  //Etiquetes
  g.selectAll('text.arc-label')
    .data(pie(data))
    .join(
      enter => enter.append('text')
        .attr('class', 'arc-label')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e5e7eb')
        .attr('font-size', '10px')
        .text(d => d.data.value > 5 ? `${d.data.value}%` : ''),
      update => update
        .call(u => u.transition().duration(500)
          .attr('transform', d => `translate(${arc.centroid(d)})`)
          .text(d => d.data.value > 5 ? `${d.data.value}%` : '')
        ),
      exit => exit.remove()
    )

  //Text central
  let centerText = g.select('text.center-text')
  if (centerText.empty()) {
    centerText = g.append('text').attr('class', 'center-text')
      .attr('text-anchor', 'middle').attr('dy', '0.35em')
      .attr('fill', '#e5e7eb').attr('font-size', '13px').attr('font-weight', 'bold')
  }
  centerText.text(props.title)
}

function onResize() {
  if (svgRef.value) {
    const w = svgRef.value.parentElement.clientWidth || 300
    size.value = Math.min(w, 320)
    draw(props.data)
  }
}

onMounted(() => { onResize(); window.addEventListener('resize', onResize) })
onUnmounted(() => window.removeEventListener('resize', onResize))
watch(() => props.data, (newData) => draw(newData), { deep: true })
</script>

<template>
  <svg ref="svgRef" class="arc-svg"></svg>
</template>

<style scoped>
.arc-svg { display: block; margin: 0 auto; }
</style>