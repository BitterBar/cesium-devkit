import {
  Cartesian3,
  BoundingSphere,
  SceneTransforms,
  type Viewer,
  Cartesian2,
  VerticalOrigin,
  HorizontalOrigin
} from 'cesium'
import computeBoundingSphereVisibility from '../_utils/computeBoundingSphereVisibility'
import { defined, defaultValue } from '@cesium-devkit/shared'

export interface CustomWindowOptions {
  show?: boolean
  position: Cartesian3
  viewer?: Viewer
  pixelOffset?: Cartesian2
  verticalOrigin?: VerticalOrigin
  horizontalOrigin?: HorizontalOrigin
}

/**
 * @description 自定义弹窗
 */
export default class CustomWindow {
  _boundingSphere: BoundingSphere
  _position: Cartesian3
  _element = createWindowElement()
  _registered = false
  _viewer: Viewer | null = null
  _wc: Cartesian2 | null = null
  _show = true

  verticalOrigin: VerticalOrigin = VerticalOrigin.CENTER
  horizontalOrigin: HorizontalOrigin = HorizontalOrigin.CENTER
  pixelOffset: Cartesian2 | null = null

  set position(v: Cartesian3) {
    this._position = v
    this._boundingSphere = BoundingSphere.fromPoints([v])
  }
  get position(): Cartesian3 {
    return this._position
  }

  set show(v: boolean) {
    this._show = v
    this._element.style.visibility = v ? 'visible' : 'hidden'
  }
  get show(): boolean {
    return this._show
  }

  set viewer(v: Viewer) {
    this._viewer = v
    ;(v.container as HTMLElement).style.overflow = 'hidden'
    this.destroy()
    this._register()
  }

  get viewer(): Viewer | null {
    return this._viewer
  }

  constructor(options: CustomWindowOptions) {
    if (!defined(options.position)) {
      throw new Error('position is required')
    }

    this.show = defaultValue(options.show, true)
    this._position = defaultValue(options.position, Cartesian3.ZERO)
    this._boundingSphere = BoundingSphere.fromPoints([options.position])

    if (defined(options.viewer)) this.viewer = options.viewer
    if (defined(options.pixelOffset)) this.pixelOffset = options.pixelOffset
    if (defined(options.verticalOrigin)) this.verticalOrigin = options.verticalOrigin
    if (defined(options.horizontalOrigin)) this.horizontalOrigin = options.horizontalOrigin
  }

  setContent(content: string | number | null | Element) {
    if (content === null) return (this._element.innerHTML = '')
    if (!(content instanceof Element)) return (this._element.innerHTML = String(content))
    this._element.appendChild(content)
  }

  update() {
    if (!this._show || !this.viewer) return
    if (!this._boundingSphere) return

    const {
      viewer: { camera, scene },
      pixelOffset,
      _position,
      _boundingSphere,
      _element,
      _wc
    } = this

    const visibility = computeBoundingSphereVisibility(camera, _boundingSphere)
    if (!visibility) return (_element.style.visibility = 'hidden')
    else _element.style.visibility = 'visible'

    const wc = SceneTransforms.worldToWindowCoordinates(scene, _position)
    if (!wc) {
      return (_element.style.visibility = 'hidden')
    }

    if (defined(pixelOffset)) {
      Cartesian2.add(wc, pixelOffset, wc)
    }

    if (_wc && _wc.equals(wc)) return
    this._wc = wc

    // 根据垂直和水平对齐方式调整位置
    const { verticalOrigin, horizontalOrigin } = this
    const { width, height } = _element.getBoundingClientRect()
    let top = wc.y
    let left = wc.x

    switch (verticalOrigin) {
      case VerticalOrigin.TOP:
        break
      case VerticalOrigin.CENTER:
        top -= height / 2
        break
      case VerticalOrigin.BOTTOM:
        top -= height
        break
    }

    switch (horizontalOrigin) {
      case HorizontalOrigin.LEFT:
        break
      case HorizontalOrigin.CENTER:
        left -= width / 2
        break
      case HorizontalOrigin.RIGHT:
        left -= width
        break
    }

    _element.style.transform = `translate(${left}px, ${top}px)`
  }

  _register() {
    if (this._registered) return

    if (!this._viewer) {
      throw new Error('viewer is required')
    }

    this._viewer.container.appendChild(this._element)
    this._viewer.scene.preRender.addEventListener(this.update, this)
    this._registered = true
  }

  destroy() {
    if (!this._registered || !this._viewer) return

    this._viewer.scene.preRender.removeEventListener(this.update, this)
    this._viewer.container.removeChild(this._element)
    this._registered = false
  }
}

function createWindowElement() {
  const div = document.createElement('div')
  // @ts-ignore
  div.style = `position: absolute; top: 0; left: 0;`
  return div
}
