import { Cesium3DTileset } from 'cesium'

/**
 * @description 创建 Cesium 3D Tileset
 * @param {string} url
 * @param {import('cesium').Cesium3DTileset.ConstructorOptions} options
 * @returns {Promise<import('cesium').Cesium3DTileset>}
 */
export default async function createCesium3DTileset(url, options = {}) {
  return Cesium3DTileset.fromUrl(
    url,
    Object.assign(
      {
        enableCollision: true,
        maximumScreenSpaceError: 16,
        skipLevelOfDetail: true,
        baseScreenSpaceError: 1024,
        skipScreenSpaceErrorFactor: 16,
        skipLevels: 1,
        immediatelyLoadDesiredLevelOfDetail: true,
        loadSiblings: true,
        cullWithChildrenBounds: true
      },
      options
    )
  )
}
