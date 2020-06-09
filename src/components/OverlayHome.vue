<template>
  <el-container id="monitor" style="height:100%;overflow:auto">
    <el-aside width="25%" style="min-width:550px">
      <FrameContainer style="height:25%; overflow:hidden" >
        <StatsEltbox style="height:75%" :eltboxValues="eltboxValues" :eltboxOptions="eltboxOptions"/>
      </FrameContainer>
      <FrameContainer style="height:25%; overflow:hidden" >
        <el-row :gutter="20" style="height:50%; border:0; padding:0">
          <el-col :span="12" style="height:100%;">
            <ECharts style="width:100%; height:100%" :options="deviceChartOptions"/>
          </el-col>
          <el-col :span="12" style="height:100%;">
            <ECharts ref="lampOnRateChart" style="width:100%; height:100%" :options="lampOnRateChartOptions"/>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="height:50%">
          <el-col :span="12" style="height:100%;">
            <ECharts style="width:100%; height:100%" :options="roadCrossChartOptions"/>
          </el-col>
          <el-col :span="12" style="height:100%;">
            <ECharts style="width:100%; height:100%" :options="onlineRateChartOptions"/>
          </el-col>
        </el-row>
      </FrameContainer>
      <FrameContainer style="height:25%; overflow:hidden" >
        <!-- <StatsException/> -->
        <el-row :gutter="20" style="height:100%">
          <el-col :span="12" style="height:100%;">
            <StatsDataList style="padding-top:10px; height:calc(100% - 20px)" :options="lampEventData" />
          </el-col>
          <el-col :span="12" style="height:100%;">
            <StatsDataList style="padding-top:10px; height:calc(100% - 20px)" :options="controllerEventData" />
          </el-col>
        </el-row>

      </FrameContainer>
      <FrameContainer  style="height:25%; overflow:hidden;background-color:#0E2A43" >
        <!-- <StatsCityEvent/> -->
        <StatsDataList ref="cityEventList" style="padding-top:10px; height:calc(100% - 20px)" :options="cityEventData" />
      </FrameContainer>
    </el-aside>
    <el-main width="75%" style="height:30%;top: 70%;">
      <FrameContainer class="map_footer">
        <swiper :options="swiperOption" style="height:calc(100% - 20px); width:calc(100% - 20px);padding-top:10px">
          <swiper-slide>
            <ECharts ref="environmentChart" style="height:100%; width:100%;" :options="environmentChartOptions" autoresize/>
          </swiper-slide>
          <swiper-slide>
            <StatsDataTable :options="emergencyData" />
          </swiper-slide>
          <!-- <swiper-slide>
            <ECharts style="height:100%; width:100%;" :options="parkChartOptions" autoresize/>
          </swiper-slide> -->
          <swiper-slide>
            <ECharts style="height:100%; width:100%;" :options="adChartOptions" autoresize/>
          </swiper-slide>
          <swiper-slide style="width:430px;">
            <StatsDataTable :options="chargeData" />
          </swiper-slide>
          <swiper-slide style="width:430px;">
            <StatsDataTable :options="manholeData" />
          </swiper-slide>
          <!-- <swiper-slide>
            <div style="width:500px; height:100%; display:flex; flex-direction:row">
              <div style="flex:1">
                <ECharts style="height:100%; width:250px" :options="wifiChartOptions" autoresize/>
              </div>
              <div style="height:100%; flex:1;">
                  <ECharts style="height:33%; width:250px;" :options="wifiOnlineRateChartOptions" autoresize/>
                  <ECharts style="height:33%; width:250px;" :options="wifiUserChartOptions" autoresize/>
                  <ECharts style="height:34%; width:250px;" :options="wifiUsageChartOptions" autoresize/>
              </div>
            </div>
          </swiper-slide> -->
          <swiper-slide style="width:430px;">
            <StatsDataTable :options="broadcastData" />
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </FrameContainer>
    </el-main>
  </el-container>
</template>

