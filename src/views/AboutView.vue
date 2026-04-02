<template>
  <div class="about-view">
    <div class="about-header">
      <h1>Sobre el <span class="highlight">Projecte</span></h1>
      <p class="subtitle">
        Una visualització interactiva dels punts d'inflexió climàtics del planeta.
      </p>
    </div>

    <div class="about-grid">
      <div class="about-card">
        <h2>Què són els punts d'inflexió?</h2>
        <p>
          Els punts d'inflexió climàtics són llindars crítics del sistema terrestre.
          Quan la temperatura global els supera, s'activen canvis en cascada que poden
          ser irreversibles a escala humana: el desglaç de Groenlàndia, el col·lapse
          de la circulació atlàntica o la conversió de l'Amazònia en savana.
        </p>
      </div>

      <div class="about-card">
        <h2>Fonts de dades</h2>
        <p>
          Les dades d'anomalia de temperatura provenen de la base de dades
          <strong>NASA GISS Surface Temperature Analysis</strong>. Les dades de gel àrtic
          del <strong>NSIDC</strong> i les concentracions de CO₂ del
          <strong>NOAA Global Monitoring Laboratory</strong>.
        </p>
      </div>

      <div class="about-card">
        <h2>Tecnologies</h2>
        <p>
          Aquest projecte està construït amb <strong>Vue 3</strong> (Composition API),
          <strong>Pinia</strong> per a la gestió d'estat, <strong>Vue Router</strong>
          per a la navegació i <strong>D3.js</strong> per a les visualitzacions de dades.
        </p>
      </div>

      <div class="about-card">
        <h2>Per què és urgent?</h2>
        <p>
          L'Acord de París estableix el límit d'1.5°C d'escalfament global. Estudis
          recents indiquen que ja hem superat els 1.1°C i que alguns punts d'inflexió
          podrien activar-se molt abans del previst. Cada dècima de grau importa.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.about-header {
  margin-bottom: 3rem;
  text-align: center;
}

.about-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.highlight { color: #10b981; }

.subtitle {
  color: #9ca3af;
  font-size: 1.1rem;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.about-card {
  background: #1f2937;
  border: 1px solid #374151;
  border-radius: 10px;
  padding: 1.5rem;
}

.about-card h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #e5e7eb;
}

.about-card p {
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.7;
}

.about-card strong {
  color: #d1d5db;
}
</style>