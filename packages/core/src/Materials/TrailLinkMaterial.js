import { Color, Material } from 'cesium'
import TrailLinkMaterial from '../Shaders/TrailLinkMaterial.glsl?raw'

export const DEFAULT_COLOR = Color.WHITE
export const DEFAULT_ANIMATION_SPEED = 0.005

Material.TrailLinkType = 'TrailLink'
Material._materialCache.addMaterial(Material.TrailLinkType, {
  fabric: {
    type: Material.TrailLinkType,
    uniforms: {
      color: DEFAULT_COLOR,
      image: '',
      animationSpeed: DEFAULT_ANIMATION_SPEED
    },
    source: TrailLinkMaterial
  },
  translucent: () => true
})
