<template>
  <div class="text-light" style="padding:5px; width:100%; height:100%; overflow:hidden;">
    <el-container>
      <el-aside style="width:480px; position:relative;">
        <StatsBox style="height:120px;" :data="data"/>
        <div style="height:280px;width:480px;">
            <ECharts style="height:100%; width:100%;" :options="chartOptions" autoresize/>
        </div>
        <div>
          <ImageDataList id="vehicleImageDataList" :options="vehicleViolationData" />
        </div>
      </el-aside>
    <el-main>
    <el-row :gutter="0" style="height:38%; width:1400px;padding:0;">
      <el-col :span="12" style="padding:0;">
        <div class="grid-content bg-purple">
          <video-player  class="vjs-custom-skin"
                         :options="playerOptions"
                         :playsinline="true"
                         @play="onPlayerPlay($event)">
          </video-player>
        </div>
      </el-col>
        <el-col :span="12" style="padding:0;">
        <div class="grid-content bg-purple">
          <video-player  class="vjs-custom-skin"
                         :options="playerOptions2"
                         :playsinline="true"
                         @play="onPlayerPlay($event)">
          </video-player>
        </div>
      </el-col>
    </el-row>
      <el-row :gutter="0" style="height:38%; width:1400px;">
      <el-col :span="12" style="">
        <div class="grid-content bg-purple">
          <video-player  class="vjs-custom-skin"
                         :options="playerOptions3"
                         :playsinline="true"
                         @play="onPlayerPlay($event)">
          </video-player>
        </div>
      </el-col>
        <el-col :span="12" style="">
        <div class="grid-content bg-purple">
          <video-player  class="vjs-custom-skin"
                         :options="playerOptions4"
                         :playsinline="true"
                         @play="onPlayerPlay($event)">
          </video-player>
        </div>
      </el-col>
    </el-row>
    </el-main>
    </el-container>
  </div>
</template>

<script>
import FrameContainer from '@/components/FrameContainer'
import StatsDataTable from '@/components/StatsDataTable'
import StatsDataList from '@/components/StatsDataList'
import ImageDataList from '@/components/ImageDataListVerticle'
import StatsBox from '@/components/StatsSecurity'


import {_} from "underscore"

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/chart/pictorialBar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import echartsUtil from '@/utils/echartsUtil'

export default {
  components: {ImageDataList, ECharts, StatsBox
  },
  methods: {
    fetchData: function() {
    },
  },
  data: function() {
    return {
      chartOptions: {},
        playerOptions: {
          height: '400',
          autoplay: true,
            muted: true,
            loop: true,
            fluid: true,
            controls: false,
          sources: [{
            type: "video/mp4",
            // mp4
            src: "/static/videos/1.mp4",
          }],
      },
        playerOptions2: {
          height: '400',
          autoplay: true,
            muted: true,
            loop: true,
            fluid: true,
            controls: false,
          sources: [{
            type: "video/mp4",
            // mp4
            src: "/static/videos/2.mp4",
          }],
      },
         playerOptions3: {
          height: '400',
          autoplay: true,
            muted: true,
            loop: true,
                        fluid: true,
            controls: false,
          sources: [{
            type: "video/mp4",
            // mp4
            src: "/static/videos/3.mp4",
          }],
      },
         playerOptions4: {
          height: '400',
          autoplay: true,
            muted: true,
            loop: true,
                        fluid: true,
            controls: false,
          sources: [{
            type: "video/mp4",
            // mp4
            src: "/static/videos/4.mp4",
          }],
      },
      vehicleViolationData: {
        title: '安防',
        tableData: [],
        columns: [
          {prop: 'plateInfo', label: '车牌号', width: 100}
          // {prop: 'sourceTitle', label: '位置', width: 100}
        ]
      },
      objectList:[],
      timeElapsed: 0,
      data: {
        person: 3105,
        vehicle: 2201,
        business: 231,
        ad: 12
      }
    }
  },
  mounted: function() {
    let list = require('./vehicle/data/object.json').data
    let personList = require('./vehicle/data/person.json').data
    let index = 0
    for (const item of list) {
      index ++
      const newItem = {
        objectType: item[2],
        occured_time: "2019-12-19 18:43:44",
        picVehicle: `/static/object/${item[0]}`,
        picVehicleSub:  `/static/object/${item[0]}`,
        vehicle_type: item[2],
        plateInfo: item[2],
        num: item[1]
      }
      this.objectList.push(newItem)
      if (index <=8) {
        this.vehicleViolationData.tableData.push(newItem)
      }
    }

    for (const item of personList) {
      index ++
      const newItem = {
        objectType: item[2],
        occured_time: "2019-12-19 18:43:44",
        picVehicle: `/static/person/${item[0]}`,
        picVehicleSub:  `/static/person/${item[0]}`,
        vehicle_type: item[2],
        plateInfo: item[2],
        num: item[1]
      }
      this.objectList.push(newItem)
      if (index <=8) {
        this.vehicleViolationData.tableData.push(newItem)
      }
    }

    let  options = require('./echartsconfig/securityChartOptions.js').default
    options.series[0].data = [this.data.person, this.data.vehicle, this.data.business, this.data.ad]
    this.chartOptions = options

    setInterval(()=> {
      this.timeElapsed ++
      if (this.timeElapsed >= 120) this.timeElapsed = 0
      const data = _.find(this.objectList, (e) => {return e.num === this.timeElapsed})
      console.log(data)
      if (!data) return
      this.vehicleViolationData.tableData.splice(0, 0, data)
      this.vehicleViolationData.tableData.pop()
      if (data.dangmark && data.dangmark === '是') {
        this.capturedImageURL = data.picVehicle
        this.capturedImageVisible = true
        setTimeout(() => { this.capturedImageVisible = false }, 5000)
      }
      this.data.person ++
      this.data.vehicle ++
      // this.chartOptions.series[0].data = [this.data.person, this.data.vehicle, this.data.business, this.data.ad]
    }, 1000)
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
/* .bg-purple {
  background: #7294d4;
} */
.text-light {
  color: #eee
}
.bg-purple-light {
  display: block;
  background: #e5e9f2;
}
.bg-purple {
  background: #2c323d;
}
.grid-content {
  border-radius: 4px;
  min-height: 150px;
  padding:10px;
  position: relative;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.statsCircle {
  background-color:#0092f6;
  border-radius: 50%;
  vertical-align: middle;
  float: left;
  position: absolute;
  top:20px;
  left:20px;
  font-size: 30px;
  color: white;
  line-height: 80px;
  width: 80px;
  height: 80px;
}
.statsTitle {
  float:right;
  bottom:60px;
  right:20px;
  position: absolute;
}
.statsValue {
  font-size: 26px;
  float:right;
  right:20px;
  bottom: 20px;
  position: absolute;  
}
.chartTitle {
  text-align: left
}

#vehicleImageDataList {
    position: absolute;
    width: 480px;
    bottom: 5px;
    top: 405px;
    left: 5px;
    background-color:rgba(12, 27, 78, 0.9);
    z-index: 998;
    overflow: hidden;
}

</style>