<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <img alt="Vue logo" src="@/assets/earth.svg" width="60" height="60" />
    <span class="title">Punts d'Inflexió</span>
    <nav>
      <RouterLink :to="{ name: 'home' }">Casa</RouterLink>
      <RouterLink :to="{ name: 'about' }">Sobre</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}
.title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
  flex: 1;
}
nav a {
  margin-left: 1rem;
  color: var(--color-text);
  text-decoration: none;
}
nav a.router-link-exact-active {
  color: #10b981;
}
</style>