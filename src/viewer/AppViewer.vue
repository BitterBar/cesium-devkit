<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { flyHome } from '@/source'
import { selectedFeature } from '@/features'
import { Viewer, PostProcessStage } from 'cesium'
import useViewerStore from '@/store/viewerStore'

const viewerStore = useViewerStore()
const container = ref(null)

onMounted(main)
onBeforeUnmount(() => {
  viewerStore.viewer?.destroy()
  viewerStore.viewer = null
})

async function main() {
  const viewer = (viewerStore.viewer = new Viewer(container.value, {
    infoBox: false,
    timeline: false,
    animation: false,
    baseLayerPicker: false,
    homeButton: false,
    geocoder: false,
    fullscreenButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    shadows: false,
    targetFrameRate: 60
  }))

  {
    // 显示帧率
    viewer.scene.debugShowFramesPerSecond = true
    // 设置Camera的最大视角高度
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = __DEV__ ? undefined : 2000
    // 禁用惯性
    const CesiumViewerSceneController = viewer.scene.screenSpaceCameraController
    CesiumViewerSceneController.inertiaSpin = 0
    CesiumViewerSceneController.inertiaTranslate = 0
    CesiumViewerSceneController.inertiaZoom = 0
  }

  {
    const postProcessStage = new PostProcessStage({
      fragmentShader: `
          uniform sampler2D colorTexture;
          in vec2 v_textureCoordinates;
          out vec4 fragColor;
          
          void main(void) {
            vec4 color = texture(colorTexture, v_textureCoordinates);
            // 调整颜色和亮度以模拟初晴效果
            color.rgb = pow(color.rgb, vec3(1.1)); // 轻微Gamma校正
            color.rgb *= vec3(0.9, 1.0, 1.1); // 调整整体颜色，增加蓝色和绿色分量
            
            // 增加亮度
            color.rgb *= 1.1;
            
            // 增加饱和度
            float avg = (color.r + color.g + color.b) / 3.0;
            color.rgb = mix(vec3(avg), color.rgb, 1.3);
            
            fragColor = color;
          }
        `
    })

    viewer.scene.postProcessStages.add(postProcessStage)
  }

  {
    // 添加径向阴影的后处理效果
    const postProcessStage = new PostProcessStage({
      fragmentShader: `
          uniform sampler2D colorTexture;
          uniform sampler2D depthTexture;
          in vec2 v_textureCoordinates;
          out vec4 fragColor;

          void main(void) {
            vec4 color = texture(colorTexture, v_textureCoordinates);
            vec4 depth = texture(depthTexture, v_textureCoordinates);
            
            // 计算径向阴影
            vec2 center = vec2(0.5, 0.5);
            float distance = distance(v_textureCoordinates, center);
            float shadow = smoothstep(0.3, 0.7, distance);
            color.rgb *= 1.0 - shadow * 0.5; // 调整阴影强度
            
            fragColor = color;
          }
        `
    })

    viewer.scene.postProcessStages.add(postProcessStage)
  }

  flyHome(viewer)
}
</script>

<template>
  <div ref="container" id="cesium">
    <Suspense :timeout="300">
      <component v-if="selectedFeature" :is="selectedFeature.component" />
      <template #fallback>
        <div class="cesium-loading">Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
#cesium {
  position: relative;
  width: 100%;
  height: 100%;
}

.cesium-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  z-index: 9999;
  border-radius: 0.5rem;
  padding: 1rem;
  filter: drop-shadow(0 0 0.5rem var(--background-color));
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
