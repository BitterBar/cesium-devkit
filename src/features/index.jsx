import { shallowRef } from 'vue'
import '@material'

export const selectedFeature = shallowRef(null)
const modules = import.meta.glob('./**/*.feature.jsx', { eager: true })

const features = []
for (const path in modules) {
  const { TITLE, default: component } = modules[path]
  features.push({ title: TITLE, component })
}
features.sort((a, b) => a.title.localeCompare(b.title))

export default features
