<script setup>
import { ref, computed } from 'vue'
import features, { selectedFeature } from './features'

const props = defineProps(['search'])
const filteredFeatures = computed(() => {
  if (!props.search) return features

  return features.filter((feature) => {
    return feature.title.toLowerCase().includes(props.search.toLowerCase())
  })
})

const selectedFeatureTitle = ref(null)
const selectFeature = (feature) => {
  if (selectedFeatureTitle.value === feature.title) {
    selectedFeatureTitle.value = null
    selectedFeature.value = null
    return
  }
  selectedFeature.value = feature
  selectedFeatureTitle.value = feature.title
}
</script>

<template>
  <aside class="sidebar-wrapper">
    <div class="siderbar">
      <h2 class="sidebar-title">Features</h2>
      <ul class="feature-list">
        <li
          v-for="(feature, index) in filteredFeatures"
          :key="index"
          class="feature-item"
          :class="{ 'is-active': feature.title === selectedFeatureTitle }"
          @click="selectFeature(feature)"
        >
          {{ feature.title }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-wrapper {
  width: 20%;
  padding: 1rem;
  border-right: 1px solid var(--border-color);
  height: 100%;
}

.siderbar {
  height: 100%;
  overflow-y: auto;
}

.sidebar-title {
  margin-bottom: 1rem;
  color: var(--highlight-color);
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-item {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
}

.feature-item:hover {
  background-color: var(--hover-color);
}

.feature-item.is-active {
  background-color: var(--highlight-color);
  color: var(--background-color);
}
</style>
