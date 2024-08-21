import { ConstantProperty } from 'cesium'
import defined from '../_utils/defined'

const createPriviteName = (name: string) => `_${name}`
const createSubcriptionName = (name: string) => `_${name}Subscription`

export default function setPropertyWithEvent(materialProperty: any, name: string, value: any) {
  const priviteName = createPriviteName(name)
  const subcriptionName = createSubcriptionName(name)

  const oldValue = materialProperty[priviteName]
  const subscription = materialProperty[subcriptionName]
  if (defined(subscription)) {
    subscription()
    materialProperty[subcriptionName] = undefined
  }

  const hasValue = value !== undefined
  if (hasValue && (!defined(value) || !defined(value.getValue))) {
    value = new ConstantProperty(value)
  }

  if (oldValue !== value) {
    materialProperty[priviteName] = value
    materialProperty._definitionChanged.raiseEvent(materialProperty, 'image', value, oldValue)
  }

  if (defined(value) && defined(value.definitionChanged)) {
    materialProperty[subcriptionName] = value.definitionChanged.addEventListener(function () {
      // @ts-ignore
      this._definitionChanged.raiseEvent(this, 'image', value, value)
    }, materialProperty)
  }
}
