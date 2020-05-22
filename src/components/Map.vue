<template>
    <div id="mapContainer"></div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'

let loadedAMapJS = false

export default {
  components: {},
  data: function () {
    return {

    }
  },
  async created () {
    if (!loadedAMapJS) {
      await remoteLoad('https://webapi.amap.com/maps?v=1.4.15&key=2691a1ff880a31cc519476070f38e69e')
      // await remoteLoad('https://webapi.amap.com/ui/1.0/main.js?v=1.0.20')
      loadedAMapJS = true
    }
    this.initMap()
  },
  mounted: function () {

  },
  methods: {
    initMap: function () {
      if (!loadedAMapJS) return
      let AMap = window.AMap
      this.amap = new AMap.Map('mapContainer', {
        resizeEnable: true,
        mapStyle: 'amap://styles/blue',
        zoom: 5,
        zooms: [5, 18]
      })
      this.marker = new AMap.Marker({content: ' ', map: this.amap})
      this.amap.on('zoomchange', this.zoomChange)
      this.amap.on('dblclick', this.dblClick)
    }
  }
}
</script>

<style scoped>

</style>
