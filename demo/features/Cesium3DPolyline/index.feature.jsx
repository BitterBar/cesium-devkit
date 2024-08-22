import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import {
  BoundingSphere,
  Cartesian2,
  Cartesian3,
  Math as CMath,
  Color,
  DistanceDisplayConditionGeometryInstanceAttribute,
  GeometryInstance,
  Intersect,
  Material,
  MaterialAppearance,
  PolylineVolumeGeometry,
  Primitive,
  VertexFormat
} from 'cesium'

import useViewerStore from '@demo/store/viewerStore'

export const TITLE = 'Cesium3DPolyline'

export default defineComponent({
  name: 'Cesium3DPolyline',
  setup() {
    const viewer = useViewerStore().viewer

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(120.1612674, 30.2786256, 1000)
    })

    // 创建3D管道，路径是 positions
    let gemetries = []
    function main() {
      function computeHollowCircle(radius, thickness) {
        const positions = []
        const step = 45
        for (let i = 0; i < 360; i += step) {
          const radians = CMath.toRadians(i)
          positions.push(new Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)))
        }

        for (let i = 360; i > 0; i -= step) {
          const radians = CMath.toRadians(i)
          positions.push(
            new Cartesian2(
              (radius - thickness) * Math.cos(radians),
              (radius - thickness) * Math.sin(radians)
            )
          )
        }

        return positions
      }

      function createPolylineVolumeGeometry(positions) {
        return new PolylineVolumeGeometry({
          vertexFormat: VertexFormat.POSITION_AND_NORMAL,
          polylinePositions: Cartesian3.fromDegreesArray(positions.flat(Infinity)),
          shapePositions: computeHollowCircle(10.0, 0.01)
        })
      }

      import('@demo/assets/jsons/hangzhou_road.json').then((res) => {
        res.features.slice(0, 4000).forEach((e) => {
          gemetries.push(
            new GeometryInstance({
              geometry: createPolylineVolumeGeometry(e.geometry.coordinates),
              attributes: {
                distanceDisplayCondition: new DistanceDisplayConditionGeometryInstanceAttribute(
                  500.0,
                  10000.0
                )
              }
            })
          )
        })
        func()
      })
    }

    const material = Material.fromType('Color', {
      color: Color.fromAlpha(Color.RED, 1)
    })

    const materialAppearance = new MaterialAppearance({
      translucent: true,
      material,
      vertexFormat: VertexFormat.POSITION_AND_NORMAL
    })

    // 计算几何体的包围球
    function computeBoundingSphere(geometry) {
      const positions = geometry._positions
      return BoundingSphere.fromPoints(positions)
    }

    const func = () => {
      if (!gemetries.length) return
      const camera = viewer.camera
      const frustum = camera.frustum
      const cullingVolume = frustum.computeCullingVolume(
        camera.position,
        camera.direction,
        camera.up
      )

      // 过滤几何体实例，只保留在视口内的几何体
      const visibleGeometries = gemetries.filter((instance) => {
        const boundingSphere = computeBoundingSphere(instance.geometry)
        return cullingVolume.computeVisibility(boundingSphere) !== Intersect.OUTSIDE
      })

      viewer.scene.primitives.removeAll()

      const primitive = new Primitive({
        interleave: true,
        releaseGeometryInstances: true,
        allowPicking: false,
        geometryInstances: visibleGeometries,
        asynchronous: true,
        appearance: materialAppearance
      })

      viewer.scene.primitives.add(primitive)
    }

    viewer.camera.moveEnd.addEventListener(func)

    onMounted(main)
    onBeforeUnmount(() => {
      gemetries = []
      viewer.camera.moveEnd.removeEventListener(func)
      viewer.scene.primitives.removeAll()
    })
  },
  render() {
    return <div></div>
  }
})
