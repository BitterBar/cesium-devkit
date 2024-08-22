import { defineComponent, onBeforeUnmount } from 'vue'
import {
  Cartesian3,
  Color,
  GeometryInstance,
  Material,
  MaterialAppearance,
  Primitive,
  WallGeometry
} from 'cesium'

import useViewerStore from '@demo/store/viewerStore'
import spriteline from '@demo/assets/images/spriteline.png'

export const TITLE = 'SurroundingWall'

export default defineComponent({
  name: 'SurroundingWall',
  setup() {
    const viewer = useViewerStore().viewer

    const wallDegressArr = [
      [120.867826, 30.033522],
      [120.873986, 30.034511],
      [120.874279, 30.029005],
      [120.86935, 30.028495],
      [120.867826, 30.033522]
    ]

    // 添加墙体到场景
    const primitive = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: new WallGeometry({
          positions: Cartesian3.fromDegreesArray(wallDegressArr.flat(2)),
          maximumHeights: Array(wallDegressArr.length).fill(100),
          minimumHeights: Array(wallDegressArr.length).fill(0)
        })
      }),
      appearance: new MaterialAppearance({
        translucent: true,
        closed: true,
        material: new Material({
          fabric: {
            type: Material.TrailLinkType,
            uniforms: {
              color: Color.DARKTURQUOISE,
              image: spriteline,
              animationSpeed: 0.008
            }
          }
        })
      })
    })
    viewer.scene.primitives.add(primitive)
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(120.8715, 30.0315, 1000)
    })

    onBeforeUnmount(() => {
      viewer.scene.primitives.remove(primitive)
    })
  },
  render() {
    return <div></div>
  }
})
