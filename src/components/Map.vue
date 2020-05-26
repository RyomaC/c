<template>
  <div style="width:100%;height:100%;position:relative;">
    <div id="mapContainer"></div>
    <component id="modultePart" v-bind:is="overlayComponent" />
  </div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'
import OverlayHome from '@/components/OverlayHome'
import OverlayVehicle from '@/components/vehicle/OverlayVehicle'
import OverlayPerson from '@/components/vehicle/OverlayPerson'
import OverlayLight from '@/components/OverlayLight'
import OverlayAlarm from '@/components/vehicle/OverlayAlarm'
import OverlayEnvironment from '@/components/Environment'
import OverlayGovernment from '@/components/vehicle/OverlayGovernment'
import OverlaySecurity from '@/components/OverlaySecurity'

let loadedAMapJS = false

export default {
  props: ['componentType'],
  components: {OverlayHome, OverlayVehicle, OverlayPerson, OverlayLight, OverlayAlarm, OverlayEnvironment, OverlayGovernment, OverlaySecurity},
  data: function () {
    return {
      text: '主页',
      overlayComponent: OverlayHome
    }
  },
  async created () {
    if (!loadedAMapJS) {
      await remoteLoad('https://webapi.amap.com/maps?v=1.4.15&key=2691a1ff880a31cc519476070f38e69e')
      loadedAMapJS = true
    }
    this.initMap()
  },
  mounted: function () {
    this.initMap()
  },
  watch: {
    'componentType': function () {
      switch (this.componentType) {
        case 'home':
          this.text = '主页'
          break
        case 'vehicle':
          this.text = '车辆'
          break
        case 'person':
          this.text = '行人'
          break
        case 'light':
          this.text = '照明'
          break
        case 'environment':
          this.text = '环境'
          break
        case 'government':
          this.text = '市政'
          break
        case 'alarm':
          this.text = '报警'
          break
        case 'security':
          this.text = '安防'
          break
      }
      this.loadMarkers()
      const mapping = {
        'home': OverlayHome,
        'vehicle': OverlayVehicle,
        'person': OverlayPerson,
        'light': OverlayLight,
        'environment': OverlayEnvironment,
        'government': OverlayGovernment,
        'alarm': OverlayAlarm,
        'security': OverlaySecurity
      }
      if (mapping[this.componentType]) {
        this.overlayComponent = mapping[this.componentType]
      }
    }
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

      // 创建纯文本标记
      var text = new AMap.Text({
        text: '主页',
        anchor: 'center', // 设置文本标记锚点
        draggable: true,
        cursor: 'pointer',
        angle: 10,
        style: {
          'padding': '.75rem 1.25rem',
          'margin-bottom': '1rem',
          'border-radius': '.25rem',
          'background-color': 'white',
          'width': '15rem',
          'border-width': 0,
          'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
          'text-align': 'center',
          'font-size': '20px',
          'color': 'blue'
        },
        position: [105.117187, 33.943359]
      })

      text.setMap(this.amap)
    },
    loadMarkers: function () {
      this.amap.clearMap()
      var marker = new AMap.Marker({
        position: this.amap.getCenter(),
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        offset: new AMap.Pixel(-13, -30)
      })

      marker.setMap(this.amap)

      marker.setTitle('我是marker的title')

      marker.setLabel({
        offset: new AMap.Pixel(20, 20),
        content: "<div class='info'>我是 marker 的 label 标签----</div>" + this.text,
        direction: 'right'
      })
    }
  }
}
</script>

<style scoped>
#mapContainer{
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute !important;
}
#modultePart{
  width: auto;
  height: auto;
  z-index: 999;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
}
</style>