<script>
import PortalMap from '@/components/PortalMap'
import FrameContainer from '@/components/FrameContainer'
import StatsEltbox from '@/components/StatsEltbox'
import StatsException from '@/components/StatsException'
import StatsCityEvent from '@/components/StatsCityEvent'
import StatsDataTable from '@/components/StatsDataTable'
import StatsDataList from '@/components/StatsDataList'

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'

import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import {_} from 'underscore'
import echartsUtil from '@/utils/echartsUtil'

export default {
  components: {PortalMap,
    StatsEltbox,
    StatsException,
    StatsCityEvent,
    StatsDataTable,
    StatsDataList,
    ECharts,
    swiper,
    swiperSlide,
    FrameContainer
  },
  sockets: {
    summaryReport: function (data) {
      console.log('summaryReport')
      console.log(data)
      this.eltboxValues = {
        totalRatedPower: data.totalRatedPower,
        totalActualPower: data.totalActualPower,
        ecYear: data.ecYear,
        ecMonth: data.ecMonth
      }
    },
    deviceError: function (message) {
      this.$notify({
        title: '',
        type: 'info',
        dangerouslyUseHTMLString: true,
        showClose: false,
        message: `${message.uuid} 发生异常，代码：${message.data.Warning_state}`,
        duration: 30000
      })
    },
    incident_count: function (message) {
      let data = JSON.parse(message)
      switch (data.key) {
        case '报警.报警':
          this.emergencyData.aggregates[0].value = data.count
          break
        case '报警.对讲':
          this.emergencyData.aggregates[1].value = data.count
          break
        case '报警.监听':
          this.emergencyData.aggregates[2].value = data.count
          break
        case '井盖.倾斜':
          this.manholeData.aggregates[0].value = data.count
          break
        case '井盖.位移':
          this.manholeData.aggregates[1].value = data.count
          break
        case '井盖.电量过低':
          this.manholeData.aggregates[2].value = data.count
          break
      }
    },
    incident: function (message) {
      let data = JSON.parse(message)
      data.occured_time = data.occured_time.slice(0, 10)
      this.$notify({
        title: '',
        type: 'info',
        dangerouslyUseHTMLString: true,
        showClose: false,
        message: `${data.area} ${data.source_id} - ${data.type}`,
        duration: 8000
      })
      this.cityEventData.tableData.splice(0, 0, data)
      this.cityEventData.tableData.pop()
      switch (data.type) {
        case '报警':
          this.emergencyData.tableData.splice(0, 0, data)
          this.emergencyData.tableData.pop()
          break
        case '井盖':
          this.manholeData.tableData.splice(0, 0, data)
          this.manholeData.tableData.pop()
          break
      }
      this.$refs.map.locateDeviceWithID(data.source_id)
    }
  },
  methods: {
    fetchData: function () {
      this.$axios.post('stats/portal')
        .then(response => {
          let data = response.data.data

          this.eltboxValues = {
            totalRatedPower: data.totalRatedPower,
            totalActualPower: data.totalActualPower,
            ecYear: data.ecYear,
            ecMonth: data.ecMonth
          }

          let options = {}
          try {
            options = require('./echartsconfig/eltboxChartOptions.js').default
            // options.series[0].data = _.pluck(data.ratec.rows, 'VALUE').reverse()
            options.series[0].data = _.pluck(data.actec.rows, 'VALUE').reverse()
            options.xAxis.data = _.pluck(data.ratec.rows, 'TIME').reverse()
            this.eltboxOptions = options
          } catch (e) {}

          options = require('./echartsconfig/deviceChartOptions.js').default
          options.series[0].data = Object.values(data.device_summary).slice(0, 9)
          this.deviceChartOptions = options

          options = {}
          options['title'] = '报警'
          options['tableData'] = _.each(data.emergency_summary.recent_list, (v, k, list) => {
            v.occured_time = v.occured_time.slice(0, 10)
          })
          options['aggregates'] = _.each(data.emergency_summary.group_list, (v, k, list) => {
            v.title = v.type
            v.value = v.total
          })
          options['columns'] = [
            {prop: 'area', label: '区域', width: 100},
            {prop: 'source_id', label: '设备ID', width: 100},
            {prop: 'type', label: '类型', width: 100},
            {prop: 'handler', label: '操作人', width: 100},
            {prop: 'occured_time', label: '时间', width: 250}
          ]
          this.emergencyData = options

          options = {}
          options['title'] = '路灯事件动态'
          options['tableData'] = data.lamp_event_list
          options['columns'] = [
            {prop: 'id', label: '区域', width: 100},
            {prop: 'type', label: '类型', width: 100},
            {prop: 'status', label: '状态', width: 100}
          ]
          this.lampEventData = options

          options = {}
          options['title'] = '物联传感器事件动态'
          options['tableData'] = data.controller_event_list
          options['columns'] = [
            {prop: 'id', label: '区域', width: 100},
            {prop: 'type', label: '类型', width: 100},
            {prop: 'status', label: '状态', width: 100}
          ]
          this.controllerEventData = options

          options = {}
          options['title'] = '市政事件动态'
          options['tableData'] = _.each(data.city_event_list.recent_list, (v, k, list) => {
            v.occured_time = v.occured_time.slice(0, 10)
          })
          options['columns'] = [
            {prop: 'area', label: '地点', width: 100},
            {prop: 'source_id', label: '名称', width: 100},
            {prop: 'type', label: '类型', width: 100},
            {prop: 'occured_time', label: '时间', width: 250}
          ]
          this.cityEventData = options

          options = {}
          options['title'] = '充电'
          options['tableData'] = data.charge_summary.charge_count_list
          options['aggregates'] = [
            {title: '设备数量', value: data.charge_summary.sum_device_count},
            {title: '充电量', value: data.charge_summary.sum_charge_quantity.toFixed(2)},
            {title: '充电次数', value: data.charge_summary.sum_charge_count}
          ]
          options['columns'] = [
            {prop: 'title', label: '设备分组', width: 100},
            {prop: 'deviceCount', label: '设备数量', width: 100},
            {prop: 'chargeQuantity', label: '充电量', width: 100},
            {prop: 'chargeCount', label: '充电次数', width: 100}
          ]
          this.chargeData = options

          options = {}
          options['title'] = '井盖'
          options['tableData'] = _.each(data.manhole_summary.recent_list, (v, k, list) => {
            v.occured_time = v.occured_time.slice(0, 10)
          })
          options['aggregates'] = _.each(data.manhole_summary.group_list, (v, k, list) => {
            v.title = v.type
            v.value = v.total
          })
          options['columns'] = [
            {prop: 'area', label: '区域', width: 100},
            {prop: 'source_id', label: '设备ID', width: 100},
            {prop: 'type', label: '类型', width: 100},
            {prop: 'occured_time', label: '时间', width: 250}
          ]
          this.manholeData = options

          options = {}
          options['title'] = '广播'
          options['tableData'] = _.each(data.boradcast_summary, (v, k, list) => {
            v.time = v.time.slice(0, 10)
          })
          options['columns'] = [
            {prop: 'position', label: '区域', width: 100},
            {prop: 'status', label: '状态', width: 100},
            {prop: 'title', label: '播放资源', width: 100},
            {prop: 'time', label: '时间', width: 250}
          ]
          this.broadcastData = options

          options = require('./echartsconfig/wifiOnlineRateChartOptions.js').default
          options.series[0].data = data.wifi_summary.online_rate
          this.wifiOnlineRateChartOptions = options

          options = require('./echartsconfig/wifiUserChartOptions.js').default
          options.series[0].data = data.wifi_summary.user
          this.wifiUserChartOptions = options

          options = require('./echartsconfig/wifiUsageChartOptions.js').default
          options.series[0].data = data.wifi_summary.usage
          this.wifiUsageChartOptions = options

          options = require('./echartsconfig/parkChartOptions.js').default
          options.series[0].data = data.park_summary.in_use
          this.parkChartOptions = options

          options = require('./echartsconfig/adChartOptions.js').default
          options.xAxis.data = _.pluck(data.ad_summary, 'title')
          options.series[0].data = _.pluck(data.ad_summary, 'count')
          this.adChartOptions = options
        })
    },
    animate: function () {
      this.environmentChartSelectedIndex++
      if (this.environmentChartSelectedIndex >= this.environmentChartOptions.legend.data.length) {
        this.environmentChartSelectedIndex = 0
      }
    //   this.$refs.environmentChart.dispatchAction(
    //     {type: 'legendSelect', name: this.environmentChartOptions.legend.data[this.environmentChartSelectedIndex]})

    //   this.$refs.lampOnRateChart.dispatchAction(
    //     {type: 'downplay', seriesIndex: 0, dataIndex: this.lampOnRateChartSelectedIndex})
    //   this.lampOnRateChartSelectedIndex++
    //   if (this.lampOnRateChartSelectedIndex >= this.lampOnRateChartOptions.legend.data.length) {
    //     this.lampOnRateChartSelectedIndex = 0
    //   }
    //   this.$refs.lampOnRateChart.dispatchAction(
    //     {type: 'highlight', seriesIndex: 0, dataIndex: this.lampOnRateChartSelectedIndex})
    //   this.$refs.lampOnRateChart.dispatchAction(
    //     {type: 'showTip', seriesIndex: 0, dataIndex: this.lampOnRateChartSelectedIndex})
    }
  },
  data: function () {
    return {
      fullname: '',
      currentTime: '',
      leftSideMenuShown: true,
      glanceVisible: false,
      swiperOption: {
        slidesPerView: 'auto',
        autoplay: {
          delay: 8000
        },
        spaceBetween: 30,
        speed: 200,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      lampEventData: {},
      controllerEventData: {},
      cityEventData: {},
      emergencyData: {},
      chargeData: {},
      manholeData: {},
      broadcastData: {},
      eltboxValues: {},

      eltboxOptions: {},
      deviceChartOptions: {},
      lampOnRateChartOptions: require('./echartsconfig/lampOnRateChartOptions').default,
      roadCrossChartOptions: require('./echartsconfig/roadCrossChartOptions').default,
      onlineRateChartOptions: require('./echartsconfig/onlineRateChartOptions').default,
      parkChartOptions: {},
      adChartOptions: {},
      wifiChartOptions: require('./echartsconfig/wifiChartOptions').default,
      wifiOnlineRateChartOptions: require('./echartsconfig/wifiOnlineRateChartOptions').default,
      wifiUserChartOptions: {},
      wifiUsageChartOptions: {},
      environmentChartOptions: require('./echartsconfig/environmentChartOptions').default,

      environmentChartSelectedIndex: 0,
      lampOnRateChartSelectedIndex: 0
    }
  },
  mounted: function () {
    this.fetchData()
    setInterval(() => {
      this.animate()
    }, 5000)
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
  height:100%;
  background-color: #0E2A43;
}
.swiper-slide {
  width: 500px;
  height: 100%;
}
.el-notification {
  background: #ff0000;
}
.el-notification__title, .el-notification__content {
  color: white;
}
#banner{
  left: 500px;
  top: 0px;
  width: 1200px;
  height: 200px;
  position: absolute;
  z-index: 998;
  background: url('/static/images/bg.png') no-repeat;
}
#bannerTime{
  font-size: 25pt;
  color: rgb(240, 240, 240);
  left: 150px;
  top: 10px;
  height: 100px;
  position: absolute;
  z-index: 999;
  text-shadow:10px 10px 10px black
}
#bannerTitle{
  font-size: 45pt;
  color: rgb(240, 240, 240);
  left: 340px;
  top: 65px;
  /* height: 250px; */
  position: absolute;
  z-index: 999;
  text-shadow:10px 10px 10px black
}

.moduleTitle{
  color:white;
}
#topdrawer i{
  color:white;
  font-size: 25px;
}
#topdrawer .el-col{
  margin: 0 auto !important;
}
</style>
