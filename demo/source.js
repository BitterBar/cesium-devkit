import {
  Cartesian3,
  Math as CMath,
  createWorldTerrainAsync,
  EllipsoidTerrainProvider
} from 'cesium'

// 中心经纬度
export const centerDegrees = [120.8715, 30.031]

/**
 * @description 视角飞到中心点
 * @param {import('cesium').Viewer} viewer
 */
export function flyHome(viewer) {
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(centerDegrees[0], centerDegrees[1] - 0.005, 500),
    orientation: {
      heading: CMath.toRadians(0),
      pitch: CMath.toRadians(-45),
      roll: 0
    },
    duration: 0
  })
}

/**
 * @description 设置地形
 * @param {import('cesium').Viewer} viewer
 */
export async function toggleTerrain(viewer) {
  if (!(viewer.terrainProvider instanceof EllipsoidTerrainProvider)) {
    return (viewer.terrainProvider = new EllipsoidTerrainProvider())
  }
  viewer.terrainProvider = await terrain
}
const terrain = createWorldTerrainAsync({
  requestWaterMask: false,
  requestVertexNormals: false
})
