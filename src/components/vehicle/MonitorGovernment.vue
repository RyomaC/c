<template>
  <el-container id="monitor" style="height:100%;overflow:auto">
    <el-aside width="25%" style="min-width:550px">
      <FrameContainer style="height:25%; overflow:hidden" >
        <StatsBox  style="height:75%"/>
      </FrameContainer>
      <FrameContainer style="height:25%; overflow:hidden" >
        <el-row :gutter="20" style="height:100%; border:0; padding:0">
          <el-col :span="24" style="height:100%;">
            <ECharts style="width:100%; height:100%" :options="chartOptions"/>
          </el-col>          
        </el-row>
      </FrameContainer>
      <FrameContainer  style="height:50%; overflow:hidden;background-color:#0E2A43" >
        <!-- <StatsCityEvent/> -->
        <StatsDataList ref="cityEventList" style="padding-top:10px; height:calc(100% - 20px)" :options="cityEventData" />
      </FrameContainer>
    </el-aside>
    <el-main>
      <PortalMap ref="map" style="height:100%"/>
    </el-main>
  </el-container>
</template>

<script>
import PortalMap from '@/components/vehicle/PortalMapGovernment'
import FrameContainer from '@/components/FrameContainer'
import StatsBox from '@/components/StatsGovernment'
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

import {_} from "underscore"
import echartsUtil from '@/utils/echartsUtil'

export default {
  components: {PortalMap, StatsBox, 
    StatsDataList, ECharts,  FrameContainer
  },
  methods: {
    fetchData: function() {
      this.$axios.post('stats/portal')
      .then( response => {
        let data = response.data.data
        let options = {}
        options['title'] = '市政事件动态'
        options['tableData'] = _.each(data.city_event_list.recent_list, (v, k, list) => {
          v.occured_time = v.occured_time.slice(0,10);
        });
        options['columns'] = [
          {prop: 'area', label: '地点', width: 100},
          {prop: 'source_id', label: '名称', width: 100},
          {prop: 'type', label: '类型', width: 100},
          {prop: 'occured_time', label: '时间', width: 250},
        ]
        this.cityEventData = options;
      })
    },
  },
  data: function() {
    return {
      fullname: '',
      currentTime:'',
      leftSideMenuShown:true,
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
      onlineRateChartOptions: require('./echartsconfig/onlineRateChartOptions').default,

      chartOptions: require('../echartsconfig/securityChartOptions').default,

      environmentChartSelectedIndex: 0,
      lampOnRateChartSelectedIndex: 0,
    }
  },
  mounted: function() {
    this.fetchData()
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