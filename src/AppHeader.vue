<script setup>
import { ref, onBeforeUnmount } from 'vue'

const search = defineModel('search')
const searchDom = ref(null)

const handleFocus = (e) => e.key === '/' && searchDom.value?.focus()
document.addEventListener('keyup', handleFocus)
onBeforeUnmount(() => document.removeEventListener('keyup', handleFocus))
</script>

<template>
  <header class="header">
    <input ref="searchDom" v-model="search" type="text" placeholder="/" class="search-bar" />
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem 1.3rem 0.2rem;
  border-bottom: 1px solid var(--border-color);
}

.search-bar {
  width: 30%;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid var(--border-color);
  color: var(--button-foreground-color);
  background-color: var(--button-background-color);
  border-radius: 4px;
}
</style>
