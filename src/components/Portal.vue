<template>
  <div class="text-light" style="padding:5px">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <span class="statsCircle">A</span><span class="statsTitle">单灯平均功率</span><span class="statsValue">{{parseFloat(statsData.totalActualPower).toFixed(2)}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <span class="statsCircle">E</span><span class="statsTitle">单灯额定功率</span><span class="statsValue">{{parseFloat(statsData.totalRatedPower).toFixed(2)}}</span>
          </div>
        </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <span class="statsCircle">Y</span><span class="statsTitle">年度节约</span><span class="statsValue">{{parseFloat(statsData.ecYear).toFixed(2)}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <span class="statsCircle">M</span><span class="statsTitle">月度节约</span><span class="statsValue">{{parseFloat(statsData.ecMonth).toFixed(2)}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12">
        <div class="grid-content bg-purple">
          <div class="chartTitle">用电量</div>
          <ECharts style="width:95%;height:330px" :options="lineChartData" autoresize v-if="loaded"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <ECharts style="width:90%;height:350px" :options="eltboxData" autoresize v-if="loaded"/>
          <span class="statsTitle">电箱</span><span class="statsValue">{{statsData.eltBoxBad}} / {{statsData.eltBoxTotal}}</span>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <ECharts style="width:90%;height:350px" :options="lightChartData" autoresize v-if="loaded"/>
          <span class="statsTitle">灯杆</span><span class="statsValue">{{statsData.lightConnected}} / {{statsData.lightTotal}}</span>
        </div
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <div class="chartTitle">平均功率</div>
          <ECharts style="width:95%; height:130px" :options="powerData" autoresize v-if="loaded"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <div class="chartTitle">平均照度</div>
          <ECharts style="width:95%; height:130px" :options="illuData" autoresize v-if="loaded"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <div class="chartTitle">平均温度</div>
          <ECharts style="width:95%; height:130px" :options="tempData" autoresize v-if="loaded"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="grid-content bg-purple">
          <span class="statsCircle">G</span><span class="statsTitle">灯杆良好率</span><span class="statsValue">{{parseFloat(statsData.lampGoodRate).toFixed(2)}}%</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// <el-col :xs="24" :sm="12" :md="6">
//   <div class="grid-content bg-purple">
//     <span class="statsCircle">D</span><span class="statsTitle">灯具良好率</span><span class="statsValue">{{parseFloat(statsData.lightGoodRate).toFixed(2)}}%</span>
//   </div>
// </el-col>
// <el-col :xs="24" :sm="12" :md="6">
//   <div class="grid-content bg-purple">
//     <span class="statsCircle">X</span><span class="statsTitle">线路良好率</span><span class="statsValue">{{parseFloat(statsData.lineGoodRate).toFixed(2)}}%</span>
//   </div>
// </el-col>

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import moment from 'moment'

export default {
  props: ['project', 'statsData'],
  name: 'Portal',
  components: {ECharts},
  data: function () {
    return {
      id: null,
      loaded: true,
      userProfile: localStorage.userProfile,
      lineData: null,
      lineChartData: null,
      eltboxData: null,
      lightChartData: null,
      lightData: {
        labels: ['在线', '离线'],
        datasets: [
          {
            backgroundColor: ['#f87979', '#36a2eb'],
            data: null
          }
        ]
      },
      tempData: null,
      illuData: null,
      powerData: null
    }
  },
  mounted: function () {
    this.$axios
      .get('/portal/view')
      .catch(e => console.log(e))
    this.tempData = require('@/components/echartsconfig/generalLineOptions').default
    this.illuData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.powerData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.lineChartData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
  },
  watch: {
    'statsData': function () {
      this.loadData()
    }
  },
  methods: {
    loadData: function () {
      this.eltboxData =
      {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          selectedMode: false,
          textStyle: {color: '#ddd'},
          data: ['在线', '离线']
        },
        series: [
          {
            name: '电箱',
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: this.statsData.eltBoxTotal - this.statsData.eltBoxBad, name: '在线'},
              {value: this.statsData.eltBoxBad, name: '离线'}
            ]
          }
        ],
        color: ['#0092f6', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
      }
      this.lightChartData = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          selectedMode: false,
          textStyle: {color: '#ddd'},
          data: ['在线', '离线']
        },
        series: [
          {
            name: '灯杆',
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: this.statsData.lightConnected, name: '在线'},
              {value: this.statsData.lightTotal - this.statsData.lightConnected, name: '离线'}
            ]
          }
        ],
        color: ['#0092f6', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
      }
      let actecLabels = []
      let actecValues = []
      if (this.statsData.actec) {
        const actecList = this.statsData.actec.rows
        for (let item in actecList) {
          actecLabels.unshift(actecList[item].TIME)
          actecValues.unshift(Number(actecList[item].VALUE))
        }
      }

      this.lineChartData.xAxis.data = actecLabels
      this.lineChartData.series[0].name = '用电量'
      this.lineChartData.series[0].data = actecValues

      if (!this.statsData.mean15m) {
        this.statsData.mean15m = []
      }
      this.powerData.xAxis.data = this.statsData.mean15m.map(e => moment(e.time).format('HH:mm'))
      this.powerData.series[0].name = '平均功率'
      this.powerData.series[0].data = this.statsData.mean15m.map(e => parseFloat(e.mean_Power).toFixed(2))

      this.tempData.xAxis.data = this.statsData.mean15m.map(e => moment(e.time).format('HH:mm'))
      this.tempData.series[0].name = '平均温度'
      this.tempData.series[0].data = this.statsData.mean15m.map(e => parseFloat(e.mean_Temp).toFixed(2))

      this.illuData.xAxis.data = this.statsData.mean15m.map(e => moment(e.time).format('HH:mm'))
      this.illuData.series[0].name = '平均照度'
      this.illuData.series[0].data = this.statsData.mean15m.map(e => parseFloat(e.mean_Illu).toFixed(2))
    }
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
</style>
