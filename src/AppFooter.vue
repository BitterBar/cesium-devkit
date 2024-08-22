<script setup>
import useViewerStore from '@/store/viewerStore'
import { flyHome, toggleTerrain } from '@/source'
import { toRefs } from 'vue'

const { viewer } = toRefs(useViewerStore())
</script>

<template>
  <footer class="control-bar">
    <div class="control-bar__flex" id="CBL"></div>
    <div class="control-bar__flex" id="CBR">
      <button v-if="viewer" class="control-bar__button" @click="flyHome(viewer)">🏠</button>
      <button v-if="viewer" class="control-bar__button" @click="toggleTerrain(viewer)">地形</button>
    </div>
  </footer>
</template>

<style scoped>
.control-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 1.3rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--foreground-color);
}

.control-bar button {
  color: inherit;
  font-size: inherit;
}

.control-bar__flex {
  display: flex;
  align-items: center;
  flex-flow: row-reverse;
  gap: 0.5rem;
}
</style>
