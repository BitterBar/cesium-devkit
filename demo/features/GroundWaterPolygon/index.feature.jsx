import { defineComponent, onBeforeUnmount } from 'vue'
import {
  Appearance,
  buildModuleUrl,
  Cartesian3,
  Color,
  ColorGeometryInstanceAttribute,
  GeometryInstance,
  GroundPrimitive,
  Material,
  PolygonGeometry,
  PolygonHierarchy
} from 'cesium'

import useViewerStore from '@demo/store/viewerStore'
import bezier from '@demo/utils/bezier'

export const TITLE = 'GroundWaterPolygon'

export default defineComponent({
  name: 'GroundWaterPolygon',
  setup() {
    const viewer = useViewerStore().viewer

    const P0 = [120.87, 30.032] // 以中心点附近的西边为起点
    const P1 = [120.873, 30.0325] // 以中心点正北为控制点
    const P2 = [120.873, 30.03] // 以中心点附近的东边为终点
    const curveDegreesArr = []
    for (let t = 0; t <= 1; t += 0.01) {
      curveDegreesArr.push(bezier(t, P0, P1, P2))
    }

    // 添加一个贴地多边形（水材质）
    const primitive = new GroundPrimitive({
      geometryInstances: new GeometryInstance({
        geometry: new PolygonGeometry({
          polygonHierarchy: new PolygonHierarchy(
            Cartesian3.fromDegreesArray(curveDegreesArr.flat(2))
          )
        }),
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(Color.WHITE)
        }
      }),
      appearance: new Appearance({
        material: new Material({
          fabric: {
            type: 'Water',
            uniforms: {
              normalMap: buildModuleUrl('Assets/Textures/waterNormals.jpg'),
              frequency: 100.0,
              animationSpeed: 0.01,
              amplitude: 10.0,
              specularIntensity: 5.0,
              baseWaterColor: new Color(0.0, 0.3, 0.6, 0.65)
            }
          }
        }),
        translucent: true
      }),
      vertexCacheOptimize: true
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
