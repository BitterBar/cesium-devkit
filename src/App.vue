<script setup>
import { ref } from 'vue'

import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import AppMain from './AppMain.vue'
import AppFooter from './AppFooter.vue'
import AuthCode from './AuthCode.vue'

window.CESIUM_BASE_URL = __CESIUM_BASE_URL__

const search = ref('')
const isAuth = window.sessionStorage.getItem('auth')
</script>

<template>
  <div v-if="isAuth" class="cesium-preview">
    <AppHeader v-model:search="search" />
    <main class="main">
      <AppSidebar :search />
      <AppMain />
    </main>
    <AppFooter />
  </div>
  <AuthCode v-else />
</template>

<style scoped>
.cesium-preview {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--background-color);
  color: var(--foreground-color);
}

.main {
  height: calc(100vh - 2.82rem - 1.977rem); /* Adjust for header height and footer height */
  display: flex;
}
</style>
