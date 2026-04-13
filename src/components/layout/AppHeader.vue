<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="top-nav">
    <RouterLink :to="{ name: 'home' }">Inici</RouterLink>
    <RouterLink :to="{ name: 'tipping-points' }">Punts d'Inflexió</RouterLink>
    <RouterLink :to="{ name: 'data' }">Dades</RouterLink>
  </nav>
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  background: #0d1117;
  border-bottom: 1px solid #1f2937;
  width: 100%;
  padding: 0 2rem;
}

.top-nav a {
  padding: 0.75rem 1.25rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.top-nav a:hover {
  color: #e5e7eb;
}

.top-nav a.router-link-active {
  color: #10b981;
  border-bottom-color: #10b981;
}
</style>