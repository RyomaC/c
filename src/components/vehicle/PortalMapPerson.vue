<template>
  <div id="mapContainer">
    <canvas id="canvas" ref="canvas" v-if="canvasVisible" style="position:absolute; right:20px; top:150px; width:320px; height:240px;z-index:1999;" @click="canvasVisible = false" ></canvas>
    <div id="mapHead" v-if="amap && amap.getZoom() > 10">
      <div id = "actionBar">
<!--        <el-button type="text" icon="el-icon-refresh" @click="reloadProject()" v-if="amap && amap.getZoom() > 10"/>-->
<!--        <el-button type="text" icon="el-icon-s-grid" @click="toggleDeviceList" v-if="amap && amap.getZoom() > 10"/>-->
      </div>
    </div>
    <div class="deviceList" v-show="deviceListVisible">
      <PortalDeviceList :deviceList="deviceList" @itemClicked="deviceListItemClicked" @itemsSelected="deviceListItemsSelected"/>
    </div>
    <div id="infoContainer" v-show="infoContainerVisible">
      <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
      <DataItem ref="dataItem" :data_id="currentDeviceID" data_action="view" :data_type="deviceType" :data="currentData" v-if="infoContainerVisible" @hideItem="hideDetail" @itemUpdated="reloadProject"/>
    </div>
    <img id="capturedImage" :src="capturedImageURL" v-show="capturedImageVisible"/>
    <img id="enlargedImage" :src="enlargedImageURL" v-show="enlargedImageVisible" @click="enlargedImageVisible=false"/>
    <div id="statsContainer" v-show="statsVisible">
    </div>
    <ImageDataList id="vehicleImageDataList" :options="vehicleViolationData" />
  </div>
</template>

<script>
import DataItem from '@/components/vehicle/DataItem'
import PortalDeviceList from '@/components/vehicle/PortalDeviceList'
import remoteLoad from '@/utils/remoteLoad.js'
import _ from 'underscore'
import gpsUtil from '@/utils/gpsUtil.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import warningStateUtil from '@/utils/warningStateUtil'
import moment from 'moment'
import StatsDataList from '@/components/vehicle/StatsDataList'
import ImageDataList from '@/components/vehicle/ImageDataList'
import {JSMpeg} from './jsmpeg.min.js'

let loadedAMapJS = false

