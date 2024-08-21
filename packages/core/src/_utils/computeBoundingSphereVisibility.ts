import { Intersect, type Camera, type BoundingSphere } from 'cesium'

/**
 * @description 计算包围球可见性
 */
export default function computeBoundingSphereVisibility(
  camera: Camera,
  boundingSphere: BoundingSphere
): boolean {
  const cullingVolume = camera.frustum.computeCullingVolume(
    camera.position,
    camera.direction,
    camera.up
  )
  return cullingVolume.computeVisibility(boundingSphere) !== Intersect.OUTSIDE
}
