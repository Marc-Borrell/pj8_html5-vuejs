<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  nodes: { type: Array, required: true },
  links: { type: Array, required: true }
})

const emit = defineEmits(['node-click'])

const svgRef = ref(null)
const width = ref(700)
const height = 480

let simulation = null

function draw(nodes, links) {
  if (!svgRef.value || !nodes.length) return

  const w = width.value
  const h = height

  const svg = d3.select(svgRef.value)
    .attr('width', w)
    .attr('height', h)

  svg.selectAll('*').remove()

  //Gradient de fons
  const defs = svg.append('defs')
  const radial = defs.append('radialGradient')
    .attr('id', 'bg-gradient')
  radial.append('stop').attr('offset', '0%').attr('stop-color', '#1f2937')
  radial.append('stop').attr('offset', '100%').attr('stop-color', '#111827')

  svg.append('rect')
    .attr('width', w).attr('height', h)
    .attr('fill', 'url(#bg-gradient)')
    .attr('rx', 12)

  //Gradient per node seleccionat
  nodes.forEach(node => {
    const grad = defs.append('radialGradient')
      .attr('id', `grad-${node.id}`)
    grad.append('stop').attr('offset', '0%').attr('stop-color', node.color).attr('stop-opacity', 0.9)
    grad.append('stop').attr('offset', '100%').attr('stop-color', node.color).attr('stop-opacity', 0.3)
  })

  const g = svg.append('g')

  //Links
  const linkSel = g.append('g').attr('class', 'links')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#374151')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,3')

  //Nodes
  const nodeG = g.append('g').attr('class', 'nodes')
    .selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .style('cursor', 'pointer')
    .on('click', (event, d) => emit('node-click', d))
    .call(
      d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
    )

  // Cercle exterior (glow)
  nodeG.append('circle')
    .attr('r', d => 14 + d.impact * 2.5)
    .attr('fill', d => d.color)
    .attr('opacity', 0.1)

  // Cercle principal amb gradient
  nodeG.append('circle')
    .attr('r', d => 10 + d.impact * 2)
    .attr('fill', d => `url(#grad-${d.id})`)
    .attr('stroke', d => d.color)
    .attr('stroke-width', 1.5)

  // Etiqueta
  nodeG.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => 16 + d.impact * 2)
    .attr('fill', '#e5e7eb')
    .attr('font-size', '11px')
    .text(d => d.name.split(' ').slice(0, 2).join(' '))

  // Límit
  nodeG.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', d => 28 + d.impact * 2)
    .attr('fill', '#9ca3af')
    .attr('font-size', '10px')
    .text(d => `${d.threshold}°C`)

  //Simulació de forces
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(160))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('collision', d3.forceCollide().radius(d => 20 + d.impact * 2.5))
    .on('tick', () => {
      linkSel
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      nodeG.attr('transform', d => `translate(${d.x},${d.y})`)
    })
}

function onResize() {
  if (svgRef.value) {
    width.value = svgRef.value.parentElement.clientWidth || 700
    draw(props.nodes, props.links)
  }
}

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  if (simulation) simulation.stop()
  window.removeEventListener('resize', onResize)
})

watch(() => props.nodes, () => draw(props.nodes, props.links), { deep: true })
</script>

<template>
  <svg ref="svgRef" class="force-svg"></svg>
</template>

<style scoped>
.force-svg {
  width: 100%;
  display: block;
  border-radius: 12px;
}
</style>