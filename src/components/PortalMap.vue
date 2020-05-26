<template>
  <div id="mapContainer">
    <div id="projectSelect" v-show="false">
      <el-select v-model="projectSelectedIndex" placeholder="Select" @change="projectSelectChange">
        <el-option
          v-for="(item, index) in projects"
          :key="item.title"
          :label="item.title"
          :value="index">
        </el-option>
      </el-select>
    </div>
    <div id="debugInfoContainer" v-show="debugInfoVisible">
      <div>{{focusDeviceData.NAME}}</div>
      <div>{{focusDeviceData.Warning_state && focusDeviceData.Warning_state > 0 ? focusDeviceData.Warning_state : ''}}&nbsp;
        <el-tag type="danger" color="yellow" size="mini" v-for="(item, index) in warningStateText" :key="index">{{item}}</el-tag>
      </div>
      <div>版本： {{focusDeviceData.Version}}</div>
      <div>功率： {{focusDeviceData.Power}}</div>
      <div>电压：{{focusDeviceData.Voltage}} &nbsp;&nbsp;&nbsp;&nbsp; 电流：{{focusDeviceData.Current}}</div>
      <div>亮度： 主 {{focusDeviceData.FirDimming}} &nbsp;&nbsp;&nbsp;&nbsp; 辅 {{focusDeviceData.SecDimming}} </div>
      <div>照度： {{focusDeviceData.Illu}}</div>
      <ECharts style="width:250px;height:100px" :options="firLampData" autoresize/>
      <ECharts style="width:250px;height:100px" :options="secLampData" autoresize/>
    </div>
    <div id="mapHead" v-if="amap && amap.getZoom() > 10">
      <div id = "actionBar">
        <el-button type="text" icon="el-icon-s-data" @click="toggleStats" v-if="amap && amap.getZoom() > 10"/>
        <el-button type="text" icon="el-icon-refresh" @click="reloadProjectMarkers(projects[projectSelectedIndex])" v-if="amap && amap.getZoom() > 10"/>
        <el-button type="text" icon="el-icon-map-location" @click="zoomOut" v-if="amap && amap.getZoom() > 10"/>
        <el-button type="text" icon="el-icon-s-grid" @click="toggleDeviceList" v-if="amap && amap.getZoom() > 10"/>
      </div>
      <div id = "statsSummary">
        <!-- <div style = "display:inline-block; width:100px; height: 50px; position:relative;">
          <div style="position:absolute; left:10px; top:-15px"> 在线: {{lightConnected}}</div>
        </div>         -->
        <div style = "display:inline-block; width:130px; height: 50px; position:relative;">
          <div style="position:absolute; top:-15px; right:15px; ">功率：{{parseFloat(statsData.mean15s && statsData.mean15s.length > 0 ? statsData.mean15s[0].mean_power : 0 || 0).toFixed(2)}}</div>
          <ECharts style="width:130px;height:50px" :options="realtimePowerChart" autoresize />
        </div>
        <div style = "display:inline-block; width:130px; height: 50px; position:relative;">
          <div style="position:absolute; top:-15px;  right:15px;">照度：{{parseFloat(statsData.mean15s && statsData.mean15s.length > 0  ? statsData.mean15s[0].mean_illu : 0 || 0).toFixed(2)}}</div>
          <ECharts style="width:130px;height:50px" :options="realtimeIlluChart" autoresize />
        </div>
        <div style = "display:inline-block; width:130px; height: 50px; position:relative;">
          <div style="position:absolute; top:-15px;  right:15px;">温度：{{parseFloat(statsData.mean15s && statsData.mean15s.length > 0  ? statsData.mean15s[0].mean_temp : 0 || 0).toFixed(2)}}</div>
          <ECharts style="width:130px;height:50px" :options="realtimeTempChart" />
        </div>
      </div>
      <div id="timeline" style="width:86%; position:absolute; top:-15px;z-index:2;">
        <el-slider v-model="focusTime" :step="1" :max="96" @change="sliderChange" :marks="getSliderMark()" :format-tooltip="formatSliderTooltip"></el-slider>
        <el-button type="text" icon="el-icon-video-play" @click="replay" > </el-button>
      </div>
      <div id="currenttime" style="width:86%;position:absolute;top:-15px;z-indez:1;">
        <el-slider v-model="cuTime" :step="1" :max="1440" :marks="getSliderMark1()" disabled></el-slider>
      </div>
    </div>
    <div class="deviceList" v-show="deviceListVisible">
      <PortalDeviceList :deviceList="deviceList" @itemClicked="deviceListItemClicked" @itemsSelected="deviceListItemsSelected" @controlModeChange='controlModeChange'/>
    </div>
    <div id="infoContainer" v-show="infoContainerVisible && !deviceControlVisible">
        <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
        <DataItem ref="dataItem" :data_id="currentDeviceID" data_action="view" :data_type="deviceType" :data="currentData" @hideItem="hideDetail" @itemUpdated="reloadProject"/>
    </div>
    <div id="deviceControlContainer" v-show="deviceControlVisible && !infoContainerVisible">
      <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
      <DeviceControl :uuids="selectedUUIDs" :project="projects[projectSelectedIndex]" v-show="deviceControlVisible"/>
    </div>
    <div id="statsContainer" v-show="statsVisible">
      <!-- <component v-bind:is="portalComponent" /> -->
      <Portal :project="projects[projectSelectedIndex]" :statsData="statsData"/>
    </div>
  </div>
