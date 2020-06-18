<template>
    <div style="height:100%;margin-left:140px;">
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
        <div id="mapHead" v-if="mapHeadVisible">
          <div id = "actionBar">
            <el-tooltip :content="isDraw ? '关闭框选' : '开始框选'" placement="bottom">
              <el-button type="text" :icon="isDraw ? 'el-icon-close' : 'el-icon-crop'"  @click="drawRectangle()" v-show="chooseVisible"/>
            </el-tooltip>
            <el-button type="text" icon="el-icon-s-data" @click="toggleStats" />
            <el-button type="text" icon="el-icon-refresh" @click="reloadProjectMarkers(projects[projectSelectedIndex])"/>
            <el-button type="text" icon="el-icon-map-location" @click="zoomOut" />
            <el-button type="text" icon="el-icon-s-grid" @click="toggleDeviceList"/>
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
          <!-- <div id="timeline" style="width:86%; position:absolute; top:-15px;z-index:2;">
            <el-slider v-model="focusTime" :step="1" :max="96" @change="sliderChange" :marks="getSliderMark()" :format-tooltip="formatSliderTooltip"></el-slider>
            <el-button type="text" icon="el-icon-video-play" @click="replay" > </el-button>
          </div>
          <div id="currenttime" style="width:86%;position:absolute;top:-15px;z-indez:1;">
            <el-slider v-model="cuTime" :step="1" :max="1440" :marks="getSliderMark1()" disabled></el-slider>
          </div> -->
        </div>
        <div class="deviceList" v-show="deviceListVisible">
          <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
          <PortalDeviceList :deviceList="deviceList" :selectedUUIDsProp="selectedUUIDs" :selectModeProp="selectMode" @itemClicked="deviceListItemClicked" @itemsSelected="deviceListItemsSelected" @controlModeChange='controlModeChange'/>
        </div>
        <div id="infoContainer" v-if="infoContainerVisible && !deviceControlVisible">
            <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
            <DataItem ref="dataItem" :data_id="currentDeviceID" :data_action="currentAction" :data_type="deviceType" :data="currentData" @hideItem="hideDetail" @itemUpdated="reloadProject"/>
        </div>
        <div id="deviceControlContainer" v-if="deviceControlVisible && !infoContainerVisible">
          <div style="text-align:right; margin-right:10px;"><el-button icon="el-icon-close" type="text" @click="hideDetail"/></div>
            <DeviceControl :uuids="Object.keys(selectedUUIDs)" :project="projects[projectSelectedIndex]" v-show="deviceControlVisible"/>
        </div>
        <div id="statsContainer" v-if="statsVisible">
          <!-- <component v-bind:is="portalComponent" /> -->
          <Portal :project="projects[projectSelectedIndex]" :statsData="statsData"/>
        </div>
    </div>
</template>

<script>
import DataList from '@/components/DataList'
import DataItem from '@/components/DataItem'
import Portal from '@/components/Portal'
import PortalDeviceList from '@/components/PortalDeviceList'
import DeviceControl from '@/components/DeviceControl'
import _ from 'underscore'
import moment from 'moment'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
// eslint-disable-next-line no-unused-vars
import echartsUtil from '@/utils/echartsUtil'
import warningStateUtil from '@/utils/warningStateUtil'
import Bus from '@/utils/bus.js'

