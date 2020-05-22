<template>
  <el-container id="monitor" style="height:100%;overflow:auto">
    <div id="listContainer" v-if="listVisible">
      <VehicleReport v-if="dataListType==='vehicle_report'" />
      <DataList ref="dataList" :datatype="dataListType" fixedColumns="0" v-else/>
    </div>
    <el-aside v-show="isMonitorView" ref="leftSideMenu" width="480px">
      <div style="height: 100%; width: 60px; background: #0d213b; float:left;">
        <el-menu :default-openeds="['1']" :default-active="$route.path">
          <el-menu-item index="home" @click="hideList">
            <i class="el-icon-s-home" style="font-size:15pt;"/>
          </el-menu-item>
          <el-menu-item index="vehicle" @click="toggleDataList('v_vehicle_danger')">
            <i class="el-icon-truck" style="font-size:15pt;"/>
          </el-menu-item>
          <el-menu-item index="settings" @click="toggleDataList('supervisor')">
            <i class="el-icon-user-solid" style="font-size:15pt;"/>
          </el-menu-item>
          <el-menu-item index="chart" @click="toggleDataList('vehicle_report')">
            <i class="el-icon-s-data" style="font-size:15pt;"/>
          </el-menu-item>
        </el-menu>
      </div>
      <div style="height: 100%; width: 420px; float:left;">
        <FrameContainer style="height:235px; overflow:hidden" >
          <StatsPersonCount style="height:75%" :dangerCountValues="dangerCountValues" :dangerCountOptions="dangerCountOptions"/>
        </FrameContainer>
        <FrameContainer style="height:calc(100% - 390px + 155px); overflow:hidden" >
          <div class="ilist">
            <!-- <p>危化品车辆检出状态</p> -->
            <div>
              <ul>
                <li v-for="(item, i) in vehicleItem" :key="i" @click="dangerItemClick(vehicleItem[i])">
                  <p>{{i+1}}</p>
                  <div>
                    <el-image  fit="scale-down" :src="vehicleItem[i].picVehicleSub" :title="vehicleItem[i].IPADDR + '\n' + vehicleItem[i].ADDR">
                      <div slot="error"  class="image-slot">
                        <el-image src="/static/images/default_error.png"></el-image>
                      </div>
                    </el-image>
                    <span>{{vehicleItem[i].occured_time}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </FrameContainer>
        <!-- <FrameContainer style="height:155px; overflow:hidden;" >
          <div style="display: flex; flex-direction: row; flex-wrap: nowrap; width: 90%; height: 90%;padding:10px; font-size: 9pt; line-height: 30px; background: #0E2A43; color:lightgray;  overflow:hidden">
            <div style="flex:1">
              CPU使用率:{{sysInfo.cpuInfo ? (sysInfo.cpuInfo * 100).toFixed(1) : 0}}%
              <ECharts style="width:130px;height:100px" :options="realtimeCpuChartOption" autoresize />
            </div>
            <div style="flex:1">
              内存剩余：{{sysInfo.memoryInfo ? sysInfo.memoryInfo.freeMemMb : 0}}M
              <ECharts style="width:130px;height:100px" :options="realtimeMemChartOption" autoresize />
            </div>
            <div style="flex:1">
              磁盘剩余：{{sysInfo.driveInfo ? sysInfo.driveInfo.freeGb : 0}}G
              <ECharts style="width:130px;height:100px" :options="realtimeDriveChartOption" autoresize />
            </div>
          </div>
       </FrameContainer> -->
      </div>
    </el-aside>
    <el-main style="position:relative;">
      <PortalMap ref="map"  style="height:100%" :alarmList="alarmList"/>
    </el-main>
  </el-container>
</template>

<script>
import PortalMap from '@/components/vehicle/PortalMapPerson'
import FrameContainer from '@/components/vehicle/FrameContainer'
import StatsPersonCount from '@/components/vehicle/StatsPersonCount'
import StatsDataTable from '@/components/vehicle/StatsDataTable'
import StatsDataList from '@/components/vehicle/StatsDataList'
import DataList from '@/components/vehicle/DataList'
import VehicleReport from '@/components/vehicle/VehicleReport'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import {_} from 'underscore'
import moment from 'moment'

export default {
  components: {PortalMap,
    StatsPersonCount,
    StatsDataTable,
    StatsDataList,
    ECharts,
    FrameContainer,
    DataList,
    VehicleReport
  },
  data: function () {
    return {
      fullname: '',
      currentTime: '',
      isMonitorView: true,
      isFooterShow: false,
      dangerCountValues: {},
      dangerCountOptions: {},

      alarmList: [],
      alarmCount: 0,
      listVisible: false,
      dataListType: 'vehicle_alarm',

      vehicleItem: [],
      cameraLastDangerVehicles: [],

      sysInfo: {},
      realtimeCpuChartOption: {},
      realtimeMemChartOption: {},
      realtimeDriveChartOption: {}
    }
  },
  mounted: function () {
    this.fetchData()
    this.$EventBus.$on('mapClicked', () => {
      this.listVisible = false
    })
    this.$EventBus.$on('vehicleItemClicked', data => {
      this.listVisible = false
    })
    this.$EventBus.$on('dataItemUpdated', data => {
      if (data === 'vehicle_alarm') {
        this.fetchData()
      }
    })
    // this.$EventBus.$on('vehicleItem_kk', data => {
    //   this.vehicleItem = data
    //   _.each(this.vehicleItem, (v, k, list) => {
    //     v.picVehicleSub = 'static/images/default_sub.jpg'
    //     v.picVehicle = 'static/images/default.jpg'
    //     v.occured_time = '2019-12-31 12:31:12'
    //   })
    //   this.updateCameraVehicleList()
    // })

    setInterval(() => {
      this.getCurrentTime()
    }, 1000)
    setInterval(this.fetchData, 60000)

    this.realtimeCpuChartOption = JSON.parse(JSON.stringify(require('@/components/vehicle/echartsconfig/generalMiniLineOptions').default))
    this.realtimeMemChartOption = JSON.parse(JSON.stringify(require('@/components/vehicle/echartsconfig/generalMiniLineOptions').default))
    this.realtimeDriveChartOption = JSON.parse(JSON.stringify(require('@/components/vehicle/echartsconfig/generalPieOptions').default))
    for (let chart of [[this.realtimeCpuChartOption, 100], [this.realtimeMemChartOption, 100]]) {
      chart[0].yAxis.min = 0
      chart[0].yAxis.max = chart[1]
      while (chart[0].xAxis.data.length < 20) {
        chart[0].xAxis.data.push('')
        chart[0].series[0].data.push(10)
      }
    }
  },
  sockets: {
    incident: function (data) {
      data.occured_time = moment().format('YYYY-MM-DD HH:mm:ss')
      data._id = Math.floor(Math.random() * 10000000000000)
      data.sourceTitle = `${data.sourceTitle} ${data.roadDirection ? data.roadDirection : ''}`
      data.image = `<img style="width:60px; vertical-align:middle" src="${data.picVehicleSub}" />`
      this.$EventBus.$emit('vehicleCaptured', data)
      if (data.dangmark === '是') {
        _.each(this.vehicleItem, (v, k, list) => {
          if (v.IPADDR === data.sourceIP) {
            v.picVehicleSub = data.picVehicleSub
            v.picVehicle = data.picVehicle
            v.occured_time = data.occured_time
          }
        })
      }
      this.$refs.map.locateDeviceWithID(data.sourceIP, data.plateInfo)
    },
    alarmed: function (data) {
      data.time = data.ts ? moment(data.ts).format('YYYY-MM-DD HH:mm:ss') : ''
      this.$EventBus.$emit('vehicleAlarm', data)
      this.$notify({
        title: '紧急事故',
        type: 'Warning',
        dangerouslyUseHTMLString: true,
        showClose: false,
        message: `${data.address}, ${data.dangerType}`,
        duration: 3000
      })
      setTimeout(this.fetchData, 2000)
    }
  },
  methods: {
    fetchData: function () {
      let data = require('./data/stats.json')
          let options = {}
          try {
            options = require('./echartsconfig/dangerCountChartOptions.js').default
            options.series[0].data = _.pluck(data.dangerCountDaily, 'count')
            options.xAxis.data = _.pluck(data.dangerCountDaily, '_id')
            this.dangerCountOptions = options
          } catch (e) {}
      const list = require('./data/person.json').data
      const newList = []
      for (const item of list) {
        newList.push({
          LAT: "29.821961",
          LNG: "106.536629",
          objectType: item[2],
          occured_time:  moment().add(- Math.random()* 10000, "seconds").format('YYYY-MM-DD HH:mm:ss'),
          picVehicle: `/static/person/${item[0]}`,
          picVehicleSub:  `/static/person/${item[0]}`,
          vehicle_type: item[2],
          plateInfo: 'aaaa'
        })
      }
      this.vehicleItem = newList.reverse()

    },
    updateCameraVehicleList () {
      // if (this.cameraLastDangerVehicles.length <= 0) return
      // this.cameraLastDangerVehicles.forEach(e => {
      //   _.each(this.vehicleItem, (v, k, list) => {
      //     if (v.IPADDR === e._id && (moment(e.occured_time).add(1, 'days') > moment())) {
      //       v.picVehicle = e.picVehicle
      //       v.picVehicleSub = e.picVehicleSub
      //       v.plateInfo = e.plateInfo
      //       v.occured_time = e.occured_time
      //     }
      //   })
      // })
    },
    dangerItemClick (row) {
      this.$EventBus.$emit('dangerVehicleClick', row)
    },
    getCurrentTime () {
      let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
      let date_time = new Date()
      let year = date_time.getFullYear()
      if (year < 10) {
        year = '0' + year
      }
      let month = date_time.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let day = date_time.getDate()
      if (day < 10) {
        day = '0' + day
      }
      let hours = date_time.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      let minutes = date_time.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let seconds = date_time.getSeconds()
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      this.currentTime = year + '年' + month + '月' + day + '日' + ' ' + show_day[date_time.getDay()] + ' ' + hours + ':' + minutes + ':' + seconds
    },
    toggleDataList (dataType) {
      this.listVisible = false
      this.dataListType = dataType
      this.listVisible = true
    },
    hideList () {
      this.listVisible = false
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 0
}
#monitor td{
  background:transparent !important;
  padding:5px;
}
.map_footer{
  height:25%;
  background-color: #0E2A43;
}
.el-notification {
  background: #ff0000;
}
.el-notification__title, .el-notification__content {
  color: white;
}
#banner{
  left: 350px;
  top: -50px;
  width: 1200px;
  height: 200px;
  position: absolute;
  z-index: 800;
  /* background: url('/static/images/bg.png') no-repeat; */
}

#listContainer{
  left: 60px;
  width: 1000px;
  height: 100%;
  background: #0E2A43;
  position: absolute;
  z-index: 1100;
  overflow-y: scroll;
}

