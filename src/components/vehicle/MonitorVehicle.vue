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
          <StatsDangerCount style="height:75%" :dangerCountValues="dangerCountValues" :dangerCountOptions="dangerCountOptions"/>
        </FrameContainer>
        <FrameContainer style="height:calc(100% - 390px + 155px); overflow:hidden" >
          <div class="ilist">
            <!-- <p>危化品车辆检出状态</p> -->
            <div>
              <ul>
                <li v-for="(item, i) in vehicleItem" :key="i" @click="dangerItemClick(vehicleItem[i])">
                  <!-- <p>{{vehicleItem[i].IPADDR.split(".")[3]}}</p> -->
                  <p>{{i+1}}</p>
                  <div>
                    <el-image fit="cover" :src="vehicleItem[i].picVehicleSub" :title="vehicleItem[i].IPADDR + '\n' + vehicleItem[i].ADDR">
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
      </div>
    </el-aside>
    <el-main style="position:relative;">
      <PortalMap ref="map"  style="height:100%" :alarmList="alarmList"/>
    </el-main>
  </el-container>
</template>

<script>
import PortalMap from '@/components/vehicle/PortalMapVehicle'
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
      const list = require('./data/object.json').data
      const newList = []
      for (const item of list) {
        newList.push({
          LAT: "29.821961",
          LNG: "106.536629",
          objectType: item[2],
          occured_time:  moment().add(- Math.random()* 10000, "seconds").format('YYYY-MM-DD HH:mm:ss'),
          picVehicle: `/static/object/${item[0]}`,
          picVehicleSub:  `/static/object/${item[0]}`,
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
