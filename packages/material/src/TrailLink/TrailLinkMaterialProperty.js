import { Property, Event as CEvent, Material, Color } from 'cesium'
import setPropertyWithEvent from '../_utils/setPropertyWithEvent'
import { defined, defaultValue } from '@cesium-devkit/shared'

/**
 * @typedef {{
 *   color?: Color,
 *   animationSpeed?: number,
 *   image: string
 * }} TrailLinkMaterialPropertyOptions
 */

export default class TrailLinkMaterialProperty {
  /**
   *
   * @param {TrailLinkMaterialPropertyOptions} options
   */
  constructor(options) {
    const { color, animationSpeed, image } = options

    this._definitionChanged = new CEvent()

    this.image = image
    this.color = color
    this.animationSpeed = animationSpeed
  }

  get isConstant() {
    return Property.isConstant(this._color) && Property.isConstant(this._image)
  }

  get definitionChanged() {
    return this._definitionChanged
  }

  get color() {
    return this._color
  }

  set color(value) {
    setPropertyWithEvent(this, 'color', value)
  }

  get image() {
    return this._image
  }

  set image(value) {
    setPropertyWithEvent(this, 'image', value)
  }

  get animationSpeed() {
    return this._animationSpeed
  }

  set animationSpeed(value) {
    setPropertyWithEvent(this, 'animationSpeed', value)
  }

  getType() {
    return Material.TrailLinkType
  }

  getValue(time, result) {
    if (!defined(result)) result = {}

    result.animationSpeed = defaultValue(this._animationSpeed, 0.005)
    result.image = Property.getValueOrUndefined(this._image, time)
    result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color)

    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof TrailLinkMaterialProperty &&
        Property.equals(this._color, other._color) &&
        Property.equals(this._image, other._image) &&
        Property.equals(this._animationSpeed, other._animationSpeed))
    )
  }
}
