import { Color, Property, Event as CEvent, Material, type JulianDate } from 'cesium'
import setPropertyWithEvent from '../_utils/setPropertyWithEvent'
import defaultValue from '../_utils/defaultValue'
import defined from '../_utils/defined'

const defaultColor = Color.WHITE
const defaultAnimationSpeed = 0.005

export interface TrailLinkMaterialPropertyOptions {
  color?: Color
  animationSpeed?: number
  image: string
}

export default class TrailLinkMaterialProperty {
  _image?: string
  _animationSpeed?: number
  _color?: Color
  _definitionChanged: CEvent

  constructor(options: TrailLinkMaterialPropertyOptions) {
    const { color, animationSpeed, image } = options

    this._definitionChanged = new CEvent()

    this.image = image
    this.color = color
    this.animationSpeed = animationSpeed
  }

  get isConstant() {
    // @ts-ignore
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
    return 'PolylineTrailLink'
  }

  getValue(time: JulianDate, result: any) {
    if (!defined(result)) result = {}

    result.animationSpeed = defaultValue(this._animationSpeed, defaultAnimationSpeed)
    // @ts-ignore
    result.image = Property.getValueOrUndefined(this._image, time)
    // @ts-ignore
    result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color)

    return result
  }

  equals(other: TrailLinkMaterialProperty) {
    return (
      this === other ||
      (other instanceof TrailLinkMaterialProperty &&
        // @ts-ignore
        Property.equals(this._color, other._color) &&
        // @ts-ignore
        Property.equals(this._image, other._image) &&
        // @ts-ignore
        Property.equals(this._animationSpeed, other._animationSpeed))
    )
  }
}

// @ts-ignore
Material.PolylineTrailLinkType = 'PolylineTrailLink'
// @ts-ignore
Material.PolylineTrailLinkImage = '/assets/images/flyline.png' // TODO 临时使用,需要完善静态资源路径解析逻辑
// @ts-ignore
Material.PolylineTrailLinkSource = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;

  float time = czm_frameNumber * animationSpeed;
  vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));

  material.alpha = colorImage.a * color.a;
  material.diffuse = (colorImage.rgb + color.rgb) / 2.0;
  return material;
}`

// @ts-ignore
Material._materialCache.addMaterial(Material.PolylineTrailLinkType, {
  fabric: {
    // @ts-ignore
    type: Material.PolylineTrailLinkType,
    uniforms: {
      color: new Color(1.0, 0.0, 0.0, 0.5),
      // @ts-ignore
      image: Material.PolylineTrailLinkImage,
      animationSpeed: defaultAnimationSpeed
    },
    // @ts-ignore
    source: Material.PolylineTrailLinkSource
  },
  translucent: () => {
    return true
  }
})
