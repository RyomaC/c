<template>
<div style="height:100%;width:100%;background:#0E2A43;">
    <div style="height:33%;width:100%;">
        <div style="float:left;width:10%;height:100%;position:relative;color:white;vertical-align: bottom;">
            <span  style="left: 50%;top: 50%;position: absolute;color:#D9CB49;">
                <img src="/static/images/temperature.png">
                <br>
                当前：25℃
            </span>
        </div>
        <div style="float:right;width:90%;height:100%;position:relative;">
            <ECharts ref="environmentChart" style="height:100%; width:100%;" :options="environmentChartOptions_temp" autoresize/>
        </div>
    </div>

    <div style="height:33%;width:100%;">
        <div style="float:left;width:10%;height:100%;position:relative;color:white;vertical-align: bottom;">
            <span  style="left: 50%;top: 50%;position: absolute;color:#06C64F;">
                <img src="/static/images/pm2.5.png">
                <br>
                当前：146
            </span>
        </div>
        <div style="float:right;width:90%;height:100%;position:relative;">
            <ECharts ref="environmentChart" style="height:100%; width:100%;" :options="environmentChartOptions_pm25" autoresize/>
        </div>
    </div>

    <div style="height:33%;width:100%;">
        <div style="float:left;width:10%;height:100%;position:relative;color:white;vertical-align: bottom;">
            <span  style="left: 50%;top: 50%;position: absolute;color:#E75A40;">
                <img src="/static/images/noise.png">
                <br>
                当前：235.8
            </span>
        </div>
        <div style="float:right;width:90%;height:100%;position:relative;">
            <ECharts ref="environmentChart" style="height:100%; width:100%;" :options="environmentChartOptions_noise" autoresize/>
        </div>
    </div>
</div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

export default{
  components: {ECharts},
  data: function () {
    return {
      environmentChartOptions_temp: require('./echartsconfig/environmentChartOptions_temp').default,
      environmentChartOptions_pm25: require('./echartsconfig/environmentChartOptions_pm2.5').default,
      environmentChartOptions_noise: require('./echartsconfig/environmentChartOptions_noise').default
    }
  }
}
</script>
