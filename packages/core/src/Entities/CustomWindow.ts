import { Cartesian3, BoundingSphere, SceneTransforms, type Viewer, type Cartesian2 } from 'cesium'
import computeBoundingSphereVisibility from '../_utils/computeBoundingSphereVisibility'
import { defined, defaultValue } from '@cesium-devkit/shared'

export interface CustomWindowOptions {
  show?: boolean
  position: Cartesian3
  viewer: Viewer
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
      position,
      _boundingSphere,
      _element,
      _wc
    } = this

    const visibility = computeBoundingSphereVisibility(camera, _boundingSphere)
    if (!visibility) return (_element.style.visibility = 'hidden')
    else _element.style.visibility = 'visible'

    const wc = SceneTransforms.worldToWindowCoordinates(scene, position)
    if (!wc) {
      return (_element.style.visibility = 'hidden')
    }

    if (_wc && _wc.equals(wc)) return
    this._wc = wc

    const { width, height } = _element.getBoundingClientRect()
    _element.style.transform = `translate(${wc.x - width / 2}px, ${wc.y - height}px)`
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