</template>

<script>
// <el-button type="text" icon="el-icon-s-operation" @click="toggleSelectMode" />
import DataItem from '@/components/DataItem'
import Portal from '@/components/Portal'
import PortalDeviceList from '@/components/PortalDeviceList'
import remoteLoad from '@/utils/remoteLoad.js'
import DeviceControl from '@/components/DeviceControl'
import _ from 'underscore'
import gpsUtil from '@/utils/gpsUtil.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import echartsUtil from '@/utils/echartsUtil'
import warningStateUtil from '@/utils/warningStateUtil'
import moment from 'moment'

let loadedAMapJS = false

export default {
  components: {DataItem, PortalDeviceList, DeviceControl, Portal, ECharts},
  data: function () {
    return {
      deviceList: [],
      indexedDeviceList: {},
      massMarkersData: [],
      indexedMassMarkersData: {},
      projectMarkersData: [],
      amap: null,
      labelsLayer: null,
      marker: null,
      labelMarkers: [],
      projects: [],
      projectSelectedIndex: -1,
      currentDeviceID: null,
      currentData: {},
      focusDeviceData: {},
      warningCount: 0,
      massMarks: null,
      projectMarks: null,
      info: '',
      deviceType: 'v_device',
      debugInfo: 'debugInfo',
      debugInfoVisible: false,
      infoContainerVisible: false,
      deviceListVisible: false,
      deviceControlVisible: false,
      selectedUUIDs: [],
      selectedDeviceID: -1,
      mapCenter: [],
      selectMode: false,
      refreshInterval: null,
      statsVisible: false,
      portalComponent: null,
      statsData: {},
      realtimePowerChart: null,
      realtimeIlluChart: null,
      realtimeTempChart: null,
      firLampData: null,
      secLampData: null,
      lightConnected: 0,
      currentTime: '',
      focusTime: 1,
      cuTime: 1,
      heatmap: null
      // mapCenter:[112.025698,31.214243]
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
    this.initMap()
    this.firLampData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.secLampData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.secLampData.series[0].areaStyle = {
      color: echartsUtil.gradientColor('rgba(100,44,90,0.3)', 'rgba(0,146,246,0.9)', 0, 1, 0, 0)
    }
    this.firLampData.series[0].step = 'end'
    this.secLampData.series[0].step = 'end'

    //    this.realtimePowerChart.yAxis.max = 150
    this.realtimePowerChart = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalMiniLineOptions').default))
    this.realtimeIlluChart = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalMiniLineOptions').default))
    this.realtimeTempChart = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalMiniLineOptions').default))
    for (let chart of [[this.realtimePowerChart, 250], [this.realtimeIlluChart, 15000], [this.realtimeTempChart, 50]]) {
      chart[0].yAxis.min = 0
      chart[0].yAxis.max = chart[1]
      let xAxis = chart[0].xAxis.data
      while (xAxis.length < 50) {
        xAxis.push('')
      }
    }

    this.refreshInterval = setInterval(() => {
      this.fetchStatsData()
    }, 15000)

    // setTimeout(() => {
    //   if (!this.portalComponent) {
    //     this.portalComponent = () => import('@/components/Portal')
    //   }
    //   if (this.portalComponent) {
    //     this.portalComponent.project = this.projects[this.projectSelectedIndex]
    //   }
    // }, 2000)
    this.focusTime = Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)
  },
  destroyed: function () {
    clearInterval(this.refreshInterval)
  },
  sockets: {
    deviceStatus: function (datas) {
      if (this.selectMode) return
      let selectedDevice = this.deviceList[this.selectedDeviceID]
      for (const data of datas) {
        const device = this.indexedDeviceList[data.uuid]
        if (device) {
          // if (selectedDevice && device.UUID == selectedDevice.UUID || data.data.Warning_state || data.data.FirDimming) {
          Object.assign(device, data.data)
          // }
          let markerData = this.indexedMassMarkersData[data.uuid]
          if (markerData) {
            this.showDeviceStatus(data.uuid)
            if (typeof (data.data.Warning_state) !== 'undefined') {
              if (data.data.Warning_state > 0) {
                if (data.data.TYPE === 2) markerData.style = 2
                if (data.data.TYPE === 1) markerData.style = 3
                if (data.data.TYPE === 4) markerData.style = 9
              }
              continue
            }
            if (
              typeof (data.data.Power) === 'undefined' &&
                typeof (data.data.FirDimming) === 'undefined' &&
                typeof (data.data.SecDimming) === 'undefined'
            ) {
              continue
            }
            markerData.style = this.getStyle(data.data)
          } else {
            console.log('markerdata not found:' + data.uuid)
          }
        } else {
          console.log('device not found:' + data.uuid)
        }
      }
      if (this.massMarks) {
        this.massMarks.setData(this.massMarkersData)
      }
    }
  },
  methods: {
    toggleSelectMode () {
      this.selectMode = true
      this.reloadMassMarkersStyle()
      console.log(`selectMode:${this.selectMode}`)
    },
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
      const self = this
      this.amap.plugin(['AMap.Heatmap'], function () {
        self.heatmap = new AMap.Heatmap(self.amap, {
          radius: 35,
          opacity: [0, 0.8],
          gradient: {
            0.5: 'blue',
            0.65: 'rgb(117,211,248)',
            0.7: 'rgb(0, 255, 0)',
            0.9: '#ffea00',
            1.0: 'red'
          }

        })
      })
      this.fetchData()
    },
    zoomOut: function () {
      this.marker.hide()
      this.amap.setCenter(this.mapCenter)
      this.amap.setZoom(5)
      this.deviceListVisible = false
      this.deviceControlVisible = false
      this.infoContainerVisible = false
      this.statsVisible = false
    },
    fetchData: function () {
      this.$axios
        .post('/project/list', {size: 2000})
        .then(response => {
          this.projects = response.data.data.data
          this.showProjectMarkers()
        })
    },
    showMarkers: function () {
      const iconSize = 26
      const style = [
        '/static/images/light_on.png',
        '/static/images/light_off.png',
        '/static/images/light_warning.png',
        '/static/images/ebox.png',
        '/static/images/light_offline.png',
        '/static/images/light_selected.png',
        '/static/images/light_on_l.png',
        '/static/images/light_on_m.png',
        '/static/images/wiresafe.png',
        '/static/images/wiresafe_red.png'
      ].map(url => {
        return {
          url: url,
          anchor: new AMap.Pixel(5, 5),
          size: new AMap.Size(iconSize, iconSize)
        }
      })
      this.massMarkersData = []
      this.labelMarkers = []
      for (let i = 0; i < this.deviceList.length; i++) {
        if (this.deviceList[i].LNG && this.deviceList[i].LAT ||
            this.deviceList[i].Longitude && this.deviceList[i].Latitude ||
            this.deviceList[i].lbsLongitude && this.deviceList[i].lbsLatitude
        ) {
          let data = {
            lnglat: this.getLngLat(this.deviceList[i]),
            name: this.deviceList[i].NAME,
            id: i,
            uuid: this.deviceList[i].UUID,
            style: this.getStyle(this.deviceList[i])
          }
          console.log(data.lnglat || 'not lnglat')
          this.massMarkersData.push(data)
        }
      }
      if (!this.massMarks) {
        this.massMarks = new AMap.MassMarks(this.massMarkersData, {
          zIndex: 100,
          style: style
        })
      }
      this.indexedMassMarkersData = _.indexBy(this.massMarkersData, 'uuid')
      this.massMarks.setData(this.massMarkersData)
      this.massMarks.setMap(this.amap)
      this.massMarks.on('click', this.onMassMarksClick)
      this.massMarks.on('mouseover', this.onMassMarksMouseOver)
      this.massMarks.on('mouseout', this.onMassMarksMouseOut)
      this.massMarks.show()
      this.projectMarks.hide()
    },
    showDeviceStatus (uuid) {
      const deviceMarker = this.indexedMassMarkersData[uuid]
      let marker = new AMap.Marker({
        map: this.amap,
        position: deviceMarker.lnglat,
        icon: '/static/images/light_green_dot.png',
        offset: new AMap.Pixel(15, -9)
      })
      setTimeout(() => {
        this.amap.remove(marker)
      }, 2000)
    },
    onMassMarksMouseOver (e) {
      const device = this.deviceList[e.data.id]
      if (device.TYPE !== 2) return
      this.focusDeviceData = device
      this.debugInfoVisible = true
      if (device.LNG && device.LAT) {
        this.marker.setPosition([device.LNG, device.LAT])
        this.marker.setLabel({content: device.NAME})
        this.marker.show()
      }
      this.firLampData.xAxis.data = [device.Fir_tt_Fir || '', device.Sec_tt_Fir || '', device.Thir_tt_Fir || '', device.Four_tt_Fir || '', device.Fif_tt_Fir || '', device.Six_tt_Fir || '']
      this.firLampData.series[0].data = [device.Fir_tp_Fir || 0, device.Sec_tp_Fir || 0, device.Thir_tp_Fir || 0, device.Four_tp_Fir || 0, device.Fif_tp_Fir || 0, device.Six_tp_Fir || 0]
      this.firLampData.animation = false
      this.secLampData.xAxis.data = [device.Fir_tt_Sec || '', device.Sec_tt_Sec || '', device.Thir_tt_Sec || '', device.Four_tt_Sec || '', device.Fif_tt_Sec || '', device.Six_tt_Sec || '']
      this.secLampData.series[0].data = [device.Fir_tp_Sec || 0, device.Sec_tp_Sec || 0, device.Thir_tp_Sec || 0, device.Four_tp_Sec || 0, device.Fif_tp_Sec || 0, device.Six_tp_Sec || 0]
      this.secLampData.animation = false
    },
    onMassMarksMouseOut (e) {
      this.marker.hide()
      this.debugInfoVisible = false
    },
    onMassMarksClick (e) {
      if (this.selectMode) {
        return
      }
      this.showDetail(e)
    },
    reloadMassMarkersStyle () {
      if (this.selectMode) {
        for (const markerData of this.massMarkersData) {
          markerData.style = 1
        }
        for (const key of this.selectedUUIDs) {
          let markerData = this.indexedMassMarkersData[key]
          if (markerData) {
            markerData.style = 5
          }
        }
        if (this.massMarks) {
          this.massMarks.setData(this.massMarkersData)
        }
      } else {
        this.refreshProjectMarkers(this.projects[this.projectSelectedIndex])
      }
    },
    showProjectMarkers: function () {
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
      const project = this.projects[e.data.id]
      this.$EventBus.$emit('projectChanged', {project})
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
          this.showMarkers()
          this.lightConnected = _.filter(this.deviceList, {TYPE: 2, STATE: 1}).length
        })
      this.$axios
        .post('/v_device_ebox/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.showMarkers()
        })
      this.$axios
        .post('/v_device_wiresafe/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.showMarkers()
        })
      this.realtimePowerChart.series[0].data = []
      this.realtimeIlluChart.series[0].data = []
      this.realtimeTempChart.series[0].data = []
      this.fetchStatsData()
    },
    refreshProjectMarkers: function (project) {
      if (!project) return
      this.$axios
        .post('/v_device_lamp/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          const datalist = response.data.data.data
          for (const data of datalist) {
            let markerData = this.indexedMassMarkersData[data.UUID]
            if (markerData) {
              markerData.style = this.getStyle(data)
            }
          }
          if (this.massMarks) {
            this.massMarks.setData(this.massMarkersData)
          }
        })
    },
    reloadProject () {
      if (!(this.projects.length > 0 && this.projectSelectedIndex >= 0)) return
      const project = this.projects[this.projectSelectedIndex]
      this.reloadProjectMarkers(project)
    },
    reloadProjectMarkers: function (project) {
      if (!project) return
      this.deviceList = []
      this.$axios
        .post('/v_device_lamp/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.showMarkers()
        })
      this.$axios
        .post('/v_device_ebox/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.showMarkers()
        })
      this.$axios
        .post('/v_device_wiresafe/list', {where: {PROJECT: project.title}, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.showMarkers()
        })
    },
    showDetail: function (e) {
      this.selectedDeviceID = e.data.id
      let device = this.deviceList[e.data.id]
      this.showDeviceDetail(device)
    },
    showDeviceDetail: function (device) {
      this.currentDeviceID = device._id
      this.currentData = device
      switch (device.TYPE) {
        case 1:
        case '1': // mongo
          this.deviceType = 'v_device_ebox'
          break
        case 2:
        case '2':
          this.deviceType = 'v_device_lamp'
          break
        case 4:
        case '4':
          this.deviceType = 'v_device_wiresafe'
          break
        default:
          this.deviceType = 'v_device'
      }
      this.infoContainerVisible = true
    },
    hideDetail: function () {
      this.infoContainerVisible = false
      this.deviceControlVisible = false
    },
    zoomChange: function () {
      if (this.amap.getZoom() <= 10) {
        this.massMarks ? this.massMarks.hide() : ''
        this.projectMarks.show()
      }
      // this.debugInfo = this.amap.getZoom()
    },
    dblClick: function (e) {
      this.$alert(`${e.lnglat.getLng()},${e.lnglat.getLat()}`, '经纬度', {
        confirmButtonText: 'OK',
        callback: action => {
        }
      })
      this.$EventBus.$emit('mapDoubleClicked', {lng: e.lnglat.getLng(), lat: e.lnglat.getLat()})
    },
    projectSelectChange: function (value) {
      this.amap.panTo([this.projects[value].lng, this.projects[value].lat])
    },
    locateDeviceWithID: function (id) {
      let device = _.findWhere(this.deviceList, {ID: id})
      this.locateDevice(device)
    },
    locateDevice (device, showLabel) {
      this.amap.panTo([device.LNG, device.LAT])
      this.currentDeviceID = device._id
      this.infoContainerVisible = true
      if (showLabel) {
        this.marker.show()
        this.marker.setPosition([device.LNG, device.LAT])
        this.marker.setLabel({content: device.NAME})
      }
      this.amap.setZoom(18)
    },
    deviceListItemClicked (uuid) {
      let device = this.indexedDeviceList[uuid]
      this.deviceControlVisible = false
      this.showDeviceDetail(device)
      this.locateDevice(device)
    },
    deviceListItemsSelected (ids) {
      this.selectedUUIDs = ids
      this.reloadMassMarkersStyle()
    },
    controlModeChange (selectMode) {
      this.marker.hide()
      this.selectMode = selectMode
      this.reloadMassMarkersStyle()
      this.infoContainerVisible = false
      this.deviceControlVisible = selectMode
    },
    toggleDeviceList () {
      this.marker.hide()
      this.selectMode = false
      this.deviceListVisible = !this.deviceListVisible
      this.deviceControlVisible = false
      this.infoContainerVisible = false
      this.statsVisible = false
      this.reloadMassMarkersStyle()
    },
    toggleStats () {
      this.marker.hide()
      this.statsVisible = !this.statsVisible
      if (!this.portalComponent) this.portalComponent = () => import('@/components/Portal')
    },
    gpsTransform (lng, lat) {
      return gpsUtil.gpsTransform(lng, lat)
    },
    fetchStatsData () {
      // this.currentTime = timeUtil.formatTime(new Date())
      this.currentTime = moment().format('hh:mm:ss')
      if (!(this.projects.length > 0 && this.projectSelectedIndex >= 0)) return
      const project = this.projects[this.projectSelectedIndex]
      if (!project) return
      this.lightConnected = _.filter(this.deviceList, {TYPE: 2, STATE: 1}).length
      this.$axios
        .post('/stats/projectStats', {code: project.code})
        .then(response => {
          this.statsData = response.data.data
          if (this.statsData === '') this.statsData = {}

          this.realtimePowerChart.series[0].data = []
          this.realtimeIlluChart.series[0].data = []
          this.realtimeTempChart.series[0].data = []
          for (let i = 0; i < this.statsData.mean15s.length; i++) {
            this.realtimePowerChart.series[0].data.push(this.statsData.mean15s[this.statsData.mean15s.length - 1 - i].mean_power)
            this.realtimeIlluChart.series[0].data.push(this.statsData.mean15s[this.statsData.mean15s.length - 1 - i].mean_illu)
            this.realtimeTempChart.series[0].data.push(this.statsData.mean15s[this.statsData.mean15s.length - 1 - i].mean_temp)
          }
          this.statsData.lightConnected = this.lightConnected
        })
        .catch(e => {
        })
    },
    getLngLat (device) {
      return device.LNG && device.LAT ? [device.LNG, device.LAT]
        : device.Longitude && device.Latitude
          ? this.gpsTransform(device.Longitude, device.Latitude)
          : [device.lbsLongitude, device.lbsLatitude]
    },
    getStyle (device) {
      return device.TYPE === 4 ? (device.Warning_state > 0 ? 9 : 8)
        : device.TYPE === 1 ? 3
          : device.STATE === 0 ? 4
            : device.Warning_state > 0 ? 2
              : device.Power < 5 ? 1
                : device.Power < 50 ? 7 // 6
                  : device.Power < 100 ? 7
                    : ((device.FirDimming || 0) >= 10 || (device.SecDimming || 0) >= 10 || device.Power) ? 0
                      : 1
    },
    formatSliderTooltip (v) {
      return moment().startOf('day').add(v * 15, 'minutes').format('HH:mm')
    },
    getSliderMark () {
      let marks = {}
      marks[24] = moment().startOf('day').add(24 * 15, 'minutes').format('HH:mm')
      marks[48] = moment().startOf('day').add(48 * 15, 'minutes').format('HH:mm')
      marks[72] = moment().startOf('day').add(72 * 15, 'minutes').format('HH:mm')
      return marks
    },
    getSliderMark1 () {
      let marks = {}
      const today = moment()
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD 23:50:00')
      const current_time = moment().format('HH:mm')
      const timemark = today.diff(yesterday, 'minute')
      this.cuTime = timemark
      // console.log(timemark)
      marks[timemark] = {
        style: {
          color: 'red'
        },
        label: this.$createElement('strong', current_time)
      }
      return marks
    },
    sliderChange () {
      if (this.focusTime > Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)) {
        this.focusTime = Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)
      }
      this.$axios.post('/stats/projectSnapshot', {code: '831400',
        time:
      moment().startOf('day').add(this.focusTime * 15, 'minutes').valueOf()})
        .then(result => {
          const datas = result.data.data
          let heatmapData = []
          for (const data of datas) {
            const device = this.indexedDeviceList[data.UUID]
            if (device) {
            // if (selectedDevice && device.UUID == selectedDevice.UUID || data.data.Warning_state || data.data.FirDimming) {
              Object.assign(device, data)
              // }
              let markerData = this.indexedMassMarkersData[data.UUID]
              if (markerData) {
              // this.showDeviceStatus(data.UUID)

              // if (typeof(data.Warning_state) !== 'undefined')  {
              //   if (data.Warning_state > 0) {
              //     markerData.style = 2
              //   }
              //   continue
              // }
                if (
                  typeof (data.Power) === 'undefined'
                  // && typeof(data.FirDimming) === 'undefined'
                  // && typeof(data.SecDimming) === 'undefined'
                ) {
                  continue
                }
                markerData.style = this.getStyle(data)
              }
              heatmapData.push({
                'lng': device.LNG,
                'lat': device.LAT,
                'count': Math.floor(data.Power)
              })
              console.log(heatmapData)
            }
          }
          if (this.massMarks) {
            this.massMarks.setData(this.massMarkersData)
          }
          console.log(heatmapData.length)
          this.heatmap.setDataSet({
            data: heatmapData,
            max: 500
          })
        })
    },
    replay () {
      this.focusTime = 0
      let iterval = setInterval(() => {
        this.focusTime++
        if (this.focusTime > Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)) { clearInterval(iterval); iterval = null }
      }, 1000)
    }
  },
  computed: {
    warningStateText () {
      return warningStateUtil.stringify(this.focusDeviceData.Warning_state)
    }
  }
}
</script>

