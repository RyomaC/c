<template>
  <div style="width:100%;height:100%;position:relative;">
    <div id="mapContainer" v-bind:class="{homeClass:a,lightClass:b}">
      <component id="moduleMap" v-bind:is="overlayMap" v-if="moduleMapVisible" />
    </div>
    <component id="modulePart" v-bind:is="overlayComponent" v-if="modulePartVisible"/>
  </div>
</template>

<script>
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
import remoteLoad from '@/utils/remoteLoad.js'
import securityUtil from '@/utils/securityUtil.js'
import Bus from '@/utils/bus.js'

let loadedAMapJS = false

export default {
  props: ['componentType'],
  components: {OverlayHome, OverlayVehicle, OverlayPerson, OverlayLight, OverlayLightmap, OverlayAlarm, OverlayEnvironment, OverlayGovernment, OverlaySecurity},
  data: function () {
    return {
      text: '主页',
      amap: null,
      overlayComponent: OverlayHome,
      overlayMap: OverlayLightmap,
      a: false,
      b: false,
      marker: null,
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
      modulePartVisible: true,
      moduleMapVisible: false,
      mouseTool: null
    }
  },
  async created () {
    if (!loadedAMapJS) {
      await remoteLoad('https://webapi.amap.com/maps?v=1.4.15&key=2691a1ff880a31cc519476070f38e69e&plugin=AMap.MouseTool')
      loadedAMapJS = true
    }
    this.initMap()
  },
  mounted: function () {
    this.initMap()

    this.$EventBus.$on('setmarker', (index) => {
      this.marker.setPosition([index.LNG, index.LAT])
      this.marker.setLabel({content: index.NAME})
      this.marker.show()
    })
    this.$EventBus.$on('hidemarker', (index) => {
      this.marker.hide()
    })
    this.$EventBus.$on('reloadmarkers', (index) => {
      this.deviceList = []
      markersLight.loadMarkers(this.amap, this.deviceList, index, this.indexedDeviceList, this.lightConnected, this.lightMarkersData, this.$EventBus)
    })
    this.$EventBus.$on('setCenterZoom', (index) => {
      this.amap.setCenter(this.mapcenter)
      this.amap.setZoom(5)
    })
    this.$EventBus.$on('closeMouseTool', (index) => {
      this.mouseTool && this.mouseTool.close(true)
      // this.amap.clearMap()
    })
    this.$EventBus.$on('setZoom', (index) => {
      this.amap.panTo([index.LNG, index.LAT])
      this.amap.setZoom(18)
    })
    this.$EventBus.$on('drawRectangle', (index) => {
      const overlays = []
      const self = this

      this.mouseTool.rectangle({
        strokeColor: 'red',
        strokeOpacity: 0.5,
        strokeWeight: 2
      })

      this.mouseTool.on('draw', function (e) {
        let AMap = window.AMap
        overlays.push(e.obj)
        const overlayPath = e.obj.getPath()// 覆盖物路径，event.obj 为绘制出来的覆盖物对象
        for (let i = 0; i < index.length; i++) {
          const point = index[i].lnglat
          const isPointInRing = AMap.GeometryUtil.isPointInRing(
            point,
            overlayPath
          )
          if (isPointInRing) { // 点在矩形内
            self.$EventBus.$emit('isPointInRing', index[i].uuid)
          }
          self.amap.remove(overlays)
        }
      })
    })
  },
  watch: {
    'componentType': function () {
      console.log(this.componentType)
      switch (this.componentType) {
        case 'home':
          this.text = '主页'
          this.a = true
          this.b = false
          this.modulePartVisible = true
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
          this.a = false
          this.modulePartVisible = false
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
      const self = this
      this.amap = new AMap.Map('mapContainer', {
        resizeEnable: true,
        mapStyle: 'amap://styles/blue',
        zoom: 5,
        zooms: [5, 18]
      })

      this.amap.on('zoomchange', this.zoomChange)
      this.marker = new AMap.Marker({content: ' ', map: this.amap})
      this.$axios
        .post('/project/list', {size: 2000})
        .then(response => {
          this.projects = response.data.data.data
          this.showProjectMarkers()
        })

      // 创建右键菜单
      this.contextMenu = new AMap.ContextMenu()
      if (this.checkGranted('v_device_lamp/view')) {
        this.contextMenu.addItem('新增路灯', function () {
          const paramLnglat = {
            LNG: self.contextMenuPositon.getLng(),
            LAT: self.contextMenuPositon.getLat(),
            PROJECT: self.projects[self.projectSelectedIndex].title
          }
          const paramItem = 'v_device_lamp'
          self.$EventBus.$emit('rightclick', {paramLnglat: paramLnglat, paramItem: paramItem})
        }, 0)
      }
      if (this.checkGranted('v_device_ebox/view')) {
        this.contextMenu.addItem('新增电箱', function () {
          const paramLnglat = {
            LNG: self.contextMenuPositon.getLng(),
            LAT: self.contextMenuPositon.getLat(),
            PROJECT: self.projects[self.projectSelectedIndex].title
          }
          const paramItem = 'v_device_ebox'
          self.$EventBus.$emit('rightclick', {paramLnglat: paramLnglat, paramItem: paramItem})
        }, 1)
      }
      if (this.checkGranted('v_device_wiresafe/view')) {
        this.contextMenu.addItem('新增报警器', function () {
          const paramLnglat = {
            LNG: self.contextMenuPositon.getLng(),
            LAT: self.contextMenuPositon.getLat(),
            PROJECT: self.projects[self.projectSelectedIndex].title
          }
          const paramItem = 'v_device_wiresafe'
          self.$EventBus.$emit('rightclick', {paramLnglat: paramLnglat, paramItem: paramItem})
        }, 2)
      }
      // 地图绑定鼠标右击事件——弹出右键菜单
      this.amap.on('rightclick', function (e) {
        self.contextMenu.open(self.amap, e.lnglat)
        self.contextMenuPositon = e.lnglat
      })

      // 生成鼠标绘图工具
      self.mouseTool = new AMap.MouseTool(this.amap)
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
        this.amap.clearMap()
        this.modulePartVisible = true
        this.moduleMapVisible = true
        this.overlayMap = OverlayLightmap
        this.projectMarks.hide()

        const project = this.projects[e.data.id]
        this.projectName = project.title
        this.$EventBus.$emit('projectChanged', {project})
        this.projectSelectedIndex = e.data.id
        // this.$EventBus.$emit('getprojectSelectedIndex', e.data.id)
        this.debugInfo = parseFloat(project.lat)
        if (project.lng) {
          this.amap.setCenter([project.lng, project.lat])
          this.amap.setZoom(18)
        }
        this.deviceList = []
        markersLight.loadMarkers(this.amap, this.deviceList, project, this.indexedDeviceList, this.lightConnected, this.lightMarkersData, this.$EventBus, this.projects, this.projectSelectedIndex)
      } else {

      }
    },
    zoomChange: function () {
      let isZoom = false
      if (this.amap.getZoom() <= 10) {
        // this.massMarks ? this.massMarks.hide() : ''
        this.projectMarks.show()
      } else {
        isZoom = true
      }
      this.$EventBus.$emit('zoomchange', isZoom)
    },
    checkGranted: function (action) {
      return securityUtil.checkGranted(action)
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
#modulePart{
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
