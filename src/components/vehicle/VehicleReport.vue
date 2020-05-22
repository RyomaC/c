<template>
  <div id="datalist">
    <div style="text-align:left">
      <el-button type="text" style="color: white" icon="el-icon-arrow-left" @click="monthsChange('previous')"></el-button>
      <el-date-picker v-model="month" type="month" value-format="yyyy-MM" placeholder="选择月" :picker-options="pickerOptions" @change="fetchData"/>
      <el-button type="text" style="color: white" icon="el-icon-arrow-right" @click="monthsChange('next')" :disabled="month >= currentMonth()"></el-button>
    </div>
         <el-table
      :header-cell-style="{background:'#020288', color:'white'}"
      :row-style="{color:'#fff'}"
      :header-row-style="(r, i) => {return 'background-color:transparent; color:#fff;'}"
      :data="tableData"
      show-summary
      v-loading="loading"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      >
      <el-table-column v-for="(field,index) in dataFields" :key="index" :prop="field.name" :label="field.title" :width="field.width">
      </el-table-column>
      <el-table-column/>
    </el-table>
    <div v-show="!isHide">
        <div class="grid-content bg-purple" style="margin:30px">
          <ECharts style="width:95%; height:130px" :options="vehicleData" autoresize/>
        </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'

export default {
  components: {ECharts},
  data () {
    return {
      month: moment().format('YYYY-MM'),
      tableData: [],
      dataFields: [],
      vehicleData: null,
      loading: true,
      hideClass: 'hideClass',
      isHide: false,
      disabled: true,
      pickerOptions: {
        disabledDate: (time) => {
          // return true限制就只能选择今天之前的时间
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    this.vehicleData = JSON.parse(JSON.stringify(require('@/components/echartsconfig/generalLineOptions').default))
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.loading = true
      const config = require('./dataconfig/vehicle_report.json')
      this.dataFields = config.fields.filter(e => { return !e.hidden })
      this.$axios
        .post('/vehicle/statsMonth', {
          month: this.month
        })
        .then(response => {
          this.loading = false
          this.tableData = response.data.data
          this.vehicleData.xAxis.data = this.tableData.map(e => e._id)
          this.vehicleData.series[0].name = '危化品车辆'
          this.vehicleData.series[0].data = this.tableData.map(e => parseInt(e.dangerCount))
          this.isHide = response.data.data.length < 2
        })
        .catch(e => {
          if (e.response.status === 403) {
            this.$router.replace('/error403')
          }
        })
    },
    monthsChange: function (message) {
      if (message === 'previous') {
        this.month = moment(this.month).subtract(1, 'months').format('YYYY-MM')
      } else {
        this.month = moment(this.month).add(1, 'months').format('YYYY-MM')
      }
      this.fetchData()
    },
    currentMonth () {
      return moment().format('YYYY-MM')
    }
  }
}
</script>

<style scoped>
.bg-purple {
  background: #2c323d;
}
.grid-content {
  border-radius: 4px;
  min-height: 150px;
  padding:10px;
  position: relative;
}
</style>
