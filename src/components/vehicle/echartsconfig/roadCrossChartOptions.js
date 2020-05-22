import echarts from 'echarts/lib/echarts'
import "echarts/lib/component/graphic"

export default {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            right: '0%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
         xAxis: [{
                  type: 'category',
                  data: ['1', '2', '3', '4', '5', '6', '7', '8','9'],
                  axisLine: {
                      lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                     }
                },
                axisLabel: {
                     margin: 10,
                     interval:0,
                     color: '#e2e9ff',
                     textStyle: {
                         fontSize: 12
                     }
                 }
             }],
             yAxis: [{
                 axisLabel: {
                     formatter: '{value}',
                     color: '#e2e9ff'
                 },
                 axisLine: {
                     show: false
                 },
                 splitLine: {
                     lineStyle: {
                         color: 'rgba(255,255,255,0.12)'
                     }
                 }
             }],
             series: [{
                 type: 'bar',
                 barWidth: '10px',
                 data: [43, 25, 49, 38, 44, 70, 52, 60, 32],
                 itemStyle: {
                     normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                           offset: 0,
                                           color: 'rgba(0,244,255,1)' // 0% 处的颜色
                                       }, {
                                           offset: 1,
                                           color: 'rgba(0,77,167,1)' // 100% 处的颜色
                                       }], false),
                         barBorderRadius: [30, 30, 30, 30],
                         shadowColor: 'rgba(0,160,221,1)',
                         shadowBlur: 4
                     }
                 }

             }]
}
