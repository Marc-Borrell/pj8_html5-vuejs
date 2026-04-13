<template>
  <div class="not-found">
    <div class="content">
      <span class="code">404</span>
      <h1>Pàgina no trobada</h1>
      <p>
        Com els punts d'inflexió, alguns llocs no tenen retorn.<br>
        Aquesta pàgina no existeix.
      </p>
      <RouterLink :to="{ name: 'home' }" class="btn">
        Torna a l'inici
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.code {
  font-size: 6rem;
  font-weight: 700;
  color: #10b981;
  opacity: 0.3;
  line-height: 1;
}

h1 {
  font-size: 1.75rem;
  color: #e5e7eb;
}

p {
  color: #6b7280;
  line-height: 1.7;
}

.btn {
  margin-top: 1rem;
  background: #10b981;
  color: #000;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn:hover { opacity: 0.85; }
</style>