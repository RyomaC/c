<template>
  <el-container id="monitor" style="height:100%;overflow:auto">
    <el-aside v-show="isMonitorView" ref="leftSideMenu" width="800px">
      <div style="height: 100%; width: 800px; float:left;">
        <DataList ref="dataList" :datatype="dataListType" fixedColumns="0" />
         <!-- <StatsDataList style="padding-top:10px; height:calc(100% - 20px)" :options="alarmData" /> -->
      </div>
    </el-aside>
    <el-main style="position:relative;">
      <PortalMap ref="map"  style="height:100%" :alarmList="alarmList"/>
    </el-main>
  </el-container>
</template>

<script>
import PortalMap from '@/components/vehicle/PortalMapAlarm'
import FrameContainer from '@/components/vehicle/FrameContainer'
import StatsDangerCount from '@/components/vehicle/StatsDangerCount'
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
    StatsDangerCount,
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

      alarmData: {},
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
  },
  methods: {
    fetchData: function () {

      this.$axios
        .post('/vehicle_alarm/list', {sort: {_id: -1}})
        .then(response => {
            options = {}
            options['title'] = 'aaa'
            options['tableData'] = response.data.data
            options['columns'] = [
              {prop: 'address', label: '地点', width: 100},
              {prop: 'contact', label: '联系人', width: 100},
              {prop: 'dangerType', label: '类型', width: 100},
            ]
          this.alarmData = options;
        })

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
