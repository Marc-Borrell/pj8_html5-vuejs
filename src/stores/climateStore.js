import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { climateTimeSeries, tippingPoints, generateDistribution } from '@/data/climateData'

export const useClimateStore = defineStore('climate', () => {
  //Estat
  const isInitialized = ref(false)
  const selectedDistribution = ref('normal')  // 'normal' | 'optimista' | 'pessimista'
  const sampleSize = ref(200)
  const selectedIndicator = ref('temperature') 
  const isLoading = ref(false)

  //Dades base
  const timeSeries = ref(climateTimeSeries)
  const points = ref(tippingPoints)

  // Dades filtrades per l'indicador seleccionat
  const activeTimeSeries = computed(() =>
    timeSeries.value.filter(d => d.indicator === selectedIndicator.value)
  )

  // Distribució aleatòria
  const distributionSamples = computed(() =>
    generateDistribution(selectedDistribution.value, sampleSize.value)
  )

  // Rang de dates 
  const dateExtent = computed(() => {
    const dates = activeTimeSeries.value.map(d => d.year)
    return [Math.min(...dates), Math.max(...dates)]
  })

  //Accions
  function initialize() {
    isInitialized.value = true
  }

  function setDistribution(dist) {
    selectedDistribution.value = dist
  }

  function setSampleSize(size) {
    sampleSize.value = size
  }

  function setIndicator(indicator) {
    selectedIndicator.value = indicator
  }

  return {
    isInitialized,
    selectedDistribution,
    sampleSize,
    selectedIndicator,
    isLoading,
    timeSeries,
    points,
    activeTimeSeries,
    distributionSamples,
    dateExtent,
    initialize,
    setDistribution,
    setSampleSize,
    setIndicator
  }
})