import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const base = '/preview'
const __DEV__ = process.env.NODE_ENV !== 'production'

export default defineConfig({
  base,
  plugins: [vue(), vueJsx()],
  define: {
    __DEV__,
    __TDT_SUBDOMAINS__: ['0', '1', '2', '3', '4', '5', '6', '7'],
    __TDT_KEY__: JSON.stringify('4774ca01d665a06c9e494ca5f29dba10'),
    __CESIUM_BASE_URL__: JSON.stringify(
      __DEV__ ? path.join(base, 'node_modules/cesium/Build/Cesium') : path.join(base, 'Cesium')
    )
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./packages/core/src', import.meta.url)),
      '@material': fileURLToPath(new URL('./packages/material/src', import.meta.url))
    }
  }
})
