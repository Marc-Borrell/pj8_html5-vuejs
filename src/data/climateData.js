// Simulació de dades
export const climateTimeSeries = [
  // Temperatura global (anomalia respecte 1951-1980)
  { year: 1980, value: 0.26, indicator: 'temperature' },
  { year: 1985, value: 0.12, indicator: 'temperature' },
  { year: 1990, value: 0.44, indicator: 'temperature' },
  { year: 1995, value: 0.38, indicator: 'temperature' },
  { year: 2000, value: 0.42, indicator: 'temperature' },
  { year: 2005, value: 0.68, indicator: 'temperature' },
  { year: 2010, value: 0.72, indicator: 'temperature' },
  { year: 2015, value: 0.87, indicator: 'temperature' },
  { year: 2016, value: 1.01, indicator: 'temperature' },
  { year: 2020, value: 0.98, indicator: 'temperature' },
  { year: 2023, value: 1.17, indicator: 'temperature' },
  // Extensió gel àrtic (milions km²)
  { year: 1980, value: 7.8, indicator: 'arctic-ice' },
  { year: 1990, value: 7.2, indicator: 'arctic-ice' },
  { year: 2000, value: 6.5, indicator: 'arctic-ice' },
  { year: 2007, value: 4.3, indicator: 'arctic-ice' },
  { year: 2012, value: 3.4, indicator: 'arctic-ice' },
  { year: 2020, value: 3.9, indicator: 'arctic-ice' },
  { year: 2023, value: 4.1, indicator: 'arctic-ice' },
  // CO₂ atmosfèric (ppm)
  { year: 1980, value: 338, indicator: 'co2' },
  { year: 1990, value: 354, indicator: 'co2' },
  { year: 2000, value: 369, indicator: 'co2' },
  { year: 2010, value: 389, indicator: 'co2' },
  { year: 2020, value: 412, indicator: 'co2' },
  { year: 2023, value: 421, indicator: 'co2' },
]

export const tippingPoints = [
  {
    id: 'greenland',
    name: 'Casquet de Gel de Groenlàndia',
    threshold: 1.5,
    impact: 9,
    region: 'Àrtic',
    description: 'Desglaç irreversible que podria elevar el nivell del mar 7m.',
    color: '#06b6d4',
    connections: ['arctic-ice', 'amoc']
  },
  {
    id: 'amazon',
    name: 'Amazònia',
    threshold: 2.0,
    impact: 8,
    region: 'Amèrica del Sud',
    description: 'Conversió de selva tropical a sabana, alliberant 90 Gt de carboni.',
    color: '#22c55e',
    connections: ['monsoon', 'permafrost']
  },
  {
    id: 'amoc',
    name: 'Circulació Atlàntica (AMOC)',
    threshold: 1.8,
    impact: 10,
    region: 'Atlàntic Nord',
    description: 'Col·lapse de la circulació termohalina afectant el clima europeu.',
    color: '#3b82f6',
    connections: ['greenland', 'arctic-ice']
  },
  {
    id: 'arctic-ice',
    name: 'Gel Àrtic Estival',
    threshold: 1.5,
    impact: 7,
    region: 'Àrtic',
    description: 'Desaparició del gel àrtic a l\'estiu, accelerant l\'escalfament.',
    color: '#a855f7',
    connections: ['greenland', 'amoc']
  },
  {
    id: 'permafrost',
    name: 'Permafrost Boreal',
    threshold: 1.5,
    impact: 8,
    region: 'Sibèria / Canadà',
    description: 'Alliberament de metà i CO₂ del sòl congelat.',
    color: '#f59e0b',
    connections: ['amazon', 'monsoon']
  },
  {
    id: 'coral',
    name: 'Esculls de Corall Tropicals',
    threshold: 1.5,
    impact: 6,
    region: 'Tròpics',
    description: 'Blanquejament massiu i mort dels ecosistemes coralins.',
    color: '#f97316',
    connections: []
  },
  {
    id: 'monsoon',
    name: 'Monzó de l\'Àsia Occidental',
    threshold: 2.5,
    impact: 7,
    region: 'Àsia',
    description: 'Desestabilització del cicle de monzons afectant milers de milions.',
    color: '#ec4899',
    connections: ['amazon', 'permafrost']
  }
]

// Generador de distribucions per l'histograma
// Genera n valors aleatoris simulant anomalies de temperatura (°C)
export function generateDistribution(type, n) {
  const samples = []

  for (let i = 0; i < n; i++) {
    if (type === 'normal') {
      // La majoria de valors entre 0.8 i 1.4°C 
      samples.push(0.8 + Math.random() * 0.6)

    } else if (type === 'optimista') {
      // Valors baixos: bona gestió climàtica, entre 0.2 i 1.0°C
      samples.push(0.2 + Math.random() * 0.8)

    } else if (type === 'pessimista') {
      // Valors alts: sense acció climàtica, entre 1.5 i 4.0°C
      samples.push(1.5 + Math.random() * 2.5)
    }
  }

  return samples
}