<style scoped>
#mapContainer {
  height: 100%;
}
#projectSelect {
  color: white;
  font-size:9px;
  left: 20px;
  top: 20px;
  width: 300px;
  position: absolute;
  z-index: 999;
}
#mapHead {
  z-index: 999;
  color: #dddddd;
  background: #22222299;
  right: 0px;
  top: 0px;
  left: 0px;
  height: 50px;
  position: absolute;
  float: left;
}
#statsSummary {
  top: 0px;
  left: 0px;
  height: 50px;
  position: absolute;
  text-align: left;
  float: left;
  line-height: 50px;
  font-size:12px;
}
#actionBar {
  z-index: 998;
  right: 0px;
  top: 0px;
  height: 50px;
  position: absolute;
  text-align: right;
  float: right;
}
#actionBar .el-button {
  font-size:15pt;margin-right:20px;
}
.badget {
  margin-top: -10px;
  margin-right: 0px;
}
#infoContainer, #deviceControlContainer{
  background-color: rgba(12, 27, 78, 0.9);
  border: 1px sold white;
  color: white;
  font-size:9px;
  right: 20px;
  bottom: 20px;
  width: 450px;
  top: 100px;
  position: absolute;
  z-index: 999;
  /* overflow-y:auto;
  overflow-x:hidden; */
}
#debugInfoContainer {
  background-color: rgb(12, 27, 78);
  border: 1px sold white;
  color: white;
  font-size:12px;
  text-align: left;
  left: 20px;
  bottom: 20px;
  width: 250px;
  height: 330px;
  position: absolute;
  z-index: 1000;
  padding: 10px;
  /* overflow-y:auto;
  overflow-x:hidden; */
}

#statsContainer {
  background-color: rgb(29, 32, 41);
  border: 1px sold white;
  color: white;
  font-size:15px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  top: 60px;
  position: absolute;
  z-index: 888;
  overflow-y:auto;
  overflow-x:hidden;
}

.deviceList {
  background-color: rgba(12, 27, 78, 0.9);
  border: 1px sold white;
  color: white;
  font-size:9px;
  left: 20px;
  bottom: 20px;
  width: 400px;
  height: 90%;
  position: absolute;
  z-index: 888;
  /* overflow-y:auto; */
  /* overflow-x:hidden; */
}

@media screen and (max-width: 800px) {
  #infoContainer, #deviceControlContainer {
    background-color: rgb(12, 27, 78);
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    top: 0px;
  }
}

@media screen and (max-width: 800px) {
  .deviceList, #statsContainer {
    background-color: rgb(12, 27, 78);
    right: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    top: 60px;
  }
}

@media screen and (max-width: 800px) {
  #statsSummary {
    visibility: hidden;
  }
}

@media screen and (max-width: 800px) {
  #debugInfoContainer {
    visibility: hidden;
  }
}
</style>