export default {
  components: {DataList, DataItem, PortalDeviceList, DeviceControl, Portal, ECharts},
  data: function () {
    return {
      isDraw: false,
      focusTime: 1,
      cuTime: 1,
      firLampData: null,
      secLampData: null,
      focusDeviceData: {},
      selectMode: false,
      selectedUUIDs: {},
      selectedDeviceID: -1,
      indexedDeviceList: {},
      massMarks: null,
      massMarkersData: [],
      indexedMassMarkersData: {},
      lightMarkersData: [],
      statsData: {},
      projects: [],
      deviceList: [],
      projectSelectedIndex: -1,
      currentDeviceID: null,
      currentAction: 'view',
      deviceType: 'v_device',
      currentData: {},
      lightConnected: 0,
      realtimePowerChart: null,
      realtimeIlluChart: null,
      realtimeTempChart: null,
      debugInfoVisible: false,
      statsVisible: false,
      mapHeadVisible: false,
      deviceListVisible: false,
      deviceControlVisible: false,
      infoContainerVisible: false,
      chooseVisible: false
    }
  },
  mounted: function () {
    this.firLampData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.secLampData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.secLampData.series[0].areaStyle = {
      color: echartsUtil.gradientColor('rgba(100,44,90,0.3)', 'rgba(0,146,246,0.9)', 0, 1, 0, 0)
    }
    this.firLampData.series[0].step = 'end'
    this.secLampData.series[0].step = 'end'

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

    this.focusTime = Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)

    this.$EventBus.$on('zoomchange', (index) => {
      this.mapHeadVisible = index
      if (!index) {
        this.massMarks ? this.massMarks.hide() : ''
      }
    })

    this.$EventBus.$on('getmassMarks', index => {
      this.massMarks = index
    })

    this.$EventBus.$on('fetchStatsData', index => {
      this.deviceList = index
      this.fetchStatsData()
    })

    this.$EventBus.$on('getindexedDeviceList', index => {
      this.indexedDeviceList = index
      this.fetchStatsData()
    })

    this.$EventBus.$on('getindexedMassMarkersData', index => {
      this.indexedMassMarkersData = index
    })

    this.$EventBus.$on('getlightMarkersData', index => {
      this.lightMarkersData = index
    })

    this.$EventBus.$on('getmassMarkersData', index => {
      this.massMarkersData = index
    })

    this.$EventBus.$on('getprojectSelectedIndex', index => {
      this.projectSelectedIndex = index
    })

    this.$EventBus.$on('getprojects', index => {
      this.projects = index
    })

    this.$EventBus.$on('isPointInRing', index => {
      this.$set(this.selectedUUIDs, index, 1)
      this.reloadMassMarkersStyle()
    })

    this.$EventBus.$on('rightclick', index => {
      console.log(index)
      this.newItem(index.paramLnglat, index.paramItem)
    })

    this.$EventBus.$on('hidemodule', index => {
      this.statsVisible = false
      this.deviceListVisible = false
      this.deviceControlVisible = false
    })

    this.$EventBus.$on('hidedetail', index => {
      this.infoContainerVisible = false
      this.deviceControlVisible = false
      this.deviceListVisible = false
      this.selectMode = false
      this.chooseVisible = false
      this.selectedUUIDs = {}
      this.reloadMassMarkersStyle()
    })

    this.$EventBus.$on('onMassMarksClick', e => {
      if (e.data.type === 2) {
        this.deviceControlVisible = this.selectMode
        if (this.selectMode) {
          if (this.selectedUUIDs[e.data.uuid]) {
            this.$delete(this.selectedUUIDs, e.data.uuid)
          } else {
            this.$set(this.selectedUUIDs, e.data.uuid, 1)
          }
        } else {
          this.selectedUUIDs = {}
          this.$set(this.selectedUUIDs, e.data.uuid, 1)
          this.showDetail(e)
        }
      }
      this.reloadMassMarkersStyle()
    })

    this.$EventBus.$on('onMassMarksMouseOver', e => {
      const device = this.deviceList[e.data.id]
      if (device.TYPE !== 2) return
      this.focusDeviceData = device
      this.debugInfoVisible = true
      if (device.LNG && device.LAT) {
        this.$EventBus.$emit('setmarker', device)
      }
      this.firLampData.xAxis.data = [device.Fir_tt_Fir || '', device.Sec_tt_Fir || '', device.Thir_tt_Fir || '', device.Four_tt_Fir || '', device.Fif_tt_Fir || '', device.Six_tt_Fir || '']
      this.firLampData.series[0].data = [device.Fir_tp_Fir || 0, device.Sec_tp_Fir || 0, device.Thir_tp_Fir || 0, device.Four_tp_Fir || 0, device.Fif_tp_Fir || 0, device.Six_tp_Fir || 0]
      this.firLampData.animation = false
      this.secLampData.xAxis.data = [device.Fir_tt_Sec || '', device.Sec_tt_Sec || '', device.Thir_tt_Sec || '', device.Four_tt_Sec || '', device.Fif_tt_Sec || '', device.Six_tt_Sec || '']
      this.secLampData.series[0].data = [device.Fir_tp_Sec || 0, device.Sec_tp_Sec || 0, device.Thir_tp_Sec || 0, device.Four_tp_Sec || 0, device.Fif_tp_Sec || 0, device.Six_tp_Sec || 0]
      this.secLampData.animation = false
    })

    this.$EventBus.$on('onMassMarksMouseOut', e => {
      this.$EventBus.$emit('hidemarker', 1)
      this.debugInfoVisible = false
    })
  },
  destroyed: function () {
    clearInterval(this.refreshInterval)
  },
  sockets: {

  },
  watch: {

  },
  methods: {
    zoomOut: function () {
      this.$EventBus.$emit('hidemarker', 1)
      this.$EventBus.$emit('setCenterZoom', 1)
      this.$EventBus.$emit('hideMenu', 1)
      this.deviceListVisible = false
      this.deviceControlVisible = false
      this.infoContainerVisible = false
      this.statsVisible = false
      this.$EventBus.$emit('listVisible', 1)
    },
    hideDetail: function () {
      this.$EventBus.$emit('hidedetail1', 1)
      this.infoContainerVisible = false
      this.deviceControlVisible = false
      this.deviceListVisible = false
      this.selectMode = false
      this.chooseVisible = false
      this.selectedUUIDs = {}
      this.reloadMassMarkersStyle()
    },
    newItem: function (data, deviceType) {
      console.log(data)
      this.selectedDeviceID = ''
      this.currentDeviceID = ''
      this.deviceType = deviceType
      this.currentData = data
      this.currentAction = 'new'
      this.infoContainerVisible = true
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
                lng: device.LNG,
                lat: device.LAT,
                count: Math.floor(data.Power)
              })
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
      const currenttime = moment().format('HH:mm')
      const timemark = today.diff(yesterday, 'minute')
      this.cuTime = timemark
      marks[timemark] = {
        style: {
          color: 'red'
        },
        label: this.$createElement('strong', currenttime)
      }
      return marks
    },
    formatSliderTooltip (v) {
      return moment().startOf('day').add(v * 15, 'minutes').format('HH:mm')
    },
    drawRectangle () { // 鼠标矩形框选
      this.isDraw = !this.isDraw
      const allMarkers = this.lightMarkersData
      if (this.isDraw) {
        this.$EventBus.$emit('drawRectangle', allMarkers)
      } else { // 关闭框选功能
        this.$EventBus.$emit('closeMouseTool', 1)
      }
    },
    toggleStats () {
      this.$EventBus.$emit('listVisible', 1)
      this.$EventBus.$emit('hidemarker', 1)
      this.statsVisible = !this.statsVisible
      if (!this.portalComponent) this.portalComponent = () => import('@/components/Portal')
    },
    reloadProject () {
      if (!(this.projects.length > 0 && this.projectSelectedIndex >= 0)) return
      const project = this.projects[this.projectSelectedIndex]
      this.reloadProjectMarkers(project)
    },
    reloadProjectMarkers: function (project) {
      console.log(this.projects)
      console.log(this.projectSelectedIndex)
      if (!project) return
      this.$EventBus.$emit('reloadmarkers', project)
    },
    showDetail: function (e) {
      this.selectedDeviceID = e.data.id
      let device = this.deviceList[e.data.id]
      this.showDeviceDetail(device)
    },
    showDeviceDetail: function (device) {
      this.currentDeviceID = device._id
      this.currentAction = 'view'
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
    toggleDeviceList () {
      this.selectMode = false
      this.chooseVisible = false
      this.deviceControlVisible = false
      this.infoContainerVisible = false
      this.statsVisible = false
      this.$EventBus.$emit('hidemarker', 1)
      this.$EventBus.$emit('closeMouseTool', 1)
      this.$EventBus.$emit('listVisible', 1)
      this.deviceListVisible = !this.deviceListVisible
      this.selectedUUIDs = {}
      this.reloadMassMarkersStyle()
    },
    replay () {
      this.focusTime = 0
      let iterval = setInterval(() => {
        this.focusTime++
        if (this.focusTime > Math.floor(moment().diff(moment().startOf('day'), 'minute') / 15)) { clearInterval(iterval); iterval = null }
      }, 1000)
    },
    reloadMassMarkersStyle () {
      for (const markerData of this.lightMarkersData) {
        markerData.style = 1
      }
      for (const key of Object.keys(this.selectedUUIDs)) {
        let markerData = this.indexedMassMarkersData[key]
        if (markerData) {
          markerData.style = 5
        }
      }
      if (this.massMarks) {
        this.massMarks.setData(this.massMarkersData)
      }
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
    fetchStatsData () {
      console.log(this.projects)
      console.log(this.projectSelectedIndex)
      this.realtimePowerChart.series[0].data = []
      this.realtimeIlluChart.series[0].data = []
      this.realtimeTempChart.series[0].data = []

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
    locateDevice (device, showLabel) {
      this.$EventBus.$emit('setZoom', device)
      this.currentDeviceID = device._id
      this.infoContainerVisible = true
      if (showLabel) {
        this.$EventBus.$emit('setmarker', device)
      }
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
      this.$EventBus.$emit('hidemarker', 1)
      this.selectMode = selectMode
      this.infoContainerVisible = false
      this.deviceControlVisible = selectMode
      this.selectedUUIDs = {}
      this.$EventBus.$emit('closeMouseTool', 1)
      this.chooseVisible = selectMode
      this.isDraw = !selectMode
      this.reloadMassMarkersStyle()
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
#mapHead {
  z-index: 9999;
  color: #dddddd;
  background: rgba(34, 34, 34, 0.6);
  right: 0px;
  top: 0px;
  left: 0px;
  height: 50px;
  width: 100%;
  float: left;
  position: relative;
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
#debugInfoContainer {
  background-color: rgb(12, 27, 78);
  border: 1px sold white;
  color: white;
  font-size:12px;
  text-align: left;
  left: 160px;
  bottom: 20px;
  width: 250px;
  height: 330px;
  position: absolute;
  z-index: 1000;
  padding: 10px;
}
#statsContainer {
  background-color: rgb(29, 32, 41);
  border: 1px sold white;
  color: white;
  font-size:15px;
  right: 20px;
  bottom: 10px;
  left: 160px;
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
  left: 160px;
  bottom: 20px;
  width: 400px;
  height: 88%;
  position: absolute;
  z-index: 9999;
}
#infoContainer, #deviceControlContainer{
  background-color: rgba(12, 27, 78, 0.9);
  color: white;
  font-size:9px;
  right: 20px;
  bottom: 20px;
  width: 450px;
  top: 80px;
  position: absolute;
  z-index: 999;
  height: 86%;
}
.resizable{
  cursor: pointer;
}

@media screen and (max-width: 800px) {
  #debugInfoContainer {
    visibility: hidden;
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
  #infoContainer, #deviceControlContainer {
    background-color: rgb(12, 27, 78);
    right: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    top: 0px;
  }
}
</style>
