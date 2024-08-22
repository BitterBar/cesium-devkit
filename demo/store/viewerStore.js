import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

const useViewerStore = defineStore('viewer', () => {
  /** @type {import("vue").ShallowRef<import('cesium').Viewer | null>} */
  const viewer = shallowRef(null)

  return {
    viewer
  }
})

export default useViewerStore
