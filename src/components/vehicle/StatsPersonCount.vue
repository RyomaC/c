<template>
<div class="left_one_wrapper border-father">
    <div class="left_one_top">
        <p>行人检出状态</p>
    </div>
    <!-- <div class="left_one_middle">
        <span id="htmer_time"></span> 
    </div> -->
    <div class="left_one_bottom">
      <ECharts style="width:100%;height:100%;padding-left:10px;" :options="dangerCountOptions" autoresize/>
    </div>
</div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'

export default {
  components: {ECharts},
  props: ['dangerCountValues', 'dangerCountOptions'],
  methods: {
    secondToDate: function (second) {
      if (!second) {
        return 0
      }
      var time = new Array(0, 0, 0, 0, 0)
      if (second >= 365 * 24 * 3600) {
        time[0] = parseInt(second / (365 * 24 * 3600))
        second %= 365 * 24 * 3600
      }
      if (second >= 24 * 3600) {
        time[1] = parseInt(second / (24 * 3600))
        second %= 24 * 3600
      }
      if (second >= 3600) {
        time[2] = parseInt(second / 3600)
        second %= 3600
      }
      if (second >= 60) {
        time[3] = parseInt(second / 60)
        second %= 60
      }
      if (second > 0) {
        time[4] = second
      }
      return time
    },
    numParse: function (number) {
      var newnum = number
      if (number < 10) {
        newnum = '0' + number
      }
      return newnum
    },
  },
}
</script>

<style scoped>
@import '../../../static/css/style.css';
</style>