export default {
  components: {DataItem, PortalDeviceList, ECharts, StatsDataList, ImageDataList},
  data: function () {
    return {
      deviceList: [],
      deviceList_kk: [],
      indexedDeviceList: {},
      massMarkersData: [],
      indexedMassMarkersData: {},
      ipIndexedDeviceList: {},
      ipIndexedDeviceList_kk: {},
      projectMarkersData: [],
      amap: null,
      marker: null,
      projects: [],
      projectSelectedIndex: -1,
      currentDeviceID: null,
      currentData: {},
      focusDeviceData: {},
      focusCameraID: null,
      warningCount: 0,
      massMarks: null,
      projectMarks: null,
      info: '',
      deviceType: 'v_device',
      debugInfo: 'debugInfo',
      debugInfoVisible: false,
      infoContainerVisible: false,
      deviceListVisible: false,
      selectedUUIDs: [],
      selectedDeviceID: -1,
      mapCenter: [],
      contextMenu: null,
      contextMenuPosition: null,
      selectMode: false,
      refreshInterval: null,
      statsVisible: false,
      statsData: {},
      currentTime: '',
      focusTime: 1,
      capturedImageURL: '',
      capturedImageVisible: false,
      enlargedImageURL: '',
      enlargedImageVisible: false,
      canvasVisible: false,
      player: null,
      vehicleViolationData: {
        title: '危化品车辆',
        tableData: [],
        columns: [
          {prop: 'plateInfo', label: '车牌号', width: 100}
          // {prop: 'sourceTitle', label: '位置', width: 100}
        ]
      },
      vehiclePaths: [],
      vehicleMarker: null,
      alarmList: [],
      alarmMarker: null,
      alarmMarkers: [],
      vehiclePolyline: null,
      vehiclePassedPolyline: null,
      vehiclePassedIndex: null,
      vehiclePassed: [],
      historyMarkers: []
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
    this.$axios
      .get('/portal/view')
      .catch(e => console.log(e))
    this.initMap()
    this.$EventBus.$on('vehicleItemClicked', data => {
      this.infoContainerVisible = false
    })
    this.$EventBus.$on('dangerVehicleClick', data => {
    //  this.enlargedImageVisible = true
    //  this.enlargedImageURL = data.picVehicleSub
      this.showVehicleDetail(data)
    })
    this.$EventBus.$on('vehicleCaptured', data => {
      data.plateInfo = `${data.plateInfo}  - ${data.sourceIP.split('.').length >= 4 ? data.sourceIP.split('.')[3] : ''}`
      this.vehicleViolationData.tableData.splice(0, 0, data)
      this.vehicleViolationData.tableData.pop()
      if (data.dangmark && data.dangmark === '是') {
        this.capturedImageURL = data.picVehicle
        this.capturedImageVisible = true
        setTimeout(() => { this.capturedImageVisible = false }, 5000)
      }
    })
    this.$EventBus.$on('vehicleAlarm', data => {
      this.alarmMarker.show()
      this.alarmMarker.setPosition([data.lng, data.lat])
      this.alarmMarker.setTitle(data.address)
      // this.amap.panTo([data.lng, data.lat])
    })
    this.$EventBus.$on('refreshAlarmMarkers', data => {
      this.refreshAlarmMakers(data)
    })
    this.$EventBus.$on('addHistoryMarker', data => {
      this.addHistoryMarker(data)
    })
    this.$EventBus.$on('addHistoryMarkers', dataList => {
      this.addHistoryMarkers(dataList)
    })
    // this.$axios.post('/vehicle_capture/list', {order: 'occured_time DESC'})
    //   .then(response => {
    //     const list = response.data.data.data
    //     list.map(e => {
    //       if (e.plateInfo === '') { e.plateInfo = '未检出' }
    //       e.plateInfo = `${e.plateInfo}  - ${e.sourceIP.split('.').length>=4 ? e.sourceIP.split('.')[3] : ''}`
    //       e.sourceTitle = `${e.sourceTitle} ${e.roadDirection || ''}`
    //     })
    //     this.vehicleViolationData.tableData = list
    //   })
    const list = require('./data/person.json').data
    const newList = []
    for (const item of list) {
      newList.push({
        LAT: "29.821961",
        LNG: "106.536629",
        objectType: item[2],
        occured_time: "2019-12-19 18:43:44",
        picVehicle: `/static/person/${item[0]}`,
        picVehicleSub:  `/static/person/${item[0]}`,
        vehicle_type: item[2],
        plateInfo: item[2]
      })
    }
      this.vehicleViolationData.tableData = newList
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
      this.fetchData()
      // this.initVehicleMarker()
      this.initAlarmMarker()
      this.contextMenu = new AMap.ContextMenu()
      const self = this
      this.contextMenu.addItem('复制当前坐标', function () {
        self.copyLngLat(self.contextMenuPositon)
      }, 0)
      this.contextMenu.addItem('摄像头聚焦此处', function () {
        self.$axios.post('vehicle_alarm/cameraFocus', {
          lng: self.contextMenuPositon.getLng(),
          lat: self.contextMenuPositon.getLat()
        })
      }, 1)
      this.amap.on('click', function (e) {
        self.enlargedImageVisible = false
        self.clearHistoryMarkers()
        self.$EventBus.$emit('mapClicked')
      })
      this.amap.on('rightclick', function (e) {
        self.contextMenu.open(self.amap, e.lnglat)
        self.contextMenuPositon = e.lnglat
      })
    },
    clearHistoryMarkers () {
      for (const marker of this.historyMarkers) {
        this.amap.remove(marker)
      }
      this.historyMarkers = []
    },
    zoomOut: function () {
      this.marker.hide()
      this.amap.setCenter(this.mapCenter)
      this.amap.setZoom(5)
      this.deviceListVisible = false
      this.infoContainerVisible = false
      this.statsVisible = false
    },
    fetchData: function () {
      this.$axios
        .post('/project/list', {size: 2000})
        .then(response => {
          this.projects = response.data.data.data
          this.showProjectDetail()
        })
    },
    showMarkers: function () {
      const iconSize = 20
      const style = [
        '/static/images/camera1.png',
        '/static/images/camera2.png',
        '/static/images/camera1_red.png'
      ].map(url => {
        return {
          url: url,
          anchor: new AMap.Pixel(5, 5),
          size: new AMap.Size(iconSize, iconSize)
        }
      })
      this.massMarkersData = []
      for (let i = 0; i < this.deviceList.length; i++) {
        if ((this.deviceList[i].LNG && this.deviceList[i].LAT) ||
          (this.deviceList[i].Longitude && this.deviceList[i].Latitude) ||
          (this.deviceList[i].lbsLongitude && this.deviceList[i].lbsLatitude)
        ) {
          let data = {
            lnglat: this.getLngLat(this.deviceList[i]),
            name: this.deviceList[i].NAME,
            id: i,
            uuid: this.deviceList[i].UUID,
            style: this.getStyle(this.deviceList[i])
          }
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
      this.ipIndexedDeviceList = _.indexBy(this.deviceList, 'IPADDR')
      this.massMarks.setData(this.massMarkersData)
      this.massMarks.setMap(this.amap)
      this.massMarks.on('click', this.onMassMarksClick)
      this.massMarks.on('mouseover', this.onMassMarksMouseOver)
      this.massMarks.on('mouseout', this.onMassMarksMouseOut)
      this.massMarks.show()
      this.projectMarks ? this.projectMarks.hide() : ''

      this.initAlarmMarkers()
    },
    refreshMarkers () {
      for (const data of this.deviceList) {
        let markerData = this.indexedMassMarkersData[data.UUID]
        if (markerData) {
          markerData.style = this.getStyle(data)
        }
      }
      if (this.massMarks) {
        this.massMarks.setData(this.massMarkersData)
      }
    },
    initAlarmMarkers () {
      this.$axios.post('vehicle/stats')
        .then(response => {
          let data = response.data.data
          this.alarmList = data.alarmList
          this.refreshAlarmMakers(this.alarmList)
        })
    },
    refreshAlarmMakers (alarmList) {
      const self = this
      for (const marker of this.alarmMarkers) {
        this.amap.remove(marker)
      }
      for (const data of alarmList) {
        const alarmMarker = new AMap.Marker({
          map: this.amap,
          icon: '/static/images/danger.png',
          offset: new AMap.Pixel(-34, -21),
          zIndex: 9,
          title: data.address
        })
        alarmMarker.setPosition([data.lng, data.lat])
        alarmMarker.on('click', () => {
          self.showAlarmDetail(data)
        })
        this.alarmMarkers.push(alarmMarker)
      }
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
      // this.debugInfoVisible = true
      const device = this.deviceList[e.data.id]
      this.focusDeviceData = device
      if (device.LNG && device.LAT) {
        this.marker.setPosition([device.LNG, device.LAT])
        this.marker.setLabel({content: `${device.NAME} ${device.IPADDR}`})
        this.marker.show()
      }
    },
    onMassMarksMouseOut (e) {
      this.marker.hide()
      this.debugInfoVisible = false
    },
    onMassMarksClick (e) {
      if (this.selectMode) {
        return
      }
      // this.player = new JSMpeg.Player('ws://10.168.71.200:9999', {
      //   canvas: this.$refs.canvas
      // })
      // this.canvasVisible = true
      this.showDetail(e)
    },
    showProjectDetail: function (e) {
      const project = this.projects.find(e => e.title === '中科洛丁展示项目/重庆展厅')
      this.$EventBus.$emit('projectChanged', {project})
      if (project.lng) {
        this.amap.setCenter([project.lng, project.lat])
        this.amap.setZoom(14)
      }
      this.deviceList = []
      this.deviceList_kk = []
      this.$axios
        .post('/v_device/list', {where: { PROJECT: project.title, TYPE: ['IN', [3, 4]] }, size: 2000})
        .then(response => {
          this.deviceList = this.deviceList.concat(response.data.data.data)
          this.indexedDeviceList = _.indexBy(this.deviceList, 'UUID')
          this.showMarkers()

          this.deviceList_kk = _.filter(this.deviceList, {TYPE: 4})
          this.ipIndexedDeviceList_kk = _.indexBy(this.deviceList_kk, 'IPADDR')
          this.$EventBus.$emit('vehicleItem_kk', this.ipIndexedDeviceList_kk)
        })
      this.fetchStatsData()
    },
    reloadProject () {
      if (!(this.projects.length > 0 && this.projectSelectedIndex >= 0)) return
      this.refreshMarkers()
    },
    reloadProjectMarkers: function (project) {
      if (!project) return
      this.deviceList = []
      this.$axios
        .post('/v_device/list', {where: { PROJECT: project.title, TYPE: ['IN', [3, 4]] }, size: 2000})
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
      this.deviceType = 'v_device'
      this.infoContainerVisible = true
    },
    showVehicleDetail: function (data) {
      this.currentDeviceID = data._id
      this.currentData = data
      this.deviceType = 'v_vehicle_danger'
      this.infoContainerVisible = true
    },
    showAlarmDetail: function (data) {
      this.currentDeviceID = data._id
      this.currentData = JSON.parse(JSON.stringify(data))
      this.deviceType = 'vehicle_alarm'
      this.infoContainerVisible = true
    },
    hideDetail: function () {
      this.infoContainerVisible = false
      this.clearHistoryMarkers()
    },
    copyLngLat (lnglat) {
      this.$alert(`${lnglat.getLng()},${lnglat.getLat()}`, '经纬度', {
        confirmButtonText: 'OK',
        callback: action => {
        }
      })
      this.$EventBus.$emit('mapDoubleClicked', {lng: lnglat.getLng(), lat: lnglat.getLat()})
    },
    projectSelectChange: function (value) {
      this.amap.panTo([this.projects[value].lng, this.projects[value].lat])
    },
    locateDeviceWithID: function (id, plateInfo) {
      let device = _.findWhere(this.deviceList, {IPADDR: id})
      this.locateDevice(device, plateInfo, true)
    },
    locateDevice (device, plateInfo, showLabel) {
      this.focusCameraID = device.IPADDR
      if (showLabel) {
        this.marker.show()
        this.marker.setPosition([device.LNG, device.LAT])
        this.marker.setLabel({content: `${device.NAME}:${plateInfo}`, offset: new AMap.Pixel(-40, 0)})
      }
      this.refreshMarkers()
    },
    deviceListItemClicked (uuid) {
      let device = this.indexedDeviceList[uuid]
      this.showDeviceDetail(device)
      this.locateDevice(device)
    },
    deviceListItemsSelected (ids) {
      this.selectedUUIDs = ids
    },
    toggleDeviceList () {
      this.marker.hide()
      this.selectMode = false
      this.deviceListVisible = !this.deviceListVisible
      this.infoContainerVisible = false
      this.statsVisible = false
    },
    gpsTransform (lng, lat) {
      return gpsUtil.gpsTransform(lng, lat)
    },
    fetchStatsData () {
      this.currentTime = moment().format('HH:mm:ss')
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
      return device.LNG && device.LAT
        ? [device.LNG, device.LAT]
        : device.Longitude && device.Latitude
          ? this.gpsTransform(device.Longitude, device.Latitude)
          : [device.lbsLongitude, device.lbsLatitude]
    },
    getStyle (device) {
      // eslint-disable-next-line eqeqeq
      if (device.IPADDR === this.focusCameraID) console.log(this.focusCameraID)
      return device.TYPE === 4 ? (device.IPADDR === this.focusCameraID ? 2 : 0) : 1
    },
    initVehicleMarker () {
      this.vehicleMarker = new AMap.Marker({
        map: this.amap,
        icon: '/static/images/vehicle_green.png',
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      })
      this.vehiclePolyline = new AMap.Polyline({
        map: this.amap,
        showDir: true,
        strokeColor: '#28F',
        strokeWeight: 6
      })

      this.vehiclePassedPolyline = new AMap.Polyline({
        map: this.amap,
        strokeColor: '#28F',
        strokeWeight: 6
      })

      const self = this
      this.vehicleMarker.on('moving', function (e) {
        const lnglat = e.target.getPosition()
        const paths = self.vehiclePaths[self.vehiclePassedIndex]
        for (let i = 0; i < paths.length; i++) {
          if (paths[i].getLng() === lnglat.getLng()) {
            console.log(`经过：${lnglat.getLng()}`)
            self.$notify({
              title: '',
              type: 'info',
              dangerouslyUseHTMLString: true,
              showClose: false,
              message: `经过：${lnglat.getLng()}`,
              duration: 3000
            })
          }
        }
        self.vehiclePassedPolyline.setPath(e.passedPath)
      })

      //       this.vehicleMarker.on('moveend', function (e) {
      //         const lnglat = e.target.getPosition()
      //         const paths = self.vehiclePaths[self.vehiclePassedIndex]
      //         if (paths[paths.length-1].getLng() == lnglat.getLng()) {
      //           console.log('last')
      //                        self.vehicleMarker.setContent(`<div style="position:relative"><img  style="position:absolute; top:0; left:0" src="/static/images/vehicle_green.png"/>
      //       <svg style="position:absolute; top:-36px; left:-70px" xmlns="http://www.w3.org/2000/svg" version="1.1">
      //   <circle cx="100" cy="50" r="40" stroke="blue"
      //   stroke-width="5" fill="transparent"/>
      // </svg>
      //       </div>`)
      //         }
      //       })
    },
    startVehicleAnimation (index) {
      this.vehiclePassedIndex = index
      this.vehiclePassed = []
      // this.vehicleMarker.setContent(`<div style="position:relative"><img  style="position:absolute; top:0; left:0" src="/static/images/vehicle_green.png"/>
      //   </div>`)
      this.vehicleMarker.setPosition(this.vehiclePaths[index][0])
      this.vehicleMarker.moveAlong(this.vehiclePaths[index], 1000)
    },
    addHistoryMarker (data) {
      let LNG = data.LNG
      let LAT = data.LAT
      if (!(LNG && LAT)) {
        const device = this.ipIndexedDeviceList[data.sourceIP]
        if (device) {
          LNG = device.LNG
          LAT = device.LAT
        }
      }
      const marker = new AMap.Marker({
        map: this.amap,
        position: new AMap.LngLat(LNG, LAT),
        icon: '/static/images/circle.png',
        offset: new AMap.Pixel(-16, -16),
        title: data.occured_time
      })
      this.historyMarkers.push(marker)
    },
    addHistoryMarkers (dataList) {
      this.clearHistoryMarkers()
      for (const data of dataList) {
        this.addHistoryMarker(data)
      }
    },
    initAlarmMarker () {
      this.alarmMarker = new AMap.Marker({
        map: this.amap,
        icon: '/static/images/danger.png',
        zIndex: 99,
        offset: new AMap.Pixel(-42, -29)
      })
      this.alarmMarker.hide()
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
#mapHead {
  z-index: 999;
  color: #dddddd;
  right: 0px;
  top: 0px;
  left: 0px;
  height: 50px;
  position: absolute;
  float: left;
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
#infoContainer{
  background-color: rgba(12, 27, 78, 0.9);
  color: white;
  font-size:9px;
  right: 10px;
  bottom: 160px;
  width: 450px;
  top: 10px;
  position: absolute;
  z-index: 999;
  /* overflow-y:auto;
  overflow-x:hidden; */
}

#capturedImage{
  background-color: rgba(12, 27, 78, 0.9);
  color: white;
  font-size:9px;
  left: 20px;
  width: 320px;
  height: 240px;
  bottom: 220px;
  position: absolute;
  z-index: 999;
}

#enlargedImage{
  background-color: rgba(12, 27, 78, 0.9);
  color: white;
  font-size:9px;
  right: 20px;
  height: 600px;
  bottom: 220px;
  position: absolute;
  z-index: 1000;
}

#statsContainer {
  background-color: rgb(29, 32, 41);
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

#vehicleDataList {
    position: absolute;
    width: 400px;
    height: 400px;
    bottom: 20px;
    left: 20px;
    background-color:rgba(12, 27, 78, 0.9);
    z-index: 9;
}

#vehicleImageDataList {
    position: absolute;
    height: 150px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    background-color:rgba(12, 27, 78, 0.9);
    z-index: 998;
    overflow: hidden;
}

@media screen and (max-width: 800px) {
  #infoContainer {
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
