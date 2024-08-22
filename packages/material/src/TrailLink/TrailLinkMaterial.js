import { Color, Material } from 'cesium'
import { TrailLinkMaterialShader } from '@cesium-devkit/shader'

Material.TrailLinkType = 'TrailLink'
Material._materialCache.addMaterial(Material.TrailLinkType, {
  fabric: {
    type: Material.TrailLinkType,
    uniforms: {
      color: Color.WHITE,
      image: '',
      animationSpeed: 0.005
    },
    source: TrailLinkMaterialShader
  },
  translucent: () => true
})
