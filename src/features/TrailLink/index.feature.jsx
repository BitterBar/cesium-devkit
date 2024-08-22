import { defineComponent, onBeforeUnmount } from 'vue'
import { Cartesian3, Color } from 'cesium'

import { TrailLinkMaterialProperty } from '@material'
import resolvePublic from '@/utils/resolvePublic'
import useViewerStore from '@/store/viewerStore'
import bezier from '@/utils/bezier'

export const TITLE = 'TrailLink'

export default defineComponent({
  name: 'TrailLink',
  setup() {
    const viewer = useViewerStore().viewer

    const P0 = [120.87, 30.032] // 以中心点附近的西边为起点
    const P1 = [120.873, 30.0325] // 以中心点正北为控制点
    const P2 = [120.873, 30.03] // 以中心点附近的东边为终点
    const curveDegreesArr = []
    for (let t = 0; t <= 1; t += 0.01) {
      curveDegreesArr.push(bezier(t, P0, P1, P2))
    }

    // 添加带有流动效果的线
    const polyline = viewer.entities.add({
      polyline: {
        positions: Cartesian3.fromDegreesArray(curveDegreesArr.flat(2)),
        width: 33,
        clampToGround: true,
        material: new TrailLinkMaterialProperty({
          image: resolvePublic('assets/images/flyline.png'),
          color: Color.ORANGERED
        })
      }
    })

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(120.8715, 30.0315, 1000)
    })

    onBeforeUnmount(() => {
      viewer.entities.remove(polyline)
    })
  },
  render() {
    return <div></div>
  }
})
