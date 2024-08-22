import './index.css'

import { defineComponent, onBeforeUnmount, onMounted, render, h, ref, Teleport } from 'vue'
import { Cartesian2, Cartesian3, Color, HorizontalOrigin, VerticalOrigin } from 'cesium'
import { centerDegrees } from '@/source'

import useViewerStore from '@/store/viewerStore'
import { CustomWindow } from '@core'

export const TITLE = '自定义弹窗'

const ElementContent = defineComponent({
  render() {
    return (
      <article class="preset-card">
        <h3>{TITLE}</h3>
        <p style="margin: 1rem 0">
          这是一个<u>自定义弹窗</u>，可以在地图上显示<u>任意内容</u>。
        </p>

        <ins>
          <p>null</p>
        </ins>
        <ins>
          <p>string</p>
        </ins>
        <ins>
          <p>number</p>
        </ins>
        <ins>
          <p>Element</p>
        </ins>
      </article>
    )
  }
})

export default defineComponent({
  name: 'CustomWindow',
  setup() {
    const viewer = useViewerStore().viewer
    const position = Cartesian3.fromDegrees(...centerDegrees)

    const show = ref(true)
    const handleUpdateShow = (value) => {
      show.value = value
      customWindow.show = value
    }

    const customWindow = new CustomWindow({
      show: show.value,
      position,
      viewer,
      pixelOffset: new Cartesian2(0, -50),
      verticalOrigin: VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER
    })

    viewer.entities.add({
      position,
      ellipse: {
        semiMinorAxis: 10.0,
        semiMajorAxis: 10.0,
        material: Color.RED
      }
    })

    onBeforeUnmount(() => {
      customWindow.destroy()
      viewer.entities.removeAll()
    })

    onMounted(() => {
      const div = document.createElement('div')
      render(h(ElementContent), div)
      customWindow.setContent(div)

      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(...centerDegrees, 1000)
      })
    })

    return {
      show,
      handleUpdateShow
    }
  },
  render() {
    return (
      <Teleport to="#CBR">
        <div className="CustomWindow">
          <label>显示：</label>
          <input
            checked={this.show}
            onChange={(e) => this.handleUpdateShow(e.target.checked)}
            type="checkbox"
          />
        </div>
      </Teleport>
    )
  }
})
