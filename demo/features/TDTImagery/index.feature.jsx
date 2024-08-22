import { ImageryLayer, WebMapTileServiceImageryProvider } from 'cesium'
import { defineComponent, onBeforeUnmount } from 'vue'
import useViewerStore from '@demo/store/viewerStore'

export const TITLE = '天地图卫星影像'

export default defineComponent({
  name: 'TDTImagery',
  setup() {
    const viewer = useViewerStore().viewer

    const imagery = new ImageryLayer(
      new WebMapTileServiceImageryProvider({
        url:
          'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
          __TDT_KEY__,
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        layer: 'USGSShadedReliefOnly',
        maximumLevel: 18,
        subdomains: __TDT_SUBDOMAINS__
      }),
      1
    )

    viewer.imageryLayers.add(imagery)

    onBeforeUnmount(() => {
      viewer.imageryLayers.remove(imagery)
    })
  },
  render() {
    return <div></div>
  }
})