#bannerTitle{
  font-size: 35pt;
  color: rgb(240, 240, 240);
  left: 100px;
  right: 100px;
  top: 20px;
  margin: auto;
  /* height: 250px; */
  position: absolute;
  z-index: 800;
  text-shadow:10px 10px 10px black
}
#bannerTime{
  font-size: 18px;
  color: rgb(240, 240, 240);
  right: 15px;
  top: 17px;
  width: 300px;
  height: 100px;
  position: absolute;
  z-index: 800;
  text-shadow:10px 10px 10px black
}
#bannerWeather{
  right: 15px;
  top: 30px;
  width: 250px;
  height: 120px;
  position: absolute;
  z-index: 800;
}
.badge {
  position: absolute;
  top: -10px;
  left: 10px;
}
.ilist{
  width:100%;
  height:100%;
  float: left;
  text-align: left;
  position: absolute;
}
.ilist>p{
  font-size:18px;
  color: #3bdafe;
  height: 3%;
  position: relative;
  text-align: center;
  padding:10px 15px 0px;
}
.ilist div{
  width: 98%;
  height: 97%;
  color: white;
  position: relative;
  font-size: 9px;
  text-align: left;
  padding:0% 1%;
  border-collapse:collapse;
}
.ilist div ul{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 0px 0px 5px;
}
.ilist div ul li{
  list-style: none;
  float: left;
  width: 30%;
  height: 13%;
  margin: 8px 5px;
  position: relative;
}
.ilist div ul li div{
  width: 100%;
  height: 90%;
  vertical-align: middle;
  float: left;
  z-index: 11;
  cursor: pointer;
}
.ilist div ul li div span{
  color: white;
}
.ilist div ul li p{
  position: absolute;
  z-index: 22;
  color: #3bdafe;
  font-size: 14px;
  background: rgba(0, 0, 0, .3);
  margin-left: 3px;
}
.ctitle{
  font-size:18px;
  color: aqua;
  float: left;
  margin: 5px;
}
.ctable{
  width: 100%;
  color: white;
  margin-top: 10px;
}
.ctable th{
  font-size: 16px;
}
.image-slot{
  background-image: url("/static/images/default_error.jpg");
  background-color: red;
}
</style>
