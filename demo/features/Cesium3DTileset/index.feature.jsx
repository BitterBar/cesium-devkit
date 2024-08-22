import './index.css'

import { defineComponent, onBeforeUnmount, reactive, Teleport } from 'vue'
import createCesium3DTileset from '@demo/utils/createCesium3DTileset'
import useViewerStore from '@demo/store/viewerStore'
import { Cartesian3, Cartographic, Matrix4 } from 'cesium'

export const TITLE = 'Cesium3DTileset'

export default defineComponent({
  name: 'Cesium3DTileset',
  async setup() {
    const viewer = useViewerStore().viewer
    let tileset = null

    const state = reactive({
      height: 0,
      maximumScreenSpaceError: 0
    })

    function handleUpdateHeight(height) {
      height = Number(height)
      state.height = height
      if (!tileset) return
      const cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center)
      const surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0)
      const offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height)
      const translation = Cartesian3.subtract(offset, surface, new Cartesian3())
      tileset.modelMatrix = Matrix4.fromTranslation(translation)
    }

    function handleUpdateSSError(ssError) {
      ssError = Number(ssError)
      state.maximumScreenSpaceError = ssError
      if (!tileset) return
      tileset.maximumScreenSpaceError = ssError
    }

    onBeforeUnmount(() => {
      if (!tileset) return
      viewer.scene.primitives.remove(tileset)
    })

    tileset = await createCesium3DTileset('http://39.184.194.199:8284/3dtiles.json', {
      maximumScreenSpaceError: 16
    })
    viewer.scene.primitives.add(tileset)
    state.maximumScreenSpaceError = tileset.maximumScreenSpaceError
    state.height = tileset.getHeight(viewer.scene.camera.positionCartographic, viewer.scene) || 0
    await viewer.zoomTo(tileset)

    return {
      state,
      handleUpdateHeight,
      handleUpdateSSError
    }
  },
  render() {
    return (
      <Teleport to="#CBR">
        <div className="Cesium3DTileset">
          <ul>
            <li>
              <label>高度：</label>
              <input
                value={this.state.height}
                onChange={(e) => this.handleUpdateHeight(e.target.value)}
                type="range"
                min={0}
                max={200}
              />
            </li>
            <li>
              <label>清晰度：</label>
              <input
                value={this.state.maximumScreenSpaceError}
                onChange={(e) => this.handleUpdateSSError(e.target.value)}
                type="range"
                min={1}
                max={16}
              />
            </li>
          </ul>
        </div>
      </Teleport>
    )
  }
})
