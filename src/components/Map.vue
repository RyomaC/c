<template>
  <div style="width:100%;height:100%;position:relative;">
    <div id="mapContainer" v-bind:class="{homeClass:a,lightClass:b}"></div>
    <component id="modultePart" v-bind:is="overlayComponent" v-if="modultePartVisible"/>
  </div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'
import OverlayHome from '@/components/OverlayHome'
import OverlayVehicle from '@/components/vehicle/OverlayVehicle'
import OverlayPerson from '@/components/vehicle/OverlayPerson'
import OverlayLight from '@/components/OverlayLight'
import OverlayLightmap from '@/components/OverlayLightmap'
import OverlayAlarm from '@/components/vehicle/OverlayAlarm'
import OverlayEnvironment from '@/components/Environment'
import OverlayGovernment from '@/components/vehicle/OverlayGovernment'
import OverlaySecurity from '@/components/OverlaySecurity'
import markersLight from '@/components/dataconfig/markers_light'
import _ from 'underscore'
import lnglatUtil from '@/utils/lnglatUtil'
import styleUtil from '@/utils/styleUtil'

let loadedAMapJS = false

export default {
  props: ['componentType'],
  components: {OverlayHome, OverlayVehicle, OverlayPerson, OverlayLight, OverlayLightmap, OverlayAlarm, OverlayEnvironment, OverlayGovernment, OverlaySecurity},
  data: function () {
    return {
      text: '主页',
      overlayComponent: OverlayHome,
      a: false,
      b: false,
      projectMarkersData: [],
      projects: [],
      projectMarks: null,
      mapCenter: [],
      projectName: '',
      projectSelectedIndex: -1,
      debugInfo: 'debugInfo',
      indexedDeviceList: {},
      lightConnected: 0,
      deviceList: [],
      lightMarkersData: [],
      modultePartVisible: true
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
          this.a = true
          break
        case 'vehicle':
          this.text = '车辆'
          break
        case 'person':
          this.text = '行人'
          break
        case 'light':
          this.text = '照明'
          this.b = true
          this.modultePartVisible = false
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

      this.$axios
        .post('/project/list', {size: 2000})
        .then(response => {
          this.projects = response.data.data.data
          this.showProjectMarkers()
        })
    },
    showProjectMarkers: function () {
      // eslint-disable-next-line no-unused-vars
      const iconSize = 20
      const style = [
        {
          url: '/static/images/bian.png',
          anchor: new AMap.Pixel(5, 5),
          size: new AMap.Size(64, 38)
        }
      ]
      this.projectMarkersData = []
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i].lng && this.projects[i].lat) {
          this.mapCenter = [this.projects[i].lng, this.projects[i].lat]
          let data = {
            lnglat: [this.projects[i].lng, this.projects[i].lat],
            name: this.projects[i].Title,
            id: i,
            style: 0
          }
          this.projectMarkersData.push(data)
        }
      }
      this.projectMarks = new AMap.MassMarks(this.projectMarkersData, {
        zIndex: 100,
        style: style
      })
      this.projectMarks.setMap(this.amap)
      this.projectMarks.on('click', this.showProjectDetail)
      this.amap.setCenter(this.mapCenter)
      this.amap.setZoom(5)
    },
    showProjectDetail: function (e) {
      console.log(this.componentType)
      if (this.componentType === 'light') {
        const project = this.projects[e.data.id]
        this.projectName = project.title
        // this.$EventBus.$emit('projectChanged', {project})
        this.projectSelectedIndex = e.data.id
        this.debugInfo = parseFloat(project.lat)
        if (project.lng) {
          this.amap.setCenter([project.lng, project.lat])
          this.amap.setZoom(18)
        }
        this.deviceList = []
        this.$axios
          .post('/v_device_lamp/list', {where: {PROJECT: project.title}, size: 2000})
          .then(response => {
            this.deviceList = this.deviceList.concat(response.data.data.data)
            this.indexedDeviceList = _.indexBy(this.deviceList, 'UUID')
            this.showMarkers(this.componentType)
            this.lightConnected = _.filter(this.deviceList, {TYPE: 2, STATE: 1}).length

            for (let i = 0; i < this.deviceList.length; i++) {
              if ((this.deviceList[i].LNG && this.deviceList[i].LAT) ||
                  (this.deviceList[i].Longitude && this.deviceList[i].Latitude) ||
                  (this.deviceList[i].lbsLongitude && this.deviceList[i].lbsLatitude)
              ) {
                let data = {
                  lnglat: lnglatUtil.getLngLat(this.deviceList[i]),
                  name: this.deviceList[i].NAME,
                  id: i,
                  uuid: this.deviceList[i].UUID,
                  style: styleUtil.getStyle(this.deviceList[i])
                }
                this.lightMarkersData.push(data)
              }
            }
          })
        this.$axios
          .post('/v_device_ebox/list', {where: {PROJECT: project.title}, size: 2000})
          .then(response => {
            this.deviceList = this.deviceList.concat(response.data.data.data)
            this.showMarkers(this.componentType)
          })
        this.$axios
          .post('/v_device_wiresafe/list', {where: {PROJECT: project.title}, size: 2000})
          .then(response => {
            this.deviceList = this.deviceList.concat(response.data.data.data)
            this.showMarkers(this.componentType)
          })
        // this.realtimePowerChart.series[0].data = []
        // this.realtimeIlluChart.series[0].data = []
        // this.realtimeTempChart.series[0].data = []
        // this.fetchStatsData()
      } else {

      }
    },
    showMarkers: function (type) {
      this.amap.clearMap()
      if (type === 'light') {
        this.modultePartVisible = true
        markersLight.loadMarkers(this.amap, this.deviceList)
        this.projectMarks.hide()
      }
    }
  }
}
</script>

<style scoped>
#mapContainer{
  width: 71%;
  height: 100%;
  z-index: 1;
  right: 0;
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
.homeClass{
  width: 71% !important;
}
.lightClass{
  width: 100% !important;
}
</style>
