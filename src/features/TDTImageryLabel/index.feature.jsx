import { ImageryLayer, WebMapTileServiceImageryProvider } from 'cesium'
import { defineComponent, onBeforeUnmount } from 'vue'
import useViewerStore from '@/store/viewerStore'

export const TITLE = '天地图卫星标注'

export default defineComponent({
  name: 'TDTImageryLabel',
  setup() {
    const viewer = useViewerStore().viewer

    const imageryLabel = new ImageryLayer(
      new WebMapTileServiceImageryProvider({
        url:
          'http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' +
          __TDT_KEY__,
        maximumLevel: 18,
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        layer: 'USGSShadedReliefOnly',
        subdomains: __TDT_SUBDOMAINS__
      }),
      1
    )

    viewer.imageryLayers.add(imageryLabel)

    onBeforeUnmount(() => {
      viewer.imageryLayers.remove(imageryLabel)
    })
  },
  render() {
    return <div></div>
  }
})
